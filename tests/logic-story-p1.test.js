// 스토리 1차 개선 검증(브라우저 불필요, 가짜 DOM에서 실제 챕터 스크립트 실행)
// - 챕터 2~4 정답 누설·설정 모순 문구 정리
// - 챕터 4 잠긴 자료의 잠금 이유 표시(잠금 판정 collect()와 표시 lockReason()이 같은 조건인지 대조)
// - 챕터 5 재구성 힌트(모바일에서 펼치는 힌트), 시간표 힌트
// - 챕터 5 BAD END: 충돌 영역 안내, 같은 답안 반복 제출 방지
// - 기존 저장 데이터(새 항목이 없는 이전 형식) 호환
// 실행: node tests/logic-story-p1.test.js
'use strict';
const fs = require('fs'), path = require('path');
const { boot, reporter, PROJECT_ROOT } = require('./lib/fake-dom');
const { KEYS: K, CH5, ch4Investigate, ch4Complete, ch5ReadyToClaim, ch5Ending } = require('./lib/saves');

const T = reporter('스토리 1차 개선·저장 호환'); const ok = T.ok;
const src = f => fs.readFileSync(path.join(PROJECT_ROOT, f), 'utf8');
const GUIDE = { 'gguhansung-fog-villa-guide-v1': JSON.stringify({ ch1: true, ch2: true }) };
const CH4_DONE = ch4Complete();
// 챕터 4 장소의 자료 타일 class 읽기
const tileClass = (g, id) => (g.html().match(new RegExp(`<button class="action-tile ([^"]*)" data-act="collect" data-id="${id}">`)) || [])[1];
const locked = (g, id) => /\blocked\b/.test(tileClass(g, id) || '');

async function ch5Submit(opts = {}) {
  const g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE) });
  await g.click('begin'); await g.drain();
  for (const [k, v] of Object.entries(CH5.timeline)) await g.change({ time: k }, v);
  await g.click('time-check'); await g.drain();
  await fill(g, opts);
  await g.click('submit'); await g.drain();
  return g;
}
async function fill(g, opts = {}) {
  for (const [k, v] of Object.entries({ ...CH5.slots, ...(opts.slots || {}) })) await g.change({ slot: k }, v);
  for (const [k, v] of Object.entries({ ...CH5.proofs, ...(opts.proofs || {}) })) await g.change({ proof: k }, v);
  for (const [k, v] of Object.entries({ ...CH5.secrets, ...(opts.secrets || {}) })) await g.change({ secret: k }, v);
}

(async () => {
  // ───────── 1. 정답 누설·설정 모순 문구 ─────────
  T.section('챕터 2~4 누설·모순 문구');
  const c2 = src('chapter2.js'), c3 = src('chapter3.js'), c4 = src('chapter4.js'), c5 = src('chapter5.js');
  ok(!c2.includes('7분 느렸나요'), 'CH2 질문창 예시가 P01 정답(7분)을 노출하지 않음');
  ok(!c2.includes('헤드랜턴을 보여주던 사람'), 'CH2 다뮤_ 대사가 헤드랜턴과 불빛을 직접 연결하지 않음');
  ok(!c2.includes('모두 큰 사고 없이 거실에 모였다'), 'CH2 22:44 장면: "모두 거실에 모였다"(S1) 삭제');
  ok(!c2.includes('23:34에 마스터키') && !c3.includes('관리인 마스터키'), '23:34 개방 열쇠 표기를 "비상키"로 통일');
  ok(!c3.includes('다른 사진으로 확인'), 'CH3 E03: 존재하지 않는 "다른 사진" 근거 삭제');
  ok(!c3.includes('누가 전기를 끈 것까지는'), 'CH3 박태성: 수동 차단(챕터 4 P09)을 미리 언급하지 않음');
  ok(!c4.includes('윤해준의 얼굴') && !c4.includes('유족이라는 사실만으로 오세린'), 'CH4 P08·P10 선택지에 인물 실명 누설 없음');
  ok(!c4.includes('일부 등록번호'), 'CH4 E10: 등록번호 전체 표시(공식 설정 D4)와 일치');
  ok(/'E06':\{[^}]*where:'주방/.test(c4), 'CH4 E06 위치: 주방(D14)');
  ok(!c4.includes('창밖 사람의 얼굴'), 'CH4 김옥독: E04b에 없는 "창밖 사람" 언급 삭제');
  ok(!c5.includes('거실 NVR 퇴장 장면'), 'CH5 시간표 힌트가 존재하지 않는 증거를 가리키지 않음');

  T.section('CH2 완료 문구: P03을 풀었을 때만 "거짓말이 밝혀졌다"');
  const ch2Done = solved => JSON.stringify({ version: 1, name: '테스터', stage: 'complete', room: 'living', reported: true, secured: true, evidence: ['E04a', 'E09', 'ST-YUNA', 'E02', 'E01', 'E08', 'E11'], solved, talked: [], asked: [], log: [] });
  let g = boot('chapter2.js', { [K.ch2]: ch2Done(['P01', 'P02']), ...GUIDE });
  ok(g.html().includes('기록 사이의 어긋남은 드러났지만') && !g.html().includes('거짓말은 밝혀졌지만'), 'P01·P02만 해결 → 거짓말 문구 없음');
  g = boot('chapter2.js', { [K.ch2]: ch2Done(['P01', 'P03']), ...GUIDE });
  ok(g.html().includes('누군가의 거짓말은 밝혀졌지만'), 'P03 해결 → 거짓말 문구 표시');
  ok(g.errors.length === 0, 'CH2 이전 형식 완료 저장 로드 오류 없음');

  // ───────── 2. 챕터 4 잠금 이유 ─────────
  T.section('CH4 잠긴 자료의 잠금 이유 표시 = 실제 잠금');
  const ch4 = extra => JSON.stringify(ch4Investigate(extra));
  // 아무것도 없음: 네 자료 모두 잠김 표시 + 실제로 획득 차단
  for (const [room, id] of [['living', 'E10'], ['management', 'E13'], ['basement', 'E14'], ['basement', 'C09']]) {
    g = boot('chapter4.js', { [K.ch4]: ch4({ room }) });
    const shown = locked(g, id);
    await g.click('collect', id);
    ok(shown && !g.save(K.ch4).evidence.includes(id), `${id}: 잠금 표시 + 획득 차단`);
  }
  g = boot('chapter4.js', { [K.ch4]: ch4({ room: 'living' }) });
  ok(g.html().includes('봉투 사진(E09) 미완료 · 이유나와 대화 미완료'), 'E10 잠금 이유에 남은 조건 표시');
  g = boot('chapter4.js', { [K.ch4]: ch4({ room: 'living', evidence: ['E09'] }) });
  ok(g.html().includes('봉투 사진(E09) ✓ · 이유나와 대화 미완료'), '조건 일부 충족 → ✓로 진행 상황 표시');
  // 조건을 갖추면 잠금 표시가 사라지고 실제로 획득됨
  const opened = [
    ['living', 'E10', { evidence: ['E09'], talked: ['이유나'] }],
    ['management', 'E13', { evidence: ['C07'], logAccess: true }],
    ['basement', 'E14', { evidence: ['C08', 'E11'], solved: ['P09'] }],
    ['basement', 'C09', { evidence: ['E14'] }],
  ];
  for (const [room, id, extra] of opened) {
    g = boot('chapter4.js', { [K.ch4]: ch4({ room, ...extra }) });
    const shown = locked(g, id);
    await g.click('collect', id);
    ok(!shown && g.save(K.ch4).evidence.includes(id), `${id}: 조건 충족 → 잠금 표시 없음 + 획득`);
  }
  // 경계: E14는 퍼즐(P08/P09) 미해결이면 잠김 유지
  g = boot('chapter4.js', { [K.ch4]: ch4({ room: 'basement', evidence: ['C08', 'E11'] }) });
  const e14Shown = locked(g, 'E14'); await g.click('collect', 'E14');
  ok(e14Shown && !g.save(K.ch4).evidence.includes('E14'), 'E14: 흔적만 있고 퍼즐 미해결 → 잠금 표시 + 차단');
  // 이미 가진 자료는 잠금 표시 없음(기존 저장 호환: E13을 이미 가진 이전 저장)
  g = boot('chapter4.js', { [K.ch4]: ch4({ room: 'management', evidence: ['E13'] }) });
  ok(!locked(g, 'E13') && /\bdone\b/.test(tileClass(g, 'E13')), '이미 확보한 자료는 잠금 없이 완료 표시');
  ok(g.errors.length === 0, 'CH4 이전 형식 진행 저장 로드 오류 없음');

  // ───────── 3. 챕터 5 힌트 ─────────
  T.section('CH5 재구성 힌트(모바일)');
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE), [K.ch5]: JSON.stringify(ch5ReadyToClaim()) });
  await g.click('tab', 'reconstruct');
  const hints = g.html().match(/<details class="slot-hint"><summary>힌트 보기<\/summary><p>[^<]+<\/p><\/details>/g) || [];
  ok(hints.length === 7, `재구성 7칸 모두 누르면 펼쳐지는 힌트 (${hints.length}개)`);
  ok(!/class="question-mark" title=/.test(g.html()), '마우스 오버 전용 툴팁 제거');
  ok((g.html().match(/data-slot="/g) || []).length === 7, '재구성 선택칸 7개 유지(data-slot)');

  // ───────── 4. BAD END 안내·반복 제출 방지 ─────────
  T.section('CH5 BAD END: 충돌 영역 안내');
  g = await ch5Submit({ slots: { culprit: 'serin' } });
  let s = g.save(K.ch5);
  ok(s.ending === 'bad' && s.attempts === 1, 'BAD END, 시도 1회');
  ok(g.html().includes('기록과 충돌한 영역') && g.html().includes('누가 (범인 지목)') && !g.html().includes('언제 (범행 시각'), '틀린 영역(누가)만 안내');
  ok(g.html().includes('범인은 공개되지 않아') && !g.html().includes('haejun'), '정답은 공개하지 않음');
  ok(Array.isArray(s.failedClaims) && s.failedClaims.length === 1, '실패한 답안 기록');

  T.section('CH5 같은 답안 반복 제출 방지');
  await g.click('retry');
  ok(g.save(K.ch5).stage === 'reconstruct' && g.save(K.ch5).slots.culprit === 'serin', '재시도: 입력 유지(기존 동작)');
  await g.click('submit'); await g.drain(); s = g.save(K.ch5);
  ok(s.stage === 'reconstruct' && !s.ending && s.attempts === 1 && g.html().includes('이미 기록과 충돌한다고 확인된 추리'), '같은 답안 → 제출 차단, 시도 횟수 그대로');
  await g.change({ slot: 'motive' }, 'sale'); await g.click('submit'); await g.drain();
  ok(g.save(K.ch5).stage === 'reconstruct' && g.save(K.ch5).attempts === 1, '판정에 쓰이지 않는 동기만 바꿔도 차단');
  await g.change({ slot: 'culprit' }, 'yuna'); await g.click('submit'); await g.drain(); s = g.save(K.ch5);
  ok(s.ending === 'bad' && s.attempts === 2 && s.failedClaims.length === 2, '다른 오답 → 새로 판정(BAD, 기록 2개)');
  await g.click('retry'); await g.change({ slot: 'culprit' }, 'haejun'); await g.change({ slot: 'motive' }, 'transfer');
  await g.click('submit'); await g.drain();
  ok(g.save(K.ch5).stage === 'rebuttal', '정답으로 고치면 반박 단계로 진행');

  T.section('CH5 BAD END: 근거·여러 영역');
  g = await ch5Submit({ slots: { when: 'after', method: 'fall' }, proofs: { clock: 'E06' } });
  const h = g.html();
  ok(g.save(K.ch5).ending === 'bad' && h.includes('언제 (범행 시각·알리바이)') && h.includes('어디서·어떻게') && h.includes('결정적 근거') && !h.includes('누가 (범인 지목)'), '틀린 영역만 묶어서 안내(언제·어떻게·근거)');

  // ───────── 5. 기존 저장 데이터 호환 ─────────
  T.section('기존 저장 데이터 호환(새 항목 failedClaims 없음)');
  const oldBad = { ...ch5Ending('bad'), stage: 'ending', timeline: { ...CH5.timeline }, slots: { ...CH5.slots, culprit: 'serin' }, proofs: { ...CH5.proofs }, secrets: { ...CH5.secrets } };
  delete oldBad.failedClaims;
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE), [K.ch5]: JSON.stringify(oldBad) });
  ok(g.html().includes('BAD END') && g.html().includes('누가 (범인 지목)'), '이전 BAD 저장: 충돌 영역을 현재 선택에서 계산해 표시');
  await g.click('retry'); s = g.save(K.ch5);
  ok(s.stage === 'reconstruct' && Array.isArray(s.failedClaims) && s.failedClaims.length === 1, '이전 BAD 저장 재시도 → 실패 답안 보충 기록');
  await g.click('submit'); await g.drain();
  ok(g.save(K.ch5).stage === 'reconstruct' && g.html().includes('이미 기록과 충돌한다고 확인된 추리'), '이전 BAD 저장도 같은 답안 반복 차단');
  ok(g.errors.length === 0, 'CH5 이전 BAD 저장 로드 오류 없음');

  const oldReady = ch5ReadyToClaim(); delete oldReady.failedClaims;
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE), [K.ch5]: JSON.stringify(oldReady) });
  await fill(g, { slots: { culprit: 'dosik' } }); await g.click('submit'); await g.drain();
  ok(g.save(K.ch5).ending === 'bad' && g.save(K.ch5).failedClaims.length === 1, '이전 진행 저장: 오답 제출 시 새 항목 생성');

  for (const end of ['true', 'normal']) {
    g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE), [K.ch5]: JSON.stringify({ ...ch5Ending(end), slots: { ...CH5.slots }, proofs: { ...CH5.proofs }, secrets: { ...CH5.secrets } }) });
    ok(g.html().includes(`${end.toUpperCase()} END`) && !g.html().includes('기록과 충돌한 영역') && g.errors.length === 0, `이전 ${end.toUpperCase()} 저장: 그대로 표시, 충돌 안내 없음`);
  }
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE) });
  ok(g.html().includes('마지막 추리 시작'), '챕터 4 완료 저장(이전 형식) → 챕터 5 진입 가능');

  T.section('챕터 5 시간표 근거 E17·E18 (2026-11-14)');
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE) });
  await g.click('begin'); await g.drain();
  ok(['E17', 'E18', 'E03', 'E16'].every(id => g.save(K.ch5).evidence.includes(id)), '새 게임: 챕터 5 시작 시 E17·E18 지급(E03·E16 기존 유지)');
  const c5now = src('chapter5.js');
  ok(c5now.includes("E17:'assets/evidence/e17-nvr-hallway-exit-2214.webp'") && c5now.includes("E18:'assets/evidence/e18-nvr-hallway-return-222813.webp'"), 'E17·E18 이미지 경로 연결');
  ok(['e17-nvr-hallway-exit-2214.webp', 'e18-nvr-hallway-return-222813.webp', 'e03-nvr-wallclock-223413.webp'].every(f => fs.existsSync(path.join(PROJECT_ROOT, 'assets', 'evidence', f))), 'E03·E17·E18 이미지 파일 존재');
  ok(/id:'left'[^}]*correct:'22:21'[^}]*E17/.test(c5now) && /id:'return'[^}]*correct:'22:55'[^}]*E18/.test(c5now), '시간표 힌트가 E17(이탈)·E18(복귀)을 가리키고 정답 22:21·22:55는 그대로');
  const legacy5 = JSON.parse(JSON.stringify(ch5ReadyToClaim())); legacy5.evidence = (legacy5.evidence || []).filter(id => id !== 'E17' && id !== 'E18');
  g = boot('chapter5.js', { [K.ch4]: JSON.stringify(CH4_DONE), [K.ch5]: JSON.stringify(legacy5) });
  await g.click('read', 'E18'); ok(g.html().includes('e18-nvr-hallway-return-222813.webp') && g.errors.length === 0, '예전 저장: E17·E18 보충 → E18 보기 시 이미지 표시');

  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
