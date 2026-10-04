const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert=require('node:assert/strict');
const {readFile,mkdir}=require('node:fs/promises');
const path=require('node:path');
const base=process.env.CLIENTBRIDGE_URL || 'http://127.0.0.1:8765/clientbridge/';
const shots=process.env.CLIENTBRIDGE_SCREENSHOTS;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByRole('heading',{name:'Your next great conversation.'}).waitFor();
 const data=await page.evaluate(async()=>{const m=await import('./scenarios.mjs');return {scenarios:m.scenarios,phrases:m.phrases}});
 assert.equal(data.scenarios.length,12);assert.equal(data.phrases.length,36);
 if(shots){await mkdir(shots,{recursive:true});await page.screenshot({path:path.join(shots,'clientbridge-desktop.png'),fullPage:true});}
 await page.locator('#mission-search').fill('incident');assert.equal(await page.locator('[data-mission]:visible').count(),1);
 await page.locator('#mission-search').fill('not-found');assert.equal(await page.locator('[data-mission]:visible').count(),0);
 await page.locator('#mission-search').fill('');await page.locator('#mission-level').selectOption('C1');assert.equal(await page.locator('[data-mission]:visible').count(),2);
 await page.locator('#mission-level').selectOption('all');
 for(const s of data.scenarios){
  await page.locator(`.card-start[data-start="${s.id}"]`).click();await page.locator('.choice').first().waitFor();
  for(let i=0;i<3;i++){
   const best=s.steps[i].choices.findIndex(c=>c.score.every(n=>n===3));
   await page.locator(`[data-choice="${best}"]`).click();await page.locator('.feedback').waitFor();
   assert.equal(await page.locator('.choice:disabled').count(),3);
   assert.ok((await page.locator('.feedback').innerText()).includes('9 / 9'));
   if(s.id==='requirements'&&i===0){await page.reload();await page.locator('.feedback').waitFor();assert.equal(await page.locator('.choice:disabled').count(),3);}
   if(shots&&s.id==='requirements'&&i===1)await page.screenshot({path:path.join(shots,'clientbridge-conversation.png'),fullPage:true});
   await page.locator('[data-continue]').click();
  }
  await page.locator('.score-inner strong').waitFor();assert.equal(await page.locator('.score-inner strong').innerText(),'100%');
  const email=await page.locator('#client-email').inputValue();assert.ok(email.includes(s.emailSubject));assert.ok(email.includes(s.client));
  await page.locator('.review-item summary').first().click();assert.ok(await page.locator('.review-detail').first().isVisible());
  if(shots&&s.id==='requirements')await page.screenshot({path:path.join(shots,'clientbridge-results.png'),fullPage:true});
  await page.locator('.back-button').click();await page.locator('.mission-grid').waitFor();
 }
 assert.ok((await page.locator('#rail-fraction').innerText()).includes('12 / 12'));
 await page.goto(base+'#result/requirements');await page.locator('[data-retry]').click();
 for(let i=0;i<3;i++){await page.locator('[data-choice="0"]').click();await page.locator('[data-continue]').click();}
 assert.notEqual(await page.locator('.score-inner strong').innerText(),'100%');
 await page.goto(base+'#phrasebook');await page.locator('#phrase-search').fill('budget');assert.ok(await page.locator('.phrase-card').count()>0);
 await page.locator('#phrase-search').fill('');await page.locator('#phrase-category').selectOption('Security');assert.equal(await page.locator('.phrase-card').count(),3);
 await page.locator('#phrase-search').fill('ZZZZ');assert.ok(await page.locator('.empty-state').isVisible());
 await page.goto(base+'#flashcards');await page.locator('[data-session]').click();
 for(let i=0;i<8;i++){await page.locator('[data-reveal]').click();assert.ok(await page.locator('.flashcard-answer').isVisible());await page.locator(`[data-rating="${i===0?'again':i%2?'good':'easy'}"]`).click();}
 await page.getByText('SESSION COMPLETE',{exact:true}).waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('clientbridge.progress.v1')));assert.equal(Object.keys(saved.reviews).length,8);assert.equal(saved.history.length,13);
 await page.reload();assert.ok((await page.locator('.review-numbers').innerText()).includes('28'));
 await page.goto(base+'#emails');await page.locator('.skip').evaluate(e=>e.click());assert.equal(await page.evaluate(()=>location.hash),'#emails');assert.equal(await page.evaluate(()=>document.activeElement.id),'main');await page.locator('#email-context').selectOption('security');await page.locator('#email-recipient').fill('Pat');await page.locator('#email-sender').fill('Vladislav');await page.locator('#email-action').fill('Please confirm access by Friday at 14:00 UTC.');await page.locator('[data-generate]').click();
 let draft=await page.locator('#client-email').inputValue();assert.ok(draft.includes('Dear Pat,'));assert.ok(draft.includes('14:00 UTC'));assert.ok(draft.endsWith('Vladislav'));
 await page.locator('#client-email').fill(draft+'\nEdited locally.');await page.reload();assert.ok((await page.locator('#client-email').inputValue()).endsWith('Edited locally.'));
 await page.locator('[data-copy]').click();assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).includes('Dear Pat,'));
 const [emailDownload]=await Promise.all([page.waitForEvent('download'),page.locator('[data-download]').click()]);assert.ok((await readFile(await emailDownload.path(),'utf8')).includes('Edited locally.'));
 await page.goto(base+'#progress');assert.equal(await page.locator('.history-row').count(),13);
 const [backup]=await Promise.all([page.waitForEvent('download'),page.locator('[data-export]').click()]);const backupPath=await backup.path();const backupData=JSON.parse(await readFile(backupPath,'utf8'));assert.equal(backupData.history.length,13);
 await page.locator('[data-import]').click();await page.locator('#import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Could not import'));assert.ok((await page.locator('#toast').innerText()).includes('Could not import'));
 await page.locator('#import-file').setInputFiles(backupPath);await page.locator('#import-dialog').waitFor({state:'visible'});await page.locator('#import-cancel').click();assert.equal(await page.locator('.history-row').count(),13);
 await page.locator('#import-file').setInputFiles(backupPath);await page.locator('#import-confirm').click();assert.equal(await page.locator('.history-row').count(),13);
 await page.locator('[data-reset]').click();await page.locator('#reset-cancel').click();assert.equal(await page.locator('.history-row').count(),13);
 await page.locator('[data-reset]').click();await page.locator('#reset-confirm').click();await page.locator('.mission-grid').waitFor();assert.equal(await page.locator('#rail-fraction').innerText(),'0 / 12');
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:width<500?844:1000});
  for(const route of ['practice','mission/requirements','phrasebook','flashcards','emails','progress','project']){
   await page.goto(base+'#'+route);await page.locator('main h1').waitFor();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);assert.equal(overflow,false,`overflow ${width} ${route}`);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'#practice');
 if(shots)await page.screenshot({path:path.join(shots,'clientbridge-mobile.png'),fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.mission-card').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 const broken=await browser.newContext();await broken.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});const blocked=await broken.newPage();await blocked.goto(base);await blocked.locator('[data-start]').first().click();await blocked.locator('[data-choice="1"]').click();assert.ok(await blocked.locator('.feedback').isVisible());assert.ok(await blocked.locator('.storage-warning').isVisible());await broken.close();
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('clientbridge.progress.v1','{broken'));const corruptPage=await corrupt.newPage();await corruptPage.goto(base);assert.equal(await corruptPage.locator('#rail-fraction').innerText(),'0 / 12');await corrupt.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: 12 missions / 36 decisions, best and weak replies, reload, locks, search/filter, 8-card scheduling, drafts/copy/download, history/export/import/reset, 28 responsive route checks, reduced motion, blocked/corrupt storage. No browser errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
