import { scenarios, phrases } from './scenarios.mjs';
import { scheduleReview, duePhrases, recommendMission, validateProgress } from './practice.mjs';
import { freshState, readState, evaluate, composeEmail } from './core.mjs';
let importCandidate = null;
let reviewQueue = [];
let reviewIndex = 0;
let reviewRevealed = false;
const KEY = 'clientbridge.progress.v1';
let storageAvailable = true;
let state;
try { state = readState(localStorage.getItem(KEY)); } catch { state = freshState(); storageAvailable = false; }
const main = document.querySelector('#main');
const dialog = document.querySelector('#reset-dialog');
let toastTimer;
let cursor = 0;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message) {
  const element = document.querySelector('#toast'); element.textContent = message; element.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 4500);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; toast('Progress cannot be saved in this browser. You can still practise.'); }
  updateJourney();
}
function updateJourney() {
  const complete = scenarios.filter(s => state.answers[s.id].length === s.steps.length).length;
  document.querySelector('#rail-fraction').textContent = `${complete} / ${scenarios.length}`;
  document.querySelector('#rail-bar').style.width = `${complete/scenarios.length*100}%`;
}
function route(hash, focus = true) {
  if (location.hash === `#${hash}`) render(focus);
  else location.hash = hash;
}
function setPage(html, page, focus) {
  const warning = storageAvailable ? '' : '<div class="storage-warning" role="status">Browser storage is unavailable. Your progress will last only until this page closes.</div>';
  main.innerHTML = warning + html;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const current = link.dataset.nav === page;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  document.querySelector('#breadcrumb').innerHTML = `Workspace <span>/</span> ${({practice:'Practice room',phrasebook:'Phrasebook',project:'The project',flashcards:'Review cards',emails:'Email studio',progress:'My progress'})[page]}`;
  updateJourney();
  if (focus) { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
}
function dashboard(focus) {
  const complete = scenarios.filter(s => state.answers[s.id].length === 3);
  const average = complete.length ? Math.round(complete.reduce((n,s) => n + evaluate(s,state.answers[s.id]).total,0)/complete.length) : null;
  const next = recommendMission(state);
  setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">A LITTLE PRACTICE. A BIG DIFFERENCE.</div><h1>Your next great conversation.</h1><p>Business English for the moments that matter in IT.</p></div><span class="small-tag">B1–C1 · SELF-PACED</span></div>
    <section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> THE HUMAN SIDE OF TECH</div><h2 id="hero-title">Good conversations.<br><em>Great partnerships.</em></h2><p>You know how to build the product. Now practise the words that build your client’s trust.</p><div class="hero-action"><button class="button primary" data-train="${next.id}">${state.answers[next.id].length ? 'Continue practising' : 'Step into a conversation'} <span aria-hidden="true">↗</span></button><span>3 decisions · about 5 minutes</span></div></div>
    <div class="hero-art" aria-hidden="true"><div class="orb"></div><div class="orbit"></div><div class="sample-window"><div class="window-top"><span>Northstar Studio · Client chat</span><span class="window-dots"><i></i><i></i><i></i></span></div><div class="sample-client"><div class="sample-avatar">AL</div><div class="sample-bubble">“Can we get a simple dashboard<br>in the next sprint?”</div></div><div class="sample-reply">“Could you clarify which metrics<br>your team needs to see?”</div><div class="sample-coach">✓ Clear question. Collaborative tone.</div></div><span class="floating-badge">✦ Confidence, one reply at a time.</span></div></section>
    <div class="stats-strip" aria-label="Your learning progress"><div class="stat"><span class="stat-icon" aria-hidden="true">◫</span><div><strong>${complete.length}<span style="font-size:12px;color:#879288"> / ${scenarios.length}</span></strong><small>Missions completed</small></div></div><div class="stat"><span class="stat-icon" aria-hidden="true">↗</span><div><strong>${average === null ? '—' : average+'%'}</strong><small>Average practice score</small></div></div><div class="stat"><span class="stat-icon" aria-hidden="true">▤</span><div><strong>${phrases.length}</strong><small>Useful business phrases</small></div></div></div>
    <section aria-labelledby="mission-list-title"><div class="section-heading"><h2 id="mission-list-title">Choose your next challenge</h2><span>Real situations. Better responses.</span></div><div class="mission-toolbar"><label class="search-field"><span aria-hidden="true">⌕</span><input id="mission-search" type="search" aria-label="Search missions" placeholder="Search by topic or situation…"></label><label class="filter-label">Level<select id="mission-level"><option value="all">All levels</option><option value="B1">B1–B2</option><option value="B2">B2</option><option value="C1">B2–C1</option></select></label></div><div class="mission-grid">${scenarios.map(s => {
      const answers = state.answers[s.id]; const done = answers.length === 3;
      return `<article class="mission-card" data-mission="${s.id}" data-level="${s.level}"><div class="card-top"><span class="mission-icon ${s.color}" aria-hidden="true">${s.icon}</span><span class="mission-number">MISSION / ${s.number}</span></div><div class="card-category">${s.category}${done ? '<span class="card-status">COMPLETED</span>' : answers.length ? '<span class="card-status">IN PROGRESS</span>' : ''}</div><h3>${s.title}</h3><p>${s.description}</p><div class="card-bottom"><span class="mission-meta">${s.level} <span aria-hidden="true">·</span> ${s.minutes} min <span aria-hidden="true">·</span> 3 decisions</span><button class="card-start" data-start="${s.id}" aria-label="${done ? 'View results for' : answers.length ? 'Continue' : 'Start'} ${s.title}">${done ? 'View results' : answers.length ? 'Continue mission' : 'Start mission'}<span aria-hidden="true">↗</span></button></div></article>`;
    }).join('')}</div></section><div class="daily-banner"><div><div class="eyebrow">BUILD A HABIT</div><h2>A small session. A stronger skill.</h2><p>${duePhrases(state.reviews).length} phrases are ready to review. Try a fresh conversation, then revisit the language you learned.</p></div><div><button class="button secondary" data-random>Surprise me ↗</button><a class="button primary" href="#flashcards">Review phrases →</a></div></div><div class="practice-note"><span>No pressure. Every answer is a chance to learn.</span><a href="#project">Meet the team behind ClientBridge ↗</a></div><button class="button text mobile-reset" data-reset>↺ Reset progress</button></div>`, 'practice', focus);
}
function start(id) {
  const s = scenarios.find(s => s.id === id); if (!s) return;
  state.active = id; save();
  cursor = Math.max(0,state.answers[id].length-1);
  route(`${state.answers[id].length === 3 ? 'result' : 'mission'}/${id}`);
}
function mission(s, focus) {
  const answers = state.answers[s.id];
  cursor = Math.min(cursor,answers.length,s.steps.length-1);
  const step = s.steps[cursor];
  const selected = answers[cursor];
  const chosen = step.choices[selected];
  const best = step.choices.find(c => c.score.every(n => n === 3));
  setPage(`<div class="view-enter"><button class="back-button" data-back>← Back to missions</button><div class="mission-header"><span class="mission-icon ${s.color}" aria-hidden="true">${s.icon}</span><div><div class="eyebrow">MISSION ${s.number} / ${s.category}</div><h1>${s.title}</h1></div></div><div class="mission-layout"><section class="conversation-panel" aria-label="Conversation with ${s.client}"><div class="conversation-top"><div class="client-avatar ${s.color}">${s.initials}</div><div><div class="client-name">${s.client}</div><div class="client-role">${s.role}</div></div><span class="online"><span class="live-dot"></span>Client chat</span></div><div class="conversation-body"><div class="step-counter"><span>Decision ${cursor+1} of 3</span><span class="step-dots" aria-hidden="true">${s.steps.map((_,i)=>`<i class="${i<=cursor?'filled':''}"></i>`).join('')}</span></div><div class="client-message">${step.message}</div><div class="response-label">${chosen ? 'YOUR RESPONSE · FEEDBACK BELOW' : 'HOW WOULD YOU RESPOND?'}</div><div class="choices">${step.choices.map((c,i)=>`<button class="choice ${selected===i?'selected':''}" data-choice="${i}" ${chosen?'disabled':''} ${selected===i?'aria-label="Selected answer: '+escape(c.text)+'"':''}><span class="choice-letter" aria-hidden="true">${'ABC'[i]}</span><span>${c.text}</span></button>`).join('')}</div>${chosen ? `<section class="feedback ${chosen===best?'':'developing'}" aria-label="Answer feedback" tabindex="-1"><div class="feedback-heading"><span>${chosen===best?'✦ A reply that builds trust.':'↗ A useful learning moment.'}</span><small>${chosen.score.reduce((a,b)=>a+b,0)} / 9 points</small></div><p>${chosen.feedback}</p>${chosen===best?'':`<div class="better-answer"><strong>A stronger alternative</strong><p>${best.text}</p></div>`}</section><div class="continue-row"><small>Clarity · Tone · Next steps</small><button class="button primary" data-continue>${cursor===2?'See my results':'Next message'} <span aria-hidden="true">→</span></button></div>`:''}</div><div class="session-footnote">A simulated client conversation. Take your time before replying.</div></section><aside class="brief-panel" aria-label="Mission brief and language coaching"><section class="brief-card context"><h2><span aria-hidden="true">◫</span> The situation</h2><p>${s.context}</p></section><section class="brief-card objective"><h2><span aria-hidden="true">◎</span> Your objective</h2><p>${s.objective}</p></section><section class="brief-card coach"><h2><span aria-hidden="true">✦</span> Language coach</h2><p>${step.tip}</p><span class="phrase-inline">“${step.phrase}”</span><small>${step.meaning}</small></section></aside></div></div>`, 'practice', focus);
}
function result(s, focus) {
  const answers = state.answers[s.id];
  if (answers.length < 3) { cursor=Math.max(0,answers.length-1); return mission(s,focus); }
  const score = evaluate(s,answers);
  const labels = ['Clarity','Business tone','Next steps'];
  const descriptions = ['Be specific and easy to understand.','Stay courteous and collaborative.','Offer a realistic way forward.'];
  setPage(`<div class="view-enter"><button class="back-button" data-back>← Back to missions</button><section class="result-hero" aria-label="Practice results">${score.total>=80?Array.from({length:16},(_,i)=>`<i class="confetti" aria-hidden="true" style="left:${8+i*5.5}%;animation-delay:${i*.035}s"></i>`).join(''):''}<div class="score-ring" style="--score:${score.total}"><div class="score-inner"><strong>${score.total}%</strong><span>PRACTICE SCORE</span></div></div><div><div class="eyebrow">MISSION ${s.number} / COMPLETE</div><h1>${score.total>=80?'That’s how trust is built.':score.total>=50?'You’re finding your voice.':'Every conversation is practice.'}</h1><p>${score.total>=80?'You combined clear language, a professional tone and practical next steps. Take these habits into your next real conversation.':'Review your replies below, compare the stronger alternatives and try again. Small changes in language can make a big difference.'}</p></div></section><div class="result-content"><section class="result-skills"><h2>Your communication toolkit</h2>${labels.map((label,i)=>`<div class="dimension"><div class="dimension-label"><span>${label}</span><strong>${score.dimensions[i]}%</strong></div><div class="dimension-track"><div style="--value:${score.dimensions[i]}"></div></div><p class="dimension-description">${descriptions[i]}</p></div>`).join('')}<div class="result-actions"><a class="button mint" href="#flashcards">Review key phrases →</a><button class="button secondary" data-retry="${s.id}">↺ Practise again</button><button class="button primary" data-back>Explore missions →</button></div></section><section class="email-panel" aria-labelledby="email-title"><div class="email-top"><h2 id="email-title">From conversation to email.</h2><span>MODEL RESPONSE</span></div><p>A suggested professional follow-up based on the mission brief, rather than a transcript of your choices. Edit it to make it your own.</p><label for="client-email">Your editable draft · saved on this device</label><textarea id="client-email" data-draft="${s.id}" spellcheck="true">${escape(state.drafts[s.id] ?? composeEmail(s,answers))}</textarea><div class="email-buttons"><button class="button primary" data-copy>Copy email <span aria-hidden="true">⧉</span></button><button class="button secondary" data-download="${s.id}">Download .txt <span aria-hidden="true">↓</span></button><small>Nothing is sent to a client.</small></div></section></div><section class="review-section"><h2>Revisit your decisions</h2>${s.steps.map((step,i)=>{
    const chosen=step.choices[answers[i]], best=step.choices.find(c=>c.score.every(n=>n===3));
    return `<details class="review-item"><summary><span>0${i+1} · ${step.phrase}</span><small>${chosen.score.reduce((a,b)=>a+b,0)} / 9 points <span aria-hidden="true">⌄</span></small></summary><div class="review-detail"><p><strong>Client:</strong> ${step.message}</p><p><strong>Your reply:</strong> ${chosen.text}</p><p>${chosen.feedback}</p>${chosen===best?'':`<p><strong>Stronger alternative:</strong> ${best.text}</p>`}</div></details>`;
  }).join('')}</section><p class="result-notice">This is a learning score, not an academic grade or a CEFR assessment. Each decision earns up to 3 points for clarity, tone and next steps (27 points per mission).</p></div>`, 'practice', focus);
}
function phrasebook(focus) {
  setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">SMALL PHRASES. STRONGER RELATIONSHIPS.</div><h1>Find the right words.</h1><p>A practical phrasebook for your next client conversation.</p></div><span class="small-tag">${phrases.length} EXPRESSIONS</span></div><div class="search-row"><label class="search-field"><span aria-hidden="true">⌕</span><input id="phrase-search" type="search" aria-label="Search phrases" placeholder="Search a phrase, situation or meaning…"></label><label class="filter-label">Topic<select id="phrase-category"><option value="all">All topics</option>${[...new Set(phrases.map(p=>p.category))].map(c=>`<option>${c}</option>`).join('')}</select></label><span id="phrase-count" class="search-count" role="status"></span></div><div class="phrase-grid" id="phrase-grid"></div></div>`, 'phrasebook', focus);
  filterPhrases('');
}
function filterPhrases(query) {
  const category=document.querySelector('#phrase-category')?.value || 'all';
  const found = phrases.filter(p => (category==='all'||p.category===category) && Object.values(p).join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  document.querySelector('#phrase-count').textContent = `${found.length} / ${phrases.length} phrases`;
  document.querySelector('#phrase-grid').innerHTML = found.length ? found.map(p=>`<article class="phrase-card"><div class="card-category">${p.category}</div><h2>${p.term}</h2><p>${p.meaning}</p><div class="phrase-example">${p.example}</div></article>`).join('') : '<div class="empty-state">No matching phrases. Try “budget”, “update” or “clarify”.</div>';
}
function project(focus) {
  setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">LANGUAGE MEETS REAL-WORLD TECH.</div><h1>A small project. A useful skill.</h1><p>A joint student project for «Деловой иностранный язык».</p></div><span class="small-tag">PROJECT / 2026</span></div><section class="project-intro"><div class="eyebrow">WHY CLIENTBRIDGE?</div><h2>Great software needs<br>great conversations.</h2><p>ClientBridge connects technical work with the language of collaboration. Practise clarifying requirements, negotiating scope, communicating delays and responding to complaints — before the stakes are real.</p></section><div class="project-grid"><section class="project-card"><h2>The project team</h2><h3>Иноземцев Владислав Сергеевич</h3><span class="group">ОVМП-104ивс · Vladislav Inozemtsev</span><h3>Грушко Тимофей Андреевич</h3><span class="group">ОVМП-102ивс · Timofey Grushko</span><p>Proposed responsibilities: Vladislav — product coordination, interface demonstration and technical validation. Timofey — language review, scenario refinement and rehearsal. These roles are proposals, not a record of completed work.</p></section><section class="project-card"><h2>What you can learn</h2><ul><li>Ask focused questions instead of assuming scope.</li><li>Negotiate time, cost and priorities professionally.</li><li>Acknowledge problems and offer realistic next steps.</li><li>Write a clear follow-up email with an agreed action.</li></ul><p>Twelve missions with three decisions each. Instant explanations, scheduled phrase review, an email studio and a history of your practice. No external service or account required.</p></section><section class="project-card"><h2>How the feedback works</h2><p>Each response has an authored rubric: clarity, business tone and next steps, from 0 to 3 points each. The score is the percentage of the 27 possible points in a mission. It is transparent practice feedback, not an AI evaluation of free-form writing.</p><p>Model emails show a professional approach to the brief. Editing a draft does not change your score. Progress is stored locally; clearing browser data removes it.</p></section><section class="project-card"><h2>Honest about how it was built</h2><p>The concept and scope were selected with Vladislav. This initial implementation, scenario writing and automated checks were produced with Codex assistance. The team should review, adapt and be ready to explain the project before presenting it.</p><p>No completed implementation contribution or commit history is attributed to Timofey. A shared repository does not synchronise learning progress between devices.</p></section></div><div class="project-disclaimer"><strong>For discussion with the course teacher.</strong> Eligibility for any alternative assessment must be agreed with the teacher. ClientBridge does not guarantee automatic credit and does not replace the three mandatory test assignments. The teacher’s specific rubric and email address are not available.</div><div style="margin-top:23px"><button class="button primary" data-back>Try a conversation <span aria-hidden="true">↗</span></button></div></div>`, 'project', focus);
}
function filterMissions() {
 const query=document.querySelector('#mission-search').value.toLowerCase().trim();
 const level=document.querySelector('#mission-level').value;
 document.querySelectorAll('[data-mission]').forEach(card=>{
   const s=scenarios.find(s=>s.id===card.dataset.mission);
   const match=s.title.toLowerCase().includes(query)||s.description.toLowerCase().includes(query)||s.category.toLowerCase().includes(query);
   const levelMatch=level==='all'||(level==='B1'?s.level==='B1–B2':level==='C1'?s.level==='B2–C1':s.level==='B2');
   card.hidden=!(match&&levelMatch);
 });
 const visible=[...document.querySelectorAll('[data-mission]')].filter(c=>!c.hidden).length;
 let empty=document.querySelector('#mission-empty');
 if(!visible&&!empty){empty=document.createElement('p');empty.id='mission-empty';empty.className='empty-state';empty.textContent='No missions match. Try another topic or level.';document.querySelector('.mission-grid').append(empty);}
 if(visible&&empty)empty.remove();
}
function flashcards(focus) {
 const due=duePhrases(state.reviews);
 const reviewed=Object.keys(state.reviews).length;
 setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">MAKE THE LANGUAGE STICK.</div><h1>A phrase today. A habit tomorrow.</h1><p>Recall the phrase, reveal the example, then rate your confidence.</p></div><span class="small-tag">SPACED REVIEW</span></div><div class="review-dashboard"><section class="review-welcome"><span class="review-stack" aria-hidden="true"><i></i><i></i><i>▱</i></span><div class="eyebrow">YOUR NEXT SHORT SESSION</div><h2>${due.length ? 'Keep the useful words close.' : 'You’re up to date.'}</h2><p>${due.length?`${due.length} phrases are ready. We’ll take up to 8 at a time, so a little practice fits into your day.`:'No cards are due right now. Check the schedule below or practise a conversation while you wait.'}</p>${due.length?'<button class="button primary" data-session>Start a review session →</button>':'<a class="button primary" href="#practice">Practise a mission →</a>'}<div class="review-numbers"><div><strong>${due.length}</strong><span>Ready to review</span></div><div><strong>${reviewed}</strong><span>Phrases reviewed</span></div><div><strong>${phrases.length}</strong><span>In your collection</span></div></div></section><section class="brief-card"><h2>✦ How it works</h2><p><strong>Again:</strong> return in 10 minutes.<br><strong>Good:</strong> return in 1 day, then double the interval.<br><strong>Easy:</strong> return in 3 days, then triple the interval.</p><p>Intervals are capped at 90 days. These are local self-ratings, not automated language assessment. New cards are always available.</p><p>Suggestion: finish one mission, review 8 phrases and revisit your weakest skill.</p></section></div><section id="review-session" aria-live="polite" tabindex="-1"></section><section class="schedule-section"><div class="section-heading"><h2>Your review schedule</h2><a class="small-tag" href="#phrasebook">Browse all phrases ↗</a></div><div class="schedule-list">${phrases.map(p=>{const r=state.reviews[p.id];return `<div class="schedule-row"><div><strong>${p.term}</strong><small>${p.category}</small></div><span class="schedule-date">${!r?'New · ready now':r.due<=Date.now()?'Due now':`Due ${escape(new Date(r.due).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}))}`}</span></div>`}).join('')}</div></section></div>`, 'flashcards', focus);
}
function beginReview() {
 reviewQueue=duePhrases(state.reviews).slice(0,8);reviewIndex=0;reviewRevealed=false;renderReviewCard();
 document.querySelector('#review-session').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function renderReviewCard() {
 const host=document.querySelector('#review-session');if(!host)return;
 const card=reviewQueue[reviewIndex];
 if(!card){
  host.innerHTML=`<div class="flashcard completed"><div class="eyebrow">SESSION COMPLETE</div><h2>Eight minutes well invested.<br><em>Or even less.</em></h2><p>You reviewed ${reviewQueue.length} phrases. Your next review dates are saved on this device.</p><div class="flashcard-actions"><button class="button primary" data-session>Review more phrases →</button><a class="button secondary" href="#progress">See my progress ↗</a></div></div>`;
  // Refresh counts and dates without removing the completed session.
  const session=host.innerHTML;flashcards(false);document.querySelector('#review-session').innerHTML=session;
  document.querySelector('#review-session').focus?.();return;
 }
 host.innerHTML=`<div class="flashcard ${reviewRevealed?'revealed':''}"><div class="flashcard-top"><span class="eyebrow">${card.category}</span><span>${reviewIndex+1} / ${reviewQueue.length}</span></div><div class="flashcard-prompt"><div class="eyebrow">RECALL A BUSINESS PHRASE FOR THIS MEANING</div><h2>${card.meaning}</h2>${reviewRevealed?`<div class="flashcard-answer"><h3>${card.term}</h3><p>${card.example}</p></div>`:'<p>Say it aloud or think of your own example before revealing the answer.</p>'}</div><div class="flashcard-actions">${reviewRevealed?'<button class="button secondary" data-rating="again">Again · 10 min</button><button class="button mint" data-rating="good">Good · '+Math.min(90,Math.max(1,(state.reviews[card.id]?.interval||0)*2))+' day(s)</button><button class="button primary" data-rating="easy">Easy · '+Math.min(90,Math.max(3,(state.reviews[card.id]?.interval||0)*3))+' day(s)</button>':'<button class="button primary" data-reveal>Reveal the phrase ↻</button>'}</div></div>`;
 host.querySelector('button')?.focus({preventScroll:true});
}
function rateCard(rating) {
 const card=reviewQueue[reviewIndex];if(!card||!reviewRevealed)return;
 state.reviews[card.id]=scheduleReview(state.reviews[card.id],rating);save();reviewIndex++;reviewRevealed=false;renderReviewCard();
}
function emailStudio(focus) {
 setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">TURN INTENT INTO A CLEAR MESSAGE.</div><h1>Your business email studio.</h1><p>Choose a context, customise the details, then refine the draft.</p></div><span class="small-tag">LOCAL TEMPLATE BUILDER</span></div><div class="email-studio-layout"><section class="composer-form"><h2>Set the context.</h2><label for="email-context">Situation</label><select id="email-context">${scenarios.map(s=>`<option value="${s.id}">${s.category} — ${s.title}</option>`).join('')}</select><label for="email-recipient">Recipient</label><input id="email-recipient" maxlength="100"><label for="email-sender">Sign-off name or team</label><input id="email-sender" value="The ClientBridge project team" maxlength="100"><label for="email-subject">Subject line</label><input id="email-subject" maxlength="200"><label for="email-summary">Key message</label><textarea id="email-summary" rows="4" maxlength="3000"></textarea><label for="email-action">Next step / deadline</label><textarea id="email-action" rows="4" maxlength="3000"></textarea><button class="button primary" data-generate>Generate my draft →</button><p>Generating replaces the draft on the right. Your current draft is saved locally. This is a template tool; your free-form English is not automatically graded.</p></section><section class="email-panel"><div class="email-top"><h2>A message you can make yours.</h2><span>EDITABLE DRAFT</span></div><p>Check names, commitments and dates before using this outside the trainer.</p><label for="client-email">Your working draft · saved on this device</label><textarea id="client-email" data-draft="builder" spellcheck="true">${escape(state.drafts.builder??composeEmail(scenarios[0],[]))}</textarea><div class="email-buttons"><button class="button primary" data-copy>Copy email ⧉</button><button class="button secondary" data-download="custom">Download .txt ↓</button><small>Nothing is sent automatically.</small></div><div class="email-checklist"><h3>Before you send</h3><p>✓ Does the subject identify the purpose?<br>✓ Is the tone courteous and specific?<br>✓ Is the next step owned and time-bound?<br>✓ Are all commitments realistic and approved?</p></div></section></div></div>`, 'emails', focus);
 setEmailFields();
}
function setEmailFields() {
 const s=scenarios.find(s=>s.id===document.querySelector('#email-context').value);if(!s)return;
 document.querySelector('#email-recipient').value=s.client;
 document.querySelector('#email-subject').value=s.emailSubject;
 document.querySelector('#email-summary').value=s.emailSummary;
 document.querySelector('#email-action').value=s.emailNext;
}
function generateEmail() {
 const value=id=>document.querySelector(`#${id}`).value.trim();
 const recipient=value('email-recipient'),subject=value('email-subject'),summary=value('email-summary'),action=value('email-action'),sender=value('email-sender');
 if(!recipient||!subject||!summary||!action||!sender){toast('Complete each field so your email has a clear recipient and next step.');return;}
 const draft=`Subject: ${subject}\n\nDear ${recipient},\n\nThank you for discussing this with us. ${summary}\n\n${action}\n\nPlease let us know if this reflects your understanding or if you would like to clarify any details.\n\nKind regards,\n${sender}`;
 state.drafts.builder=draft;save();document.querySelector('#client-email').value=draft;toast('Draft generated. Read it through and make it your own.');
}
function downloadText(content,name,type='text/plain;charset=utf-8') {
 const url=URL.createObjectURL(new Blob([content],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function readImport(file) {
 if(!file)return;
 try {
  if(file.size>1000000)throw new Error('Choose a progress file smaller than 1 MB.');
  importCandidate=validateProgress(await file.text());
  const completed=scenarios.filter(s=>importCandidate.answers[s.id].length===3).length;
  document.querySelector('#import-description').textContent=`The backup contains ${completed} completed missions, ${importCandidate.history.length} recorded attempts and ${Object.keys(importCandidate.reviews).length} reviewed phrases.`;
  document.querySelector('#import-dialog').showModal();
 } catch(error){importCandidate=null;toast(`Could not import: ${error.message}`);}
 document.querySelector('#import-file').value='';
}
function progress(focus) {
 const completed=scenarios.filter(s=>state.answers[s.id].length===3);
 const totals=[0,0,0];completed.forEach(s=>evaluate(s,state.answers[s.id]).dimensions.forEach((n,i)=>totals[i]+=n));
 const skills=totals.map(n=>completed.length?Math.round(n/completed.length):0);
 const labels=['Clarity','Business tone','Next steps'];
 const weak=skills.indexOf(Math.min(...skills));
 const next=recommendMission(state);
 const days=new Set(state.history.map(h=>new Date(h.at).toLocaleDateString())).size;
 setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">YOUR PROGRESS, IN YOUR HANDS.</div><h1>Notice how far you’ve come.</h1><p>Use your history to choose the next useful practice session.</p></div><span class="small-tag">SAVED LOCALLY</span></div><div class="progress-stats"><div><strong>${completed.length} / ${scenarios.length}</strong><span>Missions completed</span></div><div><strong>${state.history.length}</strong><span>Recorded attempts</span></div><div><strong>${days}</strong><span>Days with practice</span></div><div><strong>${Object.keys(state.reviews).length} / ${phrases.length}</strong><span>Phrases reviewed</span></div></div><div class="progress-grid"><section class="result-skills"><h2>Your current skill profile</h2>${labels.map((label,i)=>`<div class="dimension"><div class="dimension-label"><span>${label}</span><strong>${completed.length?skills[i]+'%':'—'}</strong></div><div class="dimension-track"><div style="--value:${skills[i]}"></div></div></div>`).join('')}<p class="dimension-description">Based on your latest completed answer set in each mission. Repeat a mission to update your profile.</p></section><section class="next-plan"><div class="eyebrow">YOUR NEXT 10 MINUTES</div><h2>${completed.length?`Focus on ${labels[weak].toLowerCase()}.`:'Build your first good habit.'}</h2><p>${completed.length?(['Ask precise questions, summarise scope and avoid vague promises.','Acknowledge concerns, avoid blame and offer collaborative choices.','Name an owner, deadline or approval step instead of saying “soon”.'][weak]):'Start one client conversation. Read the feedback carefully, then review a handful of phrases.'}</p><ol><li>Practise <strong>${next.title}</strong></li><li>Review up to 8 due phrases.</li><li>Use Email studio to write a realistic follow-up.</li></ol><div><button class="button primary" data-train="${next.id}">Open recommended mission →</button><a class="button secondary" href="#flashcards">Review phrases</a></div></section></div><section class="history-section"><div class="section-heading"><h2>Your recent conversations</h2><span>Last ${Math.min(20,state.history.length)} of ${state.history.length} attempts</span></div>${state.history.length?`<div class="history-list">${state.history.slice(-20).reverse().map(h=>{const s=scenarios.find(s=>s.id===h.id);const score=evaluate(s,h.choices);return `<div class="history-row"><span class="mission-icon ${s.color}" aria-hidden="true">${s.icon}</span><div><strong>${s.title}</strong><small>${escape(new Date(h.at).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}))}</small></div><span class="history-score">${score.total}%</span><button class="button text" data-start="${s.id}">Open latest ↗</button></div>`}).join('')}</div>`:'<div class="empty-state">Your first completed conversation will appear here. Repeat attempts are saved too.</div>'}</section><section class="backup-card"><div><h2>Your learning travels with you.</h2><p>Export answers, review dates, attempt history and email drafts as a JSON backup. Import it on another device to continue. Backups contain your local drafts; store them where you intend.</p></div><div class="backup-actions"><button class="button secondary" data-export>Export progress ↓</button><button class="button secondary" data-import>Import backup ↑</button><button class="button text" data-reset>Reset all progress</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></section><p class="result-notice">Practice scores are authored learning feedback, not academic grades. History retains up to 200 attempts. Devices do not sync automatically.</p></div>`, 'progress', focus);
}

function render(focus = true) {
  const [view,id] = location.hash.slice(1).split('/');
  const scenario = scenarios.find(s => s.id === id);
  if (view === 'phrasebook') phrasebook(focus);
  else if (view === 'project') project(focus);
  else if (view === 'flashcards') flashcards(focus);
  else if (view === 'emails') emailStudio(focus);
  else if (view === 'progress') progress(focus);
  else if ((view === 'mission' || view === 'result') && scenario) {
    state.active=id;
    if (view === 'result') result(scenario,focus); else mission(scenario,focus);
  } else dashboard(focus);
}
main.addEventListener('click', async event => {
  const button = event.target.closest('button'); if (!button || button.disabled) return;
  if(button.hasAttribute('data-train')){const id=button.dataset.train;if(state.answers[id].length===3)state.answers[id]=[];start(id);}
  if (button.hasAttribute('data-start')) start(button.dataset.start);
  if (button.hasAttribute('data-back')) route('practice');
  if (button.hasAttribute('data-choice')) {
    const s = scenarios.find(s=>s.id===state.active); if (!s || state.answers[s.id].length !== cursor) return;
    state.answers[s.id].push(Number(button.dataset.choice));
    if(state.answers[s.id].length===3) state.history.push({id:s.id,at:Date.now(),choices:[...state.answers[s.id]]});
    state.history=state.history.slice(-200);save();
    mission(s,false);
    document.querySelector('.feedback')?.focus({preventScroll:true});
    document.querySelector('.feedback')?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  if (button.hasAttribute('data-continue')) {
    const s = scenarios.find(s=>s.id===state.active); if (!s) return;
    if (cursor===2) route(`result/${s.id}`); else {cursor++; mission(s,false);main.focus({preventScroll:true});document.querySelector('.conversation-panel').scrollIntoView({block:'start',behavior:'instant'});}
  }
  if (button.hasAttribute('data-retry')) {
    const id=button.dataset.retry; state.answers[id]=[];state.active=id;cursor=0;save();route(`mission/${id}`);
  }
  if (button.hasAttribute('data-copy')) {
    const area=document.querySelector('#client-email');
    try { await navigator.clipboard.writeText(area.value); toast('Email copied. Ready for your own document.'); }
    catch { area.focus();area.select();toast('Select and copy the draft, or use Download .txt.'); }
  }
  if (button.hasAttribute('data-download')) {
    const content=document.querySelector('#client-email').value;
    const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`clientbridge-${button.dataset.download}-email.txt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Your email draft has been downloaded.');
  }
  if (button.hasAttribute('data-random')) {
    const pool=scenarios.filter(s=>s.id!==state.active);const s=pool[Math.floor(Math.random()*pool.length)];
    state.answers[s.id]=[];start(s.id);
  }
  if(button.hasAttribute('data-session'))beginReview();
  if(button.hasAttribute('data-reveal')){reviewRevealed=true;renderReviewCard();}
  if(button.hasAttribute('data-rating'))rateCard(button.dataset.rating);
  if(button.hasAttribute('data-generate'))generateEmail();
  if(button.hasAttribute('data-export'))downloadText(JSON.stringify(state,null,2),'clientbridge-progress.json','application/json');
  if(button.hasAttribute('data-import'))document.querySelector('#import-file').click();
  if (button.hasAttribute('data-reset')) dialog.showModal();
});
main.addEventListener('input',event=>{
  if(event.target.id==='phrase-search')filterPhrases(event.target.value);
  if(event.target.id==='mission-search')filterMissions();
  if(event.target.matches('[data-draft]')){state.drafts[event.target.dataset.draft]=event.target.value;save();}
});
main.addEventListener('change',event=>{
  if(event.target.id==='phrase-category')filterPhrases(document.querySelector('#phrase-search').value);
  if(event.target.id==='mission-level')filterMissions();
  if(event.target.id==='email-context')setEmailFields();
  if(event.target.id==='import-file')readImport(event.target.files[0]);
});
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:'instant'});});
document.querySelector('#reset-open').addEventListener('click',()=>dialog.showModal());
document.querySelector('#reset-cancel').addEventListener('click',()=>dialog.close());
document.querySelector('#reset-confirm').addEventListener('click',()=>{state=freshState();cursor=0;save();dialog.close();route('practice');toast('Progress reset. A fresh start.');});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
window.addEventListener('hashchange',()=>{const [view,id]=location.hash.slice(1).split('/');if(view==='mission'&&state.answers[id])cursor=Math.max(0,state.answers[id].length-1);render()});
document.querySelector('#import-cancel').addEventListener('click',()=>{importCandidate=null;document.querySelector('#import-dialog').close()});
document.querySelector('#import-confirm').addEventListener('click',()=>{if(!importCandidate)return;state=importCandidate;importCandidate=null;save();document.querySelector('#import-dialog').close();progress(true);toast('Learning backup restored.');});
const initialId=location.hash.slice(1).split('/')[1];
if(state.answers[initialId])cursor=Math.max(0,state.answers[initialId].length-1);
render(false);
