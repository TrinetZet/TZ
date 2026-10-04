const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs/promises');
(async()=>{const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto((process.env.CLIENTBRIDGE_URL||'http://127.0.0.1:8778/clientbridge/')+'#project');
await page.locator('#project-guide').waitFor({timeout:4000});
assert.equal(await page.locator('#guide-content').getAttribute('lang'),'ru');
assert.ok((await page.locator('#guide-content').innerText()).includes('Practice room'));
const original=await page.evaluate(()=>localStorage.getItem('clientbridge.progress.v1'));
await page.locator('[data-guide-lang="en"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#guide-content').getAttribute('lang'),'en');assert.equal(await page.locator('[data-guide-lang="en"]').getAttribute('aria-pressed'),'true');
await page.reload();assert.equal(await page.locator('#guide-content').getAttribute('lang'),'en');assert.equal(await page.evaluate(()=>localStorage.getItem('clientbridge.progress.v1')),original);
for(const lang of ['ru','en']){await page.locator(`[data-guide-lang="${lang}"]`).click();for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
if(process.env.CLIENTBRIDGE_SCREENSHOTS){await fs.mkdir(process.env.CLIENTBRIDGE_SCREENSHOTS,{recursive:true});await page.setViewportSize({width:1100,height:900});await page.locator('#project-guide').scrollIntoViewIfNeeded();await page.screenshot({path:process.env.CLIENTBRIDGE_SCREENSHOTS+'/guide-'+lang+'.png',fullPage:true});}}
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#project-guide').evaluate(e=>getComputedStyle(e).animationName),'none');
console.log('PASS bilingual guide, RU default, keyboard switch, persistence, untouched progress, eight responsive checks.');await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
