// 챕터 3 진행 흐름 검사(실제 Chrome, 실제 마우스 클릭) — PC 1365 / 낮은 PC 1365x640 / 태블릿 820 / 모바일 390
// 1) 장소 이동 후 새 장소 정보가 화면에 들어오는지(챕터 2·3·4), 이미 보이면 스크롤하지 않는지
// 2) 조사 도구 버튼(인물 심문·증거 연결·시간표 조립)이 탭을 열고 그 내용이 화면에 보이는지, 선택 표시·터치 크기
// 3) 오세린 반박: 진술 미청취·E08 미확보·미선택 안내가 버튼 근처에 보이는지, 진술 아래에서 E08 선택 → 반박 → E07
// 4) P00: 챕터 2 P01 이어받음 안내 / 미완료 시 직접 풀기 / 이전 저장 호환
// 5) E03: 잠금 조건 표시 → P04·P05 후 획득 → 이미지·기록 탭 재열람
// 6) E04a·E04d 이미지 표시, 새로고침 복원, 이미지 404·콘솔 오류
// 실행: node tests/browser-ch3-flow.test.js [--shots <폴더>]
'use strict';
const path = require('path');
const { startServer, launch, reporter, sleep } = require('./lib/browser');
const { KEYS } = require('./lib/saves');

const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const GUIDE = { 'gguhansung-fog-villa-guide-v1': { ch1: true, ch2: true } };
const ch3 = (extra = {}) => ({ version: 1, name: '테스터', stage: 'investigate', room: 'living', evidence: [], solved: [], confronted: [], talked: [], timeline: {}, timelineDone: false, notes: [], asked: [], log: [], ...extra });
const ch2Done = (solved) => ({ version: 1, name: '테스터', stage: 'complete', room: 'living', reported: true, secured: true, evidence: ['E04a', 'E09', 'ST-YUNA', 'E02', 'E01', 'E08', 'E11'], solved, talked: [], asked: [], log: [] });

(async () => {
  const T = reporter('챕터 3 진행 흐름(실제 클릭)');
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'pc-short', width: 1365, height: 640 }, { tag: 'tablet', width: 820, height: 1180, mobile: true }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const page = await launch(vp); const V = vp.tag;
    const ok = (c, m) => T.ok(c, `${V} ${m}`);
    T.section(`${V} ${vp.width}x${vp.height}`);
    const shot = async n => { if (shotsDir) await page.shot(path.join(shotsDir, `${V}-${n}.png`)); };
    const txt = () => page.text();
    const inView = sel => page.ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;const r=e.getBoundingClientRect();return r.top>=0&&r.top<=innerHeight-60})()`);
    const save3 = () => page.ev(`JSON.parse(localStorage.getItem('${KEYS.ch3}'))`);

    // ── 1) 장소 이동 (챕터 2·3·4) ──
    const roomCases = [
      ['ch3', '/chapter3.html', { [KEYS.ch3]: ch3({ evidence: ['E01', 'E02', 'E04a', 'E08', 'E04b', 'E04c', 'E06', 'E05', 'E04d'], solved: ['P00'] }) }, 'data-action', 'board', ['kitchen', 'terrace', 'management']],
      ['ch2', '/chapter2.html', { [KEYS.ch2]: { version: 1, name: '테스터', stage: 'investigate', room: 'living', reported: true, secured: true, evidence: ['E04a', 'E09', 'ST-YUNA'], solved: [], talked: [], asked: [], log: [] } }, 'data-action', 'board', ['management', 'study']],
      ['ch4', '/chapter4.html', { [KEYS.ch4]: { version: 1, name: '테스터', stage: 'investigate', room: 'living', evidence: ['E09', 'E07', 'E08'], solved: [], talked: [], classified: {}, motiveDraft: {}, log: [], asked: [] } }, 'data-act', 'board', ['management', 'storage']],
    ];
    for (const [ch, file, st, attr, longTab, rooms] of roomCases) {
      await page.setStorage(server.origin, { ...st, ...GUIDE });
      await page.go(server.origin + file);
      await page.ev(`document.querySelector('.side [${attr}="tab"][data-id="${longTab}"]').click();1`); await sleep(150);
      for (const room of rooms) {
        // 장소 버튼이 화면에 보이는 범위에서 최대한 아래로 내린 상태(게시판을 읽던 중)에서 실제 클릭
        const pre = await page.ev(`(()=>{const b=document.querySelector('.room[data-id="${room}"]');const sticky=getComputedStyle(b.closest('.rail')).position==='sticky';
          window.scrollTo(0, sticky ? document.documentElement.scrollHeight : Math.max(0, scrollY + b.getBoundingClientRect().top - 20));
          // 모바일 가로 장소 목록: 사용자가 옆으로 밀어 버튼을 찾듯 가로로만 이동
          const nav=b.parentElement;if(nav.scrollWidth>nav.clientWidth)nav.scrollLeft=b.offsetLeft-nav.offsetLeft-20;return {y:scrollY,sticky}})()`);
        await page.realClick(`.room[data-id="${room}"]`, { noScroll: true });
        const post = await page.ev(`(()=>{const c=document.querySelector('.context').getBoundingClientRect(),a=document.querySelector('.action-grid').getBoundingClientRect();return {y:scrollY,ctx:c.top,tiles:a.top,tilesFit:a.top-c.top<innerHeight-80,vh:innerHeight,name:document.querySelector('.context h2').textContent}})()`);
        ok(post.ctx >= 0 && post.ctx <= post.vh - 60, `${ch} 장소 이동 → ${post.name}: 새 장소 제목이 화면에 보임 (스크롤 ${pre.y.toFixed(0)}→${post.y.toFixed(0)}, 제목 ${post.ctx.toFixed(0)}px)`);
        // 화면 높이가 제목~조사 카드를 함께 담을 수 있으면 조사 카드도 보여야 함
        ok(!post.tilesFit || post.tiles < post.vh, `${ch} 장소 이동 → ${post.name}: 조사 카드 ${post.tilesFit ? '화면에 보임' : '(낮은 화면이라 제목 아래로 이어짐)'} (${post.tiles.toFixed(0)}px)`);
        // 장소 목록이 내용 위에 있는 화면(태블릿·모바일): 위로 튀거나 맨 위로 초기화되지 않음(아래 조사 카드를 보여 주려 내려가는 것은 허용)
        if (!pre.sticky) ok(post.y >= pre.y - 1, `${ch} 장소 이동: 위로 튀거나 맨 위로 초기화되지 않음 (${pre.y.toFixed(0)}→${post.y.toFixed(0)})`);
      }
      // 이미 장소 정보가 보이는 상태에서는 스크롤하지 않음
      const y0 = await page.ev(`(()=>{const c=document.querySelector('.context');c.scrollIntoView({block:'start'});window.scrollBy(0,-12);return scrollY})()`);
      const roomVisible = await page.ev(`(()=>{const r=document.querySelector('.room[data-id="${rooms[0]}"]').getBoundingClientRect();return r.bottom>0&&r.top<innerHeight})()`);
      if (roomVisible) { await page.realClick(`.room[data-id="${rooms[0]}"]`, { noScroll: true }); ok(Math.abs((await page.ev('scrollY')) - y0) <= 1, `${ch} 장소 정보가 이미 보이면 스크롤 위치 유지`); }
    }

    // ── 2) 조사 도구 버튼 (챕터 3, 챕터 2·4 동일 구조) ──
    for (const [ch, file, st, attr, tabs] of [['ch3', '/chapter3.html', { [KEYS.ch3]: ch3({ evidence: ['E08'] }) }, 'data-action', [['people', '증언과 심문'], ['board', '증거 연결 보드'], ['timeline', '사건 시간표']]],
      ['ch2', '/chapter2.html', roomCases[1][2], 'data-action', [['board', '증거 연결 보드'], ['people', '대화와 진술']]],
      ['ch4', '/chapter4.html', roomCases[2][2], 'data-act', [['people', '인물과 대화'], ['board', '증거 연결 보드'], ['motives', '거짓말의 이유']]]]) {
      await page.setStorage(server.origin, { ...st, ...GUIDE });
      await page.go(server.origin + file);
      for (const [t, title] of tabs) {
        const sel = `.rail-bottom [${attr}="tab"][data-id="${t}"]`;
        await page.realClick(sel);
        const r = await page.ev(`(()=>{const s=document.querySelector('.side .card');const rr=s.getBoundingClientRect();const b=document.querySelector('${sel}');return {title:s.querySelector('h3').textContent,top:rr.top,vh:innerHeight,active:b.classList.contains('active')&&b.getAttribute('aria-pressed')==='true',h:b.getBoundingClientRect().height,others:[...document.querySelectorAll('.rail-bottom .btn.active')].length}})()`);
        ok(r.title === title && r.top >= 0 && r.top <= r.vh - 60, `${ch} 조사 도구 「${t}」: 「${r.title}」 탭이 열리고 화면에 보임 (${r.top.toFixed(0)}px)`);
        ok(r.active && r.others === 1, `${ch} 조사 도구 「${t}」: 선택된 버튼 표시`);
        if (vp.mobile) ok(r.h >= 44, `${ch} 조사 도구 「${t}」: 터치 크기 ${r.h.toFixed(0)}px ≥ 44px`);
      }
    }

    // ── 3) 오세린 반박: 챕터 2에서 E08을 가져온 경우 ──
    await page.setStorage(server.origin, { [KEYS.ch2]: ch2Done(['P01', 'P02']), ...GUIDE });
    await page.go(server.origin + '/chapter3.html');
    await page.realClick('[data-action="begin"]'); await page.drain();
    let s = await save3();
    ok(s.evidence.includes('E08') && s.solved.includes('P00') && s.p00FromCh2 === true, '챕터 2 증거(E08)·P01 결과 연결');
    await page.realClick('.rail-bottom [data-action="tab"][data-id="people"]');
    const nearBtn = async (needle) => page.ev(`(()=>{const n=document.querySelector('.puzzle-note');const b=document.querySelector('[data-action="confront"][data-id="SERIN"]');if(!n)return {ok:false};const nr=n.getBoundingClientRect(),br=b.getBoundingClientRect();
      return {ok:n.textContent.includes(${JSON.stringify(needle)}),near:nr.top>=br.bottom-1&&nr.top-br.bottom<260,vis:nr.top>=0&&nr.bottom<=innerHeight+1,text:n.textContent}})()`);
    await page.realClick('[data-action="confront"][data-id="SERIN"]');
    let n = await nearBtn('진술을 들어 봐');
    ok(n.ok && n.near, '반박: 진술 미청취 → 버튼 아래에 안내(토스트 아님)');
    await page.realClick('.witness[data-id="오세린"]'); await page.drain();
    await page.realClick('[data-action="confront"][data-id="SERIN"]');
    n = await nearBtn('서재 출입 기록(E08)을 먼저 확인하고 선택해');
    ok(n.ok && n.near, '반박: E08 미선택 → 버튼 아래에 선택 방법 안내');
    await shot('serin-not-selected');
    ok(await page.ev(`!!document.querySelector('.statement .confront-proofs .proof[data-id="E08"]')`), '반박: 오세린 진술 아래에 자료 선택 버튼 표시');
    await page.realClick('.statement .confront-proofs .proof[data-id="E08"]');
    ok(await page.ev(`document.querySelector('.statement .confront-proofs .proof[data-id="E08"]').classList.contains('selected')`), '반박: 진술 아래에서 E08 선택(✓)');
    await page.realClick('[data-action="confront"][data-id="SERIN"]');
    const lines = await page.drain();
    s = await save3();
    ok(s.confronted.includes('SERIN') && s.evidence.includes('E07') && lines.some(l => l.speaker === '오세린'), '반박 성공 → 오세린 인정 대사 + E07 면담 녹음 추가');
    ok(s.evidence.filter(x => x === 'E08').length === 1 && s.evidence.filter(x => x === 'E07').length === 1, 'E08·E07 중복 수집 없음');
    ok((await txt()).includes('오세린의 면담 녹음'), 'E07이 기록 탭에 표시');
    await page.reload();
    ok((await save3()).confronted.includes('SERIN'), '새로고침 후 반박 결과 유지');

    // ── 3b) E08을 챕터 3에서 직접 수집하는 경우 ──
    await page.setStorage(server.origin, { [KEYS.ch3]: ch3({ evidence: ['E01', 'E02', 'E04a'] }), ...GUIDE });
    await page.go(server.origin + '/chapter3.html');
    await page.realClick('.rail-bottom [data-action="tab"][data-id="people"]');
    await page.realClick('.witness[data-id="오세린"]'); await page.drain();
    await page.realClick('[data-action="confront"][data-id="SERIN"]');
    n = await nearBtn('아직 확보하지 못했어');
    ok(n.ok && n.near && n.text.includes('「복도」'), '반박: E08 미확보 → 획득 장소 안내');
    await page.realClick('.room[data-id="corridor"]'); await page.realClick('.action-tile[data-id="E08"]');
    ok(await page.ev(`(()=>{const i=document.querySelector('.modal-body img');return !!i&&i.getAttribute('src').endsWith('e08-study-access-log.webp')})()`), 'E08 직접 수집 → 증거 이미지');
    await page.realClick('.modal [data-action="close"]');
    await page.realClick('.rail-bottom [data-action="tab"][data-id="people"]');
    await page.realClick('.statement .confront-proofs .proof[data-id="E08"]');
    await page.realClick('[data-action="confront"][data-id="SERIN"]'); await page.drain();
    ok((await save3()).evidence.includes('E07'), '직접 수집한 E08로 반박 성공 → E07');

    // ── 4) P00 ──
    await page.setStorage(server.origin, { [KEYS.ch2]: ch2Done(['P01', 'P03']), ...GUIDE });
    await page.go(server.origin + '/chapter3.html'); await page.realClick('[data-action="begin"]'); await page.drain();
    await page.realClick('.rail-bottom [data-action="tab"][data-id="board"]');
    ok(await page.ev(`(()=>{const c=document.getElementById('card-P00');return c.textContent.includes('이어받았어')&&c.textContent.includes('완료')})()`), 'P00: 챕터 2 「두 시계」 해결 → 완료 + 이어받음 안내');
    await page.setStorage(server.origin, { [KEYS.ch2]: ch2Done(['P02', 'P03']), ...GUIDE });
    await page.go(server.origin + '/chapter3.html'); await page.realClick('[data-action="begin"]'); await page.drain();
    s = await save3();
    ok(!s.solved.includes('P00') && s.p00FromCh2 === false, 'P00: 챕터 2 P01 미해결 → 미완료로 시작');
    await page.realClick('.rail-bottom [data-action="tab"][data-id="board"]');
    for (const e of ['E01', 'E02', 'E04a']) await page.realClick(`.proof[data-id="${e}"]`);
    await page.realClick('label.board-option:has(input[data-answer="P00"][value="seven"])');
    await page.realClick('#card-P00 [data-action="solve"]'); await page.realClick('.modal [data-action="close"]');
    ok(await page.ev(`(()=>{const c=document.getElementById('card-P00');return c.textContent.includes('완료')&&!c.textContent.includes('이어받았어')})()`), 'P00: 챕터 3에서 직접 풀면 완료, 이어받음 안내 없음');
    await page.setStorage(server.origin, { [KEYS.ch3]: ch3({ evidence: ['E01', 'E02', 'E04a', 'E08'], solved: ['P00'] }), ...GUIDE }); // 이전 형식 저장(p00FromCh2 없음)
    await page.go(server.origin + '/chapter3.html'); await page.realClick('.rail-bottom [data-action="tab"][data-id="board"]');
    ok(await page.ev(`document.getElementById('card-P00').textContent.includes('이어받았어')`), 'P00: 이전 형식 저장도 이어받음 안내(호환)');

    // ── 5) E03 ──
    await page.setStorage(server.origin, { [KEYS.ch3]: ch3({ room: 'management', evidence: ['E01', 'E02', 'E04a', 'E08'], solved: ['P00', 'P04'] }), ...GUIDE });
    await page.go(server.origin + '/chapter3.html');
    const tile = await page.ev(`(()=>{const t=document.querySelector('.action-tile[data-id="E03"]');return {locked:t.classList.contains('locked'),text:t.textContent}})()`);
    ok(tile.locked && tile.text.includes('P04') && tile.text.includes('✓') && tile.text.includes('P05') && tile.text.includes('미완료'), `E03 잠김: 카드에 열림 조건·진행 상태 표시 (「${tile.text.replace(/\s+/g, ' ').slice(0, 60)}…」)`);
    await page.realClick('.action-tile[data-id="E03"]');
    ok((await txt()).includes('P05 「사건이 일어난 시간대」') && !(await save3()).evidence.includes('E03'), 'E03 잠김: 눌렀을 때 필요한 퍼즐 안내, 획득 안 됨');
    await shot('e03-locked');
    await page.setStorage(server.origin, { [KEYS.ch3]: ch3({ room: 'management', evidence: ['E01', 'E02', 'E04a', 'E08'], solved: ['P00', 'P04', 'P05'] }), ...GUIDE });
    await page.go(server.origin + '/chapter3.html');
    ok(!(await page.ev(`document.querySelector('.action-tile[data-id="E03"]').classList.contains('locked')`)), 'E03: P04·P05 완료 후 잠금 해제');
    await page.realClick('.action-tile[data-id="E03"]');
    ok(await page.ev(`(async()=>{const i=document.querySelector('.modal-body img');if(!i)return false;await i.decode().catch(()=>{});return i.naturalWidth>0&&i.getAttribute('src').endsWith('e03-nvr-wallclock-223413.webp')})()`), 'E03 획득 → NVR 벽시계 이미지 표시');
    await page.realClick('.modal [data-action="close"]');
    await page.reload();
    await page.realClick('.segment [data-id="records"]');
    await page.realClick('.record button[data-id="E03"]');
    ok(await page.ev(`(()=>{const i=document.querySelector('.modal-body img');return !!i&&i.getAttribute('src').endsWith('e03-nvr-wallclock-223413.webp')})()`), 'E03: 새로고침 후 기록 탭에서 다시 열람');
    await page.realClick('.modal [data-action="close"]');

    // ── 6) E04a·E04d 이미지 ──
    await page.setStorage(server.origin, { [KEYS.ch3]: ch3({ evidence: ['E01', 'E02', 'E08'] }), ...GUIDE });
    await page.go(server.origin + '/chapter3.html');
    const imgs = {};
    for (const id of ['E04a', 'E04d']) {
      await page.realClick(`.action-tile[data-id="${id}"]`);
      imgs[id] = await page.ev(`(async()=>{const i=document.querySelector('.modal-body img');if(!i)return null;await i.decode().catch(()=>{});return i.naturalWidth>0?i.getAttribute('src'):null})()`);
      await page.realClick('.modal [data-action="close"]');
    }
    ok(imgs.E04a && imgs.E04a.endsWith('e04a-group-photo-2212.webp') && imgs.E04d && imgs.E04d.endsWith('e04d-group-photo-2250.webp'), `E04a·E04d: 각자의 이미지 표시 (${imgs.E04a && imgs.E04a.split('/').pop()} / ${imgs.E04d && imgs.E04d.split('/').pop()})`);

    ok(await page.noHScroll(), '가로 스크롤 없음');
    ok(page.problems.length === 0, '콘솔 오류·이미지 404 없음' + (page.problems.length ? ' → ' + page.problems.join(' | ') : ''));
    await page.close();
  }
  await server.close();
  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
