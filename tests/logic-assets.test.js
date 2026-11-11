// 이미지 매핑·경로 테스트(브라우저 불필요) — 2차 작업 검증
// 외부인 초상화, 관리실 배경, 챕터 5 엔딩 이미지 구조, 참조 이미지 경로의 존재·대소문자 정확 일치
// 실행: node tests/logic-assets.test.js
'use strict';
const fs = require('fs'), path = require('path');
const { PROJECT_ROOT: ROOT, boot, reporter, seenAssets } = require('./lib/fake-dom');
const { KEYS, ch5Ending } = require('./lib/saves');

const T = reporter('이미지 매핑·경로(2차 작업)'); const ok = T.ok;
const imgOf = (shots, who) => shots.filter(s => s[0] === who).map(s => s[1]);

(async () => {
  T.section('CH2 외부인 초상화');
  let g = boot('chapter2.js', {});
  await g.click('begin'); await g.drain(); await g.click('found'); await g.drain(); await g.click('report-choice', 'self');
  let shots = await g.drain();
  ok(imgOf(shots, '이유나')[0] === 'assets/characters/lee-yuna/normal.webp', '신고 장면 이유나 → lee-yuna/normal');
  ok(imgOf(shots, '장도윤')[0] === 'assets/characters/jang-doyun/normal.webp', '신고 장면 장도윤 → jang-doyun/normal');
  ok(imgOf(shots, '윤해준')[0] === 'assets/characters/yoon-haejun/normal.webp', '신고 장면 윤해준 → yoon-haejun/normal');
  ok(imgOf(shots, '박태성')[0] === 'assets/characters/guests/taesung.webp' && imgOf(shots, '오세린')[0] === 'assets/characters/guests/serin.webp' && imgOf(shots, '최도식')[0] === 'assets/characters/guests/dosik.webp', '기존 guests 3명 유지');
  ok(imgOf(shots, '꾸티뉴')[0] === 'assets/characters/kkutinyu/night.webp', '멤버 표정(night) 유지');
  await g.click('tab', 'people');
  const h2 = g.html();
  ok(['lee-yuna', 'jang-doyun', 'yoon-haejun'].every(p => h2.includes(`assets/characters/${p}/normal.webp`)), '인물 탭 외부인 3명 이미지 표시');
  ok(!/<span aria-hidden="true">◈<\/span><span><strong>(이유나|장도윤|윤해준)/.test(h2), '외부인 자리표시(◈) 사라짐');
  ok(h2.includes('assets/characters/damyu/normal.webp') && h2.includes('assets/characters/guests/dosik.webp'), '멤버·guests 인물 탭 유지');
  await g.click('talk', '윤해준'); shots = await g.drain(); ok(imgOf(shots, '윤해준')[0] === 'assets/characters/yoon-haejun/normal.webp', '윤해준 대화 이미지');
  await g.click('talk', '야무지'); shots = await g.drain(); ok(imgOf(shots, '야무지')[0] === 'assets/characters/yamuji/night.webp', '야무지 대화 이미지 유지');

  T.section('CH2 배경');
  const bgOf = async (env, r) => { await env.click('room', r); return (env.html().match(/<img src="assets\/backgrounds\/([^"]+)" alt/) || [])[1]; };
  ok(await bgOf(g, 'management') === 'management.webp', '관리실 → management.webp');
  ok(await bgOf(g, 'corridor') === 'corridor.webp', '1층 복도 → corridor.webp 유지');
  ok(await bgOf(g, 'study') === 'corridor.webp', '서재 문 앞 → corridor.webp 유지');
  ok(await bgOf(g, 'living') === 'living.webp' && await bgOf(g, 'kitchen') === 'kitchen.webp' && await bgOf(g, 'terrace') === 'terrace.webp', '거실·주방·테라스 유지');

  T.section('CH3 외부인 초상화·배경');
  g = boot('chapter3.js', {});
  await g.click('begin'); shots = await g.drain();
  ok(imgOf(shots, '장도윤')[0] === 'assets/characters/jang-doyun/night.webp', '도입 장도윤 → jang-doyun/night');
  ok(imgOf(shots, '오세린')[0] === 'assets/characters/guests/serin.webp', '오세린 guests 유지');
  await g.click('tab', 'people');
  const h3 = g.html();
  ok(['lee-yuna', 'jang-doyun', 'yoon-haejun'].every(p => h3.includes(`assets/characters/${p}/night.webp`)), '심문 탭 외부인 3명 이미지');
  ok(h3.includes('assets/characters/kkutinyu/night.webp') && h3.includes('assets/characters/guests/taesung.webp'), '멤버·guests 심문 탭 유지');
  await g.click('talk', '윤해준'); shots = await g.drain(); ok(shots.length === 2 && shots.every(s => s[1] === 'assets/characters/yoon-haejun/night.webp'), '윤해준 2줄 대화 이미지');
  await g.click('talk', '이유나'); shots = await g.drain(); ok(imgOf(shots, '이유나')[0] === 'assets/characters/lee-yuna/night.webp', '이유나 대화 이미지');
  ok(await bgOf(g, 'management') === 'management.webp', '관리실 → management.webp');
  ok(await bgOf(g, 'corridor') === 'corridor.webp', '복도(서재 앞 경계선) → corridor.webp 유지');

  T.section('CH5 엔딩 이미지 구조');
  for (const [end, title, word] of [['true', 'TRUE END', '자동차'], ['normal', 'NORMAL END', '고민'], ['bad', 'BAD END', '좌절']]) {
    g = boot('chapter5.js', { [KEYS.ch5]: JSON.stringify(ch5Ending(end)) });
    const h = g.html();
    ok(h.includes(`finish-card ch5-finish ${end}`) && h.includes(title), `${title}: ch5-finish ${end} 클래스`);
    ok(new RegExp(`class="finish-art" role="img" aria-label="[^"]*${word}`).test(h), `${title}: 장면 설명(aria-label)`);
  }
  const css = fs.readFileSync(path.join(ROOT, 'chapter5.css'), 'utf8');
  for (const e of ['true', 'bad', 'normal']) ok(css.includes(`.ch5 .ch5-finish.${e} .finish-art{background-image:url('assets/backgrounds/ch5-${e}-ending.webp')}`), `CSS ${e} → ch5-${e}-ending.webp`);

  T.section('이미지 파일 검사');
  const files = new Set();
  (function walk(d) { for (const n of fs.readdirSync(path.join(ROOT, d))) { const r = d + '/' + n; fs.statSync(path.join(ROOT, r)).isDirectory() ? walk(r) : files.add(r); } })('assets');
  for (const e of ['true', 'bad', 'normal']) {
    const f = `assets/backgrounds/ch5-${e}-ending.webp`, b = fs.existsSync(path.join(ROOT, f)) && fs.readFileSync(path.join(ROOT, f));
    ok(files.has(f) && b && b.slice(0, 4) + '' === 'RIFF' && b.slice(8, 12) + '' === 'WEBP', `${f} 존재·WebP 형식`);
  }
  for (const p of ['lee-yuna', 'jang-doyun', 'yoon-haejun']) for (const v of ['normal', 'night', 'surprised']) ok(files.has(`assets/characters/${p}/${v}.webp`), `${p}/${v}.webp 존재`);
  ok(files.has('assets/backgrounds/management.webp'), 'management.webp 존재');

  T.section('이미지 경로·대소문자 정확 일치 검사 (Linux/Vercel 기준)');
  const refs = new Set(seenAssets);
  for (const f of fs.readdirSync(ROOT).filter(f => /\.(js|css|html)$/.test(f))) {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/assets\/[A-Za-z0-9_./-]+\.webp/g)) refs.add(m[0]);
    for (const m of t.matchAll(/bg:'([^']+\.webp)'/g)) refs.add('assets/backgrounds/' + m[1]);
    for (const m of t.matchAll(/\['([a-z0-9-]+\.webp)',/g)) refs.add('assets/backgrounds/' + m[1]);
    for (const m of t.matchAll(/bg\('([^']+)'/g)) refs.add('assets/backgrounds/' + m[1] + '.webp');
    for (const m of t.matchAll(/bg\(state\.stage==='rebuttal'\?'([^']+)':'([^']+)'\)/g)) { refs.add('assets/backgrounds/' + m[1] + '.webp'); refs.add('assets/backgrounds/' + m[2] + '.webp'); }
    // CSS 속성 선택자 [src$="/lee-yuna/night.webp"] 같은 경로 조각도 실제 파일과 대조
    for (const m of t.matchAll(/\[src\$="\/([a-z-]+\/[a-z]+\.webp)"\]/g)) refs.add('assets/characters/' + m[1]);
  }
  const members = ['kkutinyu', 'nanwoni', 'kimokdok', 'manjo', 'yappu', 'moya', 'harunotsuki', 'yuntami', 'yamuji', 'damyu'];
  for (const m of members) for (const v of ['normal', 'surprised', 'night', 'avatar']) refs.add(`assets/characters/${m}/${v}.webp`);
  const bad = [...refs].filter(r => !files.has(r));
  ok(bad.length === 0, `참조 경로 ${refs.size}개 모두 실제 파일과 대소문자까지 일치` + (bad.length ? ' → ' + bad.join(', ') : ''));
  const ci = [...refs].filter(r => !files.has(r) && [...files].some(f => f.toLowerCase() === r.toLowerCase()));
  ok(ci.length === 0, '대소문자만 다른 경로 없음');

  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
