// 챕터 1~5 전체 플레이 테스트(실제 Chrome, 사용자 순서대로 버튼·선택칸 조작)
// 저장 데이터를 미리 넣지 않고 빈 상태에서 시작해 챕터 1 → 5 엔딩까지 진행한다.
// 챕터마다: 진행 중 새로고침 복원, 오답 처리, 대화창 열기/닫기, 초상화·증거 이미지 로드, 다음 챕터 진입,
//          가로 스크롤, 콘솔 오류·이미지 404 를 검사한다. PC 1365px / 모바일 390px 두 번 실행.
// 실행: node tests/browser-playthrough.test.js [--shots <폴더>] [--only pc|mobile]
'use strict';
const path = require('path');
const { startServer, launch, reporter } = require('./lib/browser');
const { KEYS, CH5 } = require('./lib/saves');

const arg = n => (process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : null);
const shotsDir = arg('--shots'), only = arg('--only');
const VIEWPORTS = [{ name: 'PC', tag: 'pc', width: 1365, height: 900 }, { name: '모바일', tag: 'mobile', width: 390, height: 844, mobile: true }].filter(v => !only || v.tag === only);

(async () => {
  const T = reporter('챕터 1~5 전체 플레이');
  const server = await startServer();
  const O = server.origin;

  for (const vp of VIEWPORTS) {
    const page = await launch(vp);
    const V = vp.name;
    const lines = [];
    const drain = async () => { const l = await page.drain(); lines.push(...l); return l; };
    const has = async s => (await page.text()).includes(s);
    const shot = async n => { if (shotsDir) await page.shot(path.join(shotsDir, `${vp.tag}-${n}.png`)); };
    const save = k => page.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(KEYS[k])})||'null')`);
    // 상세(증거) 창: 열림 확인 → 이미지 로드 확인(있는 경우) → 닫기 확인
    const detail = async (label, { image } = {}) => {
      await page.waitFor(`document.querySelector('.modal,.detail-modal')`);
      if (image) {
        const okImg = await page.ev(`(async()=>{const i=document.querySelector('.modal-body img');if(!i)return false;await i.decode().catch(()=>{});return i.complete&&i.naturalWidth>0&&i.getAttribute('src').endsWith(${JSON.stringify(image)})})()`);
        T.ok(okImg, `${V} ${label}: 증거 이미지 표시 (${image})`);
      }
      await page.click('close');
      T.ok(!(await page.ev(`!!document.querySelector('.modal-cover,.modal-backdrop')`)), `${V} ${label}: 창 닫기`);
    };
    const collect = async (id, image) => { await page.click('collect', id); await detail(`${id} 확인`, { image }); };
    const endChapter = async ch => {
      const broken = await page.brokenImages();
      T.ok(broken.length === 0, `${V} ${ch}: 화면의 모든 이미지 로드` + (broken.length ? ' → ' + broken.join(', ') : ''));
      const bad = lines.filter(l => l.src && !l.loaded);
      T.ok(bad.length === 0, `${V} ${ch}: 대화 ${lines.length}줄의 초상화 로드 (초상화 ${lines.filter(l => l.src).length}줄)` + (bad.length ? ' → ' + bad.map(l => l.src).join(', ') : ''));
      T.ok(await page.noHScroll(), `${V} ${ch}: 가로 스크롤 없음`);
      T.ok(page.problems.length === 0, `${V} ${ch}: 콘솔 오류·404 없음` + (page.problems.length ? ' → ' + page.problems.join(' | ') : ''));
      page.problems.length = 0; lines.length = 0;
    };

    try {
      // ───────────── 챕터 1 ─────────────
      T.section(`${V} · 챕터 1`);
      await page.go(O + '/index.html');
      await page.ev('localStorage.clear();1'); await page.reload();
      T.ok(await has('별장 여행에') && !(await page.ev(`!!__qa.el('resume')`)), `${V} CH1: 새 게임 타이틀(저장 없음)`);
      await page.ev(`(()=>{const i=document.getElementById('nickname');i.value='QA탐정';i.dispatchEvent(new Event('input',{bubbles:true}));return 1})()`);
      await page.click('start'); await drain();
      T.ok((await save('ch1'))?.name === 'QA탐정', `${V} CH1: 닉네임으로 시작·자동 저장`);
      // 초보자 안내: 처음 시작 시 자동 표시 → Esc로 닫기 → 「게임 방법」으로 다시 열기 → 끝까지 넘겨 닫기
      T.ok(await page.ev(`!!document.querySelector('.guide-modal')`) && await has('여행을 시작해요'), `${V} CH1: 첫 플레이 안내 자동 표시`);
      await page.ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));1`); await new Promise(r => setTimeout(r, 150));
      T.ok(!(await page.ev(`!!document.querySelector('.guide-modal')`)), `${V} CH1: Esc로 안내 닫기`);
      T.ok(await has('현재 목표') && await has('「저녁 시간으로」'), `${V} CH1: 현재 목표 표시`);
      await page.click('guide'); T.ok(await has('여행을 시작해요'), `${V} CH1: 「게임 방법」으로 다시 열기`);
      for (let i = 1; i < 5; i++) await page.click('guide-step', String(i));
      T.ok(await has('시간 보내기') && await has('5 / 5'), `${V} CH1: 안내 5단계까지 넘기기`);
      await shot('ch1-guide-last');
      await page.click('close');
      T.ok(!(await page.ev(`!!document.querySelector('.guide-modal')`)), `${V} CH1: 「시작하기」로 안내 닫기`);
      await page.click('loc', 'living'); await page.click('interact', 'photo'); await drain();
      T.ok((await save('ch1')).clues.includes('photo'), `${V} CH1: 단서(사진) 기록`);
      await page.click('talk'); T.ok(await has('누구와 대화할까?'), `${V} CH1: 대화 상대 선택창 열림`);
      await page.click('talk-member', '꾸티뉴'); const l1 = await drain();
      T.ok(l1.some(l => l.src && l.src.includes('kkutinyu/normal')), `${V} CH1: 꾸티뉴 대화 초상화`);
      await page.click('hint'); T.ok(await has('이런 건 어때?'), `${V} CH1: 추천 활동 창 열림`);
      await page.click('close'); T.ok(!(await has('이런 건 어때?')), `${V} CH1: 추천 활동 창 닫힘`);
      await page.click('advance'); await drain();
      await page.reload();
      T.ok(await page.ev(`!!__qa.el('resume')`), `${V} CH1: 새로고침 후 '이어하기' 표시`);
      await page.click('resume');
      T.ok(await has('모두가 모이는 저녁'), `${V} CH1: 새로고침 후 저녁 단계 복원`);
      T.ok(!(await page.ev(`!!document.querySelector('.guide-modal')`)) && await has('시간대 2 / 4'), `${V} CH1: 새로고침 후 안내 재표시 없음·목표 갱신`);
      for (let i = 0; i < 3; i++) { await page.click('advance'); await drain(); }
      T.ok(await has('CHAPTER 01 · COMPLETE') && (await save('ch1')).phase === 'complete', `${V} CH1: 챕터 1 완료`);
      await page.click('home'); T.ok(await has('기록 확인'), `${V} CH1: 완료 후 타이틀 버튼(1차 수정)`);
      await page.click('resume'); T.ok(await has('CHAPTER 01 · COMPLETE'), `${V} CH1: 기록 확인 → 완료 화면`);
      await shot('ch1-complete');
      await endChapter('CH1');
      await page.click('chapter2'); await page.waitFor(`location.pathname.endsWith('/chapter2.html')&&document.readyState==='complete'`);

      // ───────────── 챕터 2 ─────────────
      T.section(`${V} · 챕터 2`);
      T.ok(await has('챕터 2 시작하기') && await has('QA탐정'), `${V} CH2: 챕터 1 기록 이어받기`);
      await page.click('begin'); await drain();
      await page.click('found'); await drain();
      await page.click('report'); T.ok(await has('신고 방법'), `${V} CH2: 신고 선택창`);
      await page.click('report-choice', 'self'); const l2 = await drain();
      T.ok(['lee-yuna/normal', 'jang-doyun/normal', 'yoon-haejun/normal'].every(p => l2.some(l => l.src && l.src.includes(p) && l.loaded)), `${V} CH2: 외부인 3명 초상화(2차 수정)`);
      // 초보자 안내: 조사 시작 시 자동 표시 → 끝까지 읽고 「조사 시작」
      T.ok(await page.ev(`!!document.querySelector('.guide-modal')`) && await has('사건 조사를 시작해요') && await has('2개 이상'), `${V} CH2: 조사 시작 시 안내 자동 표시(2개 이상 조건)`);
      for (let i = 1; i < 5; i++) await page.click('guide-step', String(i));
      await shot('ch2-guide-last');
      await page.click('close');
      T.ok(!(await page.ev(`!!document.querySelector('.guide-modal')`)) && await has('현재 0 / 3'), `${V} CH2: 안내 닫은 뒤 현재 목표 0/3`);
      await collect('E04a'); await collect('E09');
      await page.click('tab', 'people'); await page.click('talk', '이유나'); await drain();
      await page.reload();
      T.ok(await has('단서 3개'), `${V} CH2: 새로고침 후 수집 자료 3개 복원`);
      await page.click('room', 'management');
      T.ok(await page.ev(`document.querySelector('.scene img').getAttribute('src').endsWith('management.webp')`), `${V} CH2: 관리실 배경(2차 수정)`);
      await collect('E02'); await collect('E01');
      await page.click('room', 'study'); await collect('E08'); await collect('E11');
      await page.click('tab', 'board');
      T.ok(await page.ev(`[...document.querySelectorAll('.board-need')].map(e=>e.textContent).join('|')==='근거 자료 2 / 2 확보 · 자료 버튼에서 선택해 검증해 봐|근거 자료 3 / 3 확보 · 자료 버튼에서 선택해 검증해 봐|근거 자료 2 / 2 확보 · 자료 버튼에서 선택해 검증해 봐'`), `${V} CH2: 문제 카드 3개에 자료 확보 현황(모두 확보) 표시`);
      await shot('ch2-board-hints');
      await page.set('input[data-puzzle="P03"][value="yuna"]'); await page.click('solve', 'P03');
      T.ok(await has('연결 보드에서 직접 선택'), `${V} CH2: 증거 미선택 정답 → 거부`);
      await page.click('select-proof', 'ST-YUNA'); await page.click('select-proof', 'E09');
      await page.set('input[data-puzzle="P03"][value="unsure"]'); await page.click('solve', 'P03');
      T.ok(await has('입증되지 않아') && !(await save('ch2')).solved.includes('P03'), `${V} CH2: 오답 → 거부·저장 안 됨`);
      await page.set('input[data-puzzle="P03"][value="yuna"]'); await page.click('solve', 'P03'); await detail('P03 완료');
      for (const [id, proofs, ans] of [['P01', ['E04a', 'E02', 'E01'], 'offset7'], ['P02', ['E08', 'E11'], 'terrace']]) {
        for (const p of proofs) await page.click('select-proof', p);
        await page.set(`input[data-puzzle="${id}"][value="${ans}"]`); await page.click('solve', id); await detail(`${id} 완료`);
      }
      T.ok((await save('ch2')).solved.length === 3, `${V} CH2: 퍼즐 3개 해결`);
      await page.click('conclude'); T.ok(await has('CHAPTER 02 COMPLETE'), `${V} CH2: 챕터 2 완료`);
      await page.reload(); T.ok(await has('CHAPTER 02 COMPLETE'), `${V} CH2: 새로고침 후 완료 화면 유지`);
      await endChapter('CH2');
      await page.clickLink('chapter3.html');

      // ───────────── 챕터 3 ─────────────
      T.section(`${V} · 챕터 3`);
      T.ok(await has('챕터 3 시작하기'), `${V} CH3: 챕터 2 기록 이어받기`);
      await page.click('begin'); await drain();
      { const s3 = await save('ch3'); T.ok(['E01', 'E02', 'E04a', 'E08'].every(e => s3.evidence.includes(e)) && s3.solved.includes('P00'), `${V} CH3: 이전 증거 4개·P00 이어받기`); }
      await page.click('tab', 'people');
      for (const w of ['오세린', '장도윤', '윤해준']) { await page.click('talk', w); await drain(); }
      await page.click('confront', 'SERIN');
      T.ok(await has('서재 출입 기록(E08)을 먼저 확인하고 선택해'), `${V} CH3: 증거 없이 반박 → 거부`);
      await page.click('tab', 'board'); await page.click('proof', 'E08'); await page.click('tab', 'people');
      await page.click('confront', 'SERIN'); await drain();   // 반박 후 게임이 '기록' 탭으로 전환함(기존 동작)
      T.ok(await has('수집한 자료') && await has('오세린의 면담 녹음'), `${V} CH3: 반박 후 기록 탭에 E07 추가`);
      await page.click('tab', 'people'); await page.click('confront', 'DOYUN'); await drain();
      T.ok((await save('ch3')).confronted.length === 2 && (await save('ch3')).evidence.includes('E07'), `${V} CH3: 두 진술 반박 완료`);
      await page.click('room', 'living'); await collect('E04b', 'phone-video-blackout-2231.webp'); await collect('E04d', 'e04d-group-photo-2250.webp');
      await page.click('room', 'kitchen'); await collect('E04c', 'phone-video-restored-2246.webp'); await collect('E06', 'kitchen-timer-0036.webp');
      await page.click('room', 'corridor'); await collect('E05', 'e05-smartwatch-last-activity-2241.webp');
      await page.click('room', 'terrace'); await collect('E12', 'e12-vehicle-dashcam-2227.webp');
      await page.click('room', 'management');
      T.ok(await page.ev(`document.querySelector('.scene img').getAttribute('src').endsWith('management.webp')`), `${V} CH3: 관리실 배경(2차 수정)`);
      await page.click('collect', 'E03'); T.ok(await has('NVR 확대 영상이 개방되지 않았어'), `${V} CH3: 선행 퍼즐 전 E03 잠김`);
      await page.click('tab', 'board');
      for (const p of ['E04b', 'E04c', 'E02']) await page.click('proof', p);
      await page.set('input[data-answer="P04"][value="recorded"]'); await page.click('solve', 'P04');
      T.ok(await has('충돌하거나 아직 증명되지 않아'), `${V} CH3: P04 오답 → 거부`);
      await page.click('hint', 'P04'); T.ok(await has('파일 길이를 비교해'), `${V} CH3: 단계별 힌트 1`);
      await page.set('input[data-answer="P04"][value="outage20"]'); await page.click('solve', 'P04'); await detail('P04 완료');
      for (const p of ['E07', 'E04b', 'E05']) await page.click('proof', p);
      await page.set('input[data-answer="P05"][value="window"]'); await page.click('solve', 'P05'); await detail('P05 완료');
      await page.reload();
      T.ok(await has('P05 · 검증됨'), `${V} CH3: 새로고침 후 P04·P05 복원`);
      await collect('E03', 'e03-nvr-wallclock-223413.webp');
      await page.click('tab', 'board');
      for (const p of ['E02', 'E03', 'E06']) await page.click('proof', p);
      await page.set('input[data-answer="P06"][value="extra"]'); await page.click('solve', 'P06'); await detail('P06 완료');
      await page.click('tab', 'timeline');
      const TL = { arrival: '22:16', outage: '22:24', noise: '22:40~22:42', power: '22:44', frame: '22:34' };
      for (const [k, v] of Object.entries(TL)) await page.set(`select[data-time="${k}"]`, v);
      await page.click('timeline-check'); T.ok(await has('1개의 항목'), `${V} CH3: 시간표 오답 1칸 → 거부`);
      await page.set('select[data-time="frame"]', '23:01'); await page.click('timeline-check');
      T.ok(await has('시간표 일치') && (await save('ch3')).timelineDone, `${V} CH3: 시간표 검증`);
      await page.click('tab', 'records'); await page.click('read', 'E08'); await detail('기록 탭 E08 보기(1차 수정)', { image: 'e08-study-access-log.webp' });
      await page.click('conclude'); T.ok(await has('CHAPTER 03 COMPLETE'), `${V} CH3: 챕터 3 완료`);
      await endChapter('CH3');
      await page.clickLink('chapter4.html');

      // ───────────── 챕터 4 ─────────────
      T.section(`${V} · 챕터 4`);
      T.ok(await has('챕터 4 이어서 시작'), `${V} CH4: 챕터 3 기록 이어받기`);
      await page.click('begin'); await drain();
      await collect('E09', 'e09-barbecue-envelope.webp');
      await page.click('collect', 'E10'); T.ok(await has('이유나에게 이야기하고 사본 열람을 요청'), `${V} CH4: 대화 전 E10 잠김`);
      await page.click('tab', 'people'); await page.click('talk', '이유나'); await drain();
      await collect('E10', 'e10-accident-report.webp'); await collect('C01', 'c01-yoon-haejun-business-card.webp'); await collect('C02', 'c02-headlamp-demo.webp');
      await page.click('room', 'corridor'); await collect('E11', 'e11-terrace-footprints.webp'); await collect('E15', 'e15-burned-document.webp');
      await page.click('room', 'terrace'); await collect('C03'); await collect('C08', 'c08-muddy-exterior-door-tracks.webp');
      await page.click('room', 'management'); await page.click('talk', '최도식'); await drain();
      await collect('C07', 'c07-control-room-break-area.webp');
      await page.click('collect', 'E13'); T.ok(await has('관리실 휴게 흔적(C07)을 확인한 뒤') && !(await save('ch4')).evidence.includes('E13'), `${V} CH4: C07 전 대화로는 E13 잠김(1차 수정)`);
      await page.click('talk', '최도식'); await drain();
      await collect('E13', 'e13-breaker-log.webp');
      await page.click('room', 'basement'); await collect('C05', 'c05-unlocked-breaker-panel.webp');
      await page.click('collect', 'E14'); T.ok(await has('선반 뒤를 조사할 수 있어'), `${V} CH4: 퍼즐 전 E14 잠김`);
      await page.click('tab', 'board');
      await page.click('pick', 'C05'); await page.click('pick', 'E13');
      await page.set('input[data-answer="P09"][value="storm"]'); await page.click('solve', 'P09');
      T.ok(await has('현재 자료만으로 입증할 수 없어'), `${V} CH4: P09 오답 → 거부`);
      await page.set('input[data-answer="P09"][value="manual"]'); await page.click('solve', 'P09'); await detail('P09 완료');
      for (const p of ['C03', 'C02', 'E12']) await page.click('pick', p);
      await page.set('input[data-answer="P08"][value="route"]'); await page.click('solve', 'P08'); await detail('P08 완료');
      await collect('E14', 'e14-hidden-equipment.webp'); await collect('C09', 'c09-boot-heel-comparison.webp');
      for (const p of ['E11', 'E14', 'C09']) await page.click('pick', p);
      await page.set('input[data-answer="P07"][value="specific"]'); await page.click('solve', 'P07'); await detail('P07 완료');
      await page.click('room', 'storage'); await collect('C04', 'c04-accident-news.webp'); await collect('C06', 'c06-wall-inspection-report.webp'); await collect('C10', 'c10-construction-log.webp');
      for (const p of ['E10', 'C01', 'E15', 'C04', 'C10']) await page.click('pick', p);
      await page.set('input[data-answer="P10"][value="signer"]'); await page.click('solve', 'P10'); await detail('P10 완료');
      await page.reload();
      T.ok(await has('P10 완료') && await has('P07 완료'), `${V} CH4: 새로고침 후 퍼즐 진행 복원`);
      await page.click('tab', 'motives');
      const MOT = { '이유나': 'sale', '최도식': 'duty', '장도윤': 'contract', '박태성': 'sale', '오세린': 'identity' };
      for (const [n, v] of Object.entries(MOT)) await page.set(`select[data-motive="${n}"]`, v);
      await page.click('check-motives'); T.ok(await has('1명의 사정'), `${V} CH4: 거짓말 이유 1명 오답 → 거부`);
      await page.reload(); await page.click('tab', 'motives');
      T.ok(await page.ev(`document.querySelector('select[data-motive="최도식"]').value==='duty'`), `${V} CH4: 새로고침 후 분류 선택 복원`);
      await page.set('select[data-motive="이유나"]', 'source'); await page.click('check-motives'); await detail('P11 완료');
      await page.click('conclude'); T.ok(await has('CHAPTER 04 COMPLETE'), `${V} CH4: 챕터 4 완료`);
      await endChapter('CH4');
      await page.clickLink('chapter5.html');

      // ───────────── 챕터 5 ─────────────
      T.section(`${V} · 챕터 5`);
      T.ok(await has('QA탐정의 마지막 추리 시작'), `${V} CH5: 챕터 4 완료로 진입 허용·이름 이어받기`);
      await page.click('begin'); await drain();
      for (const [k, v] of Object.entries({ ...CH5.timeline, return: '23:01' })) await page.set(`select[data-time="${k}"]`, v);
      await page.click('time-check'); T.ok(await has('1개 사건이 다른 기록과 맞지 않아'), `${V} CH5: 시간표 오답 → 거부`);
      await page.set('select[data-time="return"]', '22:55'); await page.click('time-check'); await drain();
      T.ok((await save('ch5')).timelineDone, `${V} CH5: 시간표 검증`);
      const fillClaim = async slots => {
        for (const [k, v] of Object.entries(slots)) await page.set(`select[data-slot="${k}"]`, v);
        for (const [k, v] of Object.entries(CH5.proofs)) await page.set(`select[data-proof="${k}"]`, v);
        for (const [k, v] of Object.entries(CH5.secrets)) await page.set(`select[data-secret="${k}"]`, v);
      };
      const ending = async e => {
        await page.waitFor(`document.querySelector('.ch5-finish')`);
        const r = await page.ev(`(async()=>{const a=document.querySelector('.ch5-finish .finish-art');const url=getComputedStyle(a).backgroundImage.match(/url\\("?([^")]+)/)[1];
          const i=new Image();i.src=url;await i.decode().catch(()=>{});
          const all=[...document.querySelectorAll('*')].map(x=>getComputedStyle(x).backgroundImage).join(' ')+' '+[...document.images].map(x=>x.src).join(' ');
          return {file:url.split('/').pop(),w:i.naturalWidth,found:['true','normal','bad'].filter(n=>all.includes('ch5-'+n+'-ending')),cls:a.parentElement.className,label:a.getAttribute('aria-label')}})()`);
        T.ok(r.cls.includes(`ch5-finish ${e}`) && r.file === `ch5-${e}-ending.webp` && r.w === 1672, `${V} CH5 ${e.toUpperCase()} END: 전용 이미지 표시 (${r.file})`);
        T.ok(r.found.length === 1 && r.found[0] === e, `${V} CH5 ${e.toUpperCase()} END: 다른 엔딩 이미지 섞이지 않음`);
        T.ok(r.label && r.label.length > 5, `${V} CH5 ${e.toUpperCase()} END: 장면 설명 — ${r.label}`);
        await shot(`ch5-${e}-ending`);
      };
      // BAD → 재시도
      await fillClaim({ ...CH5.slots, culprit: 'serin' });
      await page.click('submit'); await ending('bad');
      T.ok(await has('너무 이른 지목') && await has('범인은 공개되지 않아'), `${V} CH5 BAD END: 문구`);
      await page.click('retry'); await page.reload();
      T.ok(await page.ev(`document.querySelector('select[data-slot="culprit"]')?.value==='serin'`), `${V} CH5: BAD 후 재시도·새로고침해도 입력 유지`);
      // 반박 단계 → 범인 변경(1차 버그) → 재검증
      await fillClaim({ ...CH5.slots, motive: 'sale' });
      await page.click('submit'); await drain();
      T.ok((await save('ch5')).stage === 'rebuttal' && await has('세 가지 반박에 증거로 답해 봐'), `${V} CH5: 최종 추리 통과 → 반박 단계`);
      await page.click('tab', 'reconstruct'); await page.set('select[data-slot="culprit"]', 'yuna');
      T.ok((await save('ch5')).stage === 'reconstruct' && !(await page.ev(`!!__qa.el('tab','rebuttal')`)), `${V} CH5: 반박 단계에서 범인 변경 → 재검증 요구(1차 수정)`);
      await page.set('select[data-slot="culprit"]', 'haejun'); await page.click('submit'); await drain();
      await page.reload();
      T.ok(await has('세 가지 반박에 증거로 답해 봐'), `${V} CH5: 새로고침 후 반박 단계 복원`);
      for (const [k, v] of Object.entries({ ...CH5.rebuttals, camera: 'E06' })) await page.set(`select[data-rebut="${k}"]`, v);
      await page.click('rebut-check'); T.ok(await has('그 반박의 핵심과 맞지 않아') && (await save('ch5')).stage === 'rebuttal', `${V} CH5: 반박 오답 → 거부`);
      await page.set('select[data-rebut="camera"]', 'E03'); await page.click('rebut-check');
      await ending('normal');
      T.ok(await has('사건은 해결됐다') && await has('과거의 진실까지 파악하지는 못했다'), `${V} CH5 NORMAL END: 문구`);
      // NORMAL → 다른 결론 검토 → TRUE
      await page.click('review'); await page.set('select[data-slot="motive"]', 'transfer');
      await page.click('submit'); await drain();
      for (const [k, v] of Object.entries(CH5.rebuttals)) await page.set(`select[data-rebut="${k}"]`, v);
      await page.click('rebut-check'); await ending('true');
      T.ok(await has('모든 시계가 가리킨 진실'), `${V} CH5 TRUE END: 문구`);
      await page.reload(); T.ok(await has('TRUE END'), `${V} CH5: 새로고침 후 TRUE END 유지`);
      await endChapter('CH5');
      // 사건 자료·친구 대화(엔딩 후 검토 화면)
      await page.click('review');
      await page.click('tab', 'evidence'); await page.click('read', 'E16'); await detail('E16 보기', { image: 'e16-study-fireplace-closeup.webp' });
      await page.click('tab', 'people'); await page.click('talk', '꾸티뉴'); const l5 = await drain();
      T.ok(l5.length === 2 && l5.every(l => l.loaded), `${V} CH5: 친구 대화창 열기·초상화·닫기`);
      await endChapter('CH5 검토 화면');
    } catch (e) {
      T.ok(false, `${V}: 진행 중단 — ${e.message}`);
      await shot('error');
    }
    await page.close();
  }
  await server.close();
  const r = T.done(); process.exit(r.fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
