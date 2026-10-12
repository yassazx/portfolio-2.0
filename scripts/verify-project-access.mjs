import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome' });
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const results = [];
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto(origin);
await desktop.locator('.splash').waitFor({ state: 'detached' });
await desktop.waitForTimeout(1300);
await desktop.locator('.work-stage').evaluate(el => {const p=el.closest('.pin-spacer')||el;scrollTo({top:scrollY+p.getBoundingClientRect().top,behavior:'instant'});});
await desktop.waitForTimeout(1000);
await desktop.locator('.project-quality .detail-toggle').focus();
for (const key of ['Tab','Tab','Shift+Tab','Shift+Tab']) {
  await desktop.keyboard.press(key);
  await desktop.waitForTimeout(850);
  results.push(await desktop.evaluate(key=>{const el=document.activeElement;const r=el.getBoundingClientRect();return {key,project:el.closest('.project')?.id,visible:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},innerScroll:document.querySelector('.work-stage').scrollLeft};},key));
}
const landscape = await browser.newPage({ viewport: {width:844,height:390},isMobile:true,hasTouch:true });
await landscape.goto(origin);
await landscape.locator('.splash').waitFor({state:'detached'});
await landscape.waitForTimeout(1000);
await landscape.locator('.project-quality .detail-toggle').click();
await landscape.waitForTimeout(1000);
results.push(await landscape.locator('#details-quality').evaluate(el=>{const r=el.getBoundingClientRect();return {type:'landscape disclosure',focused:document.activeElement===el,visible:r.top>=75&&r.bottom<=innerHeight,rect:{y:r.y,bottom:r.bottom,height:r.height}};}));
if (process.env.CAPTURE === '1') {
  await landscape.screenshot({path:'.impeccable/review/landscape-details.png'});
  await desktop.screenshot({path:'.impeccable/review/desktop-keyboard.png'});
}
await landscape.keyboard.press('Escape');
results.push(await landscape.locator('.project-quality .detail-toggle').evaluate(el=>({type:'landscape Escape closes and restores focus',visible:el.getAttribute('aria-expanded')==='false'&&document.activeElement===el})));
await browser.close();
console.log(JSON.stringify(results,null,2));
await writeFile('.impeccable/review/project-access.json',JSON.stringify(results,null,2));
if(results.some(r=>!r.visible||r.focused===false||(r.innerScroll!==undefined&&r.innerScroll!==0)))process.exitCode=1;
