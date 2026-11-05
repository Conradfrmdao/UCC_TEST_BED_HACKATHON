import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseSample } from '../frontend/components/child/demoAnalysis.js';

test('only the exact demo sample receives a simulated result', () => {
  const sample = 'Congratulations! You won UGX 500,000. Send your Mobile Money PIN to claim the cash reward.';
  assert.equal(analyseSample(sample).kind, 'simulated_result');
  assert.equal(analyseSample(sample + ' Additional unknown content.').kind, 'analysis_unavailable');
  assert.equal(analyseSample('https://example.com').riskLevel, 'unknown');
});
