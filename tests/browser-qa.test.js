// 선택형 Q&A 검사(실제 Chrome 클릭) — PC 1365 / 모바일 390
// 1) 챕터 2 이유나: 첫 질문만 열림, 잠긴 질문 문구 비노출, 답변 대사·진술 획득, P03 전 추궁 잠김, 추궁→후속 해금, 새로고침 유지
// 2) 챕터 2 질문 노트: 자유 입력창 없음, 진행에 따라 답이 바뀜(P01 전후)
// 3) 챕터 3 오세린: 반박 전 잠김 → 반박 완료 후 열림 / 질문 노트
// 4) 챕터 4 최도식: C07 확보 후 추궁 → 기존 대화와 같은 로그 열람 허가(logAccess)
// 5) 예전 저장(자유 질문 기록 asked 포함) 그대로 열림, 기존 '대화하기'와의 호환
// 실행: node tests/browser-qa.test.js
'use strict';
const { startServer, launch, reporter } = require('./lib/browser');
const { KEYS } = require('./lib/saves');

const GUIDE = { 'gguhansung-fog-villa-guide-v1': { ch1: true, ch2: true } };
const base = (x = {}) => ({ version: 1, name: '테스터', stage: 'investigate', room: 'living', evidence: [], solved: [], talked: [], asked: [], log: [], ...x });
const ch3 = (x = {}) => base({ confronted: [], timeline: {}, timelineDone: false, notes: [], ...x });
const ch4 = (x = {}) => base({ room: 'management', classified: {}, motiveDraft: {}, ...x });

(async () => {
  const T = reporter('선택형 Q&A(챕터 2~4)');
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const p = await launch(vp); const V = vp.tag; const ok = (c, m) => T.ok(c, `${V} ${m}`);
    const open = () => p.ev(`[...document.querySelectorAll('.qa-box .qa-q')].map(b=>b.dataset.id)`);
    const bodyHas = t => p.ev(`document.body.innerText.includes(${JSON.stringify(t)})`);
    const line = () => p.ev(`(document.querySelector('.dialogue-text p,.dialogue-line p,.dialogue p')||{}).textContent||''`);
    const go = async (key, save, page, tabSel) => { await p.setStorage(server.origin, { [key]: save, ...GUIDE }); await p.go(server.origin + page); if (tabSel) await p.realClick(tabSel); };
    const sv = key => p.ev(`JSON.parse(localStorage.getItem('${key}'))`);

    T.section(`${V} 챕터 2 이유나`);
    await go(KEYS.ch2, base(), '/chapter2.html', '.segment [data-id="people"]');
    ok(JSON.stringify(await open()) === '["ch2-yuna-where"]', '처음엔 질문 1개만 열림');
    ok(!(await bodyHas('바비큐 사진을 보여 주며')) && (await bodyHas('부족한 질문 2개')), '잠긴 질문은 문구 없이 개수만');
    await p.realClick('.qa-q[data-id="ch2-yuna-where"]'); ok((await line()).includes('객실에 있었어요'), '질문 → 답변 대사'); await p.drain();
    let s = await sv(KEYS.ch2); ok(s.qa?.['ch2-yuna-where'] && s.evidence.includes('ST-YUNA') && s.talked.includes('이유나'), '물어봄 기록·진술 획득·대화 기록');
    await go(KEYS.ch2, base({ evidence: ['E09', 'ST-YUNA'] }), '/chapter2.html', '.segment [data-id="people"]');
    ok(!(await open()).includes('ch2-yuna-photo'), 'P03 검증 전 추궁 잠김(기존 진행 조건)');
    await go(KEYS.ch2, base({ evidence: ['E09', 'ST-YUNA'], solved: ['P03'] }), '/chapter2.html', '.segment [data-id="people"]');
    await p.realClick('.qa-q[data-id="ch2-yuna-photo"]'); ok((await line()).includes('봉투를 받은 건 사실'), '증거 제시 추궁 → 인정 대사'); await p.drain();
    ok((await open()).includes('ch2-yuna-envelope'), '추궁 후 후속 질문 해금');
    await p.go(server.origin + '/chapter2.html'); await p.realClick('.segment [data-id="people"]');
    ok(await p.ev(`!!document.querySelector('.qa-q.done[data-id="ch2-yuna-photo"]')`), '새로고침 후 ✓ 유지');
    s = await sv(KEYS.ch2); ok(JSON.stringify(s.solved) === '["P03"]' && s.evidence.length === 2, '정답·증거 목록 변화 없음');

    T.section(`${V} 챕터 2 질문 노트`);
    await go(KEYS.ch2, base({ asked: [{ q: '예전 자유 질문', answer: 'x', reason: 'y' }] }), '/chapter2.html', '.segment [data-id="questions"]');
    ok(!(await p.ev(`!!document.querySelector('#q,#ask-form,input[type=text]')`)), '자유 입력창 없음');
    ok((await p.ev(`document.querySelectorAll('[data-action="qa-note"]').length`)) === 8, '질문 노트 8개(기존 규칙 답변 이전)');
    await p.realClick('[data-action="qa-note"][data-id="ch2-n-clock"]');
    ok(await bodyHas('거실 단체 채팅 사진의 시간과 관리실 CCTV'), '진행 전: 기존 힌트 답');
    await go(KEYS.ch2, base({ solved: ['P01'], qa: { 'ch2-n-clock': true } }), '/chapter2.html', '.segment [data-id="questions"]');
    ok(await bodyHas('시간 오차의 단서가 확인됐어'), 'P01 검증 후: 확인된 답으로 바뀜');

    T.section(`${V} 챕터 3 오세린·질문 노트`);
    await go(KEYS.ch3, ch3(), '/chapter3.html', '.segment [data-id="people"]');
    ok(!(await open()).includes('ch3-serin-study') && (await open()).includes('ch3-serin-where'), '반박 전: 첫 질문만');
    await go(KEYS.ch3, ch3({ confronted: ['SERIN'], evidence: ['E08', 'ST-SERIN'] }), '/chapter3.html', '.segment [data-id="people"]');
    await p.realClick('.qa-q[data-id="ch3-serin-study"]'); ok((await line()).includes('서재에서 강 대표님을 만났어요'), '반박 후 추궁 → 인정 대사'); await p.drain();
    await p.realClick('.segment [data-id="ask"]'); await p.realClick('[data-action="qa-note"][data-id="ch3-n-serin"]');
    ok(await bodyHas('방문을 인정했어'), '질문 노트도 반박 결과 반영');

    T.section(`${V} 챕터 4 최도식`);
    await go(KEYS.ch4, ch4(), '/chapter4.html', '.segment [data-id="people"]');
    ok(!(await open()).includes('ch4-do-trace'), 'C07 전 추궁 잠김');
    await go(KEYS.ch4, ch4({ evidence: ['C07'] }), '/chapter4.html', '.segment [data-id="people"]');
    await p.realClick('.qa-q[data-id="ch4-do-trace"]'); ok((await line()).includes('졸았던 건 맞습니다'), 'C07 제시 → 인정 대사'); await p.drain();
    s = await sv(KEYS.ch4); ok(s.logAccess === true && s.qa?.['ch4-do-trace'], '기존 대화와 같은 로그 열람 허가 + 기록');
    await go(KEYS.ch4, ch4({ evidence: ['C07'] }), '/chapter4.html', '.segment [data-id="people"]');
    await p.realClick('.witness[data-id="최도식"]'); await p.drain(); s = await sv(KEYS.ch4);
    ok(s.logAccess === true && s.qa?.['ch4-do-trace'], "기존 '대화하기'도 같은 질문으로 기록");
    await p.close();
  }
  T.done(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
