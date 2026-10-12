import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const dir = 'research/hover-sequence';
await mkdir(dir, {recursive:true});
const browser = await chromium.launch({channel:'chrome'});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('https://www.ripplix.com/library/hero-hover-loop-lando-norris-portfolio-websitemp4', {waitUntil:'domcontentloaded'});
await page.waitForTimeout(5000);
console.log(await page.locator('video').evaluateAll(els=>els.map(v=>({src:v.currentSrc,duration:v.duration,width:v.videoWidth,height:v.videoHeight}))));
await page.screenshot({path:`${dir}/page.png`});
const video = page.locator('video').first();
await video.evaluate(v=>{v.pause();v.muted=true;});
await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
const meta = await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));
await writeFile(`${dir}/metadata.json`,JSON.stringify(meta,null,2));
const times = process.env.TIMES ? process.env.TIMES.split(',').map(Number) : Array.from({length:20},(_,i)=>i*meta.duration/20);
await page.evaluate(()=>{const c=document.createElement('canvas');c.id='frames';c.width=1200;c.height=1200;c.style.cssText='position:fixed;inset:0;z-index:2147483647;width:1200px;height:1200px';document.body.append(c);});
for (const [i,time] of times.entries()) {
  await video.evaluate((v,t)=>new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=Math.max(.001,t);}),time);
  await page.waitForTimeout(100);
  await video.evaluate((v,{i,time})=>{const c=document.querySelector('#frames');const ctx=c.getContext('2d');const w=300,h=220;const x=(i%4)*w,y=Math.floor(i/4)*240;ctx.fillStyle='#eee';ctx.fillRect(x,y,w,240);ctx.drawImage(v,x,y,w,h);ctx.fillStyle='#000';ctx.font='16px sans-serif';ctx.fillText(time.toFixed(2)+'s',x+8,y+237);},{i,time});
}
await page.locator('#frames').screenshot({path:`${dir}/${process.env.TIMES?'detail':'overview'}.png`});
await browser.close();
