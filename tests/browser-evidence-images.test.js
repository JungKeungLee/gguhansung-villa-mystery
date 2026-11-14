// 대사·증거 창의 증거 이미지 표시 검사(실제 Chrome) — PC 1365 / 모바일 390
// 1) 챕터 1: 바비큐 사진(E09)·22:12 단톡 사진(E04a) 대사에 실제 이미지, 대사 글자는 가리지 않음, 이미지 없는 단서(15:10 도착 사진 등)는 표시 안 함
// 2) 이미지 누르면 확대 → 닫으면 같은 대사 그대로(대사 진행에 영향 없음)
// 3) 챕터 2: 증거 창(E02 등)에 이미지, 확대 가능
// 실행: node tests/browser-evidence-images.test.js
'use strict';
const { startServer, launch, reporter, sleep } = require('./lib/browser');
const { KEYS } = require('./lib/saves');
const KEY = 'gguhansung-fog-villa-save-v2', GK = 'gguhansung-fog-villa-guide-v1';
const save1 = (phase, location) => ({ version: 2, name: '테스터', phase, location, clues: [], talks: [], log: [], hintUses: 0, startedAt: 0, finishedAt: null });
const GUIDE = { [GK]: { ch1: true, ch2: true } };

(async () => {
  const T = reporter('대사·증거 창 이미지');
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const p = await launch(vp); const V = vp.tag; const ok = (c, m) => T.ok(c, `${V} ${m}`);
    const dlg = () => p.ev(`(()=>{const d=document.querySelector('.dialogue');if(!d)return null;const i=d.querySelector('.dlg-evidence-img');const t=d.querySelector('.dialogue-text');const tr=t.getBoundingClientRect();
      const ir=i?i.getBoundingClientRect():null;return {img:i?i.getAttribute('src'):null,text:t.textContent,textVisible:tr.top>=0&&tr.bottom<=innerHeight+1&&tr.height>0,overlap:ir?(ir.bottom>tr.top+1&&ir.top<tr.bottom-1):false,loaded:i?i.complete&&i.naturalWidth>0:null}})()`);
    T.section(`${V} 챕터 1`);
    for (const [phase, loc, id, file] of [['dinner', 'corridor', 'argument', 'e09-barbecue-envelope.webp'], ['late', 'foyer', 'cctv', 'e04a-group-photo-2212.webp']]) {
      await p.setStorage(server.origin, { [KEY]: save1(phase, loc), ...GUIDE }); await p.go(server.origin + '/index.html'); await p.click('resume');
      await p.realClick(`.hotspot[data-id="${id}"]`); await sleep(300);
      let d = await dlg(); await p.ev(`(async()=>{const i=document.querySelector('.dlg-evidence-img');if(i&&i.decode)await i.decode().catch(()=>{});return 1})()`); d = await dlg();
      ok(d && d.img && d.img.endsWith(file) && d.loaded, `${id}: 대사와 함께 ${file}`);
      ok(d.textVisible && !d.overlap, `${id}: 대사 글자가 화면 안, 이미지와 겹치지 않음`);
      const before = d.text;
      await p.realClick('.dlg-evidence-img');
      ok(await p.ev(`!!document.getElementById('ev-zoom')`), `${id}: 이미지 누르면 확대`);
      await p.realClick('#ev-zoom');
      d = await dlg(); ok(!(await p.ev(`!!document.getElementById('ev-zoom')`)) && d && d.text === before, `${id}: 확대 닫으면 같은 대사 유지`);
      await p.drain();
    }
    await p.setStorage(server.origin, { [KEY]: save1('day', 'living'), ...GUIDE }); await p.go(server.origin + '/index.html'); await p.click('resume');
    await p.realClick('.hotspot[data-id="photo"]'); await sleep(300);
    const d0 = await dlg(); ok(d0 && !d0.img, '15:10 도착 사진: 맞는 이미지가 없어 표시 안 함(다른 사진으로 대체하지 않음)'); await p.drain();

    T.section(`${V} 챕터 2 증거 창`);
    await p.setStorage(server.origin, { [KEYS.ch2]: { version: 1, name: '테스터', stage: 'investigate', room: 'management', evidence: [], solved: [], talked: [], asked: [], log: [] }, ...GUIDE }); await p.go(server.origin + '/chapter2.html');
    await p.realClick('.scene .hotspot[data-id="E02"]'); await sleep(200);
    const m = await p.ev(`(async()=>{const i=document.querySelector('.modal .ch2-evidence-image');if(!i)return null;await i.decode().catch(()=>{});return {src:i.getAttribute('src'),ok:i.naturalWidth>0}})()`);
    ok(m && m.src.endsWith('e02-living-room-cctv-2205.webp') && m.ok, 'E02 획득 창에 CCTV 이미지');
    await p.realClick('.modal .ch2-evidence-image'); ok(await p.ev(`!!document.getElementById('ev-zoom')`), '챕터 2 이미지 확대'); await p.realClick('#ev-zoom');
    ok(await p.ev(`!!document.querySelector('.modal')`), '확대 닫은 뒤 증거 창 그대로');
    await p.close();
  }
  T.done(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
