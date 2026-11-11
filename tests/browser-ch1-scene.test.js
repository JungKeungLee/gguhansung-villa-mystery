// 챕터 1 장면·대화창 검사(실제 Chrome, PC 1365x900 / 낮은 PC 1365x640 / 태블릿 820 / 모바일 390)
// - 핫스팟 중심이 장면 사진의 지정 좌표(%)에 놓이는지, 다른 요소에 가려지거나 프레임 밖으로 넘치지 않는지
// - 장면 아래 인물 카드가 핫스팟과 겹치지 않는지, 누르고 있어도 핫스팟이 움직이지 않고 클릭되는지
// - 대화창: 이미지가 있는 NPC(최도식·윤해준)는 초상화, 내레이션은 초상화 없음, 플레이어 대사는 기존 방식
// 실행: node tests/browser-ch1-scene.test.js [--shots <폴더>]
'use strict';
const path = require('path');
const { startServer, launch, sleep, reporter } = require('./lib/browser');
const OUT = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const KEY = 'gguhansung-fog-villa-save-v2', GK = 'gguhansung-fog-villa-guide-v1';
const save = (phase, location) => ({ version: 2, name: '테스터', phase, location, clues: [], talks: [], log: [], hintUses: 0, startedAt: 0, finishedAt: null });
const T = reporter('챕터 1 장면·대화창'); let VP = ''; const ok = (c, m) => T.ok(c, `${VP} ${m}`);
(async () => {
  const server = await startServer();
  for (const vp of [{ tag: 'pc', width: 1365, height: 900 }, { tag: 'pc-short', width: 1365, height: 640 }, { tag: 'tablet', width: 820, height: 1180, mobile: true }, { tag: 'mobile', width: 390, height: 844, mobile: true }]) {
    const page = await launch(vp);
    VP = vp.tag; T.section(`${vp.tag} ${vp.width}x${vp.height}`);
    for (const [phase, loc] of [['late', 'exterior'], ['late', 'living'], ['day', 'foyer'], ['late', 'foyer'], ['late', 'corridor'], ['late', 'kitchen'], ['late', 'terrace'], ['night', 'terrace'], ['night', 'living']]) {
      await page.setStorage(server.origin, { [KEY]: save(phase, loc), [GK]: { ch1: true } });
      await page.go(server.origin + '/index.html'); await page.click('resume');
      await page.ev(`(async()=>{const i=document.querySelector('.scene-art');if(i.decode)await i.decode().catch(()=>{});document.querySelector('.scene-frame').scrollIntoView({block:'start'});return 1})()`);
      await sleep(250);
      const r = await page.ev(`(()=>{const f=document.querySelector('.scene-frame'),fr=f.getBoundingClientRect(),art=f.querySelector('.scene-art');
        let box;if(art.tagName==='IMG'){const s=Math.min(fr.width/art.naturalWidth,fr.height/art.naturalHeight);const w=art.naturalWidth*s,h=art.naturalHeight*s;box={l:fr.left+(fr.width-w)/2,t:fr.top+(fr.height-h)/2,w,h};}
        else{const s=Math.min(fr.width/1000,fr.height/560);const w=1000*s,h=560*s;box={l:fr.left+(fr.width-w)/2,t:fr.top+(fr.height-h)/2,w,h};}
        const hs=[...f.querySelectorAll('.hotspot')].map(h=>{const r=h.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const m=h.getAttribute('style').match(/left:([\\d.]+)%;top:([\\d.]+)%/);
          const top=document.elementFromPoint(cx,cy);return {label:h.innerText.replace(/^.\\n?/,'').trim(),want:[+m[1],+m[2]],got:[(cx-box.l)/box.w*100,(cy-box.t)/box.h*100],covered:!(top===h||h.contains(top)),inside:r.left>=fr.left-1&&r.right<=fr.right+1&&r.top>=fr.top-1&&r.bottom<=fr.bottom+1};});
        const hit=(a,b)=>a.left<b.right-0.5&&a.right>b.left+0.5&&a.top<b.bottom-0.5&&a.bottom>b.top+0.5;
        const hsEls=[...f.querySelectorAll('.hotspot')],blockers=[...f.querySelectorAll('.scene-title,.scene-bottom>*')];
        const clash=[];hsEls.forEach((h,i)=>{const a=h.getBoundingClientRect();hsEls.slice(i+1).forEach(o=>{if(hit(a,o.getBoundingClientRect()))clash.push(h.dataset.id+'↔'+o.dataset.id)});blockers.forEach(bk=>{if(hit(a,bk.getBoundingClientRect()))clash.push(h.dataset.id+'↔'+bk.className)})});
        const people=document.querySelector('.scene-people');const overlap=people?[...f.querySelectorAll('.hotspot')].some(h=>{const a=h.getBoundingClientRect(),b=people.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top}):false;
        return {frame:[fr.width,fr.height],box:[box.w,box.h],hs,clash,peopleOutside:people?people.getBoundingClientRect().top>=fr.bottom-1:true,overlap,frameRect:{x:fr.left+scrollX,y:fr.top+scrollY,w:fr.width,h:fr.height}}})()`);
      const off = r.hs.filter(h => Math.abs(h.got[0] - h.want[0]) > 0.6 || Math.abs(h.got[1] - h.want[1]) > 0.6);
      ok(r.clash.length === 0, `${phase}/${loc} 핫스팟끼리·장면 제목·하단 안내와 겹침 없음` + (r.clash.length ? ' → ' + r.clash.join(', ') : ''));
      ok(off.length === 0 && r.hs.every(h => !h.covered && h.inside) && r.peopleOutside && !r.overlap,
        `${phase}/${loc} 프레임 ${r.frame.map(n => n.toFixed(0)).join('x')} 사진 ${r.box.map(n => n.toFixed(0)).join('x')} | ` + r.hs.map(h => `${h.label}(${h.got.map(n => n.toFixed(1)).join(',')}${h.covered ? ' 가려짐' : ''}${h.inside ? '' : ' 넘침'})`).join(' '));
      if (['living', 'kitchen'].includes(loc) || vp.tag === 'mobile') if (OUT) await page.shot(path.join(OUT, `${vp.tag}-${phase}-${loc}.png`), { x: r.frameRect.x, y: r.frameRect.y, width: r.frameRect.w, height: r.frameRect.h + 60 });
    }
    // 그림에 없는 조사 대상(벽시계·주차장·주차된 차량): 조사 표시 + 아이콘 = 클릭 영역 + 실제 클릭으로 조사
    for (const [phase, loc, id, flavor] of [['late', 'living', 'clock', '배터리로 움직이는 벽시계'], ['late', 'exterior', 'car', '주차장에 차가 몇 대'], ['late', 'terrace', 'car', '주차장에 차가 몇 대'], ['night', 'terrace', 'car', '주차장에 차가 몇 대']]) {
      await page.setStorage(server.origin, { [KEY]: save(phase, loc), [GK]: { ch1: true } });
      await page.go(server.origin + '/index.html'); await page.click('resume');
      const sel = `.scene-frame .hotspot[data-id="${id}"]`;
      const m = await page.ev(`(()=>{const h=document.querySelector('${sel}');h.scrollIntoView({block:'center'});const r=h.getBoundingClientRect();const pin=h.querySelector('.hotspot-pin'),ic=pin.getBoundingClientRect();
        const c=document.elementFromPoint(ic.left+ic.width/2,ic.top+ic.height/2);
        return {cls:h.className,svg:!!pin.querySelector('svg'),note:(h.querySelector('.hotspot-note')||{}).textContent||'',dashed:getComputedStyle(h).borderTopStyle,aria:h.getAttribute('aria-label'),
          iconInside:ic.left>=r.left&&ic.right<=r.right&&ic.top>=r.top&&ic.bottom<=r.bottom,iconHitsButton:c===h||h.contains(c)}})()`);
      ok(m.cls.includes('hotspot-offscene') && m.svg && m.dashed === 'dashed' && m.note.length > 0 && /보이지 않음/.test(m.aria), `${loc} ${id}: 조사 표시(점선·돋보기 아이콘·'${m.note}')`);
      ok(m.iconInside && m.iconHitsButton, `${loc} ${id}: 아이콘이 버튼 안에 있고 아이콘 위치가 곧 클릭 영역`);
      await page.realClick(`${sel} .hotspot-pin`);
      ok(await page.ev(`!!document.querySelector('.dialogue')&&document.body.innerText.includes(${JSON.stringify(flavor)})`), `${loc} ${id}: 아이콘 실제 클릭 → 기존 조사 내용`);
      await page.drain();
      await page.realClick(sel);
      ok(await page.ev(`!!document.querySelector('.dialogue')`), `${loc} ${id}: 버튼(글자 부분) 실제 클릭 → 조사`);
      await page.drain();
    }
    await page.setStorage(server.origin, { [KEY]: save('day', 'foyer'), [GK]: { ch1: true } });
    await page.go(server.origin + '/index.html'); await page.click('resume');
    await page.realClick('.scene-frame .hotspot[data-id="luggage"]');
    ok(await page.ev(`document.body.innerText.includes('가방들이 현관 옆에')`), '현관 여행 가방 실제 클릭 → 조사');
    await page.drain();
    ok(await page.noHScroll(), '가로 스크롤 없음');
    // 누르는 동안 위치 고정 + 긴 누름 후에도 클릭 성공
    await page.setStorage(server.origin, { [KEY]: save('late', 'living'), [GK]: { ch1: true } });
    await page.go(server.origin + '/index.html'); await page.click('resume');
    const q = `(()=>{const h=document.querySelector('.hotspot[data-id="fireplace"]');const r=h.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}})()`;
    await page.ev(`document.querySelector('.hotspot[data-id="fireplace"]').scrollIntoView({block:'center'});1`);
    const a = await page.ev(q), cx = a.x + a.w / 2, cy = a.y + a.h / 2;
    await page.cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx, y: cy });
    await page.cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1 });
    await sleep(400); const b = await page.ev(q);
    await page.cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx, y: cy, button: 'left', clickCount: 1 }); await sleep(300);
    const centerShift = Math.hypot((b.x + b.w / 2) - cx, (b.y + b.h / 2) - cy);
    ok(centerShift < 1 && await page.ev(`!!document.querySelector('.dialogue')`), `벽난로 0.4초 누름: 중심 이동 ${centerShift.toFixed(2)}px, 손 뗀 뒤 조사 대사 열림`);
    await page.drain();
    // 인물 카드 실제 클릭
    await page.realClick('.scene-person');
    ok(await page.ev(`!!document.querySelector('.dialogue .char-portrait')`), '장면 아래 인물 카드 실제 클릭 → 대화');
    await page.drain();
    // NPC 초상화
    const grab = async label => {
      const seen = [];
      for (let i = 0; i < 14; i++) {
        await sleep(160);
        const s = await page.ev(`(async()=>{const d=document.querySelector('.dialogue');if(!d)return null;const im=d.querySelector('.char-portrait');if(im)await im.decode().catch(()=>{});
          const box=d.querySelector('.dialogue-illustration')?.getBoundingClientRect();const r=im?.getBoundingClientRect();
          return {sp:d.querySelector('.speaker-name')?.textContent||'내레이션',img:im?.getAttribute('src')||null,loaded:im?im.complete&&im.naturalWidth>0:null,emblem:!!d.querySelector('.speaker-emblem:not([style*="none"])')&&getComputedStyle(d.querySelector('.speaker-emblem')).display!=='none',narr:d.classList.contains('dialogue-narration'),box:box?[box.top,box.bottom,box.left,box.right]:null,r:r?[r.top,r.bottom,r.left,r.right]:null}})()`);
        if (!s) break; seen.push(s);
        if (['최도식', '윤해준'].includes(s.sp)) if (OUT) await page.shot(path.join(OUT, `${vp.tag}-${label}-${s.sp}.png`));
        if (!(await page.ev(`!!__qa.next()&&!__qa.next().disabled`))) continue; await page.ev('__qa.next().click()');
      }
      return seen;
    };
    await page.setStorage(server.origin, { [KEY]: save('day', 'foyer'), [GK]: { ch1: true } });
    await page.go(server.origin + '/index.html'); await page.click('resume'); await page.click('interact', 'guest-list');
    let s1 = await grab('foyer');
    const dosik = s1.find(x => x.sp === '최도식');
    ok(dosik && dosik.img === 'assets/characters/guests/dosik.webp' && dosik.loaded && !dosik.emblem, `최도식: guests/dosik.webp 초상화 (원형 글자 없음)`);
    ok(s1.filter(x => x.sp === '내레이션').every(x => x.narr && !x.img), '내레이션: 초상화 없는 텍스트 창');
    await page.setStorage(server.origin, { [KEY]: save('dinner', 'kitchen'), [GK]: { ch1: true } });
    await page.go(server.origin + '/index.html'); await page.click('resume'); await page.click('advance');
    s1 = await grab('dinner');
    const hn = s1.find(x => x.sp === '윤해준');
    ok(hn && String(hn.img).endsWith('yoon-haejun/normal.webp') && hn.loaded && !hn.emblem, `윤해준(저녁→밤): yoon-haejun/normal.webp`);
    await page.setStorage(server.origin, { [KEY]: save('night', 'living'), [GK]: { ch1: true } });
    await page.go(server.origin + '/index.html'); await page.click('resume'); await page.click('advance');
    s1 = await grab('night');
    const hnight = s1.find(x => x.sp === '윤해준');
    const fits = hnight && hnight.r && hnight.r[1] >= hnight.box[1] - 1;
    // 밤→완료 진행 대사는 phase가 complete로 바뀐 뒤 표시되어 기존 규칙(poseForLine)상 surprised 표정이다
    ok(hnight && /yoon-haejun\/(night|surprised)\.webp$/.test(hnight.img) && hnight.loaded && !hnight.emblem && fits, `윤해준(밤→완료): ${hnight && hnight.img ? hnight.img.split('/').slice(-2).join('/') : '초상화 없음'} 상반신 보정, 대화창 바닥까지 채움`);
    // 플레이어 대사: 기존 방식(이름 + 원형 이니셜) 유지
    await page.setStorage(server.origin, { [KEY]: save('day', 'living'), [GK]: { ch1: true } });
    await page.go(server.origin + '/index.html'); await page.click('resume'); await page.click('talk-member', '꾸티뉴');
    s1 = await grab('player');
    const me = s1.find(x => x.sp === '테스터');
    ok(me && !me.img && me.emblem, '플레이어 실제 대사: 초상화 없이 이름 + 원형 이니셜(기존 유지)');
    ok(page.problems.length === 0, '콘솔 오류·404 없음' + (page.problems.length ? ' → ' + page.problems.join(' | ') : ''));
    await page.close();
  }
  await server.close();
  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
