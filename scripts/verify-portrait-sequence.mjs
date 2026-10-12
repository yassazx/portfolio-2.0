import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:5173';
const dir='.impeccable/review/portrait-sequence';
await mkdir(dir,{recursive:true});
const checks=[];
const check=(name,pass)=>{checks.push({name,pass});};
for (const config of [
  {name:'desktop',viewport:{width:1440,height:900}},
  {name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true},
  {name:'reduced',viewport:{width:1280,height:800},reducedMotion:'reduce'},
]) {
  const {name,...options}=config;
  const page=await browser.newPage(options);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);
  await page.locator('.splash').waitFor({state:'detached'});
  const svg=page.locator('.portrait-sequence');
  const path=svg.locator('defs>path');
  const phase=()=>svg.getAttribute('data-phase');
  const d=()=>path.getAttribute('d');
  await page.waitForTimeout(1500);
  const initialTop=await page.locator('.hero-portrait-reveal').evaluate(el=>el.getBoundingClientRect().top);
  if(name==='desktop') {
    await svg.hover({position:{x:650,y:280}});
    await page.waitForTimeout(1100);
    const first=await d();
    await page.screenshot({path:`${dir}/desktop-horizontal.png`});
    await page.waitForTimeout(450);
    check('Hover animates the reveal window',await phase()==='hover'&&await d()!==first);
    await page.waitForTimeout(2100);
    await page.screenshot({path:`${dir}/desktop-diagonal.png`});
    await page.getByRole('button',{name:'Open navigation'}).click();
    await page.waitForTimeout(200);
    const paused=await d();
    await page.waitForTimeout(400);
    check('Menu suspends portrait motion',await d()===paused);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    await svg.hover({position:{x:650,y:280}});
    await page.waitForTimeout(400);
    await page.evaluate(()=>scrollTo({top:innerHeight*1.5,behavior:'instant'}));
    await page.waitForTimeout(250);
    const offscreen=await d();
    await page.waitForTimeout(500);
    check('Offscreen portrait stops updating',await d()===offscreen);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.mouse.move(10,10);
    await page.waitForTimeout(1300);
    check('Pointer leave restores casual portrait',await d()==='M0,0Z');
    check('Returning to hero preserves portrait position',Math.abs(await page.locator('.hero-portrait-reveal').evaluate(el=>el.getBoundingClientRect().top)-initialTop)<1);
  }
  if(name==='mobile') {
    await page.waitForTimeout(1400);
    check('Touch gets the introductory sequence',await phase()==='intro');
    await page.screenshot({path:`${dir}/mobile-sequence.png`});
    await page.waitForTimeout(7500);
    check('Intro completes once and returns to a still portrait',await phase()==='idle'&&await d()==='M0,0Z');
  }
  if(name==='reduced') {
    await page.waitForTimeout(700);
    check('Reduced motion suppresses automatic sequence',await d()==='M0,0Z');
  }
  await page.getByRole('button',{name:'SWITCH TO WORK MODE'}).click();
  await page.waitForTimeout(name==='reduced'?60:1300);
  check(`${name}: work mode settles into four complete strips`,(await d()).match(/h1600v251/g)?.length===4);
  await page.screenshot({path:`${dir}/${name}-work.png`});
  await page.getByRole('button',{name:'BACK TO CASUAL'}).click();
  await page.waitForTimeout(name==='reduced'?60:1100);
  check(`${name}: toggle restores complete casual image`,await d()==='M0,0Z');
  check(`${name}: no page overflow`,await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  if(name==='desktop') {
    // Rapid hover/toggle/menu interruption must finish in the requested state.
    await svg.hover({position:{x:650,y:280}});
    await page.waitForTimeout(150);
    await page.getByRole('button',{name:'SWITCH TO WORK MODE'}).click();
    await page.waitForTimeout(120);
    await page.getByRole('button',{name:'BACK TO CASUAL'}).click();
    await page.waitForTimeout(1100);
    check('Rapid interruption restores an intact portrait',await d()==='M0,0Z');
  }
  check(`${name}: no browser errors`,errors.length===0);
  await page.close();
}
await browser.close();
await writeFile(`${dir}/checks.json`,JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
if(checks.some(c=>!c.pass))process.exitCode=1;
