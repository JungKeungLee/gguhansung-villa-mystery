// 포인트 앤 클릭 핫스팟 전체 검사(챕터 2~4 모든 조사 장소, 실제 Chrome) — PC 1365 / 모바일 390
// 장소마다: 데이터 개수만큼 표시, 화면 안(모바일에서 사진이 잘려도), 서로 겹치지 않음, 터치 높이 44px
// 클릭: 열린 핫스팟 → 기존 획득 처리(저장 기록·✓ 표시), 잠긴 핫스팟(🔒) → 획득되지 않음
// 실행: node tests/browser-hotspots.test.js [--shots <폴더>]
'use strict';
const path = require('path');
const { startServer, launch, reporter } = require('./lib/browser');
const { KEYS } = require('./lib/saves');
const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;

const GUIDE = { 'gguhansung-fog-villa-guide-v1': { ch1: true, ch2: true } };
const base = (x = {}) => ({ version: 1, name: '테스터', stage: 'investigate', evidence: [], solved: [], talked: [], asked: [], log: [], ...x });
const CH = {
  ch2: { key: KEYS.ch2, page: '/chapter2.html', rooms: ['living', 'corridor', 'study', 'terrace', 'management', 'kitchen'], save: r => base({ room: r }) },
  ch3: { key: KEYS.ch3, page: '/chapter3.html', rooms: ['living', 'management', 'kitchen', 'corridor', 'terrace'], save: r => base({ room: r, confronted: [], timeline: {}, timelineDone: false, notes: [] }) },
  ch4: { key: KEYS.ch4, page: '/chapter4.html', rooms: ['living', 'corridor', 'terrace', 'parking', 'management', 'basement', 'storage'], save: r => base({ room: r, classified: {}, motiveDraft: {} }) },
};

(async () => {
  const T = reporter('핫스팟 전체(챕터 2~4)');
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const p = await launch(vp); const V = vp.tag; const ok = (c, m) => T.ok(c, `${V} ${m}`);
    for (const [ch, c] of Object.entries(CH)) {
      T.section(`${V} ${ch}`);
      for (const room of c.rooms) {
        await p.setStorage(server.origin, { [c.key]: c.save(room), ...GUIDE }); await p.go(server.origin + c.page);
        const expected = await p.ev(`(window.HOTSPOTS.DATA['${ch}']['${room}']||[]).map(x=>x[0])`);
        const info = await p.ev(`(()=>{const s=document.querySelector('.scene');s.scrollIntoView({block:'center'});const sr=s.getBoundingClientRect();const bs=[...s.querySelectorAll('.hotspot')];
          const rs=bs.map(b=>b.getBoundingClientRect());let overlap=0;for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++){const a=rs[i],b=rs[j];if(a.left<b.right-2&&b.left<a.right-2&&a.top<b.bottom-2&&b.top<a.bottom-2)overlap++;}
          return {ids:bs.map(b=>b.dataset.id),inside:rs.every(r=>r.left>=sr.left-1&&r.right<=sr.right+1&&r.top>=sr.top-1&&r.bottom<=sr.bottom+1),minH:Math.min(...rs.map(r=>r.height)),overlap,
            locked:bs.filter(b=>b.classList.contains('locked')).map(b=>b.dataset.id),off:bs.filter(b=>b.classList.contains('hotspot-offscene')).length}})()`);
        ok(JSON.stringify(info.ids) === JSON.stringify(expected), `${room}: 핫스팟 ${expected.length}개 (${info.ids.join(',')})`);
        ok(info.inside, `${room}: 모두 장면 안`); ok(info.overlap === 0, `${room}: 서로 겹치지 않음`); ok(info.minH >= 44, `${room}: 터치 높이 ${Math.round(info.minH)}px`);
        if (shotsDir) await p.shot(path.join(shotsDir, `${V}-${ch}-${room}.png`));
        // 열린 첫 핫스팟 클릭 → 기존 획득 처리
        const target = info.ids.find(id => !info.locked.includes(id));
        if (target) {
          await p.realClick(`.scene .hotspot[data-id="${target}"]`);
          await p.ev(`(()=>{const c=document.querySelector('.modal [data-action="close"],.modal [data-act="close"]');if(c)c.click();const n=[...document.querySelectorAll('.modal button')].pop();return 1})()`);
          await p.drain().catch(() => {});
          const s = await p.ev(`JSON.parse(localStorage.getItem('${c.key}'))`);
          const ev = await p.ev(`!!window.HOTSPOTS&&true`);
          const isEvidence = /^(E|C|ST-)/.test(target);
          ok(!isEvidence || s.evidence.includes(target), `${room}: ${target} 클릭 → 기록${isEvidence ? '에 추가' : '(조사 대사)'}`);
          if (isEvidence) ok(await p.ev(`!!document.querySelector('.scene .hotspot.done[data-id="${target}"]')`), `${room}: ${target} ✓ 표시`);
        }
        for (const id of info.locked) {
          await p.realClick(`.scene .hotspot[data-id="${id}"]`);
          const s = await p.ev(`JSON.parse(localStorage.getItem('${c.key}'))`);
          ok(!s.evidence.includes(id), `${room}: 잠긴 ${id}(🔒) → 획득 안 됨`);
          await p.ev(`(()=>{const c=document.querySelector('.modal [data-action="close"],.modal [data-act="close"]');if(c)c.click();return 1})()`);
        }
      }
    }
    await p.close();
  }
  T.done(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
