import { chromium } from 'file:///C:/Users/ilyas/AppData/Local/npm-cache/_npx/af752b90495482d7/node_modules/playwright-core/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const out = 'C:/Users/ilyas/Desktop/portfolio/research/mobile-touch';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1', reducedMotion: 'no-preference', serviceWorkers: 'block' });
const page = await context.newPage();
const events = [];
page.on('pageerror', error => events.push({ type: 'pageerror', message: error.message }));
const observations = [];
const start = Date.now();
async function snap(name) {
  await page.screenshot({ path: `${out}/${name}.png` });
  const state = await page.evaluate(() => ({
    scrollY, width: innerWidth, height: innerHeight, pageHeight: document.documentElement.scrollHeight,
    mobile: matchMedia('(hover: none)').matches, orientation: matchMedia('(orientation: landscape)').matches,
    overlay: Array.from(document.querySelectorAll('[data-mob-landscape],.transition-w,[data-nav-m],[data-home-swipe-toggle]')).map(el => ({ selector: el.className, display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility, opacity: getComputedStyle(el).opacity, clip: getComputedStyle(el).clipPath, pressed: el.getAttribute('aria-pressed'), scrollDisabled: el.getAttribute('data-scroll-disabled'), text: el.textContent.trim().slice(0,300) })),
    visibleSections: Array.from(document.querySelectorAll('section')).filter(el => { const r=el.getBoundingClientRect(); return r.bottom>0 && r.top<innerHeight; }).map(el => ({ className:el.className, top:el.getBoundingClientRect().top, height:el.getBoundingClientRect().height }))
  }));
  observations.push({ name, elapsed_ms: Date.now()-start, ...state });
  console.log(JSON.stringify({ name, elapsed_ms: Date.now()-start, y:state.scrollY, height:state.pageHeight, mobile:state.mobile, overlays:state.overlay.map(x=>[x.selector,x.display,x.visibility]) }));
}
await page.goto('https://landonorris.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
await snap('portrait_initial');
for (let i=1;i<=8;i++){ await page.waitForTimeout(2000); await snap(`portrait_load_${i*2}s`); }
await page.waitForTimeout(10000);
await snap('portrait_hero');
await page.locator('[data-home-swipe-toggle]').tap();
await page.waitForTimeout(800);
await snap('portrait_locked');
await page.locator('[data-home-swipe-toggle]').tap();
await page.locator('[data-nav-ham]').tap();
await page.waitForTimeout(350);
await snap('portrait_menu_opening');
await page.waitForTimeout(1200);
await snap('portrait_menu_open');
await page.locator('[data-nav-ham]').tap();
await page.waitForTimeout(1200);
const cdp = await context.newCDPSession(page);
for (let i=1;i<=23;i++) {
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:196,y:710}]});
  for(let j=1;j<=14;j++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:196,y:710-j*38}]}); await page.waitForTimeout(15); }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(1400);
  await snap(`portrait_swipe_${i}`);
  const last=observations.at(-1);
  if(last.scrollY+last.height>=last.pageHeight-2) break;
}
await page.setViewportSize({ width:844, height:390 });
await page.waitForTimeout(2000);
await snap('landscape_after_rotation');
await writeFile(`${out}/observations.json`, JSON.stringify({ target:'https://landonorris.com/', browser:'Chrome with iPhone UA / isMobile / hasTouch emulation', observations, events },null,2));
await browser.close();
