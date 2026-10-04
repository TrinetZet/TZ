import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios } from '../scenarios.mjs';
import { freshState, readState, evaluate, composeEmail } from '../core.mjs';

test('twelve complete missions offer distinct scored choices and feedback', () => {
  assert.equal(scenarios.length, 12);
  assert.equal(new Set(scenarios.map(s => s.id)).size, 12);
  for (const s of scenarios) {
    assert.equal(s.steps.length, 3);
    for (const step of s.steps) {
      assert.equal(step.choices.length, 3);
      assert.equal(step.choices.filter(c => c.score.every(n => n === 3)).length, 1);
      for (const c of step.choices) { assert.ok(c.feedback.length > 30); assert.ok(c.text.length > 20); }
    }
  }
});
test('professional answers achieve 100 and weak answers score lower', () => {
  for (const s of scenarios) {
    const best = s.steps.map(step => step.choices.findIndex(c => c.score.every(n => n === 3)));
    assert.equal(evaluate(s, best).total, 100);
    const weak = s.steps.map(step => step.choices.findIndex(c => c.score.some(n => n < 3)));
    assert.ok(evaluate(s, weak).total < 100);
    assert.equal(evaluate(s, []).total, 0);
    assert.equal(evaluate(s, best.slice(0,1)).answered, 1);
    const mail = composeEmail(s, best);
    assert.ok(mail.includes(s.client)); assert.ok(mail.includes(s.emailSubject));
    assert.ok(mail.includes('Kind regards')); assert.ok(mail.includes(s.emailSummary));
  }
});
test('corrupt and incompatible saved data recover without throwing', () => {
  for (const raw of [null, '', '{oops', '{}', '{"version":9}', '{"version":1,"answers":null}']) {
    assert.deepEqual(readState(raw), freshState());
  }
});
test('saved choice prefixes are validated and unknown keys ignored', () => {
  const s = scenarios[0];
  const state = readState(JSON.stringify({version:1,active:s.id,answers:{[s.id]:[0,99,1],rogue:[0]}}));
  assert.deepEqual(state.answers[s.id], [0]); assert.equal(state.active, s.id);
  assert.equal(state.answers.rogue, undefined);
  const valid = freshState(); valid.answers[s.id] = [2,1,0];
  assert.deepEqual(readState(JSON.stringify(valid)), valid);
});
