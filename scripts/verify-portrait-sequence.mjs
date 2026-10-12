import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:5173';
const dir='.impeccable/review/blob-hero';
await mkdir(dir,{recursive:true});
const checks=[];
const check=(name,pass,details)=>checks.push({name,pass,details});
for(const config of [
  {name:'desktop',viewport:{width:1440,height:900}},
  {name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true},
  {name:'landscape',viewport:{width:844,height:390},isMobile:true,hasTouch:true},
  {name:'reduced',viewport:{width:1280,height:800},reducedMotion:'reduce'},
]){
  const {name,...options}=config;
  if(process.env.ONLY&&process.env.ONLY!==name)continue;
  const page=await browser.newPage(options),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);
  await page.locator('.splash').waitFor({state:'detached'});
  await page.waitForTimeout(1600);
  const svg=page.locator('.portrait-sequence'),path=svg.locator('defs>path');
  const d=()=>path.getAttribute('d');
  const radius=async()=>Number(await svg.getAttribute('data-radius'));
  const initialTop=await page.locator('.hero-portrait-reveal').evaluate(el=>el.getBoundingClientRect().top);
  const contour=page.locator('.organic-contours path').first();
  const originalLine=await contour.getAttribute('d');
  if(name==='desktop'){
    await svg.hover({position:{x:700,y:370}});
    await page.waitForTimeout(1300);
    const first=await d();
    await page.screenshot({path:`${dir}/desktop-blob.png`});
    await page.waitForTimeout(250);
    check('Hover reveals a morphing curved blob',first.includes('C')&&first!==await d()&&await radius()>200);
    check('Background contours morph organically',originalLine!==await contour.getAttribute('d'));
    await page.getByRole('button',{name:'Open navigation'}).click();
    await page.waitForTimeout(100);
    const paused=await d(),linePaused=await contour.getAttribute('d');
    await page.waitForTimeout(350);
    check('Menu suspends both blob and contours',paused===await d()&&linePaused===await contour.getAttribute('d'));
    await page.keyboard.press('Escape');
    await page.mouse.move(10,10);
    await page.waitForTimeout(1200);
  }
  if(name==='mobile'){
    await page.waitForTimeout(1600);
    check('Mobile introductory blob runs',await svg.getAttribute('data-phase')==='intro'&&await radius()>0);
    await page.screenshot({path:`${dir}/mobile-blob.png`});
    await page.waitForTimeout(3100);
    check('Intro returns to still casual portrait',await d()==='M0,0Z');
    await page.waitForFunction(()=>document.querySelector('.portrait-sequence').dataset.phase==='drift');
    const centers=[];
    for(let i=0;i<12;i++){
      centers.push(Number(await svg.getAttribute('data-center-x')));
      if(i===2)await page.screenshot({path:`${dir}/mobile-idle-sweep.png`});
      await page.waitForTimeout(1000);
    }
    const peak=Math.max(...centers),peakIndex=centers.indexOf(peak);
    check('Idle blob crosses left to right and returns',peakIndex>1&&peakIndex<9&&peak-centers[0]>700&&peak-centers.at(-1)>700,centers);
  }
  if(name==='reduced'){
    await page.waitForTimeout(500);
    check('Reduced motion leaves blob and contours still',await d()==='M0,0Z'&&originalLine===await contour.getAttribute('d'));
    check('Reduced motion retains static signature',await page.locator('.signature-static').count()===1);
  }
  await page.getByRole('button',{name:'SWITCH TO WORK MODE'}).click();
  await page.waitForTimeout(name==='reduced'?80:1300);
  check(`${name}: work toggle fills mask`,await radius()>=2099);
  await page.getByRole('button',{name:'BACK TO CASUAL'}).click();
  await page.waitForTimeout(name==='reduced'?80:1000);
  check(`${name}: casual toggle clears mask`,await radius()===0);
  if(name!=='reduced'){
    const span=await page.locator('.hero-journey').evaluate(el=>el.offsetHeight-innerHeight);
    const widths=[];
    for(const fraction of [.25,.5,.85,1]){
      await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),span*fraction);
      await page.waitForTimeout(300);
      const geometry=await page.locator('.hero-portrait-reveal').evaluate(el=>{const r=el.getBoundingClientRect();return{width:r.width,top:r.top,bottom:r.bottom}});
      widths.push(geometry.width);
      check(`${name}: hero stays pinned at ${fraction}`,await page.locator('.hero').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<2));
      if(fraction===.5||fraction===1)await page.screenshot({path:`${dir}/${name}-scroll-${fraction}.png`});
    }
    check(`${name}: portrait shrinks with scroll`,widths[0]>widths[1]&&widths[1]>widths[2]&&Math.abs(widths[2]-widths[3])<2);
    check(`${name}: signature fully drawn`,await page.locator('.signature-scene .signature-mark path').evaluateAll(els=>els.every(el=>parseFloat(getComputedStyle(el).strokeDashoffset)<1)));
    const still=await page.locator('.hero-portrait-reveal').getAttribute('style');
    await page.waitForTimeout(500);
    check(`${name}: transition waits for scroll`,still===await page.locator('.hero-portrait-reveal').getAttribute('style'));
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(500);
    const returned=await page.locator('.hero-portrait-reveal').evaluate(el=>el.getBoundingClientRect().top);
    check(`${name}: reverse scroll restores initial geometry`,Math.abs(returned-initialTop)<1);
    check(`${name}: controls return after reverse scroll`,await page.getByRole('button',{name:'SWITCH TO WORK MODE'}).isVisible());
    await page.locator('#about').evaluate(el=>el.scrollIntoView({behavior:'instant'}));
    await page.waitForTimeout(400);
    const offscreen=await d(),lineOffscreen=await contour.getAttribute('d');
    await page.waitForTimeout(300);
    check(`${name}: offscreen motion pauses`,offscreen===await d()&&lineOffscreen===await contour.getAttribute('d'));
  }
  check(`${name}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(name==='desktop'){
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(250);
    // Locator.hover() can scroll the oversized portrait into view and thereby
    // enter the scroll transition. Exercise an actual stationary pointer.
    await page.mouse.move(740,420);
    await page.waitForFunction(()=>document.querySelector('.portrait-sequence').dataset.phase==='drift',{},{timeout:8000});
    check('Stationary hover yields to idle sweep',await svg.getAttribute('data-phase')==='drift');
    await page.mouse.move(800,450);
    await page.waitForTimeout(250);
    check('Moving pointer retakes control without waiting',await svg.getAttribute('data-phase')==='hover');
  }
  check(`${name}: no browser errors`,errors.length===0,errors);
  await page.close();
}
await browser.close();
await writeFile(`${dir}/checks.json`,JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
if(checks.some(c=>!c.pass))process.exitCode=1;
