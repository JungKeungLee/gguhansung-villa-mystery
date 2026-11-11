// 대화창 초상화 렌더링 검사(실제 Chrome, PC 1365px / 모바일 390px)
// - 외부인 night/surprised 상반신이 대화창을 충분히 채우고 머리·몸이 잘리지 않는지
// - 멤버·외부인 normal 초상화는 기존 방식 그대로인지
// 실행: node tests/browser-portraits.test.js [--shots <폴더>]
'use strict';
const path = require('path');
const { startServer, launch, reporter, sleep } = require('./lib/browser');
const S = require('./lib/saves');

const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;

// 현재 대화창 이미지의 실제 인물 영역(불투명 픽셀)을 화면 좌표로 계산
const MEASURE = `(async()=>{const v=document.querySelector('.dialogue-view');const i=v&&v.querySelector('img');if(!i)return null;await i.decode();
  const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.drawImage(i,0,0);
  const d=x.getImageData(0,0,c.width,c.height).data;let l=c.width,t=c.height,r=-1,b=-1;
  for(let y=0;y<c.height;y++)for(let k=0;k<c.width;k++)if(d[(y*c.width+k)*4+3]>16){if(k<l)l=k;if(k>r)r=k;if(y<t)t=y;if(y>b)b=y;}
  const vr=v.getBoundingClientRect(),ir=i.getBoundingClientRect();const fx=ir.width/c.width,fy=ir.height/c.height;
  return {src:i.getAttribute('src'),pos:getComputedStyle(i).position,box:{t:vr.top,b:vr.bottom,l:vr.left,r:vr.right,h:vr.height},img:{h:ir.height},
    bust:{t:ir.top+t*fy,b:ir.top+(b+1)*fy,l:ir.left+l*fx,r:ir.left+(r+1)*fx}};})()`;

(async () => {
  const T = reporter('초상화 렌더링');
  const server = await startServer();
  for (const vp of [{ name: 'PC', width: 1365, height: 900 }, { name: '모바일', width: 390, height: 844, mobile: true }]) {
    const page = await launch(vp);
    const fill = async (label, opts = {}) => {
      await page.waitFor(`(()=>{const i=document.querySelector('.dialogue-view img');return i&&i.complete&&i.naturalWidth>0})()`);
      const m = await page.ev(MEASURE);
      const h = m.bust.b - m.bust.t, ratio = h / m.box.h;
      const info = `${m.src.split('/').slice(-2).join('/')} 인물 높이 ${h.toFixed(0)}px / 대화창 ${m.box.h.toFixed(0)}px (${(ratio * 100).toFixed(0)}%)`;
      if (opts.bust) {
        T.ok(ratio >= 0.85, `${vp.name} ${label}: 상반신이 대화창을 채움 — ${info}`);
        T.ok(m.bust.t >= m.box.t + 2, `${vp.name} ${label}: 머리 위쪽 잘림 없음 (여백 ${(m.bust.t - m.box.t).toFixed(1)}px)`);
        T.ok(m.bust.l >= m.box.l && m.bust.r <= m.box.r, `${vp.name} ${label}: 좌우 잘림 없음`);
        T.ok(m.bust.b >= m.box.b - 1 && m.bust.b <= m.box.b + 4, `${vp.name} ${label}: 상반신 아래 끝이 대화창 바닥에 맞음 (차이 ${(m.bust.b - m.box.b).toFixed(1)}px)`);
      } else {
        T.ok(m.pos === 'static' && Math.abs(m.img.h - m.box.h) <= 1, `${vp.name} ${label}: 기존 출력 방식 유지(contain, 대화창 높이) — ${info}`);
        T.ok(m.bust.t >= m.box.t - 0.5 && m.bust.b <= m.box.b + 0.5 && m.bust.l >= m.box.l && m.bust.r <= m.box.r, `${vp.name} ${label}: 잘림 없음`);
      }
      return m;
    };
    // 같은 인물의 night→surprised 전환 시 배율이 같은지 확인(대화창 img src만 바꿔 CSS 규칙 검증)
    const swap = async (from, to) => { await page.ev(`(()=>{const i=document.querySelector('.dialogue-view img');i.setAttribute('src',i.getAttribute('src').replace('/${from}.webp','/${to}.webp'));return 1})()`); };
    const shot = async name => { if (shotsDir) await page.shot(path.join(shotsDir, `${vp.name === 'PC' ? 'pc' : 'mobile'}-${name}.png`)); };

    T.section(`${vp.name} · 챕터 3 (외부인 night)`);
    await page.setStorage(server.origin, { [S.KEYS.ch3]: S.ch3Investigate() });
    await page.go(server.origin + '/chapter3.html');
    await page.click('tab', 'people');
    for (const who of ['이유나', '장도윤', '윤해준']) {
      await page.click('talk', who);
      const n = await fill(`${who} night`, { bust: true });
      if (who === '이유나') await shot('ch3-yuna-night');
      await swap('night', 'surprised');
      const s = await fill(`${who} surprised`, { bust: true });
      T.ok(Math.abs(n.img.h - s.img.h) < 0.5, `${vp.name} ${who}: night/surprised 같은 배율`);
      await page.drain();
    }
    await page.click('talk', '꾸티뉴'); await fill('멤버 꾸티뉴 night'); await shot('ch3-member'); await page.drain();
    await page.click('talk', '오세린'); await fill('guests 오세린'); await page.drain();

    T.section(`${vp.name} · 챕터 4 (외부인 night, 목록은 normal)`);
    await page.setStorage(server.origin, { [S.KEYS.ch4]: S.ch4Investigate() });
    await page.go(server.origin + '/chapter4.html');
    await page.click('tab', 'people');
    await page.click('talk', '장도윤'); await fill('장도윤 night', { bust: true }); await shot('ch4-doyun-night'); await page.drain();
    await page.click('talk', '야무지'); await fill('멤버 야무지 night'); await page.drain();

    T.section(`${vp.name} · 챕터 5 (반박 직전 윤해준)`);
    await page.setStorage(server.origin, { [S.KEYS.ch4]: S.ch4Complete(), [S.KEYS.ch5]: S.ch5ReadyToClaim() });
    await page.go(server.origin + '/chapter5.html');
    await page.click('tab', 'reconstruct'); await page.click('submit');
    for (let i = 0; i < 10; i++) { // 윤해준 대사 줄까지 넘기기
      const sp = await page.ev(`document.querySelector('.speaker')?.textContent||''`); if (sp === '윤해준') break;
      await page.ev('__qa.next()?.click()'); await sleep(150);
    }
    await fill('윤해준 night', { bust: true }); await shot('ch5-haejun-night');
    await page.drain();

    T.section(`${vp.name} · 챕터 2 (외부인 normal 전신)`);
    await page.setStorage(server.origin, { [S.KEYS.ch2]: S.ch2Investigate() });
    await page.go(server.origin + '/chapter2.html');
    await page.click('tab', 'people');
    await page.click('talk', '윤해준'); await fill('윤해준 normal'); await shot('ch2-haejun-normal'); await page.drain();
    await page.click('talk', '야뿌'); await fill('멤버 야뿌 night'); await page.drain();

    T.ok(await page.noHScroll(), `${vp.name}: 가로 스크롤 없음`);
    T.ok(page.problems.length === 0, `${vp.name}: 콘솔 오류·404 없음` + (page.problems.length ? ' → ' + page.problems.join(' | ') : ''));
    await page.close();
  }
  await server.close();
  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
