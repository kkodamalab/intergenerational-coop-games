import {test,expect,type Page} from '@playwright/test';
async function checkLayout(page:Page){
 const boxes=await page.evaluate(()=>{const rect=(selector:string)=>{const r=document.querySelector(selector)!.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};};return {hud:rect('#hockey-hud'),court:rect('#game'),controls:rect('.controls'),score:rect('#hockey-score'),timer:rect('#time-status')};});
 expect(boxes.controls.bottom).toBeLessThanOrEqual(boxes.hud.top);
 expect(boxes.hud.bottom).toBeLessThan(boxes.court.top);
 const {score,timer}=boxes;expect(score.right<=timer.left||timer.right<=score.left||score.bottom<=timer.top||timer.bottom<=score.top).toBe(true);
 expect(timer.left).toBeGreaterThanOrEqual(boxes.hud.left);expect(timer.right).toBeLessThanOrEqual(boxes.hud.right);
 await expect(page.locator('#game')).toHaveAttribute('width','1000');await expect(page.locator('#game')).toHaveAttribute('height','700');
}
for(const [name,width,height] of [['desktop',1280,1000],['narrow',700,900],['phone',390,844],['fullscreen',1280,1000]] as const)test(`hockey HUD stays outside court: ${name}`,async({page})=>{
 await page.setViewportSize({width,height});await page.clock.install();await page.goto('./');await page.locator('#hockey').click();await page.locator('#demo').check();await page.locator('#duration').fill('30');await page.locator('#start').click();await page.clock.runFor(16);if(name==='fullscreen'){await page.locator('#fullscreen').click();await expect.poll(()=>page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);await page.clock.runFor(100);}await expect(page.locator('#time-status')).toHaveText('残り 30 秒');await checkLayout(page);
 await page.clock.runFor(3100);await page.clock.fastForward(8000);await expect(page.locator('#time-status')).toHaveText('残り 21 秒');await checkLayout(page);await page.locator('#play').screenshot({path:test.info().outputPath(`hud-${name}.png`)});
 await page.locator('#pause').click();await page.clock.fastForward(5000);await expect(page.locator('#time-status')).toHaveText('残り 21 秒');await checkLayout(page);
 await page.locator('#pause').click();await page.clock.runFor(3100);await page.clock.fastForward(12000);await expect(page.locator('#time-status')).toHaveText('残り 9 秒');await checkLayout(page);
 await page.clock.fastForward(8000);await expect(page.locator('#time-status')).toHaveText('残り 1 秒');await checkLayout(page);
 await page.clock.fastForward(1000);await expect(page.locator('#time-status')).toHaveText('残り 0 秒');await checkLayout(page);
 await page.locator('#restart').click();await page.clock.runFor(16);await expect(page.locator('#time-status')).toHaveText('残り 30 秒');await checkLayout(page);
 await page.locator('#fullscreen').click();await expect.poll(()=>page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);await page.clock.runFor(100);await checkLayout(page);
 await page.evaluate(()=>document.exitFullscreen());await page.clock.runFor(100);await checkLayout(page);
 await page.locator('#home').click();await page.locator('#harvest').click();await page.locator('#start').click();await page.clock.runFor(16);await expect(page.locator('#hockey-hud')).toBeHidden();expect(await page.locator('#time-status').evaluate(el=>el.previousElementSibling?.id)).toBe('game');
});
