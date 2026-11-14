// 공식 데이터 읽기: 문자열은 docs/EVIDENCE_IMAGE_SPEC.md 의 evidence-data 블록,
// 등록번호·NVR 오차·녹음 구간은 docs/STORY_CANON.md 에서 직접 읽는다(도구 안에 같은 값을 두지 않음).
'use strict';
const fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const SPEC_FILE = path.join(ROOT, 'docs', 'EVIDENCE_IMAGE_SPEC.md');
const CANON_FILE = path.join(ROOT, 'docs', 'STORY_CANON.md');

const toSec = t => { const [h, m, s = 0] = t.split(':').map(Number); return h * 3600 + m * 60 + s; };
const fmt = (sec, withSec) => { sec = ((sec % 86400) + 86400) % 86400; const p = n => String(n).padStart(2, '0'); const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60; return withSec ? `${p(h)}:${p(m)}:${p(s)}` : `${p(h)}:${p(m)}`; };

function loadSpec() {
  const md = fs.readFileSync(SPEC_FILE, 'utf8');
  const m = md.match(/<!-- evidence-data:start -->\s*```json\s*([\s\S]*?)```\s*<!-- evidence-data:end -->/);
  if (!m) throw new Error('SPEC에서 evidence-data 블록을 찾지 못했습니다 (docs/EVIDENCE_IMAGE_SPEC.md §4).');
  try { return JSON.parse(m[1]); } catch (e) { throw new Error('SPEC evidence-data JSON 오류: ' + e.message); }
}

function loadCanon() {
  const md = fs.readFileSync(CANON_FILE, 'utf8');
  const reg = md.match(/\| 등록번호 값 \| \*\*`(제 \d{4}-\d{4}호)`\*\*/);
  if (!reg) throw new Error('CANON B장 "등록번호 값" 행에서 등록번호를 읽지 못했습니다.');
  const offsets = [...md.matchAll(/- (\d{2}:\d{2}(?::\d{2})?) 이후 표시 = 실제 − (\d+)분(?: (\d+)초)?/g)]
    .map(x => ({ after: toSec(x[1]), offset: Number(x[2]) * 60 + (Number(x[3]) || 0) }))
    .sort((a, b) => b.after - a.after);
  if (offsets.length < 2) throw new Error('CANON D장에서 NVR 표시 오차 규칙을 읽지 못했습니다.');
  const recLine = md.split('\n').find(l => /^\| \d{2}:\d{2}~\d{2}:\d{2} \|/.test(l) && l.includes('녹음'));
  if (!recLine) throw new Error('CANON D장에서 면담 녹음 구간(22:07~22:16 행)을 읽지 못했습니다.');
  const [, start, end] = recLine.match(/^\| (\d{2}:\d{2})~(\d{2}:\d{2}) \|/);
  return { registration: reg[1], offsets, recording: { start, end } };
}

// NVR 표시 시각 → 실제 시각(CANON D장의 규칙: 실제 시각이 기준 시각 이후인 가장 늦은 규칙을 적용)
function nvrToReal(display, offsets) {
  const d = toSec(display);
  for (const r of offsets) if (d + r.offset >= r.after) return d + r.offset;
  return d;
}

// {registration} 같은 토큰을 CANON 값으로 바꾼다. 모르는 토큰은 오류.
function resolveTokens(value, canon) {
  const tokens = { registration: canon.registration };
  if (typeof value === 'string') return value.replace(/\{(\w+)\}/g, (_, k) => { if (!(k in tokens)) throw new Error(`알 수 없는 토큰 {${k}}`); return tokens[k]; });
  if (Array.isArray(value)) return value.map(v => resolveTokens(v, canon));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveTokens(v, canon)]));
  return value;
}

// 화면에 실제로 찍혀야 하는 글자 목록(처리 지시 객체 {redact}, {signature} 등은 제외)
function visibleStrings(text) {
  const out = [];
  (function walk(v) { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object' && !v.redact && !v.signature && !v.illegible) Object.values(v).forEach(walk); })(text);
  return out;
}

function load() {
  const spec = loadSpec(), canon = loadCanon();
  const items = {};
  for (const [id, raw] of Object.entries(spec)) if (!id.startsWith('_')) items[id] = { id, ...raw, text: resolveTokens(raw.text || {}, canon) };
  return { spec, canon, items, common: { nvr: spec._nvr_ui, forbidden: spec._forbidden } };
}

module.exports = { ROOT, SPEC_FILE, CANON_FILE, load, nvrToReal, toSec, fmt, visibleStrings };
