import {missionsFor,missionFor} from './curriculum.mjs';
import {evaluate,safeOrders} from './core.mjs';
export function prepareAttempt(state,id,level=state.difficulty,rng=Math.random,restart=false){
 const s=missionFor(id,level),data=state.levels[level];if(!s||!data)return;
 if(restart){if(data.answers[id].length===3)data.completed[id]=[...data.answers[id]];data.answers[id]=[];}
 if(restart||!data.orders[id])data.orders[id]=s.steps.map(()=>{const order=[0,1,2];for(let i=2;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(rng()*(i+1))));[order[i],order[j]]=[order[j],order[i]];}return order;});
 data.active=id;
}
export const choiceOrder=(state,id,level,step)=>safeOrders(state.levels[level].orders[id])[step];
export function recordChoice(state,id,level,index,now=Date.now()){
 const data=state.levels[level],s=missionFor(id,level),answers=data?.answers[id];if(!s||!answers||answers.length>=3||!Number.isInteger(index)||!s.steps[answers.length].choices[index])return false;
 answers.push(index);if(answers.length===3){data.completed[id]=[...answers];data.history.push({id,at:now,choices:[...answers],orders:safeOrders(data.orders[id])});const all=Object.entries(state.levels).flatMap(([l,d])=>d.history.map((h,i)=>({l,h,i}))).sort((a,b)=>b.h.at-a.h.at).slice(0,200);const keep=new Set(all.map(a=>a.l+':'+a.i));for(const [l,d] of Object.entries(state.levels))d.history=d.history.filter((_,i)=>keep.has(l+':'+i));}return true;
}
export const totalNewAttempts=state=>Object.values(state.levels).reduce((n,l)=>n+l.history.length,0);
export function levelProfile(state,level){const data=state.levels[level],done=missionsFor(level).filter(s=>(data.completed[s.id]||data.answers[s.id]).length===3),scores=done.map(s=>evaluate(s,data.completed[s.id]||data.answers[s.id]));const dimensions=done.length?[0,1,2].map(i=>Math.round(scores.reduce((n,s)=>n+s.dimensions[i],0)/done.length)):null;return {accuracy:done.length?Math.round(scores.reduce((n,s)=>n+s.bestCount,0)/(done.length*3)*100):null,bestCount:scores.reduce((n,s)=>n+s.bestCount,0),decisions:done.length*3,completed:done.length,attempts:data.history.length,dimensions,average:done.length?Math.round(scores.reduce((n,s)=>n+s.total,0)/done.length):null,weak:dimensions?dimensions.indexOf(Math.min(...dimensions)):null,evidence:done.length>=3};}
export function recommendForLevel(state,level=state.difficulty){const data=state.levels[level],missions=missionsFor(level),partial=missions.find(s=>data.answers[s.id].length>0&&data.answers[s.id].length<3);if(partial)return partial;const profile=levelProfile(state,level),unseen=missions.filter(s=>!data.answers[s.id].length);if(unseen.length)return unseen.find(s=>s.skillFocus===profile.weak)||unseen[0];const dim=profile.weak;return [...missions].sort((a,b)=>evaluate(a,data.completed[a.id]||data.answers[a.id]).dimensions[dim]-evaluate(b,data.completed[b.id]||data.answers[b.id]).dimensions[dim])[0];}
