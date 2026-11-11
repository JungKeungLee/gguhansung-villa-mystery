// 게임 로직 회귀 테스트(브라우저 불필요, 가짜 DOM에서 실제 챕터 스크립트 실행) — 1차 버그 수정 검증
// 실행: node tests/logic-regression.test.js
'use strict';
const { boot, reporter } = require('./lib/fake-dom');
const { KEYS: K, CH5, ch4Complete } = require('./lib/saves');

const T = reporter('로직 회귀(1차 수정)'); const ok = T.ok;
const CH4_DONE = ch4Complete();

async function ch5ToRebuttal(opts = {}) {
  const g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE) });
  await g.click('begin'); await g.drain();
  for (const [k, v] of Object.entries(CH5.timeline)) await g.change({ time: k }, v);
  await g.click('time-check'); await g.drain();
  for (const [k, v] of Object.entries({ ...CH5.slots, ...(opts.slots || {}) })) await g.change({ slot: k }, v);
  for (const [k, v] of Object.entries(CH5.proofs)) await g.change({ proof: k }, v);
  for (const [k, v] of Object.entries({ ...CH5.secrets, ...(opts.secrets || {}) })) await g.change({ secret: k }, v);
  await g.click('submit'); await g.drain();
  return g;
}
async function rebutAll(g, vals = CH5.rebuttals) {
  for (const [k, v] of Object.entries(vals)) await g.change({ rebut: k }, v);
  await g.click('rebut-check'); await g.drain();
}

(async () => {
  T.section('CH5 정상 진행 → TRUE END');
  let g = await ch5ToRebuttal();
  ok(g.save(K.ch5).stage === 'rebuttal', '올바른 추리 → 반박 단계');
  await rebutAll(g); ok(g.save(K.ch5).ending === 'true', '반박 3개 정답 + 동기/숨은진실 정답 → TRUE');

  T.section('CH5 동기 오답 → NORMAL END (기존 규칙 유지)');
  g = await ch5ToRebuttal({ slots: { motive: 'sale' } });
  ok(g.save(K.ch5).stage === 'rebuttal', '동기 오답이어도 반박 단계 진입');
  await rebutAll(g); ok(g.save(K.ch5).ending === 'normal', 'NORMAL');

  T.section('CH5 숨은 진실 오답 → NORMAL END');
  g = await ch5ToRebuttal({ secrets: { taesung: 'murder' } });
  await rebutAll(g); ok(g.save(K.ch5).ending === 'normal', 'NORMAL');

  T.section('CH5 범인 오답 제시 → BAD END');
  g = await ch5ToRebuttal({ slots: { culprit: 'serin' } });
  ok(g.save(K.ch5).ending === 'bad', 'BAD');
  await g.click('retry'); ok(g.save(K.ch5).stage === 'reconstruct' && g.save(K.ch5).slots.culprit === 'serin', 'BAD 후 재시도: 입력 유지');

  T.section('CH5 버그 재현: 반박 단계에서 범인 변경');
  g = await ch5ToRebuttal();
  await g.click('tab', 'reconstruct');
  ok(g.html().includes('여기서 답을 바꾸면 최종 추리를 다시 제시해야 해'), '재구성 탭에 경고 문구 표시');
  await g.change({ slot: 'culprit' }, 'serin');
  let s = g.save(K.ch5);
  ok(s.stage === 'reconstruct', '범인 변경 → 반박 단계 종료(reconstruct)');
  ok(g.html().includes('다시 검증받아야 해'), '재검증 안내 표시');
  await g.click('tab', 'rebuttal'); ok(!g.html().includes('PART 03 / CONTRADICTIONS'), '반박 탭 접근 불가');
  await rebutAll(g); ok(g.save(K.ch5).ending == null, 'rebut-check로 엔딩 도달 불가');
  await g.click('submit'); await g.drain(); ok(g.save(K.ch5).ending === 'bad', '변경된 오답으로 재제시 → BAD (기존 규칙)');

  T.section('CH5 반박 단계에서 증거·숨은진실 변경 후 올바르게 재제시');
  g = await ch5ToRebuttal();
  await g.change({ rebut: 'camera' }, 'E03');
  ok(g.save(K.ch5).stage === 'rebuttal', '반박 선택 변경은 단계 유지');
  await g.change({ proof: 'clock' }, 'E13'); ok(g.save(K.ch5).stage === 'reconstruct', '증거 변경 → 재검증 필요');
  await g.click('submit'); await g.drain(); ok(g.save(K.ch5).stage === 'rebuttal', '허용 증거(E13)로 재제시 → 반박 단계');
  ok(g.save(K.ch5).rebuttals.camera === 'E03', '이전 반박 선택은 유지');
  await g.change({ secret: 'serin' }, 'unknown'); ok(g.save(K.ch5).stage === 'reconstruct', '숨은 진실 변경 → 재검증 필요');
  await g.click('submit'); await g.drain(); await rebutAll(g); ok(g.save(K.ch5).ending === 'normal', '숨은 진실 변경 반영 → NORMAL');

  T.section('CH5 반박 오답');
  g = await ch5ToRebuttal(); await rebutAll(g, { ...CH5.rebuttals, camera: 'E06' });
  ok(g.save(K.ch5).stage === 'rebuttal' && !g.save(K.ch5).ending, '반박 오답 → 엔딩 없이 단계 유지');

  T.section('CH5 기존(버그 상태로 저장된) rebuttal 세이브 방어');
  const bad = { ...g.save(K.ch5), slots: { ...CH5.slots, culprit: 'yuna' }, rebuttals: { ...CH5.rebuttals } };
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE), [K.ch5]: JSON.stringify(bad) });
  ok(g.html().includes('PART 03 / CONTRADICTIONS'), '저장된 반박 단계 그대로 로드');
  await g.click('rebut-check'); s = g.save(K.ch5);
  ok(s.stage === 'reconstruct' && !s.ending, '잘못된 저장 상태 → 엔딩 대신 재검증 요구');

  T.section('CH5 진입 조건');
  g = boot('chapter5.js', {}); ok(g.html().includes('챕터 4부터 플레이'), 'CH4 미완료 → 잠김');

  T.section('CH1 완료 후 타이틀 버튼');
  g = boot('game.js', {});
  await g.click('start'); await g.drain();
  for (let i = 0; i < 4; i++) { await g.click('advance'); await g.drain(); }
  ok(g.save(K.ch1).phase === 'complete' && g.html().includes('CHAPTER 01 · COMPLETE'), '챕터 1 완료 화면');
  const before = g.storage[K.ch1];
  await g.click('home'); ok(g.html().includes('별장 여행에') && g.html().includes('기록 확인'), '타이틀 버튼 → 타이틀 화면');
  ok(g.storage[K.ch1] === before, '저장 기록 유지');
  await g.click('resume'); ok(g.html().includes('CHAPTER 01 · COMPLETE'), '기록 확인 → 완료 화면');
  await g.click('home'); await g.click('start');
  ok(g.html().includes('정말 처음부터 시작할까?') && g.storage[K.ch1] === before, '기록 있을 때 여행 시작 → 확인창, 기록 유지');
  await g.click('close'); ok(g.storage[K.ch1] === before, '취소 → 기록 유지');
  await g.click('chapter2'); ok(g.errors.length === 0, 'CH.02 버튼 동작(예외 없음)');
  g = boot('game.js', { [K.ch1]: before }); ok(g.html().includes('기록 확인'), '완료 세이브로 새로 로드 → 타이틀 표시');
  await g.click('confirm-reset'); await g.click('reset'); ok(!g.storage[K.ch1], '명시적 초기화만 기록 삭제');
  await g.click('start'); await g.drain(); ok(g.save(K.ch1)?.phase === 'day', '초기화 후 새 여행 시작');
  const mid = boot('game.js', { [K.ch1]: g.storage[K.ch1] });
  await mid.click('resume'); ok(mid.html().includes('EXPLORATION / 장소'), '진행 중 세이브 이어하기');

  T.section('CH1 단서 다시 보기 화면');
  g = boot('game.js', {});
  await g.click('start'); await g.drain();
  await g.click('interact', 'guest-list'); await g.drain();          // 처음 확인
  await g.click('interact', 'guest-list');                           // 다시 확인
  const revisit = [];
  for (let i = 0; i < 2; i++) { revisit.push(g.html()); await g.click('next'); }
  ok(revisit[1].includes('강석훈·박태성·최도식') && revisit[1].includes('dialogue-narration'), '다시 보기 단서 설명 → 내레이션 창');
  ok(revisit.every(h => !h.includes('speaker-emblem') && !h.includes('class="speaker-name"')), '다시 보기 화면에 플레이어 이름·원형 표시 없음');
  await g.click('talk-member', '꾸티뉴');
  let playerLine = '';
  for (let i = 0; i < 3; i++) { if (g.html().includes('<div class="speaker-name">여행 친구</div>')) playerLine = g.html(); await g.click('next'); }
  ok(playerLine.includes('speaker-emblem'), '플레이어 실제 대사(꾸티뉴 대화)는 기존 표시 유지');

  T.section('CH3 기록 탭 보기 이미지');
  const c3 = { version: 1, name: 't', stage: 'investigate', room: 'living', evidence: ['E08', 'E04a', 'ST-SERIN'], solved: [], confronted: [], talked: [], timeline: {}, timelineDone: false, notes: [], asked: [], log: [] };
  g = boot('chapter3.js', { [K.ch3]: JSON.stringify(c3) });
  await g.click('read', 'E08'); ok(g.html().includes('e08-study-access-log.webp'), 'E08 보기 → 이미지 표시');
  await g.click('close'); await g.click('read', 'E04a'); ok(g.html().includes('e04a-group-photo-2212.webp'), 'E04a 보기 → 이미지 표시');
  await g.click('close'); await g.click('read', 'ST-SERIN'); ok(g.html().includes('오세린의 처음 진술') && !g.html().includes('ch3-evidence-image'), '이미지 없는 증언은 텍스트만');
  await g.click('close'); await g.click('collect', 'E04b'); ok(g.html().includes('phone-video-blackout-2231.webp'), '수집 시 이미지(기존 동작)');

  T.section('CH4 E13 획득 순서');
  g = boot('chapter4.js', {}); await g.click('begin'); await g.drain();
  await g.click('talk', '최도식'); await g.drain();
  await g.click('collect', 'C07'); await g.click('close');
  await g.click('collect', 'E13');
  ok(!g.save(K.ch4).evidence.includes('E13') && g.html().includes('C07'), 'C07 전에 대화 → E13 차단');
  await g.click('talk', '최도식'); await g.drain();
  ok(g.save(K.ch4).logAccess === true, 'C07 후 최도식 대화 → 열람 허락');
  await g.click('collect', 'E13'); ok(g.save(K.ch4).evidence.includes('E13') && g.html().includes('e13-breaker-log.webp'), 'E13 획득');
  g = boot('chapter4.js', {}); await g.click('begin'); await g.drain();
  await g.click('collect', 'E13'); ok(!g.save(K.ch4).evidence.includes('E13'), '아무것도 안 함 → 차단');
  await g.click('collect', 'C07'); await g.click('close'); await g.click('collect', 'E13'); ok(!g.save(K.ch4).evidence.includes('E13'), 'C07만 → 차단');
  const legacy = { version: 1, stage: 'investigate', room: 'management', name: 't', evidence: ['C07', 'E13'], solved: [], talked: ['최도식'], classified: {}, motiveDraft: {}, log: [], asked: [] };
  g = boot('chapter4.js', { [K.ch4]: JSON.stringify(legacy) });
  await g.click('collect', 'E13'); ok(g.html().includes('분전반 독립 기록') && g.save(K.ch4).evidence.includes('E13'), '기존 E13 보유 세이브: 유지·열람 가능');
  await g.click('close'); await g.click('read', 'E13'); ok(g.html().includes('e13-breaker-log.webp'), '기록 탭 보기 정상');

  T.section('CH2 스모크');
  g = boot('chapter2.js', {}); await g.click('begin'); await g.drain(); ok(g.html().includes('BLACKOUT'), 'CH2 시작');

  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
