import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../frontend/public/sw.js', import.meta.url), 'utf8');

function worker({ development = false, online = true } = {}) {
  const handlers = {};
  const removed = [];
  const cacheWrites = [];
  const context = {
    URL, Response,
    self: {
      location: { href: `http://localhost:3000/sw.js${development ? '?development=1' : ''}`, origin: 'http://localhost:3000' },
      addEventListener: (type, fn) => { handlers[type] = fn; },
      skipWaiting: async () => {},
      clients: { claim: async () => {} }
    },
    caches: {
      keys: async () => ['chinga-shell-v1', 'chinga-public-v3', 'other-app-cache'],
      delete: async (key) => { removed.push(key); return true; },
      match: async (key) => {
        assert.equal(key, '/offline.html');
        return new Response('Connection unavailable', { headers: { 'Content-Type': 'text/html' } });
      },
      open: async () => ({
        addAll: async () => {},
        match: async () => undefined,
        put: async (request) => { cacheWrites.push(request.url); }
      })
    },
    fetch: async () => {
      if (!online) throw new TypeError('Network unavailable');
      return new Response('network response');
    }
  };
  vm.runInNewContext(source, context);
  function request(path, properties = {}) {
    let response;
    handlers.fetch({
      request: { url: `http://localhost:3000${path}`, method: 'GET', mode: 'cors', ...properties },
      respondWith: (promise) => { response = promise; }
    });
    return response;
  }
  return { request, handlers, removed, cacheWrites };
}

test('offline document navigation gets the standalone fallback', async () => {
  const response = await worker({ online: false }).request('/admin', { mode: 'navigate' });
  assert.match(response.headers.get('Content-Type'), /text\/html/);
  assert.equal(await response.text(), 'Connection unavailable');
});

test('failed scripts, RSC, API and optimiser requests never receive offline HTML', () => {
  const instance = worker({ online: false });
  for (const path of ['/_next/static/chunk.js', '/admin?_rsc=abc', '/api/admin/overview', '/_next/image?url=hero']) {
    assert.equal(instance.request(path), undefined, path);
  }
});

test('development bypasses interception entirely', () => {
  const instance = worker({ development: true, online: false });
  assert.equal(instance.request('/admin', { mode: 'navigate' }), undefined);
  assert.equal(instance.request('/images/chinga-family-safety-hero.webp'), undefined);
});

test('online admin responses are fresh and never cached', async () => {
  const instance = worker();
  assert.equal(await (await instance.request('/admin', { mode: 'navigate' })).text(), 'network response');
  assert.deepEqual(instance.cacheWrites, []);
});

test('activation removes only stale Chinga caches', async () => {
  const instance = worker();
  let done;
  instance.handlers.activate({ waitUntil: (promise) => { done = promise; } });
  await done;
  assert.deepEqual(instance.removed, ['chinga-shell-v1']);
});
