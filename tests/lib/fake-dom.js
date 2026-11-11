// 브라우저 없이 실제 챕터 스크립트를 Node vm 안에서 실행하는 가짜 DOM.
// 클릭·선택(change) 이벤트를 흉내 내고, 렌더링된 HTML과 localStorage 저장값으로 로직을 검사한다.
'use strict';
const vm = require('vm'), fs = require('fs'), path = require('path');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const tick = () => new Promise(r => setTimeout(r, 5));

// 렌더링·이미지 로드 과정에서 등장한 모든 assets 경로(이미지 경로 검사용)
const seenAssets = new Set();
const grab = h => { for (const m of String(h).matchAll(/assets\/[A-Za-z0-9_./-]+\.webp/g)) seenAssets.add(m[0]); };

function boot(file, storage = {}, root = PROJECT_ROOT) {
  const L = {};
  let html = '';
  const app = { get innerHTML() { return html; }, set innerHTML(v) { html = v; grab(v); }, addEventListener: (t, f) => (L[t] ??= []).push(f), querySelector: () => null };
  const ls = { getItem: k => (k in storage ? storage[k] : null), setItem: (k, v) => { storage[k] = String(v); }, removeItem: k => { delete storage[k]; } };
  class Image { constructor() { this.complete = false; this.naturalWidth = 0; } set src(v) { this._s = v; grab(v); setTimeout(() => this.onload && this.onload(), 0); } get src() { return this._s; } decode() { return Promise.resolve(); } }
  const errors = [];
  const ctx = { document: { getElementById: () => app, addEventListener() {}, activeElement: null, querySelector: () => null },
    localStorage: ls, Image, window: { location: { assign() {} } }, location: { href: '' }, console: { ...console, warn() {}, error: (...a) => errors.push(a) },
    setTimeout, clearTimeout, AbortController, fetch: async () => { throw new Error('offline'); }, HTMLInputElement: class {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
  const ev = (type, target) => (L[type] || []).forEach(f => f({ target, preventDefault() {} }));
  const env = {
    app, storage, errors,
    // data-action(챕터 1~3)과 data-act(챕터 4~5)를 모두 지원
    click: async (act, id = '') => { ev('click', { closest: () => ({ dataset: { act, action: act, id } }) }); await tick(); },
    change: async (dataset, value) => { ev('change', { dataset, value }); await tick(); },
    html: () => html,
    save: k => JSON.parse(storage[k] || 'null'),
    // 대화를 끝까지 넘기며 [화자, 초상화 경로] 목록을 반환
    async drain() {
      const shots = [];
      for (let i = 0; i < 40; i++) {
        await tick();
        const m = html.match(/data-act(?:ion)?="(next|dialogue-next)"/); if (!m) return shots;
        const img = html.match(/dialogue-view">(?:<img src="([^"]+)")?/); const sp = html.match(/class="speaker">([^<]+)</);
        shots.push([sp ? sp[1] : '내레이션', (img && img[1]) || null]);
        await env.click(m[1]);
      }
      return shots;
    },
  };
  return env;
}

function reporter(title) {
  let pass = 0, fail = 0; const failures = [];
  console.log(`\n=== ${title} ===`);
  return {
    ok(c, m) { if (c) { pass++; console.log('  PASS', m); } else { fail++; failures.push(m); console.log('  FAIL', m); } },
    section(n) { console.log(`[${n}]`); },
    done() { console.log(`\n결과(${title}): PASS ${pass} / FAIL ${fail}`); if (failures.length) console.log('실패 목록:\n - ' + failures.join('\n - ')); return { pass, fail }; },
  };
}

module.exports = { PROJECT_ROOT, boot, reporter, seenAssets };
