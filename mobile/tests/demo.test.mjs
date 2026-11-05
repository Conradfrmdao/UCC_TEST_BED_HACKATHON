import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseExample, examples } from '../src/demo.js';

test('only the two complete sample messages receive demo outcomes', () => {
  assert.equal(analyseExample(examples[0].text).risk, 'high');
  assert.equal(analyseExample(examples[1].text).risk, 'suspicious');
  assert.equal(analyseExample(`${examples[0].text} Another message.`).risk, 'unknown');
  assert.equal(analyseExample('https://example.com').risk, 'unknown');
});
