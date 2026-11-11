// 전체 테스트 실행: JS 문법 검사 → 로직 테스트 → 브라우저 테스트
// 실행: node tests/run-all.js            (전체)
//       node tests/run-all.js --no-browser (Chrome 없이 문법·로직 테스트만)
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const noBrowser = process.argv.includes('--no-browser');

const results = [];
const run = (label, args) => {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
  results.push([label, r.status === 0 ? 'PASS' : `FAIL(종료 코드 ${r.status})`]);
};

// 1) 문법 검사
const jsFiles = [...fs.readdirSync(ROOT).filter(f => f.endsWith('.js')), 'api/gemini-chat.js',
  ...['', 'lib', 'tools'].flatMap(d => fs.readdirSync(path.join(__dirname, d)).filter(f => f.endsWith('.js')).map(f => path.join('tests', d, f)))];
const bad = jsFiles.filter(f => spawnSync(process.execPath, ['--check', f], { cwd: ROOT, stdio: 'inherit' }).status !== 0);
console.log(`\n▶ JS 문법 검사: ${jsFiles.length}개 중 ${bad.length ? bad.length + '개 실패 → ' + bad.join(', ') : '모두 통과'}`);
results.push(['JS 문법 검사', bad.length ? 'FAIL' : 'PASS']);

// 2) 로직 테스트(브라우저 불필요)
run('로직 회귀(1차 수정)', ['tests/logic-regression.test.js']);
run('이미지 매핑·경로(2차 작업)', ['tests/logic-assets.test.js']);

// 3) 브라우저 테스트(Chrome/Edge 필요)
if (noBrowser) results.push(['브라우저 테스트', 'SKIP(--no-browser)']);
else {
  let chromeOk = true;
  try { require('./lib/browser').findChrome(); } catch (e) { chromeOk = false; console.log('\n▶ 브라우저 테스트 건너뜀: ' + e.message); results.push(['브라우저 테스트', 'SKIP(브라우저 없음)']); }
  if (chromeOk) {
    run('초상화 렌더링(PC·모바일)', ['tests/browser-portraits.test.js']);
    run('챕터 1~5 전체 플레이(PC·모바일)', ['tests/browser-playthrough.test.js']);
  }
}

console.log('\n================ 요약 ================');
for (const [l, s] of results) console.log(`${s.padEnd(18)} ${l}`);
process.exit(results.some(([, s]) => s.startsWith('FAIL')) ? 1 : 0);
