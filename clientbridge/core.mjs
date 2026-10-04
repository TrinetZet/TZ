import { scenarios, phrases } from './scenarios.mjs';
export const freshState = () => ({version:1, active:null, answers:Object.fromEntries(scenarios.map(s => [s.id, []])), reviews:{}, history:[], drafts:{}});
export function readState(raw) {
  const clean = freshState();
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !value.answers || typeof value.answers !== 'object') return clean;
    if (scenarios.some(s => s.id === value.active)) clean.active = value.active;
    for (const s of scenarios) {
      const saved = value.answers[s.id];
      if (!Array.isArray(saved)) continue;
      for (let i=0; i<Math.min(saved.length,s.steps.length); i++) {
        if (!Number.isInteger(saved[i]) || !s.steps[i].choices[saved[i]]) break;
        clean.answers[s.id].push(saved[i]);
      }
    }
    if (Array.isArray(value.history)) {
      clean.history = value.history.filter(h => {
        const s = scenarios.find(s => s.id===h?.id);
        return s && Number.isFinite(h.at) && h.at>0 && Array.isArray(h.choices) && h.choices.length===s.steps.length && h.choices.every((n,i)=>Number.isInteger(n)&&s.steps[i].choices[n]);
      }).slice(-200).map(h=>({id:h.id,at:h.at,choices:[...h.choices]}));
    }
    for (const p of phrases) {
      const r=value.reviews?.[p.id];
      if(r && Number.isFinite(r.due) && r.due>0 && Number.isFinite(r.interval) && r.interval>=0 && r.interval<=90 && ['again','good','easy'].includes(r.rating)) {
        clean.reviews[p.id]={due:r.due,interval:r.interval,rating:r.rating,reviewedAt:Number.isFinite(r.reviewedAt)?r.reviewedAt:0};
      }
    }
    for (const id of ['builder',...scenarios.map(s=>s.id)]) {
      if(typeof value.drafts?.[id]==='string') clean.drafts[id]=value.drafts[id].slice(0,20000);
    }

  } catch { /* Untrusted or unavailable saved state is safely discarded. */ }
  return clean;
}
export function evaluate(scenario, choices) {
  const totals = [0,0,0]; let answered = 0;
  choices.slice(0, scenario.steps.length).forEach((choice,index) => {
    const answer = scenario.steps[index].choices[choice];
    if (!answer) return;
    answered++;
    answer.score.forEach((n,i) => totals[i] += n);
  });
  const maximum = scenario.steps.length * 3;
  const dimensions = totals.map(n => Math.round(n/maximum*100));
  return {total:Math.round(totals.reduce((a,b)=>a+b,0)/(maximum*3)*100),dimensions,answered};
}
export function composeEmail(scenario, choices) {
  return `Subject: ${scenario.emailSubject}\n\nDear ${scenario.client},\n\nThank you for discussing the next steps with us. ${scenario.emailSummary}\n\n${scenario.emailNext}\n\nPlease let us know if this reflects your understanding or if you would like to clarify any details.\n\nKind regards,\nThe ClientBridge project team`;
}
