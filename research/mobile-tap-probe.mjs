import { chromium } from 'file:///C:/Users/ilyas/AppData/Local/npm-cache/_npx/af752b90495482d7/node_modules/playwright-core/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const out='C:/Users/ilyas/Desktop/portfolio/research/mobile-taps';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',reducedMotion:'no-preference'});
const page=await context.newPage();
const cdp=await context.newCDPSession(page);
const log=[];
async function swipe(){
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:196,y:710}]});
 for(let j=1;j<=14;j++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:196,y:710-j*38}]});await page.waitForTimeout(15);}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(1500);
}
async function snap(name){
 await page.screenshot({path:`${out}/${name}.png`});
 const state=await page.evaluate(()=>({scrollY,url:location.href,toggle:Array.from(document.querySelectorAll('[data-home-swipe-toggle]')).map(x=>({pressed:x.getAttribute('aria-pressed'),disabled:x.getAttribute('data-scroll-disabled')})),helmets:Array.from(document.querySelectorAll('[data-helmet-item]')).slice(0,2).map(x=>({className:x.className,style:x.getAttribute('style'),text:x.textContent,imgs:Array.from(x.querySelectorAll('img')).map(e=>({class:e.className,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,clip:getComputedStyle(e).clipPath}))}))}));
 log.push({name,...state});console.log(JSON.stringify({name,y:state.scrollY,toggle:state.toggle}));
}
await page.goto('https://landonorris.com/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(10000);
await page.locator('[data-home-swipe-toggle]').tap();await page.waitForTimeout(700);await snap('locked_before_swipe');
await swipe();await snap('locked_after_swipe');
await page.locator('[data-home-swipe-toggle]').tap();await swipe();await snap('unlocked_after_swipe');
await page.locator('[data-helmet-item]').first().scrollIntoViewIfNeeded();await page.waitForTimeout(1500);await snap('helmet_before_tap');
await page.locator('[data-helmet-item]').first().tap();await page.waitForTimeout(800);await snap('helmet_after_tap');
await page.touchscreen.tap(200,400);await page.waitForTimeout(800);await snap('helmet_after_outside_tap');
await writeFile(`${out}/observations.json`,JSON.stringify(log,null,2));
await browser.close();
