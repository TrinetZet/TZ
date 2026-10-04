import { scenarios as legacyScenarios, phrases } from './scenarios.mjs';
import { difficulties, missionsFor, missionFor, skillLabels } from './curriculum.mjs';
import { prepareAttempt, recordChoice, choiceOrder, levelProfile, recommendForLevel, totalNewAttempts } from './learning.mjs';
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
let scenarios=missionsFor(state.difficulty);
const levelData=()=>state.levels[state.difficulty];
const levelLabel=()=>difficulties.find(l=>l.id===state.difficulty).label;
function difficultyPicker(){return `<section class="difficulty-picker" aria-label="Practice difficulty"><div><div class="eyebrow">CHOOSE YOUR PRACTICE</div><h2>One topic. Three different challenges.</h2></div><div class="difficulty-buttons" role="group" aria-label="Difficulty">${difficulties.map(l=>`<button type="button" data-difficulty="${l.id}" aria-pressed="${state.difficulty===l.id}"><strong>${l.label}</strong><span>${l.description}</span></button>`).join('')}</div><p>Separate practice profiles for each level. Expert explores nuanced communication; it does not certify native or CEFR proficiency.</p></section>`;}
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
  const complete = levelProfile(state,state.difficulty).completed;
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
  const complete = scenarios.filter(s => (levelData().completed[s.id]||levelData().answers[s.id]).length === 3);
  const average = complete.length ? Math.round(complete.reduce((n,s) => n + evaluate(s,levelData().completed[s.id]||levelData().answers[s.id]).total,0)/complete.length) : null;
  const next = recommendForLevel(state);
  setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">A LITTLE PRACTICE. A BIG DIFFERENCE.</div><h1>Your next great conversation.</h1><p>Business English for the moments that matter in IT.</p></div><span class="small-tag">${levelLabel()} · SELF-PACED</span></div>
    ${difficultyPicker()}<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> THE HUMAN SIDE OF TECH</div><h2 id="hero-title">Good conversations.<br><em>Great partnerships.</em></h2><p>You know how to build the product. Now practise the words that build your client’s trust.</p><div class="hero-action"><button class="button primary" data-train="${next.id}">${levelData().answers[next.id].length ? 'Continue practising' : 'Step into a conversation'} <span aria-hidden="true">↗</span></button><span>3 decisions · about 5 minutes</span></div></div>
    <div class="hero-art" aria-hidden="true"><div class="orb"></div><div class="orbit"></div><div class="sample-window"><div class="window-top"><span>Northstar Studio · Client chat</span><span class="window-dots"><i></i><i></i><i></i></span></div><div class="sample-client"><div class="sample-avatar">AL</div><div class="sample-bubble">“Can we get a simple dashboard<br>in the next sprint?”</div></div><div class="sample-reply">“Could you clarify which metrics<br>your team needs to see?”</div><div class="sample-coach">✓ Clear question. Collaborative tone.</div></div><span class="floating-badge">✦ Confidence, one reply at a time.</span></div></section>
    <div class="stats-strip" aria-label="Your learning progress"><div class="stat"><span class="stat-icon" aria-hidden="true">◫</span><div><strong>${complete.length}<span style="font-size:12px;color:#879288"> / ${scenarios.length}</span></strong><small>Missions completed</small></div></div><div class="stat"><span class="stat-icon" aria-hidden="true">↗</span><div><strong>${average === null ? '—' : average+'%'}</strong><small>Average partial-credit points</small></div></div><div class="stat"><span class="stat-icon" aria-hidden="true">▤</span><div><strong>${phrases.length}</strong><small>Useful business phrases</small></div></div></div>
    <section aria-labelledby="mission-list-title"><div class="section-heading"><h2 id="mission-list-title">Choose your next challenge</h2><span>Real situations. Better responses.</span></div><div class="mission-toolbar"><label class="search-field"><span aria-hidden="true">⌕</span><input id="mission-search" type="search" aria-label="Search missions" placeholder="Search by topic or situation…"></label><span class="small-tag">${levelLabel()} · 12 missions</span></div><div class="mission-grid">${scenarios.map(s => {
      const answers = levelData().answers[s.id]; const done = answers.length === 3;
      return `<article class="mission-card" data-mission="${s.id}" data-level="${s.level}"><div class="card-top"><span class="mission-icon ${s.color}" aria-hidden="true">${s.icon}</span><span class="mission-number">MISSION / ${s.number}</span></div><div class="card-category">${s.category}${done ? '<span class="card-status">COMPLETED</span>' : answers.length ? '<span class="card-status">IN PROGRESS</span>' : ''}</div><h3>${s.title}</h3><p>${s.description}</p><div class="card-bottom"><span class="mission-meta">${s.level} <span aria-hidden="true">·</span> ${s.minutes} min <span aria-hidden="true">·</span> 3 decisions</span><button class="card-start" data-start="${s.id}" aria-label="${done ? 'View results for' : answers.length ? 'Continue' : 'Start'} ${s.title}">${done ? 'View results' : answers.length ? 'Continue mission' : 'Start mission'}<span aria-hidden="true">↗</span></button></div></article>`;
    }).join('')}</div></section><div class="daily-banner"><div><div class="eyebrow">BUILD A HABIT</div><h2>A small session. A stronger skill.</h2><p>${duePhrases(state.reviews).length} phrases are ready to review. Try a fresh conversation, then revisit the language you learned.</p></div><div><button class="button secondary" data-random>Surprise me ↗</button><a class="button primary" href="#flashcards">Review phrases →</a></div></div><div class="practice-note"><span>No pressure. Every answer is a chance to learn.</span><a href="#project">Meet the team behind ClientBridge ↗</a></div><button class="button text mobile-reset" data-reset>↺ Reset progress</button></div>`, 'practice', focus);
}
function start(id) {
  const s = scenarios.find(s => s.id === id); if (!s) return;
  prepareAttempt(state,id,state.difficulty); save();
  cursor = Math.max(0,levelData().answers[id].length-1);
  route(`${levelData().answers[id].length === 3 ? 'result' : 'mission'}/${id}`);
}
function mission(s, focus) {
  const needsOrder=!levelData().orders[s.id];
  prepareAttempt(state,s.id,state.difficulty);if(needsOrder)save();
  const answers = levelData().answers[s.id];
  cursor = Math.min(cursor,answers.length,s.steps.length-1);
  const step = s.steps[cursor];
  const selected = answers[cursor];
  const chosen = step.choices[selected];
  const best = step.choices.find(c => c.score.every(n => n === 3));
  setPage(`<div class="view-enter"><button class="back-button" data-back>← Back to missions</button><div class="mission-header"><span class="mission-icon ${s.color}" aria-hidden="true">${s.icon}</span><div><div class="eyebrow">MISSION ${s.number} / ${s.category} · ${levelLabel()}</div><h1>${s.title}</h1></div></div><div class="mission-layout"><section class="conversation-panel" aria-label="Conversation with ${s.client}"><div class="conversation-top"><div class="client-avatar ${s.color}">${s.initials}</div><div><div class="client-name">${s.client}</div><div class="client-role">${s.role}</div></div><span class="online"><span class="live-dot"></span>Client chat</span></div><div class="conversation-body"><div class="step-counter"><span>Decision ${cursor+1} of 3</span><span class="step-dots" aria-hidden="true">${s.steps.map((_,i)=>`<i class="${i<=cursor?'filled':''}"></i>`).join('')}</span></div><div class="client-message">${step.message}</div><div class="response-label">${chosen ? 'YOUR RESPONSE · FEEDBACK BELOW' : 'HOW WOULD YOU RESPOND?'}</div><div class="choices">${choiceOrder(state,s.id,state.difficulty,cursor).map((i,position)=>{const c=step.choices[i];return `<button class="choice ${selected===i?'selected':''}" data-choice="${i}" ${chosen?'disabled':''} ${selected===i?'aria-label="Selected answer: '+escape(c.text)+'"':''}><span class="choice-letter" aria-hidden="true">${'ABC'[position]}</span><span>${c.text}</span></button>`}).join('')}</div>${chosen ? `<section class="feedback ${chosen===best?'':'developing'}" aria-label="Answer feedback" tabindex="-1"><div class="feedback-heading"><span>${chosen===best?'✦ A reply that builds trust.':'↗ A useful learning moment.'}</span><small>${chosen.score.reduce((a,b)=>a+b,0)} / 9 points</small></div><p>${chosen.feedback}</p>${chosen===best?'':`<div class="better-answer"><strong>A stronger alternative</strong><p>${best.text}</p></div>`}<details class="choice-comparison"><summary>Compare all three replies</summary>${step.choices.map(c=>`<div><strong>${escape(c.text)}</strong><p>${escape(c.feedback)}</p><small>Context ${c.score[0]}/3 · Relationship ${c.score[1]}/3 · Action ${c.score[2]}/3</small></div>`).join('')}</details><p class="rehearsal">Try it aloud: explain the risk in the other replies, then say your own version. This rehearsal is not automatically graded.</p></section><div class="continue-row"><small>Context · Relationship · Action & risk</small><button class="button primary" data-continue>${cursor===2?'See my results':'Next message'} <span aria-hidden="true">→</span></button></div>`:''}</div><div class="session-footnote">A simulated client conversation. Take your time before replying.</div></section><aside class="brief-panel" aria-label="Mission brief and language coaching"><section class="brief-card context"><h2><span aria-hidden="true">◫</span> The situation</h2><p>${s.context}</p></section><section class="brief-card objective"><h2><span aria-hidden="true">◎</span> Your objective</h2><p>${s.objective}</p></section><section class="brief-card coach"><h2><span aria-hidden="true">✦</span> Language coach</h2><details ${chosen?'open':''}><summary>${chosen?'A useful language move':'Need a hint?'}</summary><p>${step.tip}</p><span class="phrase-inline">“${step.phrase}”</span><small>${step.meaning}</small></details></section></aside></div></div>`, 'practice', focus);
}
function result(s, focus) {
  const answers = levelData().answers[s.id];
  if (answers.length < 3) { cursor=Math.max(0,answers.length-1); return mission(s,focus); }
  const score = evaluate(s,answers);
  const labels = skillLabels;
  const descriptions = ['Use the facts, constraints and priorities in this situation.','Respect the relationship while addressing the real concern.','Choose an owned, feasible action without hiding uncertainty.'];
  setPage(`<div class="view-enter"><button class="back-button" data-back>← Back to missions</button><section class="result-hero" aria-label="Practice results">${score.accuracy===100?Array.from({length:16},(_,i)=>`<i class="confetti" aria-hidden="true" style="left:${8+i*5.5}%;animation-delay:${i*.035}s"></i>`).join(''):''}<div class="score-ring" style="--score:${score.total}"><div class="score-inner"><strong>${score.total}%</strong><span>PARTIAL-CREDIT POINTS</span></div></div><div><div class="eyebrow">MISSION ${s.number} / ${levelLabel()} · COMPLETE</div><h1>${score.accuracy===100?'Every reply fits the context.':score.accuracy>=67?'Useful skills. Keep testing your judgment.':'Read the context. Compare the trade-offs.'}</h1><p>${score.total>=80?'You combined clear language, a professional tone and practical next steps. Take these habits into your next real conversation.':'Review your replies below, compare the stronger alternatives and try again. Small changes in language can make a big difference.'}</p></div></section><section class="accuracy-card"><strong>Best-reply accuracy: ${score.accuracy}% · ${score.bestCount}/3 strongest replies selected</strong><p>Points recognise useful elements in a reply. A high partial-credit score can still include important mistakes. Random selection averages about 33% best-reply accuracy; this short mission is practice evidence, not proficiency certification.</p></section><div class="result-content"><section class="result-skills"><h2>Your communication toolkit</h2>${labels.map((label,i)=>`<div class="dimension"><div class="dimension-label"><span>${label}</span><strong>${score.dimensions[i]}%</strong></div><div class="dimension-track"><div style="--value:${score.dimensions[i]}"></div></div><p class="dimension-description">${descriptions[i]}</p></div>`).join('')}<div class="result-actions"><a class="button mint" href="#flashcards">Review key phrases →</a><button class="button secondary" data-retry="${s.id}">↺ Practise again</button><button class="button primary" data-back>Explore missions →</button></div></section><section class="email-panel" aria-labelledby="email-title"><div class="email-top"><h2 id="email-title">From conversation to email.</h2><span>MODEL RESPONSE</span></div><p>A suggested professional follow-up based on the mission brief, rather than a transcript of your choices. Edit it to make it your own.</p><label for="client-email">Your editable draft · saved on this device</label><textarea id="client-email" data-draft="${state.difficulty}:${s.id}" spellcheck="true">${escape(state.drafts[state.difficulty+':'+s.id] ?? composeEmail(s,answers))}</textarea><div class="email-buttons"><button class="button primary" data-copy>Copy email <span aria-hidden="true">⧉</span></button><button class="button secondary" data-download="${s.id}">Download .txt <span aria-hidden="true">↓</span></button><small>Nothing is sent to a client.</small></div></section></div><section class="review-section"><h2>Revisit your decisions</h2>${s.steps.map((step,i)=>{
    const chosen=step.choices[answers[i]], best=step.choices.find(c=>c.score.every(n=>n===3));
    return `<details class="review-item"><summary><span>0${i+1} · ${step.phrase}</span><small>${chosen.score.reduce((a,b)=>a+b,0)} / 9 points <span aria-hidden="true">⌄</span></small></summary><div class="review-detail"><p><strong>Client:</strong> ${step.message}</p><p><strong>Your reply:</strong> ${chosen.text}</p><p>${chosen.feedback}</p>${chosen===best?'':`<p><strong>Stronger alternative:</strong> ${best.text}</p>`}</div></details>`;
  }).join('')}</section><p class="result-notice">This is a learning score, not an academic grade or a CEFR assessment. Each decision earns up to 3 points for context judgment, relationship & tone, and action & risk (27 points per mission). Levels have separate, more demanding contexts; percentages do not certify equivalent proficiency.</p></div>`, 'practice', focus);
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
const GUIDE_KEY = 'clientbridge.guide-language.v1';
let guideLanguage = 'ru';
try { if (localStorage.getItem(GUIDE_KEY) === 'en') guideLanguage = 'en'; } catch {}
const guideCopy = {
 ru: {
  title: 'Как пользоваться ClientBridge', intro: 'Тренажёр делового английского для общения с клиентами в IT. Здесь можно безопасно пробовать ответы, учить фразы и готовить письма. Названия разделов и кнопок остаются английскими — ниже объясняется, что они означают.',
  start: 'Первое занятие за 10 минут', steps: ['Откройте Practice room и нажмите Start mission на любой карточке. Для быстрого начала подойдёт Step into a conversation.', 'Прочитайте ситуацию, выберите ответ и изучите объяснение. Нажимайте Next message; после третьего ответа — See my results.', 'Закрепите фразы в Review cards, затем составьте короткое письмо в Email studio. Посмотрите результат в My progress.'],
  cards: [
   ['Practice room · миссии', 'Выберите Beginner, Advanced или Expert в Choose your practice. Выбор сохраняется; на каждом уровне есть все 12 тем с 3 отдельными решениями: всего 36 версий миссий и 108 решений. Beginner тренирует явные запросы и безопасные обещания; Advanced добавляет приоритеты, зависимости и компромиссы; Expert — подтекст, дипломатичное несогласие и тонкие переговоры. Expert не является сертификатом носителя или CEFR. Search missions фильтрует темы. Start mission открывает новую миссию, Continue mission продолжает, View results показывает текущий результат выбранного уровня. Переключение сохраняет ответы каждого уровня. Surprise me начинает другую миссию заново на выбранном уровне; предыдущие попытки остаются в истории.'],
   ['Ответы и оценка', 'Прочитайте The situation, Your objective и сообщение клиента: все необходимые факты указаны там. Need a hint? — необязательная подсказка. Выберите A, B или C: порядок перемешивается один раз на попытку и сохраняется; длина и позиция не указывают на правильность. Ответ сразу фиксируется. Прочитайте разбор контекста и Compare all three replies: сильные стороны, риск и улучшение каждого ответа. Context judgment, Relationship & tone и Action & risk дают по 0–3 балла за решение, всего 27 за миссию, показанные в процентах. Best-reply accuracy отдельно показывает, как часто выбран лучший ответ в контексте. Случайный выбор в среднем даёт около 33% точности и 72% частичных баллов; баллы не означают владение навыком. Лучший ответ подходит именно этому контексту, а не любому разговору. После выбора произнесите свой вариант вслух и объясните риски альтернатив; автоматически это не оценивается. Next message продолжает, See my results открывает результат. Practise again начинает новую попытку с новым порядком; история сохраняется.'],
   ['Phrasebook · справочник фраз', 'Здесь 36 полезных выражений с объяснением и примером. Search phrases ищет слова, Topic фильтрует темы. Найдите фразу для своего случая и попробуйте произнести собственный пример.'],
   ['Review cards · повторение', 'Start a review session открывает до 8 карточек, готовых к повторению. Сначала вспомните фразу, затем нажмите Reveal the phrase. Again · 10 min — повторить через 10 минут; Good — уверенное вспоминание, сначала через день, затем интервал удваивается; Easy — легко, сначала через 3 дня, затем интервал утраивается. Максимум — 90 дней. Это ваша самооценка, не отметка за тест. Review more phrases продолжает; Your review schedule показывает даты. Если карточек пока нет, потренируйте миссию.'],
   ['Email studio · подготовка письма', 'Выберите Situation, заполните Recipient (кому), Sign-off name or team (подпись), Subject line (тема), Key message (главная мысль) и Next step / deadline (действие и срок). Generate my draft создаёт шаблон и заменяет текущий текст. Отредактируйте Your working draft; он сохраняется локально. Copy email копирует, Download .txt сохраняет текст: на Android откроется системное окно выбора места, в браузере — загрузка. Ничего не отправляется автоматически. Before you send напоминает проверить имена, тон, сроки и обещания. Письмо не оценивается автоматически. На странице результата также есть Your editable draft — пример письма по ситуации, который можно изменить, скопировать или сохранить.'],
   ['My progress · прогресс и история', 'Выберите сложность, чтобы увидеть её профиль, попытки, дни практики и рекомендацию. Три обзорные карточки независимы: лёгкие успехи не засчитываются как экспертная практика. Профиль основан на последних завершённых ответах каждой миссии; попытки остаются в истории. Без завершённых миссий показано Not enough practice, а не выдуманный балл; менее 3 разных миссий — ограниченные данные. High rubric score — check reply accuracy и Needs focused practice описывают учебную рубрику, не официальное владение языком. Open recommended mission сначала продолжает незавершённую работу, затем выбирает новую подходящую миссию для слабого измерения или повторяет слабую завершённую. Review attempt показывает реальные ответы и разбор сохранённой попытки. Хранятся до 200 новых попыток суммарно по уровням. Legacy сохраняет старые ответы, частичный прогресс и до 200 прежних попыток со старой рубрикой; они не дают баллов новым уровням.'],
   ['Резервная копия и перенос', 'В My progress кнопка Export progress сохраняет три уровня, порядок ответов, Legacy, даты повторений и черновики в JSON v2. Import backup открывает выбор файла и принимает v1 или v2 до 1 МБ. Старые копии v1 становятся Legacy без баллов новых уровней. После проверки Restore backup заменяет текущие данные; Cancel оставляет их. Android использует системные окна Save и Open; JSON можно переносить между браузером и Android, но автоматической синхронизации нет. Экспортируйте копию до очистки данных или удаления приложения. Reset all progress / Reset progress открывает подтверждение; Reset everything очищает все уровни, Legacy, карточки и черновики; Keep my progress отменяет. Язык инструкции хранится отдельно и сохраняется после сброса прогресса.'],
   ['The project · о проекте', 'Здесь сведения о команде, назначении и принципах тренажёра и эта инструкция. RU / EN переключает только инструкцию; выбор запоминается отдельно от прогресса на этом устройстве и не переносится с JSON-копией. Если хранилище недоступно, выбор языка действует до закрытия страницы.']
  ], note: 'Не знаете английский? Начните с одной миссии: сопоставляйте сообщение клиента, варианты ответа, объяснение и пример. Инструкция помогает ориентироваться; сам учебный материал остаётся на английском.'
 },
 en: {
  title: 'How to use ClientBridge', intro: 'A business English trainer for client communication in IT. Try replies safely, learn useful phrases and prepare emails. Section and button names remain in English; the guide below explains their purpose.',
  start: 'Your first 10-minute session', steps: ['Open Practice room and choose Start mission on any card. Step into a conversation offers a quick starting point.', 'Read the situation, choose a reply and study the explanation. Use Next message, then See my results after the third reply.', 'Revisit useful phrases in Review cards, then prepare a short email in Email studio. Check your results in My progress.'],
  cards: [
   ['Practice room · missions', 'Choose Beginner, Advanced or Expert using Choose your practice. The choice is saved; each level has all 12 topics with 3 different decisions per mission: 36 mission versions and 108 decisions. Beginner practises explicit requests and safe commitments; Advanced adds priorities, dependencies and trade-offs; Expert explores subtext, diplomatic disagreement and nuanced negotiation. Expert is not a native-speaker or CEFR certificate. Search missions filters topics. Start mission opens a fresh mission, Continue mission resumes and View results opens your current result at the selected difficulty. Switching levels keeps each level’s answers. Surprise me starts another fresh mission in the selected level; prior attempts remain in history.'],
   ['Replies and scoring', 'Read The situation, Your objective and the client’s message; all required facts are there. Need a hint? is optional. Choose A, B or C: reply order is shuffled once per attempt and saved; length and position do not signal correctness. The reply locks immediately. Read the contextual explanation and Compare all three replies to see each strength, risk and improvement. Context judgment, Relationship & tone and Action & risk each earn 0–3 points per decision, 27 total per mission, displayed as a percentage. Best-reply accuracy separately shows how often you selected the strongest contextual reply. Random choice averages about 33% accuracy and 72% partial-credit points; points are not mastery. The best reply serves this specific context, not every possible conversation. After answering, rehearse your own wording aloud and explain the alternatives’ risks; this is not automatically graded. Next message advances; See my results opens results. Practise again starts a new attempt with a new order; history remains.'],
   ['Phrasebook · useful expressions', 'Browse 36 expressions with meanings and examples. Search phrases finds words; Topic filters categories. Find a phrase for your situation and say your own example aloud.'],
   ['Review cards · spaced practice', 'Start a review session opens up to 8 due cards. Recall the phrase before choosing Reveal the phrase. Again · 10 min schedules another review in 10 minutes; Good starts at one day, then doubles the interval; Easy starts at three days, then triples it. Intervals are capped at 90 days. This is your confidence rating, not a test grade. Review more phrases continues; Your review schedule shows dates. If no cards are due, practise a mission.'],
   ['Email studio · prepare an email', 'Choose Situation and fill Recipient, Sign-off name or team, Subject line, Key message and Next step / deadline. Generate my draft creates a template and replaces the current draft. Edit Your working draft; it saves locally. Copy email copies text; Download .txt saves it using Android’s system destination picker or a browser download. Nothing is sent automatically. Before you send reminds you to check names, tone, dates and commitments. Free-form email writing is not automatically graded. The result page also offers Your editable draft: a model follow-up for the situation that you can edit, copy or save.'],
   ['My progress · profile and history', 'Choose a difficulty to inspect its current skill profile, attempts, practice days and next recommendation. The three summary cards stay separate: easier scores never count as expert practice. Latest completed answers per mission determine the profile; attempts remain in history. No completed missions shows Not enough practice instead of a fabricated score; fewer than 3 different completed missions is limited evidence. High rubric score — check reply accuracy and Needs focused practice describe the rubric, not official proficiency. Open recommended mission resumes unfinished work first, then targets the lowest dimension with a relevant unseen mission, or revisits the weakest completed one. Review attempt shows that saved attempt’s actual replies and feedback. Up to 200 current attempts across levels are retained. Legacy preserves old answers, partial progress and up to 200 earlier attempts with the old rubric; these do not grant new-level credit.'],
   ['Backup and transfer', 'In My progress, Export progress saves all three levels, saved reply orders, Legacy, review dates and drafts as v2 JSON. Import backup opens a picker and accepts v1 or v2 files up to 1 MB. Old v1 backups become Legacy without awarding new-level scores. After validation, Restore backup replaces current progress; Cancel keeps it. Android uses system Save and Open pickers; browser and Android can transfer JSON, but do not sync automatically. Export a backup before clearing data or uninstalling. Reset all progress / Reset progress opens confirmation; Reset everything clears all practice, Legacy, cards and drafts; Keep my progress cancels. Guide language is separate and survives progress reset.'],
   ['The project · project information', 'Find the team, purpose, learning principles and this guide here. RU / EN changes only the guide; the choice saves separately from progress on this device and does not travel with JSON backups. If storage is unavailable, the language choice lasts until the page closes.']
  ], note: 'New to English? Begin with one mission: compare the client’s message, reply options, explanation and example. This guide helps you navigate; the learning material itself stays in English.'
 }
};
function guideMarkup() {
 const copy = guideCopy[guideLanguage];
 return `<section id="project-guide" class="project-guide" aria-labelledby="guide-title"><div class="guide-top"><div class="eyebrow">YOUR FIELD GUIDE</div><div class="guide-language" role="group" aria-label="Instruction language"><button data-guide-lang="ru" aria-pressed="${guideLanguage==='ru'}" lang="ru">RU <span>Русский</span></button><button data-guide-lang="en" aria-pressed="${guideLanguage==='en'}" lang="en">EN <span>English</span></button></div></div><div id="guide-content" lang="${guideLanguage}"><h2 id="guide-title">${copy.title}</h2><p class="guide-intro">${copy.intro}</p><section class="guide-start"><h3>${copy.start}</h3><ol>${copy.steps.map(step=>`<li>${step}</li>`).join('')}</ol></section><div class="guide-grid">${copy.cards.map(([title,body],i)=>`<section class="guide-card"><span class="eyebrow">${String(i+1).padStart(2,'0')}</span><h3>${title}</h3><p>${body}</p></section>`).join('')}</div><p class="guide-note">${copy.note}</p></div></section>`;
}

function project(focus) {
  setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">LANGUAGE MEETS REAL-WORLD TECH.</div><h1>A small project. A useful skill.</h1><p>A joint student project for «Деловой иностранный язык».</p></div><span class="small-tag">PROJECT / 2026</span></div><section class="project-intro"><div class="eyebrow">WHY CLIENTBRIDGE?</div><h2>Great software needs<br>great conversations.</h2><p>ClientBridge connects technical work with the language of collaboration. Practise clarifying requirements, negotiating scope, communicating delays and responding to complaints — before the stakes are real.</p></section>${guideMarkup()}<div class="project-grid"><section class="project-card"><h2>The project team</h2><h3>Иноземцев Владислав Сергеевич</h3><span class="group">ОVМП-104ивс · Vladislav Inozemtsev</span><h3>Грушко Тимофей Андреевич</h3><span class="group">ОVМП-102ивс · Timofey Grushko</span><p>Proposed responsibilities: Vladislav — product coordination, interface demonstration and technical validation. Timofey — language review, scenario refinement and rehearsal. These roles are proposals, not a record of completed work.</p></section><section class="project-card"><h2>What you can learn</h2><ul><li>Ask focused questions instead of assuming scope.</li><li>Negotiate time, cost and priorities professionally.</li><li>Acknowledge problems and offer realistic next steps.</li><li>Write a clear follow-up email with an agreed action.</li></ul><p>Twelve topics with three difficulty versions each: 36 missions and 108 contextual decisions. Instant explanations, scheduled phrase review, an email studio and a history of your practice. No external service or account required.</p></section><section class="project-card"><h2>How the feedback works</h2><p>Each new response has an authored rubric: context judgment, relationship & tone, and action & risk, from 0 to 3 points each. Difficulty profiles are separate; previous-version results remain Legacy. The score is the percentage of the 27 possible points in a mission. It is transparent practice feedback, not an AI evaluation of free-form writing.</p><p>Model emails show a professional approach to the brief. Editing a draft does not change your score. Progress is stored locally; clearing browser data removes it.</p></section><section class="project-card"><h2>Honest about how it was built</h2><p>The concept and scope were selected with Vladislav. This initial implementation, scenario writing and automated checks were produced with Codex assistance. The team should review, adapt and be ready to explain the project before presenting it.</p><p>No completed implementation contribution or commit history is attributed to Timofey. A shared repository does not synchronise learning progress between devices.</p></section></div><div class="project-disclaimer"><strong>For discussion with the course teacher.</strong> Eligibility for any alternative assessment must be agreed with the teacher. ClientBridge does not guarantee automatic credit and does not replace the three mandatory test assignments. The teacher’s specific rubric and email address are not available.</div><div style="margin-top:23px"><button class="button primary" data-back>Try a conversation <span aria-hidden="true">↗</span></button></div></div>`, 'project', focus);
}
function filterMissions() {
 const query=document.querySelector('#mission-search').value.toLowerCase().trim();
 const level='all';
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
  const completed=difficulties.reduce((n,l)=>n+levelProfile(importCandidate,l.id).completed,0);
  document.querySelector('#import-description').textContent=`The backup contains ${completed} completed missions, ${totalNewAttempts(importCandidate)} current attempts plus ${importCandidate.history.length} legacy attempts and ${Object.keys(importCandidate.reviews).length} reviewed phrases.`;
  document.querySelector('#import-dialog').showModal();
 } catch(error){importCandidate=null;toast(`Could not import: ${error.message}`);}
 document.querySelector('#import-file').value='';
}
function progress(focus) {
 const profile=levelProfile(state,state.difficulty),labels=skillLabels,next=recommendForLevel(state),data=levelData();
 const days=new Set(data.history.map(h=>new Date(h.at).toLocaleDateString())).size;
 setPage(`<div class="view-enter"><div class="page-heading"><div><div class="eyebrow">YOUR PROGRESS, IN YOUR HANDS.</div><h1>Notice how far you’ve come.</h1><p>Read each profile in its own context. Beginner success does not count as Expert practice.</p></div><span class="small-tag">SAVED LOCALLY</span></div>${difficultyPicker()}<div class="level-summaries">${difficulties.map(l=>{const p=levelProfile(state,l.id);return `<section class="level-summary ${state.difficulty===l.id?'current':''}"><h2>${l.label}</h2><strong>${p.average===null?'Not enough practice':p.average+'% partial-credit points'}</strong><p>${p.accuracy===null?'Best-reply accuracy: —':'Best-reply accuracy: '+p.accuracy+'% · '+p.bestCount+'/'+p.decisions}</p><p>${p.completed}/12 completed · ${p.attempts} attempts</p><small>${p.completed===0?'Start a mission to build this profile.':p.evidence?'Emerging evidence from at least 3 completed missions.':'Limited evidence — practise at least 3 different missions.'}</small></section>`}).join('')}</div><div class="progress-stats"><div><strong>${profile.completed} / 12</strong><span>${levelLabel()} missions completed</span></div><div><strong>${profile.attempts}</strong><span>${levelLabel()} recorded attempts</span></div><div><strong>${days}</strong><span>${levelLabel()} days with practice</span></div><div><strong>${Object.keys(state.reviews).length} / ${phrases.length}</strong><span>Phrases reviewed · shared</span></div></div><div class="progress-grid"><section class="result-skills"><h2>${levelLabel()} · current skill profile</h2><p><strong>Best-reply accuracy: ${profile.accuracy===null?'—':profile.accuracy+'% · '+profile.bestCount+'/'+profile.decisions}</strong></p><p>Dimension percentages award partial credit for useful elements. They are not the percentage of correct replies; random choice averages about 33% best-reply accuracy.</p>${profile.dimensions?labels.map((label,i)=>`<div class="dimension"><div class="dimension-label"><span>${label}</span><strong>${profile.dimensions[i]}%</strong></div><div class="dimension-track"><div style="--value:${profile.dimensions[i]}"></div></div><p>${profile.evidence?(profile.dimensions[i]>=85?'High rubric score — check reply accuracy':profile.dimensions[i]<65?'Needs focused practice':'Developing in this practice'):'Not enough practice for a skill conclusion'}</p></div>`).join(''):'<p class="empty-state">Not enough practice. Complete a mission at this difficulty to see a score.</p>'}<p class="dimension-description">Latest completed answer set in each ${levelLabel()} mission. Retries update the profile; older attempts remain in history. These are authored practice rubrics, not proficiency certification.</p></section><section class="next-plan"><div class="eyebrow">YOUR NEXT 10 MINUTES · ${levelLabel()}</div><h2>${profile.dimensions?`Practise ${labels[profile.weak].toLowerCase()}.`:'Build evidence at this level.'}</h2><p>${data.answers[next.id].length>0&&data.answers[next.id].length<3?'Continue your unfinished mission first.':profile.dimensions?'The recommendation targets your lowest dimension, using an unseen relevant mission where possible.':'Start with one contextual decision and explain why the alternatives miss the goal.'}</p><ol><li>Practise <strong>${next.title}</strong> at ${levelLabel()}.</li><li>Compare the risks in all three replies; rehearse your own version aloud.</li><li>Review up to 8 phrases and write a follow-up in Email studio.</li></ol><div><button class="button primary" data-train="${next.id}">Open recommended mission →</button><a class="button secondary" href="#flashcards">Review phrases</a></div></section></div><section class="history-section"><div class="section-heading"><h2>Your recent conversations · ${levelLabel()}</h2><span>Last ${Math.min(20,data.history.length)} of ${data.history.length} attempts</span></div>${data.history.length?`<div class="history-list">${data.history.slice(-20).reverse().map((h,i)=>{const s=missionFor(h.id,state.difficulty),score=evaluate(s,h.choices);return `<div class="history-row"><span class="mission-icon ${s.color}" aria-hidden="true">${s.icon}</span><div><strong>${s.title}</strong><small>${levelLabel()} · ${escape(new Date(h.at).toLocaleString())}</small></div><span class="history-score">${score.total}% points<br><small>${score.accuracy}% best replies</small></span><button class="button text" data-history="${data.history.length-1-i}">Review attempt ↗</button></div>`}).join('')}</div>`:'<div class="empty-state">No completed attempts at this difficulty yet.</div>'}</section><section id="attempt-detail" tabindex="-1"></section>${legacyMarkup()}<section class="backup-card"><div><h2>Your learning travels with you.</h2><p>Export all three profiles, saved reply order, legacy answers/history, review dates and email drafts. Import v1 or v2 JSON on another device. Import replaces progress only after confirmation. Old backups become Legacy, without new-level credit.</p></div><div class="backup-actions"><button class="button secondary" data-export>Export progress ↓</button><button class="button secondary" data-import>Import backup ↑</button><button class="button text" data-reset>Reset all progress</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></section><p class="result-notice">Up to 200 current attempts across levels, plus up to 200 legacy attempts. Free-form rehearsal and emails are not automatically graded. Devices do not sync automatically.</p></div>`,'progress',focus);
}
function showHistory(index){const h=levelData().history[index];if(!h)return;const s=missionFor(h.id,state.difficulty),host=document.querySelector('#attempt-detail');host.innerHTML=`<section class="attempt-panel"><h2>${levelLabel()} · saved attempt</h2><p>${escape(s.title)} · ${evaluate(s,h.choices).total}% points · ${evaluate(s,h.choices).accuracy}% best replies · ${escape(new Date(h.at).toLocaleString())}</p>${s.steps.map((st,i)=>`<div><h3>Decision ${i+1}</h3><p>${escape(st.message)}</p><strong>Your reply: ${escape(st.choices[h.choices[i]].text)}</strong><p>${escape(st.choices[h.choices[i]].feedback)}</p></div>`).join('')}<button class="button secondary" data-start="${s.id}">Open current mission ↗</button></section>`;host.focus();host.scrollIntoView({block:'start',behavior:'instant'});}
function legacyMarkup(){const completed=legacyScenarios.filter(s=>state.answers[s.id].length===3),started=legacyScenarios.filter(s=>state.answers[s.id].length>0);if(!started.length&&!state.history.length)return '';return `<details class="legacy-archive"><summary>Legacy · previous-version practice (${completed.length} completed, ${state.history.length} attempts)</summary><p>Original answers, partial progress and history are preserved below with their original Clarity / Business tone / Next steps rubric. They do not count toward the revised levels. Original email drafts are retained in your backup.</p>${started.map(s=>`<details><summary>${escape(s.title)} · ${state.answers[s.id].length}/3 decisions${state.answers[s.id].length===3?' · '+evaluate(s,state.answers[s.id]).total+'%':''}</summary>${state.answers[s.id].map((n,i)=>`<p><strong>${escape(s.steps[i].message)}</strong><br>${escape(s.steps[i].choices[n].text)}<br>${escape(s.steps[i].choices[n].feedback)}</p>`).join('')}${state.drafts[s.id]?`<pre>${escape(state.drafts[s.id])}</pre>`:''}</details>`).join('')}<h3>Original attempt history</h3>${state.history.slice(-20).reverse().map(h=>{const s=legacyScenarios.find(s=>s.id===h.id);return `<details><summary>${escape(s.title)} · ${evaluate(s,h.choices).total}% points · ${evaluate(s,h.choices).accuracy}% best replies · ${escape(new Date(h.at).toLocaleString())}</summary>${h.choices.map((n,i)=>`<p>${escape(s.steps[i].message)}<br><strong>${escape(s.steps[i].choices[n].text)}</strong><br>${escape(s.steps[i].choices[n].feedback)}</p>`).join('')}</details>`}).join('')}</details>`;}

function render(focus = true) {
  const [view,id] = location.hash.slice(1).split('/');
  const scenario = scenarios.find(s => s.id === id);
  if (view === 'phrasebook') phrasebook(focus);
  else if (view === 'project') project(focus);
  else if (view === 'flashcards') flashcards(focus);
  else if (view === 'emails') emailStudio(focus);
  else if (view === 'progress') progress(focus);
  else if ((view === 'mission' || view === 'result') && scenario) {
    levelData().active=id;
    if (view === 'result') result(scenario,focus); else mission(scenario,focus);
  } else dashboard(focus);
}
main.addEventListener('click', async event => {
  const button = event.target.closest('button'); if (!button || button.disabled) return;
  if(button.hasAttribute('data-guide-lang')) {
    guideLanguage=button.dataset.guideLang==='en'?'en':'ru';
    try {localStorage.setItem(GUIDE_KEY,guideLanguage);} catch {}
    document.querySelector('#project-guide').outerHTML=guideMarkup();
    document.querySelector(`[data-guide-lang="${guideLanguage}"]`).focus({preventScroll:true});
    return;
  }
  if(button.hasAttribute('data-difficulty')){state.difficulty=button.dataset.difficulty;scenarios=missionsFor(state.difficulty);cursor=0;save();const view=location.hash.slice(1).split('/')[0];if(view==='progress')progress(false);else route('practice',false);document.querySelector(`[data-difficulty="${state.difficulty}"]`)?.focus({preventScroll:true});return;}
  if(button.hasAttribute('data-history')){showHistory(Number(button.dataset.history));return;}
  if(button.hasAttribute('data-train')){const id=button.dataset.train;if(levelData().answers[id].length===3)prepareAttempt(state,id,state.difficulty,Math.random,true);start(id);}
  if (button.hasAttribute('data-start')) start(button.dataset.start);
  if (button.hasAttribute('data-back')) route('practice');
  if (button.hasAttribute('data-choice')) {
    const s = scenarios.find(s=>s.id===levelData().active); if (!s || levelData().answers[s.id].length !== cursor) return;
    recordChoice(state,s.id,state.difficulty,Number(button.dataset.choice));save();
    mission(s,false);
    document.querySelector('.feedback')?.focus({preventScroll:true});
    document.querySelector('.feedback')?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  if (button.hasAttribute('data-continue')) {
    const s = scenarios.find(s=>s.id===levelData().active); if (!s) return;
    if (cursor===2) route(`result/${s.id}`); else {cursor++; mission(s,false);main.focus({preventScroll:true});document.querySelector('.conversation-panel').scrollIntoView({block:'start',behavior:'instant'});}
  }
  if (button.hasAttribute('data-retry')) {
    const id=button.dataset.retry; prepareAttempt(state,id,state.difficulty,Math.random,true);cursor=0;save();route(`mission/${id}`);
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
    const pool=scenarios.filter(s=>s.id!==levelData().active);const s=pool[Math.floor(Math.random()*pool.length)];
    prepareAttempt(state,s.id,state.difficulty,Math.random,true);start(s.id);
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
document.querySelector('#reset-confirm').addEventListener('click',()=>{state=freshState();scenarios=missionsFor(state.difficulty);cursor=0;save();dialog.close();route('practice');toast('Progress reset. A fresh start.');});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
window.addEventListener('hashchange',()=>{const [view,id]=location.hash.slice(1).split('/');if(view==='mission'&&levelData().answers[id])cursor=Math.max(0,levelData().answers[id].length-1);render()});
document.querySelector('#import-cancel').addEventListener('click',()=>{importCandidate=null;document.querySelector('#import-dialog').close()});
document.querySelector('#import-confirm').addEventListener('click',()=>{if(!importCandidate)return;state=importCandidate;scenarios=missionsFor(state.difficulty);importCandidate=null;save();document.querySelector('#import-dialog').close();progress(true);toast('Learning backup restored.');});
const initialId=location.hash.slice(1).split('/')[1];
if(levelData().answers[initialId])cursor=Math.max(0,levelData().answers[initialId].length-1);
render(false);
