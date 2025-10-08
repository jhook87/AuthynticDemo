const test = require('node:test');
const assert = require('node:assert/strict');

const { computeMultipleHashes, verifyHash } = require('../build/services/crypto/hashService.js');
const { createBatchProof, verifyBatchProof } = require('../build/services/crypto/merkleService.js');
const { bootstrapNetwork, simulateLatencyShift } = require('../build/services/network/networkSimulationService.js');
const {
  generateSigningBundle,
  signMessage,
  verifyMessageSignature,
} = require('../build/services/crypto/signatureService.js');

test('hash service supports multiple algorithms', async () => {
  const hashes = await computeMultipleHashes('authyntic', ['sha-256', 'sha-3', 'blake2b']);
  assert.equal(hashes.length, 3);
  for (const entry of hashes) {
    assert.equal(typeof entry.digest, 'string');
    assert.ok(entry.digest.length > 20);
    assert.ok(await verifyHash(entry.algorithm, 'authyntic', entry.digest));
  }
});

test('merkle batch proof verifies all leaves', () => {
  const leaves = ['one', 'two', 'three', 'four'].map((value, index) => ({ id: `leaf-${index}`, hash: value }));
  const batch = createBatchProof(leaves, leaves.map((_, index) => index));
  assert.equal(batch.leaves.length, leaves.length);
  assert.ok(verifyBatchProof(batch));
});

test('network simulation adjusts latency', () => {
  const nodes = bootstrapNetwork(6);
  const shifted = simulateLatencyShift(nodes);
  assert.equal(shifted.length, nodes.length);
  shifted.forEach((node, index) => {
    assert.notEqual(node.latencyMs, nodes[index].latencyMs);
  });
});

test('signature service round trips ECDSA payloads', async () => {
  const bundle = await generateSigningBundle();
  const message = 'Authyntic QA verification payload';
  const signature = await signMessage(bundle, message);
  assert.equal(typeof signature, 'string');
  assert.ok(signature.length > 60);

  const verification = await verifyMessageSignature(bundle, message, signature);
  assert.equal(verification.valid, true);

  const swappedTail = signature.replace(/.$/, (char) => (char === 'A' ? 'B' : 'A'));
  const tampered = await verifyMessageSignature(bundle, message, swappedTail);
  assert.equal(tampered.valid, false);
  assert.equal(tampered.reason, 'Signature check failed');
});
