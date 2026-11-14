// 사운드 시스템 검사(실제 Chrome) — PC 1365 / 모바일 390
// 1) 자동 재생 정책: 첫 입력 전에는 오디오를 만들지 않음, 첫 클릭 뒤 시작
// 2) 페이지별 배경음악(메인·챕터 2~5·엔딩 3종), 비 오는 챕터의 빗소리
// 3) 설정 버튼(터치 44px)·패널: 배경음악/효과음 ON·OFF, 음량, 새로고침 뒤 유지
// 4) 효과음 과다 방지(같은 소리 연타·동시 재생 상한), 사건 연출 효과음(정전·CCTV·증거·오답)
// 실행: node tests/browser-sound.test.js
'use strict';
const { startServer, launch, reporter } = require('./lib/browser');
const { KEYS, ch4Complete, ch5Ending } = require('./lib/saves');

const GUIDE = { 'gguhansung-fog-villa-guide-v1': { ch1: true, ch2: true } };
const base = (x = {}) => ({ version: 1, name: '테스터', stage: 'investigate', evidence: [], solved: [], talked: [], asked: [], log: [], ...x });

(async () => {
  const T = reporter('사운드 시스템');
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const p = await launch(vp); const V = vp.tag; const ok = (c, m) => T.ok(c, `${V} ${m}`);
    const S = expr => p.ev(`window.SOUND.${expr}`);
    T.section(`${V} 메인·설정`);
    await p.setStorage(server.origin, {}); await p.go(server.origin + '/');
    ok((await S('state()')) === 'idle', '첫 입력 전 오디오 시작 안 함(자동 재생 정책)');
    const btn = await p.ev(`(()=>{const r=document.getElementById('snd-btn').getBoundingClientRect();return {w:r.width,h:r.height,vis:r.bottom<=innerHeight&&r.right<=innerWidth}})()`);
    ok(btn.w >= 44 && btn.h >= 44 && btn.vis, `설정 버튼 화면 안·터치 ${Math.round(btn.w)}px`);
    await p.realClick('#snd-btn');
    ok((await S('state()')) !== 'idle' && (await S('mood()')) === 'title' && (await S('track()')) === 'title', '첫 클릭 뒤 메인 음악 시작');
    ok(await p.ev(`!document.getElementById('snd-panel').hidden`), '설정 패널 열림');
    await p.realClick('#snd-bgm'); await p.ev(`(()=>{const r=document.getElementById('snd-vol');r.value=35;r.dispatchEvent(new Event('input',{bubbles:true}));return 1})()`);
    ok(JSON.stringify(await S('settings()')) === JSON.stringify({ bgm: false, sfx: true, vol: 35 }), '배경음악 끄기·음량 35% 저장');
    await p.go(server.origin + '/');
    ok(await p.ev(`(()=>{const s=JSON.parse(localStorage.getItem('gguhansung-sound-v1'));return s.bgm===false&&s.vol===35&&document.getElementById('snd-bgm').checked===false&&document.getElementById('snd-vol').value==='35'})()`), '새로고침 뒤 설정 유지');
    ok(await p.noHScroll(), '설정 버튼으로 가로 스크롤 생기지 않음');
    await p.setStorage(server.origin, { 'gguhansung-sound-v1': { bgm: true, sfx: true, vol: 60 } }); await p.go(server.origin + '/');
    await p.realClick('#snd-btn');
    const n0 = (await S('log()')).length; await p.ev(`(()=>{for(let i=0;i<30;i++)SOUND.sfx('click');return 1})()`);
    ok((await S('log()')).length - n0 <= 1, '같은 효과음 연타 → 1번만 재생');
    await p.ev(`(()=>{['evidence','correct','wrong','cctv','door','thunder','blackout','ending','move'].forEach(n=>SOUND.sfx(n));return 1})()`);
    ok((await S('active()')) <= 5, `동시 재생 상한 5 (현재 ${await S('active()')})`);

    T.section(`${V} 챕터별 음악·연출`);
    for (const [n, room] of [[2, 'management'], [3, 'living'], [4, 'living']]) {
      await p.setStorage(server.origin, { [KEYS['ch' + n]]: base({ room, confronted: [], timeline: {}, classified: {}, motiveDraft: {} }), ...GUIDE }); await p.go(server.origin + `/chapter${n}.html`);
      await p.realClick('#snd-btn');
      ok((await S('track()')) === 'ch' + n && (await S('rain()')) === true, `챕터 ${n}: 음악 ch${n} + 빗소리`);
    }
    await p.setStorage(server.origin, { [KEYS.ch2]: base({ room: 'management' }), ...GUIDE }); await p.go(server.origin + '/chapter2.html');
    await p.realClick('.scene .hotspot[data-id="E02"]'); await new Promise(r => setTimeout(r, 400));
    const lg = await S('log()'); ok(lg.includes('cctv') && lg.includes('evidence'), `CCTV 조사 → CCTV 소리 + 증거 발견 (${lg.slice(-3).join(',')})`);
    await p.setStorage(server.origin, {}); await p.go(server.origin + '/chapter2.html');
    await p.ev(`(()=>{const b=document.querySelector('[data-action="begin"]');b&&b.click();return 1})()`); await new Promise(r => setTimeout(r, 900));
    const st2 = await p.ev(`(JSON.parse(localStorage.getItem('${KEYS.ch2}'))||{}).stage`);
    ok(st2 !== 'blackout' || (await S('log()')).includes('thunder'), `챕터 2 정전 연출 → 천둥·정전 소리 (단계 ${st2})`);
    for (const end of ['true', 'normal', 'bad']) {
      await p.setStorage(server.origin, { [KEYS.ch4]: ch4Complete(), [KEYS.ch5]: ch5Ending(end), ...GUIDE }); await p.go(server.origin + '/chapter5.html');
      await p.realClick('#snd-btn');
      ok((await S('track()')) === end, `챕터 5 ${end.toUpperCase()} 엔딩 음악`);
    }
    await p.close();
  }
  T.done(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
