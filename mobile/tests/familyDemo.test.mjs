import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFamily, registerParent, createInvite, acceptInvite, addDemoAlert } from '../src/familyDemo.js';

test('demo signup validates phone and demo verification code', () => {
  assert.ok(registerParent(emptyFamily(), 'Amina', 'abc', '123456').error);
  assert.ok(registerParent(emptyFamily(), 'Amina', '0700123456', '000000').error);
  const registered = registerParent(emptyFamily(), 'Amina', '0700123456', '123456').state;
  assert.equal(registered.phoneLast4, '3456');
  assert.equal(registered.guardianName, 'Amina');
  assert.equal(JSON.stringify(registered).includes('0700123456'), false);
});

test('a family code is validated, expires and can be used once', () => {
  const parent = registerParent(emptyFamily(), 'Amina', '0700123456', '123456').state;
  const invited = createInvite(parent, 'Kato', 1000, () => 0).state;
  assert.ok(acceptInvite(invited, '000000', 1001).error);
  assert.ok(acceptInvite(invited, '100000', 601001).error);
  const linked = acceptInvite(invited, '100000', 1001).state;
  assert.equal(linked.linked, true);
  assert.equal(linked.invite, null);
  assert.ok(acceptInvite(linked, '100000', 1002).error);
  assert.equal(addDemoAlert(linked, 'high').alerts.length, 1);
  assert.equal(addDemoAlert(linked, 'suspicious').alerts.length, 0);
});
