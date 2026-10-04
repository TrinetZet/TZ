import { extraScenarios } from './extra-scenarios.mjs';
const answer = (text, score, feedback) => ({ text, score, feedback });
export const scenarios = [
  {
    id: 'requirements', number: '01', title: 'Make the brief clear.', category: 'Discovery', icon: '◎', color: 'mint', level: 'B1–B2', minutes: 5,
    description: 'Turn a vague request into a shared definition of done.', client: 'Alex', role: 'Product lead · Northstar Studio', initials: 'AL', context: 'Your team is building a booking platform. Alex asks for a “simple dashboard” before the next sprint. You need a clear scope before estimating.',
    objective: 'Ask precise questions, confirm scope and agree on acceptance criteria.',
    emailSubject: 'Booking dashboard — agreed scope and next steps', emailSummary: 'For the first version, we will focus on weekly booking totals and CSV export.',
    emailNext: 'We will share a wireframe by Wednesday and ask you to confirm that the weekly totals match the source data before development begins.',
    steps: [
      { message: 'Could you add a simple dashboard? Just something user-friendly. Can we get it in the next sprint?', tip: 'Clarify before committing. A polite question is more useful than a confident guess.', phrase: 'Could you clarify…?', meaning: 'A polite way to ask for more specific information.', choices: [
        answer('Absolutely. A simple dashboard is easy, so we can definitely ship it next sprint.', [1,2,0], 'Friendly, but “definitely” commits to a deadline before scope is known. Ask what the dashboard needs to show first.'),
        answer('Could you clarify which metrics users need to see and who will use the dashboard? This will help us estimate the work.', [3,3,3], 'Specific questions identify metrics and users. “Could you clarify” is courteous; explaining the purpose makes the request collaborative.'),
        answer('Your request is too vague. Send us a proper specification and then we will talk.', [2,0,1], 'You identify the problem, but “too vague” and “proper” sound accusatory. Offer focused questions to help the client clarify the brief.')
      ] },
      { message: 'Our operations team needs weekly booking totals and a CSV export. Charts would be nice, but they can wait.', tip: 'Reflect the client’s priorities. Separate essential features from later enhancements.', phrase: 'To confirm our understanding…', meaning: 'Introduce a concise summary and invite correction.', choices: [
        answer('To confirm our understanding, the first version needs weekly totals and CSV export. We can leave charts for a later release. Is that correct?', [3,3,3], 'You turn the request into a clear first-release scope and invite confirmation. This prevents different assumptions about what “done” means.'),
        answer('Okay, we will build the dashboard and include some other useful features too.', [1,2,0], 'The tone is friendly, but “other useful features” expands scope without agreement. Repeat the two essential features explicitly.'),
        answer('Charts are out of scope. You should have mentioned the CSV export earlier.', [2,0,1], 'Scope control is useful, but blame harms the relationship. State the agreed priority without criticising when the client raised it.')
      ] },
      { message: 'Yes, that is correct. How can we check that it is ready?', tip: 'Define a visible outcome and a concrete next step.', phrase: 'Acceptance criteria', meaning: 'Agreed conditions that a deliverable must meet to be accepted.', choices: [
        answer('We will let you know when our developers feel it is finished.', [1,1,1], 'This makes completion subjective. Agree on a check the client can perform, such as matching totals and opening the export.'),
        answer('You can test it yourself. It should be obvious whether it works.', [1,0,0], '“Obvious” dismisses a reasonable question. Explain the acceptance criteria and offer a review checkpoint.'),
        answer('Let’s agree that the totals must match the source data and the CSV must open correctly. We will share a wireframe by Wednesday for your review.', [3,3,3], 'Two observable criteria define success. A Wednesday wireframe review creates a practical checkpoint before implementation.')
      ] }
    ]
  },
  {
    id: 'negotiation', number: '02', title: 'Find the middle ground.', category: 'Negotiation', icon: '⇄', color: 'lavender', level: 'B2', minutes: 5,
    description: 'Balance a tight deadline with a realistic budget.', client: 'Morgan', role: 'Founder · Orbit Commerce', initials: 'MO', context: 'Orbit Commerce wants a checkout redesign in two weeks. Your estimate is four weeks and €6,000. Explore a smaller launch without promising unrealistic delivery.',
    objective: 'Explain trade-offs, propose an option and confirm the agreement.',
    emailSubject: 'Checkout redesign — phased delivery proposal', emailSummary: 'We propose a two-week first phase for €3,000, focused on the payment flow.',
    emailNext: 'After your written approval, we will schedule the first phase. Analytics and visual polish will remain in a later phase, with a separate estimate.',
    steps: [
      { message: 'We need the full checkout redesign in two weeks. Our maximum budget is €3,000. Can you make it happen?', tip: 'Acknowledge the constraint, then explain the trade-off with an alternative.', phrase: 'Within that budget…', meaning: 'Frame what is feasible under a financial constraint.', choices: [
        answer('No. That budget is unrealistic for what you want.', [2,0,0], 'The constraint may be real, but a flat rejection closes the conversation. Explain the estimate and propose a smaller first phase.'),
        answer('The full redesign requires four weeks and €6,000. Within your budget, we could deliver the core payment flow first. Would that meet your launch needs?', [3,3,3], 'You explain the estimate without blaming the client and offer a concrete scope trade-off. The final question checks whether the option solves their actual need.'),
        answer('Sure, we can try to squeeze everything in. We will figure out the budget later.', [0,2,0], 'This avoids an uncomfortable conversation but hides delivery and cost risks. State what can realistically be delivered for €3,000.')
      ] },
      { message: 'The payment flow is our priority. Can we move analytics and visual polish to a second phase?', tip: 'Name what is included and what is deferred. Keep cost and date attached to scope.', phrase: 'A phased approach', meaning: 'Deliver a project in smaller, agreed stages.', choices: [
        answer('Yes. Phase one would cover the payment flow in two weeks for €3,000. Analytics and visual polish would move to phase two, with a separate estimate.', [3,3,3], 'Clear scope, time and cost make the phased approach reviewable. A separate estimate avoids implying that phase two is included for free.'),
        answer('Yes, the rest will be done whenever we have time.', [1,1,0], '“Whenever” creates uncertainty and no shared plan. Describe a second phase and clarify that its estimate will be agreed separately.'),
        answer('We can move them, but do not ask for any more changes.', [1,0,1], 'The concern about changes is valid, but the wording sounds hostile. Explain how additional requests will affect scope and estimates.')
      ] },
      { message: 'That sounds reasonable. Let’s start tomorrow.', tip: 'Confirm agreement before work begins. Use a written checkpoint.', phrase: 'Subject to your approval', meaning: 'An action depends on explicit agreement.', choices: [
        answer('Great, we will start everything tomorrow and deal with the paperwork afterwards.', [1,2,0], 'Starting before scope approval can create misunderstandings. Confirm the phase-one terms in writing before scheduling.'),
        answer('You need to sign something first. Otherwise we cannot do anything.', [2,0,1], 'A written agreement is sensible, but the phrasing is abrupt. Explain the approval step constructively.'),
        answer('Thank you. I will send the phase-one scope and estimate today. Once you approve them in writing, we can confirm the start date.', [3,3,3], 'This is warm and specific. It makes written approval the condition for confirming a start date, without promising an unverified schedule.')
      ] }
    ]
  },
  {
    id: 'delay', number: '03', title: 'Deliver the difficult news.', category: 'Delivery', icon: '◷', color: 'peach', level: 'B1–B2', minutes: 5,
    description: 'Communicate a delay with ownership and a recovery plan.', client: 'Sam', role: 'Operations manager · Atlas Health', initials: 'SA', context: 'Your integration was due on Friday. Testing found an authentication issue, and the earliest reliable delivery is Tuesday. Sam has a Monday demo booked.',
    objective: 'Communicate early, acknowledge impact and offer a reliable update.',
    emailSubject: 'Integration update — revised delivery and Monday demo', emailSummary: 'An authentication issue found during testing means the full integration is now expected on Tuesday.',
    emailNext: 'We will provide a clearly labelled sandbox for Monday’s demo and send a progress update by 15:00 on Monday, even if the issue is still being resolved.',
    steps: [
      { message: 'Are we still on track for Friday? I have promised our team a demo on Monday.', tip: 'Be transparent early. Pair the revised date with a reason and ownership.', phrase: 'We apologise for the impact…', meaning: 'Acknowledge how a problem affects the other party.', choices: [
        answer('We found an authentication issue during testing. We expect delivery on Tuesday, and I apologise for the impact on your Monday demo. Let’s discuss a workable alternative.', [3,3,3], 'You state the issue, revised expectation and client impact directly. Offering an alternative shows ownership instead of leaving the client with the problem.'),
        answer('Everything is basically fine. We might need a little extra time, but do not worry.', [0,1,0], 'Vague reassurance hides the revised date. The client needs accurate information to change their plans.'),
        answer('The external API caused the delay. It is not our fault.', [1,0,0], 'Even if an external service contributed, blame does not help the client plan. Explain the impact and your recovery action.')
      ] },
      { message: 'Moving the demo is difficult. Is there anything we can show on Monday?', tip: 'Offer an honest fallback and name its limitations.', phrase: 'In the meantime…', meaning: 'Introduce a temporary action while the main issue is resolved.', choices: [
        answer('Just show the old version and tell everyone it is the new one.', [1,0,0], 'This would mislead the demo audience. Any temporary alternative must be clearly labelled and its limitations explained.'),
        answer('In the meantime, we can provide a sandbox with sample data for Monday. It will demonstrate the flow, but live authentication will not be available yet.', [3,3,3], 'The sandbox is a practical alternative. Explicitly stating that authentication is unavailable keeps expectations accurate.'),
        answer('There is nothing we can do. You will have to cancel.', [1,0,0], 'This dismisses the impact and gives no support. If a sandbox can demonstrate the flow, propose it with clear limitations.')
      ] },
      { message: 'A sandbox will help. Please keep me informed; I cannot be surprised again.', tip: 'Give a specific update time, including when there is no resolution.', phrase: 'Regardless of whether…', meaning: 'An action will happen even if the condition has not changed.', choices: [
        answer('I will update you soon.', [0,2,1], '“Soon” is not a usable commitment. Give a time and say what the update will contain.'),
        answer('We are busy fixing it. Please wait until we contact you.', [1,0,0], 'This discourages a reasonable request for visibility. A predictable update reduces uncertainty for the client.'),
        answer('I will send an update by 15:00 on Monday with our progress and any remaining risks, even if the issue is not fully resolved.', [3,3,3], 'A precise time and explicit risk update build trust. Updating even without a resolution prevents another silent surprise.')
      ] }
    ]
  },
  {
    id: 'complaint', number: '04', title: 'Turn tension into trust.', category: 'Client care', icon: '◇', color: 'blue', level: 'B2', minutes: 5,
    description: 'Respond to a frustrated client and agree on a remedy.', client: 'Jamie', role: 'Customer success lead · Lumen', initials: 'JA', context: 'A report export failed during a client presentation. Jamie is frustrated. You must acknowledge the incident, gather useful evidence and agree on next steps.',
    objective: 'Show empathy, investigate without blame and offer measurable follow-up.',
    emailSubject: 'Report export incident — investigation and follow-up', emailSummary: 'We apologise for the report export failure during your presentation and understand the disruption it caused.',
    emailNext: 'We will review the error message and approximate failure time, provide a manually generated report today, and send an investigation update by 12:00 tomorrow. We will confirm a fix timeline after identifying the cause.',
    steps: [
      { message: 'The export failed in front of our stakeholders. This is unacceptable. What are you going to do about it?', tip: 'Acknowledge the impact before investigating. Avoid defensive language.', phrase: 'I understand your frustration.', meaning: 'Recognise the client’s emotional response without arguing.', choices: [
        answer('It worked on our machines. Are you sure your team used it correctly?', [1,0,0], 'This sounds defensive and shifts blame before investigation. Acknowledge the presentation impact before asking for evidence.'),
        answer('I understand your frustration, and I apologise for the disruption to your presentation. We will investigate this as a priority and agree on next steps with you.', [3,3,3], 'Empathy and a direct apology address the impact. You commit to investigation and shared next steps without claiming a cause you have not verified.'),
        answer('Sorry! We promise this will never happen again.', [0,2,0], 'The apology is positive, but “never” is an unverifiable guarantee. Offer a concrete investigation and follow-up instead.')
      ] },
      { message: 'What do you need from us? We do not have time for a long investigation.', tip: 'Ask for the minimum useful evidence and explain its purpose.', phrase: 'To help us reproduce the issue…', meaning: 'Explain why you are requesting diagnostic information.', choices: [
        answer('To help us reproduce the issue, could you share the error message and approximate time of the failure? Please avoid sending any confidential report data.', [3,3,3], 'Two focused requests reduce client effort and help investigation. The confidentiality reminder prevents unnecessary sharing of sensitive content.'),
        answer('Send us all your files and every detail about the presentation.', [1,1,0], 'The request is too broad and may expose confidential data. Ask only for the error message and approximate time first.'),
        answer('We cannot investigate without your help, so you need to make time.', [1,0,1], 'The need for evidence is reasonable, but the wording sounds demanding. Explain a small, specific request politely.')
      ] },
      { message: 'I will send the error message. We still need that report today. When will you fix the export?', tip: 'Separate a temporary remedy from the permanent fix. Commit to what you can verify.', phrase: 'A temporary workaround', meaning: 'A short-term way to complete a task while the root problem is fixed.', choices: [
        answer('We will fix it in an hour, whatever the cause is.', [0,2,0], 'A deadline before the cause is known is unreliable. Offer a workaround and commit to an investigation update.'),
        answer('You will get the report when the bug is fixed.', [1,0,0], 'This leaves the urgent business need unaddressed. Provide a temporary remedy where feasible and a specific update time.'),
        answer('We can provide a manually generated report today. I will send an investigation update by 12:00 tomorrow and confirm the fix timeline once we identify the cause.', [3,3,3], 'A same-day workaround addresses the urgent need. A timed update and conditional fix estimate show accountability without overpromising.')
      ] }
    ]
  }
];
scenarios.push(...extraScenarios);
export const phrases = [
  ['Could you clarify…?', 'Discovery', 'Ask politely for more detail.', 'Could you clarify which users need access to the dashboard?'],
  ['To confirm our understanding…', 'Discovery', 'Check that both sides share the same interpretation.', 'To confirm our understanding, CSV export is part of phase one.'],
  ['Acceptance criteria', 'Discovery', 'Observable conditions for accepting a deliverable.', 'Let’s agree on the acceptance criteria before development.'],
  ['Within that budget…', 'Negotiation', 'Introduce what is feasible under a cost limit.', 'Within that budget, we can deliver the core payment flow.'],
  ['A phased approach', 'Negotiation', 'Deliver work in separately agreed stages.', 'A phased approach would help us meet your launch date.'],
  ['Subject to your approval', 'Negotiation', 'Make agreement a clear condition for proceeding.', 'We can schedule phase one, subject to your approval.'],
  ['We apologise for the impact…', 'Delivery', 'Acknowledge the consequences of a problem.', 'We apologise for the impact on your planned demo.'],
  ['In the meantime…', 'Delivery', 'Introduce an action taken while waiting for a solution.', 'In the meantime, we can prepare a sandbox with sample data.'],
  ['Regardless of whether…', 'Delivery', 'Promise an action even if circumstances have not changed.', 'We will send an update regardless of whether the fix is complete.'],
  ['I understand your frustration.', 'Client care', 'Show empathy before discussing the solution.', 'I understand your frustration and will prioritise the investigation.'],
  ['To help us reproduce the issue…', 'Client care', 'Explain a focused request for diagnostic evidence.', 'To help us reproduce the issue, could you share the error message?'],
  ['A temporary workaround', 'Client care', 'A short-term alternative while the main issue is resolved.', 'As a temporary workaround, we can generate the report manually.']
].map(([term, category, meaning, example]) => ({term, category, meaning, example}));

for (const scenario of extraScenarios) {
  for (const step of scenario.steps) phrases.push({term:step.phrase,category:scenario.category,meaning:step.meaning,example:step.choices.find(c=>c.score.every(n=>n===3)).text});
}
phrases.forEach((p,i)=>p.id=`phrase-${i+1}`);
