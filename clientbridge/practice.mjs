import { scenarios, phrases } from './scenarios.mjs';
import { evaluate, readState } from './core.mjs';
export function scheduleReview(previous, rating, now=Date.now()) {
  if (!['again','good','easy'].includes(rating)) throw new Error('Unknown review rating');
  const prior = Number.isFinite(previous?.interval) ? previous.interval : 0;
  const interval = rating==='again' ? 0 : Math.min(90, rating==='easy' ? Math.max(3,prior*3) : Math.max(1,prior*2));
  return {rating,interval,due:now+(rating==='again'?600000:interval*86400000),reviewedAt:now};
}
export function duePhrases(reviews,now=Date.now()) {
  return phrases.filter(p=>!reviews[p.id] || reviews[p.id].due<=now).sort((a,b)=>(reviews[a.id]?.due||0)-(reviews[b.id]?.due||0));
}
export function recommendMission(state) {
  return scenarios.find(s=>state.answers[s.id].length>0&&state.answers[s.id].length<s.steps.length)
    || scenarios.find(s=>state.answers[s.id].length===0)
    || [...scenarios].sort((a,b)=>evaluate(a,state.answers[a.id]).total-evaluate(b,state.answers[b.id]).total)[0];
}
export function validateProgress(raw) {
  if(raw.length>1000000) throw new Error('Progress file is too large.');
  const value=JSON.parse(raw);
  if(![1,2].includes(value?.version) || !value.answers || typeof value.answers!=='object' || Array.isArray(value.answers)) throw new Error('This is not a ClientBridge progress file.');
  if(value.version===2 && (!value.levels || typeof value.levels!=='object' || ['beginner','advanced','expert'].some(l=>!value.levels[l]?.answers || typeof value.levels[l].answers!=='object' || Array.isArray(value.levels[l].answers))))throw new Error('This backup is missing difficulty profiles.');
  return readState(raw);
}
