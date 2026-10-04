import { scenarios, phrases } from './scenarios.mjs';
import { difficulties, missionsFor } from './curriculum.mjs';
const emptyAnswers=()=>Object.fromEntries(scenarios.map(s=>[s.id,[]]));
export const freshState = () => ({version:2, active:null, answers:emptyAnswers(), reviews:{}, history:[], drafts:{},difficulty:'beginner',levels:Object.fromEntries(difficulties.map(l=>[l.id,{active:null,answers:emptyAnswers(),orders:{},history:[],completed:{}}]))});
const validTime=(n,futureDays=1)=>Number.isSafeInteger(n)&&n>0&&n<=Date.now()+futureDays*86400000;
const validChoice=(n,step)=>Number.isInteger(n)&&Boolean(step.choices[n]);
const validOrder=o=>Array.isArray(o)&&o.length===3&&new Set(o).size===3&&o.every(n=>Number.isInteger(n)&&n>=0&&n<3);
export const safeOrders=(saved,count=3)=>Array.from({length:count},(_,i)=>validOrder(saved?.[i])?[...saved[i]]:[0,1,2]);
export function readState(raw) {
  const clean = freshState();
  try {
    const value = JSON.parse(raw);
    if (![1,2].includes(value?.version) || !value.answers || typeof value.answers !== 'object') return clean;
    if (scenarios.some(s => s.id === value.active)) clean.active = value.active;
    if(value.version===2){
      if(difficulties.some(l=>l.id===value.difficulty))clean.difficulty=value.difficulty;
      for(const l of difficulties){const src=value.levels?.[l.id],dest=clean.levels[l.id];if(!src||typeof src!=='object')continue;
        for(const s of missionsFor(l.id)){const saved=src.answers?.[s.id];if(Array.isArray(saved)){for(let i=0;i<Math.min(saved.length,s.steps.length);i++){if(!validChoice(saved[i],s.steps[i]))break;dest.answers[s.id].push(saved[i]);}}
          if(Array.isArray(src.orders?.[s.id]))dest.orders[s.id]=safeOrders(src.orders[s.id],s.steps.length);
          if(src.active===s.id)dest.active=s.id;
        }
        if(Array.isArray(src.history))dest.history=src.history.filter(h=>{const s=missionsFor(l.id).find(s=>s.id===h?.id);return s&&validTime(h.at)&&Array.isArray(h.choices)&&h.choices.length===3&&h.choices.every((n,i)=>validChoice(n,s.steps[i]));}).slice(-200).map(h=>({id:h.id,at:h.at,choices:[...h.choices],orders:safeOrders(h.orders)}));
      }
      for(const l of difficulties){const dest=clean.levels[l.id],src=value.levels?.[l.id];for(const m of missionsFor(l.id)){const saved=src?.completed?.[m.id],latest=dest.history.filter(h=>h.id===m.id).at(-1)?.choices,current=dest.answers[m.id];const c=Array.isArray(saved)&&saved.length===3&&saved.every((n,i)=>validChoice(n,m.steps[i]))?saved:current.length===3?current:latest;if(c)dest.completed[m.id]=[...c];}}
      const candidates=Object.entries(clean.levels).flatMap(([id,l])=>l.history.map((h,i)=>({id,i,h}))).sort((a,b)=>b.h.at-a.h.at).slice(0,200);const keep=new Set(candidates.map(c=>c.id+':'+c.i));for(const [id,l] of Object.entries(clean.levels))l.history=l.history.filter((_,i)=>keep.has(id+':'+i));
    }
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
        return s && validTime(h.at) && Array.isArray(h.choices) && h.choices.length===s.steps.length && h.choices.every((n,i)=>Number.isInteger(n)&&s.steps[i].choices[n]);
      }).slice(-200).map(h=>({id:h.id,at:h.at,choices:[...h.choices]}));
    }
    for (const p of phrases) {
      const r=value.reviews?.[p.id];
      if(r && validTime(r.due,91) && Number.isFinite(r.interval) && r.interval>=0 && r.interval<=90 && ['again','good','easy'].includes(r.rating)) {
        clean.reviews[p.id]={due:r.due,interval:r.interval,rating:r.rating,reviewedAt:validTime(r.reviewedAt)?r.reviewedAt:0};
      }
    }
    for (const id of ['builder',...scenarios.map(s=>s.id),...difficulties.flatMap(l=>scenarios.map(s=>l.id+':'+s.id))]) {
      if(typeof value.drafts?.[id]==='string') clean.drafts[id]=value.drafts[id].slice(0,20000);
    }

  } catch { /* Untrusted or unavailable saved state is safely discarded. */ }
  return clean;
}
export function evaluate(scenario, choices) {
  const totals = [0,0,0]; let answered = 0; let bestCount=0;
  choices.slice(0, scenario.steps.length).forEach((choice,index) => {
    const answer = scenario.steps[index].choices[choice];
    if (!answer) return;
    answered++;if(answer.score.every(n=>n===3))bestCount++;
    answer.score.forEach((n,i) => totals[i] += n);
  });
  const maximum = scenario.steps.length * 3;
  const dimensions = totals.map(n => Math.round(n/maximum*100));
  return {total:Math.round(totals.reduce((a,b)=>a+b,0)/(maximum*3)*100),dimensions,answered,bestCount,accuracy:answered?Math.round(bestCount/answered*100):null};
}
export function composeEmail(scenario, choices) {
  return `Subject: ${scenario.emailSubject}\n\nDear ${scenario.client},\n\nThank you for discussing the next steps with us. ${scenario.emailSummary}\n\n${scenario.emailNext}\n\nPlease let us know if this reflects your understanding or if you would like to clarify any details.\n\nKind regards,\nThe ClientBridge project team`;
}
