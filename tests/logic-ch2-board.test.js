// 챕터 2 추리 보드 검증 결과 로직 테스트(브라우저 불필요)
// P01·P02·P03 각각: 증거 미수집 / 수집했지만 미선택 / 일부만 선택 / 결론 미선택·오답 / 정답,
// 결과가 해당 문제 카드 안에만 표시되는지, 2개 해결 후 완료, 새로고침 복원, 저장 형식 유지
// 실행: node tests/logic-ch2-board.test.js
'use strict';
const { boot, reporter } = require('./lib/fake-dom');
const { KEYS } = require('./lib/saves');

const T = reporter('챕터 2 추리 보드 검증 결과'); const ok = T.ok;
const GUIDE = JSON.stringify({ ch1: true, ch2: true });
// 각 문제의 필수 증거·정답(스포일러) — chapter2.js PUZZLES 와 같아야 한다
const P = {
  P03: { req: ['ST-YUNA', 'E09'], correct: 'yuna', wrong: 'unsure', names: ['이유나의 첫 진술', '20:41 바비큐 사진'], places: '「인물」 탭의 대화, 거실',
    answerText: '이유나의 접촉 부인 진술과 사진이 모순된다' },
  P01: { req: ['E04a', 'E02', 'E01'], correct: 'offset7', wrong: 'different', names: ['22:12 단체 채팅 사진', '거실 CCTV 일부 영상', '오후 정전 영상'], places: '거실, 관리실, 관리실 또는 주방',
    answerText: '오후 정전 이후 CCTV 표시가 약 7분 느리다' },
  P02: { req: ['E08', 'E11'], correct: 'terrace', wrong: 'locked', names: ['서재 출입문 기록', '테라스 쪽 젖은 흔적'], places: '서재 문 앞',
    answerText: '서재와 이어진 테라스 쪽 경로를 조사해야 한다' },
};
const ALL_EVIDENCE = ['E04a', 'E09', 'ST-YUNA', 'E02', 'E01', 'E08', 'E11'];
const save = (evidence = [], solved = []) => ({ version: 1, name: '테스터', stage: 'investigate', room: 'living', reported: true, secured: true, evidence, solved, talked: [], asked: [], log: [] });
const CH2_SAVE_KEYS = ['version', 'name', 'stage', 'room', 'reported', 'secured', 'evidence', 'solved', 'talked', 'asked', 'log'].sort();

// 카드 id 별 HTML 조각
const cards = html => Object.fromEntries([...html.matchAll(/<section class="board-card[^"]*" id="card-(P0\d)">([\s\S]*?)<\/section>/g)].map(m => [m[1], m[2]]));
const resultOf = (html, id) => { const c = cards(html)[id] || ''; const m = c.match(/<div class="board-result ([a-z]+)"[^>]*>([^<]*)<\/div>/); return m ? { kind: m[1], text: m[2] } : null; };
const others = (html, id) => Object.entries(cards(html)).filter(([k]) => k !== id).filter(([, c]) => /board-result (missing|select|wrong)/.test(c)).map(([k]) => k);
const afterButton = (html, id) => { const c = cards(html)[id] || ''; return c.indexOf('data-action="solve"') > -1 && c.indexOf('board-result') > c.indexOf('data-action="solve"'); };

(async () => {
  for (const [id, p] of Object.entries(P)) {
    T.section(`${id}`);
    // 1) 필수 증거 미수집
    let g = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify(save()), 'gguhansung-fog-villa-guide-v1': GUIDE });
    await g.click('tab', 'board'); await g.click('solve', id);
    let r = resultOf(g.html(), id);
    ok(r && r.kind === 'missing' && afterButton(g.html(), id), `${id} 미수집: 해당 카드의 검증 버튼 바로 아래에 표시`);
    ok(r && p.names.every(n => r.text.includes(n)) && r.text.includes(`찾아볼 곳: ${p.places}`), `${id} 미수집: 부족한 증거 이름과 찾아볼 곳 안내`);
    ok(others(g.html(), id).length === 0, `${id} 미수집: 다른 문제 카드에는 메시지 없음`);
    ok(!g.save(KEYS.ch2).solved.includes(id), `${id} 미수집: 해결 처리 안 됨`);

    // 2) 수집 완료, 선택 안 함
    g = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify(save(ALL_EVIDENCE)), 'gguhansung-fog-villa-guide-v1': GUIDE });
    await g.click('tab', 'board');
    ok(g.html().includes('현재 선택한 자료(✓): <span class="muted">없음'), `${id}: 현재 선택한 자료 '없음' 표시`);
    await g.changeInput({ puzzle: id }, p.correct); await g.click('solve', id);
    r = resultOf(g.html(), id);
    ok(r && r.kind === 'select' && r.text.includes('모으는 것과 근거로 선택하는 것은 달라') && r.text.includes('✓'), `${id} 미선택: 수집과 선택이 다르다는 안내 + ✓ 표시 설명`);
    ok(others(g.html(), id).length === 0 && !g.save(KEYS.ch2).solved.includes(id), `${id} 미선택: 다른 카드 메시지 없음·해결 안 됨`);

    // 3) 일부만 선택
    await g.click('select-proof', p.req[0]);
    ok(g.html().includes(`현재 선택한 자료(✓): ${p.names[0]}`), `${id}: 선택한 자료 이름 표시`);
    await g.click('solve', id);
    r = resultOf(g.html(), id);
    ok(r && r.kind === 'select' && r.text.includes(`근거가 아직 ${p.req.length - 1}개 더 필요해`), `${id} 일부 선택: 부족한 개수 안내(${p.req.length - 1}개)`);

    // 4) 전부 선택, 결론 미선택 → 오답 → 다시 선택 (결론을 고르지 않은 새 문서에서 시작)
    let h = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify(save(ALL_EVIDENCE)), 'gguhansung-fog-villa-guide-v1': GUIDE });
    await h.click('tab', 'board'); for (const e of p.req) await h.click('select-proof', e); await h.click('solve', id);
    r = resultOf(h.html(), id);
    ok(r && r.kind === 'wrong' && r.text.includes('결론을 아직 고르지 않았어'), `${id} 결론 미선택: 결론 선택 안내`);
    await h.changeInput({ puzzle: id }, p.wrong); await h.click('solve', id);
    r = resultOf(h.html(), id);
    ok(r && r.kind === 'wrong' && r.text.includes('입증되지 않아') && r.text.includes('다른 결론'), `${id} 오답: 재검토 안내`);
    ok(r && !r.text.includes(p.answerText) && !Object.values(P).some(q => r.text.includes(q.answerText)), `${id} 오답: 정답 문구 노출 없음`);
    ok(!h.save(KEYS.ch2).solved.includes(id) && h.html().includes('선택한 증거로 검증'), `${id} 오답 후 다시 시도 가능`);

    // 5) 정답
    await h.changeInput({ puzzle: id }, p.correct); await h.click('solve', id);
    ok(h.save(KEYS.ch2).solved.includes(id) && h.html().includes(`추리 완료 · `), `${id} 정답: 해결 저장 + 기존 성공 대화창`);
    await h.click('close');
    const c = cards(h.html())[id];
    ok(/board-card solved/.test(h.html().match(new RegExp(`<section class="board-card[^"]*" id="card-${id}"`))[0]) && c.includes('board-result success') && c.includes('검증 완료'), `${id} 정답: 카드에 검증 완료 상태 표시`);
    ok(h.html().includes('현재 선택한 자료(✓): <span class="muted">없음'), `${id} 정답 후 증거 선택 초기화(기존 동작)`);
  }

  T.section('문제 간 메시지 분리·2개 해결 후 완료·새로고침');
  let g = boot('chapter2.js', { [KEYS.ch2]: JSON.stringify(save(ALL_EVIDENCE)), 'gguhansung-fog-villa-guide-v1': GUIDE });
  await g.click('tab', 'board');
  await g.click('solve', 'P01');
  ok(resultOf(g.html(), 'P01') && !resultOf(g.html(), 'P03') && !resultOf(g.html(), 'P02'), 'P01 메시지는 P01 카드에만');
  await g.click('solve', 'P02');
  ok(resultOf(g.html(), 'P02') && !resultOf(g.html(), 'P01'), '다른 문제를 검증하면 메시지가 그 카드로 이동(이전 메시지 제거)');
  for (const e of P.P03.req) await g.click('select-proof', e);
  await g.changeInput({ puzzle: 'P03' }, 'yuna'); await g.click('solve', 'P03'); await g.click('close');
  ok(g.html().includes('현재 1 / 3') || g.html().includes('추리 검증 1/3'), '1개 해결: 목표 1/3');
  ok(g.html().includes('data-action="conclude" disabled'), '1개 해결: 「기록 정리하기」 아직 잠김');
  for (const e of P.P02.req) await g.click('select-proof', e);
  await g.changeInput({ puzzle: 'P02' }, 'terrace'); await g.click('solve', 'P02'); await g.click('close');
  ok(g.save(KEYS.ch2).solved.length === 2 && g.html().includes('목표 달성'), '2개 해결: 목표 달성');
  const saved = g.storage[KEYS.ch2];
  const re = boot('chapter2.js', { [KEYS.ch2]: saved, 'gguhansung-fog-villa-guide-v1': GUIDE });
  await re.click('tab', 'board');
  ok(/board-card solved" id="card-P03"/.test(re.html()) && /board-card solved" id="card-P02"/.test(re.html()) && !/board-card solved" id="card-P01"/.test(re.html()), '새로고침 후 해결 상태 복원');
  await re.click('conclude');
  ok(re.html().includes('CHAPTER 02 COMPLETE') && re.save(KEYS.ch2).stage === 'complete', '2개 해결 후 「기록 정리하기」 → 챕터 2 완료');
  ok(JSON.stringify(Object.keys(JSON.parse(saved)).sort()) === JSON.stringify(CH2_SAVE_KEYS), '저장 형식 변경 없음(검증 메시지는 저장하지 않음)');

  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
