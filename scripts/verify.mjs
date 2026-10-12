import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const output = '.impeccable/review';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
const checks = [];
function check(name, pass, details = '') { checks.push({ name, pass, details }); }

for (const config of [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'mobile-small', viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
  { name: 'reduced-motion', viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' },
]) {
  const { name, ...options } = config;
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(origin);
  if (name === 'desktop') await page.screenshot({ path: `${output}/splash.png` });
  await page.locator('.splash').waitFor({ state: 'detached', timeout: 10000 });
  await page.waitForTimeout(1600);
  check(`${name}: splash resolves and releases scrolling`, await page.evaluate(() => document.documentElement.style.overflow === ''));
  check(`${name}: full name fits its container`, await page.locator('.hero-name').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
  await page.screenshot({ path: `${output}/${name}.png` });
  const photoSwitch = await page.locator('.portrait-photo-switch').isVisible();
  await page.getByRole('button', { name: photoSwitch ? 'Switch to work mode' : 'SWITCH TO WORK MODE' }).click();
  await page.waitForTimeout(800);
  check(`${name}: portrait switch`, await page.getByRole('button', { name: photoSwitch ? 'Back to casual portrait' : 'BACK TO CASUAL' }).getAttribute('aria-pressed') === 'true');
  if (name === 'desktop') await page.screenshot({ path: `${output}/portrait-work.png` });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.waitForTimeout(1300);
  check(`${name}: menu opens`, await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded') === 'true');
  if (['desktop','mobile'].includes(name)) await page.screenshot({ path: `${output}/${name}-menu.png` });
  await page.keyboard.press('Escape');
  if (!options.reducedMotion) {
    await page.waitForTimeout(70);
    check(`${name}: menu remains painted during closing motion`, await page.locator('#site-menu').evaluate(el => getComputedStyle(el).visibility === 'visible'));
  }
  await page.waitForTimeout(1200);
  check(`${name}: Escape closes menu and restores focus`, await page.getByRole('button', { name: 'Open navigation' }).evaluate(el => document.activeElement === el));
  for (const id of ['about','work','expertise','background','contact']) {
    await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await page.waitForTimeout(1500);
    if (['desktop','mobile'].includes(name)) await page.screenshot({ path: `${output}/${name}-${id}.png` });
  }
  const dimensions = await page.evaluate(() => ({ width: innerWidth, doc: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
  check(`${name}: no horizontal overflow`, dimensions.doc <= dimensions.width, JSON.stringify(dimensions));
  check(`${name}: email contact`, await page.locator('.email-link').getAttribute('href') === 'mailto:ilyassazetd@gmail.com');
  await page.locator('.work-stage').evaluate(el => { const target = el.closest('.pin-spacer') || el; scrollTo({ top: scrollY + target.getBoundingClientRect().top, behavior: 'instant' }); });
  await page.waitForTimeout(1500);
  await page.locator('.project-quality .detail-toggle').click();
  await page.waitForTimeout(800);
  check(`${name}: project details readable in viewport`, await page.locator('#details-quality').evaluate(el => { const r = el.getBoundingClientRect(); return !el.inert && getComputedStyle(el).visibility === 'visible' && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight; }));
  if (['desktop','mobile'].includes(name)) await page.screenshot({ path: `${output}/${name}-details.png` });
  await page.locator('.project-quality .detail-toggle').click();
  if (name === 'desktop') {
    const stage = await page.locator('.work-stage').evaluate(el => ({ top: window.scrollY + el.parentElement.getBoundingClientRect().top, distance: el.querySelector('.work-rail').scrollWidth - el.clientWidth }));
    for (const [fraction, label] of [[.5,'data'],[1,'software']]) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), stage.top + stage.distance*fraction);
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${output}/desktop-work-${label}.png` });
    }
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  if (name === 'mobile') await page.screenshot({ path: `${output}/mobile-full.png`, fullPage: true });
  check(`${name}: no browser errors`, errors.length === 0, errors.join('; '));
  report.push({ viewport: name, errors, dimensions });
  await context.close();
}

const fallback = await browser.newContext();
const page = await fallback.newPage();
await page.route('**/*.png', route => route.abort());
await page.goto(origin);
await page.locator('.splash').waitFor({ state: 'detached', timeout: 10000 });
check('Image failure does not trap the splash', await page.locator('main').evaluate(el => !el.inert));
const response = await page.request.get(`${origin}/Ilyass-Azyaiz-CV.pdf`);
check('CV download returns a PDF', response.ok() && (await response.body()).subarray(0,4).toString() === '%PDF');
await browser.close();
await writeFile(`${output}/verification.json`, JSON.stringify({ checks, report }, null, 2));
console.log(JSON.stringify({ checks, report }, null, 2));
if (checks.some(c => !c.pass)) process.exitCode = 1;
