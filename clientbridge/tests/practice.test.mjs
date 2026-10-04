import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleReview, duePhrases, validateProgress, recommendMission } from '../practice.mjs';
import { scenarios, phrases } from '../scenarios.mjs';
import { freshState } from '../core.mjs';
const now = Date.UTC(2026,9,4,12);
test('review ratings schedule again in 10 minutes and grow successful intervals', () => {
 assert.equal(scheduleReview(null,'again',now).due,now+600000);
 const good=scheduleReview(null,'good',now);assert.equal(good.interval,1);assert.equal(good.due,now+86400000);
 assert.equal(scheduleReview(good,'good',now).interval,2);
 assert.equal(scheduleReview(null,'easy',now).interval,3);
 assert.equal(scheduleReview({interval:90},'easy',now).interval,90);
});
test('due queue excludes future cards and includes unseen cards', () => {
 const reviews={[phrases[0].id]:{due:now+1000,interval:1,rating:'good'}};
 assert.equal(duePhrases(reviews,now).length,phrases.length-1);
 assert.ok(!duePhrases(reviews,now).some(p=>p.id===phrases[0].id));
});
test('recommendation continues partial mission before untouched missions', () => {
 const state=freshState();state.answers[scenarios[2].id]=[0];
 assert.equal(recommendMission(state).id,scenarios[2].id);
 for(const s of scenarios)state.answers[s.id]=s.steps.map(t=>t.choices.findIndex(c=>c.score.every(n=>n===3)));
 state.answers[scenarios[4].id]=[0,0,0];assert.equal(recommendMission(state).id,scenarios[4].id);
});
test('progress validation rejects malformed imports and preserves bounded history/reviews', () => {
 assert.throws(()=>validateProgress('{bad'));
 assert.throws(()=>validateProgress('{}'));
 const state=freshState();state.reviews={[phrases[0].id]:scheduleReview(null,'good',now),unknown:{due:now,interval:1,rating:'good'}};
 state.history=[{id:scenarios[0].id,at:now,choices:[1,0,2]},{id:'unknown',at:now,choices:[0]}];
 const clean=validateProgress(JSON.stringify(state));
 assert.equal(clean.history.length,1);assert.equal(Object.keys(clean.reviews).length,1);
 assert.ok(!clean.reviews.unknown);
});
