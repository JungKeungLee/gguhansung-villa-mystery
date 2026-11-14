// 초보자 안내(게임 방법)·현재 목표 로직 테스트(브라우저 불필요) — 챕터 1·2
// 실행: node tests/logic-guide.test.js
'use strict';
const { boot, reporter } = require('./lib/fake-dom');
const { KEYS } = require('./lib/saves');

const T = reporter('초보자 안내(챕터 1·2)'); const ok = T.ok;
const GUIDE = 'gguhansung-fog-villa-guide-v1';
const guideOpen = g => g.html().includes('guide-modal');
const step = g => (g.html().match(/게임 방법 · (\d+) \/ (\d+)/) || []).slice(1).map(Number);
const CH1_SAVE_KEYS = ['version', 'name', 'phase', 'location', 'clues', 'talks', 'log', 'hintUses', 'startedAt', 'finishedAt'].sort();
const CH2_SAVE_KEYS = ['version', 'name', 'stage', 'room', 'reported', 'secured', 'evidence', 'solved', 'talked', 'asked', 'log', 'startedAt'].sort();
// 챕터 2 퍼즐 정답 선택지 문구(안내·힌트에 노출되면 안 됨)
const CH2_ANSWERS = ['이유나의 접촉 부인 진술과 사진이 모순된다', '오후 정전 이후 CCTV 표시가 약 7분 느리다', '서재와 이어진 테라스 쪽 경로를 조사해야 한다'];

(async () => {
  T.section('챕터 1 — 처음 시작');
  let g = boot('game.js', {});
  ok(!guideOpen(g), '타이틀 화면에서는 안내 없음');
  await g.click('start');
  ok(!guideOpen(g), '오프닝 대사 중에는 안내가 대사를 가리지 않음');
  await g.drain();
  ok(guideOpen(g) && step(g).join('/') === '1/5', '오프닝이 끝나면 안내 자동 표시(1/5)');
  ok(JSON.parse(g.storage[GUIDE]).ch1 === true, '안내 표시 기록(별도 키)');
  const texts = [];
  for (let i = 0; i < 5; i++) { texts.push(g.html()); if (i < 4) await g.click('guide-step', String(i + 1)); }
  ok(step(g).join('/') === '5/5' && g.html().includes('시작하기'), '다음 버튼으로 5단계까지 이동');
  const all = texts.join(' ');
  ok(['장소', '「?」', '대화', '「저녁 시간으로」', '게임 방법'].every(w => all.includes(w)), '장소 이동·조사·대화·시간 진행·다시 보기 안내 포함');
  ok(all.includes('꼭 해야 하는 조사는 없어요') && all.includes('추천일 뿐'), '선택 활동을 필수라고 안내하지 않음');
  ok(!/반드시|필수로/.test(all), '"반드시/필수로" 같은 표현 없음');
  await g.click('guide-step', '3'); ok(step(g).join('/') === '4/5', '단계 점(dot)으로 이동');
  await g.click('close'); ok(!guideOpen(g), '닫기');
  ok(g.html().includes('현재 목표 · 시간대 1 / 4') && g.html().includes('「저녁 시간으로」'), '현재 목표: 시간대·진행 버튼 이름 표시');
  ok(g.html().includes('선택 · 안 해도 진행 가능'), '둘러볼 거리에 "선택" 표시');
  await g.click('guide'); ok(guideOpen(g) && step(g)[0] === 1, '「게임 방법」으로 다시 열기');
  await g.click('close');
  await g.click('advance'); await g.drain();
  ok(!guideOpen(g) && g.html().includes('현재 목표 · 시간대 2 / 4') && g.html().includes('「밤으로 시간 보내기」'), '시간대가 바뀌면 목표 갱신, 안내 재표시 없음');
  ok(JSON.stringify(Object.keys(g.save(KEYS.ch1)).sort()) === JSON.stringify(CH1_SAVE_KEYS), '챕터 1 저장 형식 변경 없음');
  for (let i = 0; i < 3; i++) { await g.click('advance'); await g.drain(); }
  ok(g.html().includes('CHAPTER 01 · COMPLETE') && !guideOpen(g), '챕터 1 완료 흐름 유지');

  T.section('챕터 1 — 두 번째 이후·기존 저장');
  await g.click('confirm-reset'); await g.click('reset'); await g.click('start'); await g.drain();
  ok(!guideOpen(g), '안내를 이미 본 브라우저에서 새 게임 → 자동 표시 안 함');
  const midSave = g.storage[KEYS.ch1];
  let h = boot('game.js', { [KEYS.ch1]: midSave });
  await h.click('resume');
  ok(guideOpen(h), '안내를 본 적 없는 기존 진행 저장 → 이어하기 시 1회 표시');
  await h.click('close'); await h.click('home'); await h.click('resume');
  ok(!guideOpen(h), '같은 브라우저에서 다시 이어하기 → 표시 안 함');
  const done = { ...JSON.parse(midSave), phase: 'complete', finishedAt: 1 };
  h = boot('game.js', { [KEYS.ch1]: JSON.stringify(done) });
  await h.click('resume'); ok(!guideOpen(h) && h.html().includes('CHAPTER 01 · COMPLETE'), '완료 저장으로 기록 확인 → 안내 없음');

  T.section('챕터 2 — 사건 조사 시작');
  g = boot('chapter2.js', { [GUIDE]: JSON.stringify({ ch1: true }) });
  await g.click('begin'); await g.drain();
  ok(!guideOpen(g) && g.html().includes('현재 목표') && g.html().includes('「이후 이야기 확인」'), '정전 단계: 안내 없음, 목표에 다음 버튼 표시');
  await g.click('found'); await g.drain();
  ok(!guideOpen(g) && g.html().includes('「경찰에 신고하기」'), '발견 단계: 목표에 신고 안내');
  await g.click('report'); await g.click('report-choice', 'self'); await g.drain();
  ok(guideOpen(g) && step(g).join('/') === '1/5' && g.html().includes('사건 조사를 시작해요'), '조사 시작 시 안내 자동 표시');
  ok(JSON.parse(g.storage[GUIDE]).ch2 === true && JSON.parse(g.storage[GUIDE]).ch1 === true, '챕터 1 기록을 유지한 채 챕터 2 표시 기록');
  const t2 = [];
  for (let i = 0; i < 5; i++) { t2.push(g.html()); if (i < 4) await g.click('guide-step', String(i + 1)); }
  const all2 = t2.join(' ');
  ok(all2.includes('2개 이상') && all2.includes('「기록 정리하기」') && all2.includes('3개를 모두 풀지 않아도'), 'P01~P03 중 2개 이상이면 완료된다는 안내');
  ok(['장소 이동', '「자료」', '「인물」', '「추리」', '「선택한 증거로 검증」', '결론 하나', '찾아볼 곳'].every(w => all2.includes(w)), '장소 이동·자료 수집·인물·추리·검증·힌트 방법 안내');
  ok(CH2_ANSWERS.every(a => !all2.includes(a)), '안내에 퍼즐 정답 없음');
  await g.click('close'); ok(!guideOpen(g), '닫기');
  ok(g.html().includes('추리 문제 3개 중 2개 이상 검증하기 · 현재 0 / 3'), '현재 목표: 0/3');

  T.section('챕터 2 — 추리 보드 힌트');
  await g.click('tab', 'board');
  const board = g.html();
  ok(board.includes('근거 자료 0 / 2 확보 · 찾아볼 곳: 「인물」 탭의 대화, 거실'), 'P03: 확보 현황 + 찾아볼 곳(장소·대화)');
  ok(board.includes('근거 자료 0 / 3 확보 · 찾아볼 곳: 거실, 관리실, 관리실 또는 주방'), 'P01: 확보 현황 + 찾아볼 곳');
  ok(board.includes('자료 버튼') && board.includes('결론 하나'), '보드 사용 순서 안내');
  ok(CH2_ANSWERS.every(a => (board.match(new RegExp(a, 'g')) || []).length === 1), '힌트가 정답을 추가로 드러내지 않음(선택지 원문 1회만)');
  await g.click('solve', 'P03'); ok(g.html().includes('찾아볼 곳: 「인물」 탭의 대화, 거실'), '자료 없이 검증 → 찾아볼 곳 안내');
  await g.click('collect', 'E04a'); await g.click('close'); await g.click('collect', 'E09'); await g.click('close');
  ok(g.html().includes('근거 자료 1 / 2 확보 · 찾아볼 곳: 「인물」 탭의 대화'), '자료를 얻으면 현황 갱신');
  await g.click('talk', '이유나'); await g.drain();
  ok(g.html().includes('근거 자료 2 / 2 확보 · 자료 버튼에서 선택해 검증해 봐'), '모두 확보하면 다음 행동 안내');
  // qa = 선택형 Q&A 물어봄 기록(선택 항목, 예전 저장에는 없어도 됨)
  ok(JSON.stringify(Object.keys(g.save(KEYS.ch2)).filter(k => k !== 'qa').sort()) === JSON.stringify(CH2_SAVE_KEYS), '챕터 2 저장 형식 변경 없음(선택 항목 qa 제외)');
  await g.click('guide'); ok(guideOpen(g), '「게임 방법」으로 다시 열기'); await g.click('close');

  T.section('챕터 2 — 기존 저장');
  const inv = { version: 1, name: 't', stage: 'investigate', room: 'living', reported: true, secured: true, evidence: [], solved: ['P01', 'P02'], talked: [], asked: [], log: [] };
  h = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify(inv) });
  ok(guideOpen(h), '안내를 본 적 없는 조사 단계 저장 → 첫 진입 시 1회 표시');
  await h.click('close');
  ok(h.html().includes('목표 달성 · 추리 검증 2 / 3') && h.html().includes('goal-strip card done'), '2개 해결 저장 → 목표 달성 표시');
  h = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify(inv), [GUIDE]: JSON.stringify({ ch2: true }) });
  ok(!guideOpen(h), '안내를 본 저장 → 표시 안 함');
  h = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify({ ...inv, stage: 'blackout', solved: [] }) });
  ok(!guideOpen(h), '조사 전(정전) 단계 저장 → 표시 안 함');
  h = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify({ ...inv, stage: 'complete' }) });
  ok(!guideOpen(h) && h.html().includes('CHAPTER 02 COMPLETE'), '완료 저장 → 안내 없이 완료 화면');

  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
