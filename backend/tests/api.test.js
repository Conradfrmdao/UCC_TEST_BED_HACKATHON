import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseDemo } from '../src/services/analysis-service.js';

test('known PIN fixture returns a simulated high-risk result', () => {
  const result = analyseDemo('You won UGX 500,000. Send your Mobile Money PIN.');
  assert.equal(result.kind, 'simulated_result');
  assert.equal(result.riskLevel, 'high');
  assert.equal(result.riskScore, null);
});

test('unknown content returns unavailable instead of a verdict', () => {
  const result = analyseDemo('Hello, are you coming to class?');
  assert.equal(result.kind, 'analysis_unavailable');
  assert.equal(result.riskLevel, 'unknown');
});
