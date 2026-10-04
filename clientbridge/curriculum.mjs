import {scenarios} from './scenarios.mjs';
import {variantsA} from './content-a.mjs';
import {variantsB} from './content-b.mjs';
export const difficulties=[
 {id:'beginner',label:'Beginner',description:'Clear requests, careful promises and useful next steps.'},
 {id:'advanced',label:'Advanced',description:'Priorities, dependencies and realistic trade-offs.'},
 {id:'expert',label:'Expert',description:'Subtext, diplomatic disagreement and nuanced negotiation.'}
];
export const skillLabels=['Context judgment','Relationship & tone','Action & risk'];
const variants={...variantsA,...variantsB};
const focus={requirements:0,negotiation:1,delay:2,complaint:1,scope:0,security:2,meeting:0,handover:2,incident:2,feedback:1,payment:1,async:0};
const catalog=Object.fromEntries(difficulties.map(l=>[l.id,scenarios.map(s=>({...s,...variants[s.id][l.id],difficulty:l.id,level:l.label,skillFocus:focus[s.id]}))]));
export const missionsFor=level=>catalog[level]||catalog.beginner;
export const missionFor=(id,level)=>missionsFor(level).find(s=>s.id===id);
