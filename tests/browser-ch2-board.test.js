// 챕터 2 추리 보드 검증 결과 화면 검사(실제 Chrome, 실제 마우스 클릭)
// PC 1365x900 / 낮은 PC 1365x640 / 태블릿 820 / 모바일 390 에서 P03·P01·P02 각각:
//  미수집 → (자료 수집) → 미선택 → 일부 선택 → 결론 오답 → 정답, 이후 2개 이상 해결로 챕터 완료.
// 검증 버튼을 누른 직후 결과가 '그 버튼 바로 아래·화면 안'에 보이는지, 다른 카드에 섞이지 않는지 확인한다.
// 실행: node tests/browser-ch2-board.test.js [--shots <폴더>]
'use strict';
const path = require('path');
const { startServer, launch, reporter, sleep } = require('./lib/browser');
const { KEYS } = require('./lib/saves');

const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const PZ = [ // 풀이 순서. 필수 증거·정답은 chapter2.js PUZZLES 와 같다(스포일러)
  { id: 'P03', req: ['ST-YUNA', 'E09'], correct: 'yuna', wrong: 'do' },
  { id: 'P01', req: ['E04a', 'E02', 'E01'], correct: 'offset7', wrong: 'fake' },
  { id: 'P02', req: ['E08', 'E11'], correct: 'terrace', wrong: 'forged' },
];
// 결과 메시지 위치 측정: 해당 카드 안, 검증 버튼 바로 아래, 화면 안
const RESULT = id => `(()=>{const card=document.getElementById('card-${id}');const btn=card&&card.querySelector('[data-action="solve"]');const res=card&&card.querySelector('.board-result');
  const others=[...document.querySelectorAll('.board-card')].filter(c=>c!==card&&c.querySelector('.board-result.missing,.board-result.select,.board-result.wrong')).map(c=>c.id);
  if(!res)return {found:false,others};const b=btn.getBoundingClientRect(),r=res.getBoundingClientRect(),c=card.getBoundingClientRect();
  return {found:true,kind:res.className.replace('board-result','').trim(),text:res.textContent,role:res.getAttribute('role'),below:r.top>=b.bottom-1&&r.top-b.bottom<24,inCard:r.bottom<=c.bottom+1,
    visible:r.top>=0&&r.bottom<=innerHeight,others,pos:\`버튼 \${b.top.toFixed(0)}~\${b.bottom.toFixed(0)} 결과 \${r.top.toFixed(0)}~\${r.bottom.toFixed(0)} 카드끝 \${c.bottom.toFixed(0)} 화면 \${innerHeight} 스크롤 \${scrollY.toFixed(0)}/\${(document.documentElement.scrollHeight-innerHeight).toFixed(0)}\`}})()`;

(async () => {
  const T = reporter('챕터 2 추리 보드 검증 결과(실제 클릭)');
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'pc-short', width: 1365, height: 640 }, { tag: 'tablet', width: 820, height: 1180, mobile: true }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const page = await launch(vp); const V = vp.tag;
    T.section(`${V} ${vp.width}x${vp.height}`);
    const shot = async n => { if (shotsDir) await page.shot(path.join(shotsDir, `${V}-${n}.png`)); };
    const verify = async (id, kind, label) => {
      await page.realClick(`#card-${id} [data-action="solve"]`);
      const r = await page.ev(RESULT(id));
      T.ok(r.found && r.kind === kind && r.role === 'status', `${V} ${id} ${label}: 결과 표시(${r.kind || '없음'})`);
      T.ok(r.found && r.below && r.inCard && r.visible, `${V} ${id} ${label}: 검증 버튼 바로 아래·화면 안에 보임` + (r.found && !(r.below && r.inCard && r.visible) ? ` [${r.pos}]` : ''));
      T.ok(r.others.length === 0, `${V} ${id} ${label}: 다른 문제 카드에 메시지 없음`);
      return r;
    };
    const radio = (id, v) => page.realClick(`label.board-option:has(input[data-puzzle="${id}"][value="${v}"])`);
    const tile = async id => { await page.realClick(`.action-tile[data-id="${id}"]`); await page.realClick('.modal [data-action="close"]'); };

    await page.setStorage(server.origin, { [KEYS.ch2]: { version: 1, name: '테스터', stage: 'investigate', room: 'living', reported: true, secured: true, evidence: [], solved: [], talked: [], asked: [], log: [] }, 'gguhansung-fog-villa-guide-v1': { ch1: true, ch2: true } });
    await page.go(server.origin + '/chapter2.html');
    await page.realClick('.segment [data-id="board"]');
    // 1) 필수 증거 미수집
    for (const p of PZ) {
      const r = await verify(p.id, 'missing', '증거 미수집');
      T.ok(/확보하지 못한 근거: .+ · 찾아볼 곳: .+/.test(r.text || ''), `${V} ${p.id} 증거 미수집: 부족한 증거·찾아볼 곳 안내`);
    }
    await shot('missing');
    // 자료 수집(실제 클릭): 거실 2개, 이유나 대화, 관리실 2개, 서재 문 앞 2개
    await tile('E04a'); await tile('E09');
    await page.realClick('.segment [data-id="people"]'); await page.realClick('.witness[data-id="이유나"]'); await page.drain();
    await page.realClick('.room[data-id="management"]'); await tile('E02'); await tile('E01');
    await page.realClick('.room[data-id="study"]'); await tile('E08'); await tile('E11');
    T.ok((await page.ev(`JSON.parse(localStorage.getItem('${KEYS.ch2}')).evidence.length`)) === 7, `${V}: 실제 클릭으로 근거 자료 7개 수집`);
    await page.realClick('.segment [data-id="board"]');

    for (const [i, p] of PZ.entries()) {
      // 2) 수집 완료, 선택하지 않음(결론은 정답을 골라 둠 — 증거 선택이 먼저 검사됨을 확인)
      await radio(p.id, p.correct);
      let r = await verify(p.id, 'select', '증거 미선택');
      T.ok(r.text && r.text.includes('✓'), `${V} ${p.id} 증거 미선택: ✓ 선택 방법 안내`);
      if (i === 0) await shot('not-selected');
      // 3) 일부만 선택
      await page.realClick(`.proof[data-id="${p.req[0]}"]`);
      T.ok(await page.ev(`document.querySelector('.board-selected').textContent.includes(document.querySelector('.proof[data-id="${p.req[0]}"]').textContent.replace('✓ ',''))`), `${V} ${p.id}: 현재 선택한 자료 표시`);
      r = await verify(p.id, 'select', '일부 선택');
      T.ok(r.text && r.text.includes(`${p.req.length - 1}개 더 필요해`), `${V} ${p.id} 일부 선택: 부족한 개수`);
      // 4) 필수 증거 모두 선택, 결론 오답
      for (const e of p.req.slice(1)) await page.realClick(`.proof[data-id="${e}"]`);
      await radio(p.id, p.wrong);
      r = await verify(p.id, 'wrong', '결론 오답');
      if (i === 0) await shot('wrong');
      // 5) 결론 정답
      await radio(p.id, p.correct);
      await page.realClick(`#card-${p.id} [data-action="solve"]`);
      T.ok(await page.ev(`!!document.querySelector('.modal')&&document.body.innerText.includes('추리 완료')`), `${V} ${p.id} 정답: 기존 성공 대화창`);
      await page.realClick('.modal [data-action="close"]');
      const s = await page.ev(`(()=>{const c=document.getElementById('card-${p.id}');return {solved:c.classList.contains('solved'),ok:!!c.querySelector('.board-result.success'),btn:c.querySelector('[data-action="solve"]').disabled,sel:document.querySelectorAll('.proof.selected').length}})()`);
      T.ok(s.solved && s.ok && s.btn && s.sel === 0, `${V} ${p.id} 정답: 카드 검증 완료 표시·버튼 잠김·증거 선택 초기화`);
      if (i === 0) await shot('solved');
      // 6) 검증 완료 후 다른 문제 진행 — 다음 반복에서 계속
      if (i === 1) {
        await page.reload(); await page.realClick('.segment [data-id="board"]');
        T.ok(await page.ev(`document.getElementById('card-P03').classList.contains('solved')&&document.getElementById('card-P01').classList.contains('solved')`), `${V}: 새로고침 후 해결 2개 복원`);
      }
    }
    // 7) 2개 이상 검증 후 챕터 완료
    await page.ev('window.scrollTo(0,0);1');
    await page.realClick('[data-action="conclude"]');
    T.ok((await page.text()).includes('CHAPTER 02 COMPLETE'), `${V}: 「기록 정리하기」 실제 클릭 → 챕터 2 완료`);
    T.ok(await page.noHScroll(), `${V}: 가로 스크롤 없음`);
    T.ok(page.problems.length === 0, `${V}: 콘솔 오류·404 없음` + (page.problems.length ? ' → ' + page.problems.join(' | ') : ''));
    await page.close();
  }
  await server.close();
  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
