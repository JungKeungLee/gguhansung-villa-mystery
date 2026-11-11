// 초보자 안내 화면 검사(실제 Chrome, PC 1365px / 모바일 390px) — 챕터 1·2
// - 안내창이 화면 안에 들어오고 읽기 쉬운지(글자 크기·버튼 크기·가로 넘침)
// - 실제 마우스 입력·Esc 키로 닫히는지, 닫은 뒤 핫스팟·장면 버튼이 정상 클릭되는지
// - 현재 목표가 스크롤 없이 보이는지
// 실행: node tests/browser-guide.test.js [--shots <폴더>]
'use strict';
const path = require('path');
const { startServer, launch, reporter } = require('./lib/browser');
const { KEYS } = require('./lib/saves');

const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const READ = `(()=>{const m=document.querySelector('.guide-modal');if(!m)return null;const r=m.getBoundingClientRect();
  const body=m.querySelector('.guide-body');const fs=parseFloat(getComputedStyle(body).fontSize);
  const btns=[...m.querySelectorAll('.guide-footer .btn')].map(b=>b.getBoundingClientRect().height);
  return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,vw:innerWidth,vh:innerHeight,fs,minBtn:Math.min(...btns),
    hOverflow:m.scrollWidth>m.clientWidth+1,scrollable:m.scrollHeight<=m.clientHeight+1||getComputedStyle(m).overflowY!=='visible'||getComputedStyle(m.closest('.modal')||m).overflowY!=='visible',
    title:m.querySelector('h2,h3').textContent,step:m.querySelector('.eyebrow').textContent}})()`;

(async () => {
  const T = reporter('초보자 안내 화면');
  const server = await startServer();
  for (const vp of [{ name: 'PC', tag: 'pc', width: 1365, height: 900 }, { name: '모바일', tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const page = await launch(vp);
    const V = vp.name;
    const shot = async n => { if (shotsDir) await page.shot(path.join(shotsDir, `${vp.tag}-${n}.png`)); };
    const checkAllSteps = async (label, n) => {
      for (let i = 0; i < n; i++) {
        const m = await page.ev(READ);
        T.ok(m && m.top >= 0 && m.bottom <= m.vh + 0.5 && m.left >= 0 && m.right <= m.vw + 0.5, `${V} ${label} ${i + 1}/${n} 「${m && m.title}」: 화면 안에 표시`);
        T.ok(m.fs >= 14 && m.minBtn >= 34 && !m.hOverflow && m.scrollable, `${V} ${label} ${i + 1}/${n}: 글자 ${m.fs}px·버튼 높이 ${m.minBtn.toFixed(0)}px·가로 넘침 없음·긴 내용 스크롤 가능`);
        if (i === 0 || i === n - 1) await shot(`${label === 'CH1 안내' ? 'ch1' : 'ch2'}-guide-${i + 1}`);
        if (i < n - 1) await page.realClick('.guide-nav .btn-primary');
      }
    };

    // ── 챕터 1 ──
    T.section(`${V} · 챕터 1`);
    await page.go(server.origin + '/index.html'); await page.ev('localStorage.clear();1'); await page.reload();
    await page.ev(`(()=>{const i=document.getElementById('nickname');i.value='안내테스트';i.dispatchEvent(new Event('input',{bubbles:true}));return 1})()`);
    await page.realClick('[data-action="start"]'); await page.drain();
    T.ok(!!(await page.ev(READ)), `${V} CH1: 첫 시작 후 안내 자동 표시`);
    await checkAllSteps('CH1 안내', 5);
    await page.realClick('.guide-nav .btn-primary'); // 마지막 「시작하기」
    T.ok(!(await page.ev(READ)), `${V} CH1: 마지막 단계 「시작하기」(실제 클릭)로 닫힘`);
    await page.realClick('.goal-help'); T.ok(!!(await page.ev(READ)), `${V} CH1: 현재 목표의 「게임 방법」(실제 클릭)으로 다시 열림`);
    await page.key('Escape'); T.ok(!(await page.ev(READ)), `${V} CH1: Esc 키로 닫힘`);
    await page.realClick('.goal-help'); await page.realClick('.guide-modal [aria-label="안내 닫기"]');
    T.ok(!(await page.ev(READ)), `${V} CH1: ✕ 버튼으로 닫힘`);
    const goal = await page.ev(`(()=>{window.scrollTo(0,0);const r=document.querySelector('.goal-bar').getBoundingClientRect();return {top:r.top,bottom:r.bottom,vh:innerHeight,text:document.querySelector('.goal-bar').innerText}})()`);
    T.ok(goal.bottom <= goal.vh && goal.text.includes('「저녁 시간으로」'), `${V} CH1: 현재 목표가 스크롤 없이 보임 (위치 ${goal.top.toFixed(0)}~${goal.bottom.toFixed(0)}px)`);
    await shot('ch1-goal');
    // 닫은 뒤 실제 클릭: 장면 속 핫스팟 → 장소 이동 → 장면 속 친구 버튼
    await page.realClick('.scene-frame .hotspot[data-action="interact"][data-id="view"]');
    T.ok(await page.ev(`!!document.querySelector('.dialogue')`) && (await page.text()).includes('안개'), `${V} CH1: 핫스팟 실제 클릭 → 조사 대사`);
    await page.drain();
    await page.realClick('.scene-frame .hotspot[data-action="loc"]');
    T.ok((await page.ev(`JSON.parse(localStorage.getItem('${KEYS.ch1}')).location`)) === 'foyer', `${V} CH1: 장면 속 「별장 안으로」 실제 클릭 → 현관 이동`);
    await page.realClick('.scene-person');
    T.ok(await page.ev(`!!document.querySelector('.dialogue .char-portrait')`), `${V} CH1: 장면 속 친구 버튼 실제 클릭 → 초상화 대화`);
    await page.drain();
    T.ok(await page.noHScroll(), `${V} CH1: 가로 스크롤 없음`);

    // ── 챕터 2 (조사 단계 저장으로 진입, 안내를 본 적 없는 상태) ──
    T.section(`${V} · 챕터 2`);
    await page.setStorage(server.origin, { [KEYS.ch2]: { version: 1, name: '안내테스트', stage: 'investigate', room: 'living', reported: true, secured: true, evidence: [], solved: [], talked: [], asked: [], log: [] } });
    await page.go(server.origin + '/chapter2.html');
    T.ok(!!(await page.ev(READ)), `${V} CH2: 조사 단계 첫 진입 시 안내 자동 표시`);
    await checkAllSteps('CH2 안내', 5);
    await page.realClick('.guide-nav .btn-primary'); // 「조사 시작」
    T.ok(!(await page.ev(READ)), `${V} CH2: 「조사 시작」(실제 클릭)으로 닫힘`);
    const g2 = await page.ev(`(()=>{window.scrollTo(0,0);const r=document.querySelector('.goal-strip').getBoundingClientRect();return {bottom:r.bottom,vh:innerHeight,text:document.querySelector('.goal-strip').innerText}})()`);
    T.ok(g2.bottom <= g2.vh && g2.text.includes('2개 이상') && g2.text.includes('0 / 3'), `${V} CH2: 현재 목표가 스크롤 없이 보임`);
    await page.realClick('.top-right [data-action="guide"]'); T.ok(!!(await page.ev(READ)), `${V} CH2: 상단 「게임 방법」(실제 클릭)으로 다시 열림`);
    await page.key('Escape'); T.ok(!(await page.ev(READ)), `${V} CH2: Esc 키로 닫힘`);
    await page.realClick('.action-tile[data-id="E04a"]');
    T.ok((await page.text()).includes('22:12 단체 채팅 사진'), `${V} CH2: 조사 카드 실제 클릭 → 자료 확인 창`);
    await page.realClick('.modal [data-action="close"]');
    await page.realClick('.segment [data-id="board"]');
    const howto = await page.ev(`(()=>{const o=document.querySelector('.board-howto');return o&&parseFloat(getComputedStyle(o).fontSize)})()`);
    T.ok(howto >= 12 && (await page.text()).includes('근거 자료 1 / 3 확보'), `${V} CH2: 추리 탭 사용 순서·자료 확보 현황 표시`);
    await shot('ch2-board');
    T.ok(await page.noHScroll(), `${V} CH2: 가로 스크롤 없음`);
    T.ok(page.problems.length === 0, `${V}: 콘솔 오류·404 없음` + (page.problems.length ? ' → ' + page.problems.join(' | ') : ''));
    await page.close();
  }
  await server.close();
  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
