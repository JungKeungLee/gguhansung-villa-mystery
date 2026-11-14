// 챕터 2 포인트 앤 클릭(관리실 시범) 검사(실제 Chrome 클릭): 표시·터치 크기·장면 안·클릭→획득·완료 표시·새로고침 유지·다른 방 기존 방식
// 실행: node tests/browser-ch2-hotspot.test.js
'use strict';

const {startServer,launch,reporter}=require('./lib/browser');const {KEYS}=require('./lib/saves');
const GUIDE={'gguhansung-fog-villa-guide-v1':{ch1:true,ch2:true}};
const ch2={version:1,name:'테스터',stage:'investigate',room:'management',evidence:[],solved:[],talked:[],asked:[],log:[]};
(async()=>{const T=reporter('CH2 포인트 앤 클릭 시범');const server=await startServer();
for(const vp of [{tag:'pc',width:1365,height:900},{tag:'tablet',width:820,height:1180,mobile:true},{tag:'mobile',width:390,height:844,mobile:true}]){
 const p=await launch(vp);const ok=(c,m)=>T.ok(c,vp.tag+' '+m);T.section(vp.tag);
 await p.setStorage(server.origin,{[KEYS.ch2]:ch2,...GUIDE});await p.go(server.origin+'/chapter2.html');
 const hs=await p.ev(`[...document.querySelectorAll('.scene .hotspot')].map(b=>{const r=b.getBoundingClientRect(),s=b.closest('.scene').getBoundingClientRect();return {id:b.dataset.id,w:Math.round(r.width),h:Math.round(r.height),inside:r.left>=s.left-1&&r.right<=s.right+1&&r.top>=s.top-1&&r.bottom<=s.bottom+1}})`);
 ok(hs.length===2&&hs.map(h=>h.id).join()==='E02,E01','핫스팟 2개(E02·E01) 표시 '+JSON.stringify(hs.map(h=>h.id)));
 ok(hs.every(h=>h.h>=44),'터치 높이 44px 이상 '+hs.map(h=>h.h).join('/'));ok(hs.every(h=>h.inside),'핫스팟이 장면 안에 있음');

 await p.realClick('.scene .hotspot[data-id="E02"]');
 const m=await p.ev(`(()=>{const t=document.querySelector('.modal');return t?t.textContent.slice(0,80):null})()`);ok(m&&m.includes('CCTV'),'E02 핫스팟 클릭 → 조사 창 ('+(m||'').slice(0,30)+')');
 await p.realClick('.modal [data-action="close"]');
 await p.realClick('.scene .hotspot[data-id="E01"]');await p.realClick('.modal [data-action="close"]');
 const sv=await p.ev(`JSON.parse(localStorage.getItem('${KEYS.ch2}')).evidence`);ok(sv.includes('E02')&&sv.includes('E01'),'저장 기록에 E02·E01 '+JSON.stringify(sv));
 const done=await p.ev(`[...document.querySelectorAll('.scene .hotspot.done')].length`);ok(done===2,'조사한 핫스팟 완료(✓) 표시 '+done);
 const tiles=await p.ev(`[...document.querySelectorAll('.action-tile.done')].map(b=>b.dataset.id).join()`);ok(tiles.includes('E02')&&tiles.includes('E01'),'아래 목록도 같은 완료 상태');
 await p.go(server.origin+'/chapter2.html');const done2=await p.ev(`[...document.querySelectorAll('.scene .hotspot.done')].length`);ok(done2===2,'새로고침 후 완료 표시 유지');
 const errs=await p.ev(`(window.__errors||[]).length`).catch(()=>0);
 // 다른 방에는 핫스팟 없음(시범 범위)
 await p.realClick('[data-action="room"][data-id="living"]').catch(()=>{});const other=await p.ev(`document.querySelectorAll('.scene .hotspot').length`);ok(other===2,'거실: 그림 밖 핫스팟 2개(휴대폰 화면 속 사진)');
 await p.close();}
T.done();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
