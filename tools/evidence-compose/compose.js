#!/usr/bin/env node
// 증거 이미지 글자 합성 도구. 사용법은 README.md 참고.
//   node tools/evidence-compose/compose.js check [ID...]
//   node tools/evidence-compose/compose.js refs [ID...]
//   node tools/evidence-compose/compose.js sample
//   node tools/evidence-compose/compose.js render <ID> --base <바탕 그림> [--out <폴더>] [--draw-clock] [--cctv-filter]
'use strict';
const fs = require('fs'), path = require('path');
const { ROOT, load } = require('./lib/data');
const { checkData, checkOutput, manualFor, MOBILE_DISPLAY_WIDTH } = require('./lib/checks');
const { imageSize, sha256 } = require('./lib/image');
const { render, makeSampleBase } = require('./lib/render');
const LAYOUTS = require('./layouts');

const TOOL = __dirname;
const DEFAULT_OUT = path.join(TOOL, 'output-preview');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');

// 출력은 게임 폴더(assets/)에 쓰지 않는다 — 증거 교체는 별도 승인 사항
function guardOut(dir) {
  const abs = path.resolve(dir), assets = path.join(ROOT, 'assets');
  if (abs === assets || abs.startsWith(assets + path.sep)) throw new Error('출력 폴더가 assets/ 안입니다. 게임 이미지 교체는 승인 후 수동으로 합니다.');
  return abs;
}
const args = process.argv.slice(2), cmd = args[0];
const opt = name => { const i = args.indexOf(name); return i > 0 ? args[i + 1] : undefined; };
const flag = name => args.includes(name);
const ids = (ctx, list) => { const bad = list.filter(i => !ctx.items[i]); if (bad.length) throw new Error('SPEC 데이터에 없는 ID: ' + bad.join(', ')); return list.length ? list : Object.keys(ctx.items); };

function printResults(title, res) {
  console.log(`\n■ ${title}`);
  for (const r of res) console.log(`  ${r.level.padEnd(4)} ${r.msg}`);
  return res.filter(r => r.level === 'FAIL').length;
}

function cmdCheck(ctx, list) {
  let fail = 0;
  console.log(`CANON: 등록번호 ${ctx.canon.registration} / NVR 오차 규칙 ${ctx.canon.offsets.length}개 / 녹음 ${ctx.canon.recording.start}~${ctx.canon.recording.end}`);
  for (const id of ids(ctx, list)) {
    if (!LAYOUTS[id]) { console.log(`\n■ ${id}\n  FAIL 배치(layouts.js)가 없음`); fail++; continue; }
    fail += printResults(`${id} (${ctx.items[id].template}, ${ctx.items[id].status})`, checkData(ctx.items[id], ctx));
  }
  console.log(fail ? `\n실패 ${fail}건` : '\n데이터 검사 통과');
  return fail;
}

function cmdRefs(ctx, list) {
  console.log('ID     | 상태 | 기존 이미지 (크기, sha256 앞 12자) | 참조 자료');
  for (const id of ids(ctx, list)) {
    const it = ctx.items[id], cur = path.join(ROOT, it.current);
    const curInfo = fs.existsSync(cur) ? (() => { const s = imageSize(cur); return `${it.current} (${s.width}×${s.height}, ${sha256(cur).slice(0, 12)})`; })() : `${it.current} (없음)`;
    const refs = (it.refs || []).map(r => (fs.existsSync(path.join(ROOT, r)) ? '' : '❌') + r).join(', ') || '—';
    console.log(`${id.padEnd(6)} | ${it.status} | ${curInfo} | ${refs}`);
  }
  return 0;
}

async function composeOne(ctx, id, base, outDir, o) {
  const item = ctx.items[id], pre = checkData(item, ctx);
  if (pre.some(r => r.level === 'FAIL')) { printResults(`${id} 데이터 검사`, pre); throw new Error(`${id}: 데이터 검사 실패로 합성하지 않음`); }
  if (String(item.status).startsWith('blocked') && !o.sample) throw new Error(`${id}: ${item.status} — 결정 전에는 완성본을 합성하지 않습니다(샘플만 가능).`);
  const outFile = path.join(outDir, o.sample ? `${id}.sample.webp` : path.basename(item.current));
  // --layout <키>: 같은 ID의 다른 바탕 그림용 배치(예: E15_v2)를 고른다. 없으면 ID 이름의 배치
  const layoutKey = o.layout || id;
  if (!LAYOUTS[layoutKey]) throw new Error(`배치 "${layoutKey}"가 layouts.js에 없습니다.`);
  const r = await render(item, LAYOUTS[layoutKey], ctx.common, { base, outFile, ...o });
  const res = [...pre, ...checkOutput(item, ctx, r)];
  return { id, item, r, res, manual: manualFor(item), fails: res.filter(x => x.level === 'FAIL').length };
}

function writePreview(outDir, results) {
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const cards = results.map(x => `<section><h2>${x.id} <small>${esc(x.item.template)} · ${esc(x.item.status)} · ${x.fails ? `<b class="bad">실패 ${x.fails}</b>` : '<b class="ok">자동 검사 통과</b>'}</small></h2>
<div class="row"><figure><img src="${path.basename(x.r.output)}"><figcaption>PC 표시</figcaption></figure>
<figure class="m"><img src="${path.basename(x.r.output)}"><figcaption>모바일 표시 폭 ${MOBILE_DISPLAY_WIDTH}px</figcaption></figure></div>
<details open><summary>자동 검사</summary><ul>${x.res.map(c => `<li class="${c.level}">${c.level} ${esc(c.msg)}</li>`).join('')}</ul></details>
<details open><summary>사람이 확인할 항목</summary><ul>${x.manual.map(m => `<li>☐ ${esc(m)}</li>`).join('')}</ul></details>
<p class="src">입력: ${esc(rel(x.r.base))} · 출력: ${esc(path.basename(x.r.output))}</p></section>`).join('');
  fs.writeFileSync(path.join(outDir, 'index.html'), `<!doctype html><meta charset="utf-8"><title>증거 합성 미리보기</title><style>
body{font:15px/1.5 "Malgun Gothic",sans-serif;background:#15171c;color:#e8e8e8;margin:0;padding:16px}h1{font-size:20px}h2{font-size:18px;margin:0 0 8px}small{font-weight:400;color:#aab}
section{background:#1e2128;border-radius:12px;padding:16px;margin:16px 0}.row{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}
figure{margin:0;flex:1 1 600px;max-width:900px}figure img{width:100%;border:1px solid #fff3;border-radius:8px}figure.m{flex:0 0 ${MOBILE_DISPLAY_WIDTH}px}
li.FAIL,.bad{color:#ff6b6b}li.WARN{color:#ffd166}.ok{color:#6bd68b}.src{color:#889;font-size:13px}</style>
<h1>증거 합성 미리보기 — 게임용 아님</h1><p>이 폴더의 파일은 Git·배포에 포함되지 않습니다(.gitignore). 게임 증거 교체는 별도 승인 후 진행합니다.</p>${cards}`);
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(results.map(x => ({ id: x.id, output: path.basename(x.r.output), fails: x.fails, checks: x.res, manual: x.manual, fonts: x.r.fonts })), null, 2));
}

async function main() {
  const ctx = load();
  if (cmd === 'check') return cmdCheck(ctx, args.slice(1));
  if (cmd === 'refs') return cmdRefs(ctx, args.slice(1));
  if (cmd === 'sample') {
    // 글자 배치 시안. 바탕은 임시 그림(나무 탁자 질감) 또는 기존 배경을 읽기 전용으로 씀 — 완성본이 아님
    // 기본: 유형별 3종(E10 보고서, E07 녹음, E03 NVR). ID를 주면 해당 ID만(예: sample C10 E10 C04 E07 E15)
    const outDir = guardOut(opt('--out') || DEFAULT_OUT), baseDir = path.join(outDir, '_sample-bases');
    const wood = path.join(baseDir, 'wood-table.png');
    await makeSampleBase(wood, [1448, 1086]);
    const bg = f => path.join(ROOT, 'assets', 'backgrounds', f);
    const BASES = {
      E10: [wood], E07: [wood], E15: [wood], C10: [bg('storage-room.webp')], C04: [bg('storage-room.webp')],
      E03: [bg('living.webp'), { drawClock: true, clock: { x: 395, y: 250, d: 150 } }], // 샘플 전용 시계 위치(실제 E03은 남쪽 벽)
      E02: [bg('living.webp')], E04a: [bg('living.webp')], E04d: [bg('living.webp')],
    };
    const want = args.slice(1).filter(a => !a.startsWith('--') && a !== opt('--out'));
    const jobs = ids(ctx, want.length ? want : ['E10', 'E07', 'E03']).map(id => [id, ...(BASES[id] || [wood]), {}].slice(0, 3));
    const results = [];
    for (const [id, base, o] of jobs) results.push(await composeOne(ctx, id, base, outDir, { sample: true, ...o }));
    for (const x of results) printResults(`${x.id} → ${rel(x.r.output)}`, x.res);
    writePreview(outDir, results);
    console.log(`\n미리보기: ${rel(path.join(outDir, 'index.html'))}`);
    return results.reduce((a, x) => a + x.fails, 0);
  }
  if (cmd === 'render') {
    const id = args[1], base = opt('--base');
    if (!id || !base) throw new Error('사용법: render <ID> --base <바탕 그림 PNG/WebP> [--out <폴더>]');
    ids(ctx, [id]);
    const outDir = guardOut(opt('--out') || DEFAULT_OUT);
    fs.mkdirSync(outDir, { recursive: true });
    const x = await composeOne(ctx, id, base, outDir, { sample: flag('--sample'), drawClock: flag('--draw-clock'), cctvFilter: flag('--cctv-filter'), layout: opt('--layout') });
    printResults(`${id} → ${rel(x.r.output)}`, x.res);
    writePreview(outDir, [x]);
    console.log('\n사람이 확인할 항목:\n' + x.manual.map(m => '  ☐ ' + m).join('\n'));
    return x.fails;
  }
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 7).join('\n').replace(/^\/\/ ?/gm, ''));
  return 1;
}

main().then(code => process.exit(code ? 1 : 0), e => { console.error('오류: ' + e.message); process.exit(1); });
