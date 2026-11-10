/* 꾸한성: 안개 속 별장 — CHAPTER 01 playable prototype
 * Local-first story engine. No network requests, accounts, analytics or backend.
 * Member roles/lines are fictional. Portraits available as local optimized WebP assets.
 */
(() => {
  'use strict';
  const KEY = 'gguhansung-fog-villa-save-v2';
  const P = ['day', 'dinner', 'late', 'night', 'complete'];
  const MEMBERS = ['꾸티뉴', '난워니', '김옥독', '만조', '야뿌', '모야', '하루노츠키', '윤타미', '야무지', '다뮤_'];
  const GUESTS = ['강석훈', '박태성', '최도식', '오세린', '윤해준', '이유나', '장도윤'];
  const MEMBER_SLUGS = Object.freeze({
    '꾸티뉴':'kkutinyu', '난워니':'nanwoni', '김옥독':'kimokdok', '만조':'manjo',
    '야뿌':'yappu', '모야':'moya', '하루노츠키':'harunotsuki', '윤타미':'yuntami',
    '야무지':'yamuji', '다뮤_':'damyu'
  });
  const portraitPath = (name,variant='normal') => {
    const slug=MEMBER_SLUGS[name];
    if(!slug)return null;
    return `assets/characters/${slug}/${variant}.webp`;
  };
  const avatarPath = (name) => {
    const slug=MEMBER_SLUGS[name];
    return slug?`assets/characters/${slug}/avatar.webp`:null;
  };
  const hasMemberPortrait = (name) => Object.hasOwn(MEMBER_SLUGS,name);
  // Preload and retain image objects so a dialogue line never appears before its portrait.
  const portraitCache = new Map();
  function preloadPortrait(src){
    if(!src) return Promise.resolve(false);
    if(portraitCache.has(src)) return portraitCache.get(src).promise;
    const image = new Image();
    image.decoding = 'sync';
    const record = {image,ready:false,promise:null};
    record.promise = new Promise(resolve=>{
      const done = success=>{record.ready=success;resolve(success);};
      image.onload=()=>{
        // onload means the resource is available; decode ensures the bitmap is paint-ready.
        if(typeof image.decode === 'function') image.decode().then(()=>done(true)).catch(()=>done(true));
        else done(true);
      };
      image.onerror=()=>done(false);
      image.src=src;
      if(image.complete && image.naturalWidth) done(true);
    });
    portraitCache.set(src,record);
    return record.promise;
  }
  function isPortraitReady(src){return portraitCache.get(src)?.ready===true;}
  function warmDialoguePortraits(items,index=0){
    for(const line of items.slice(index,index+3)){
      if(hasMemberPortrait(line[0]))preloadPortrait(portraitPath(line[0],poseForLine(line)));
    }
  }
  // The first conversations begin with narration. Use that time to load character art.
  for(const name of MEMBERS) preloadPortrait(portraitPath(name,'normal'));
  function poseForLine(item){
    const expression=item[2];
    if(['normal','surprised','night'].includes(expression))return expression;
    if(state?.phase==='complete')return 'surprised';
    if(state?.phase==='night')return 'night';
    return 'normal';
  }
  function avatarImage(name){
    const src=avatarPath(name);
    return src?`<img class="char-avatar" src="${esc(src)}" alt="" loading="lazy" decoding="async">`:'';
  }
  const ARRIVALS = {
    day: ['꾸티뉴','야뿌','만조','모야','다뮤_','하루노츠키'],
    dinner: ['꾸티뉴','야뿌','만조','모야','다뮤_','하루노츠키','난워니','김옥독'],
    late: MEMBERS,
    night: MEMBERS,
    complete: MEMBERS,
  };
  const PLACES = [
    {id:'exterior',label:'별장 외관',sub:'안개 내려앉은 산길과 불 밝힌 별장',num:'00'},
    {id:'living',label:'별장 거실',sub:'따뜻한 벽난로와 오래된 시계',num:'01'},
    {id:'foyer',label:'별장 현관',sub:'여행 가방과 투숙객 안내문',num:'02'},
    {id:'corridor',label:'1층 복도',sub:'객실로 이어진 긴 복도',num:'03'},
    {id:'kitchen',label:'주방과 식당',sub:'저녁 준비와 작은 소란',num:'04'},
    {id:'terrace',label:'별장 테라스',sub:'산길과 안개 낀 숲',num:'05'}
  ];
  // Members are placed according to the current travel scene, not shown everywhere at once.
  const MEMBER_ROOMS={
    day:{exterior:['야뿌'],living:['꾸티뉴','만조'],foyer:['하루노츠키'],corridor:['다뮤_'],kitchen:['모야']},
    dinner:{living:['꾸티뉴','만조'],foyer:['하루노츠키'],corridor:['다뮤_'],kitchen:['모야','난워니','김옥독'],terrace:['야뿌']},
    late:{living:['꾸티뉴','난워니','김옥독','다뮤_'],foyer:['윤타미','야무지'],corridor:['만조','하루노츠키'],kitchen:['모야'],terrace:['야뿌']},
    night:{living:[...MEMBERS]}
  };
  const peopleIn = (room)=>MEMBER_ROOMS[state?.phase]?.[room]||[];
  const memberRoom = (name)=>{
    const rooms=MEMBER_ROOMS[state?.phase]||{};
    return Object.keys(rooms).find(room=>rooms[room].includes(name))||null;
  };
  function scenePeople(){
    const names=peopleIn(state.location);
    if(!names.length)return '';
    const shown=names.slice(0,3);
    const cells=shown.map(name=>`<button class="scene-person" type="button" data-action="talk-member" data-id="${esc(name)}" aria-label="${esc(name)}와 대화"><img src="${esc(avatarPath(name))}" alt="" loading="eager" decoding="async"><span>${esc(name)}</span></button>`).join('');
    const more=names.length>shown.length?`<button class="scene-person-more" type="button" data-action="talk">외 ${names.length-shown.length}명 · 더 보기</button>`:'';
    return `<div class="scene-people" aria-label="이 장소에 있는 친구들">${cells}${more}</div>`;
  }
  // CH1의 사진과 메모는 '증거'가 아닌 평범한 여행 기록이다.
  const CLUES = {
    photo:{title:'선발 멤버들의 첫 사진',tag:'여행 사진',text:'15:10 별장에 먼저 도착한 꾸티뉴·야뿌·만조·모야·다뮤_의 사진. 나중에 도착한 친구들을 기다리는 중이다.'},
    'guest-list':{title:'별장 이용 안내문',tag:'안내',text:'별장에는 꾸한성 외에도 강석훈·박태성·최도식·오세린·윤해준·이유나·장도윤이 머무르는 듯하다.'},
    meal:{title:'저녁 준비 사진',tag:'여행 사진',text:'19:30 난워니와 김옥독이 도착했다. 거실과 주방을 오가며 함께 저녁을 준비했다.'},
    argument:{title:'바비큐 사진',tag:'여행 사진',text:'20:41 테라스 바비큐 사진. 뒤쪽에 강석훈이 이유나에게 봉투를 건네는 모습이 작게 찍혀 있다.'},
    'arrival-photo':{title:'뒤늦은 도착 사진',tag:'단체 채팅',text:'21:25 윤타미와 22:02 야무지가 도착했다. 단톡방에서 도착 사진을 확인할 수 있다.'},
    cctv:{title:'거실 단체사진과 모니터',tag:'여행 사진',text:'22:12 난워니가 올린 모두의 사진. 현관 관리실 모니터에도 같은 순간이 지나갔다. 지금은 자세히 볼 이유가 없다.'},
    storm:{title:'안개 낀 산길',tag:'풍경',text:'22:21, 빗줄기가 거세지고 별장 앞 산길이 잘 보이지 않는다. 모두 실내에 모여 마지막 게임을 준비한다.'}
  };
  const GOALS = {
    day:[['clue','photo','기념사진 다시 보기','거실에서 사진을 눌러 볼 수 있어.'],['clue','guest-list','별장 안내문 구경','현관의 안내문을 살펴봐.']],
    dinner:[['clue','meal','저녁 식탁 구경','주방에 가면 친구들과 나눈 이야기가 있어.'],['clue','argument','바비큐 사진 보기','1층 복도에서 친구가 보여주는 사진을 볼 수 있어.']],
    late:[['clue','arrival-photo','늦게 온 친구들 환영','현관의 사진을 확인해 봐.'],['clue','cctv','단체사진 보기','현관의 작은 화면도 눌러 볼 수 있어.']],
    night:[['clue','storm','테라스에서 날씨 보기','테라스에서 밖의 풍경을 볼 수 있어.']]
  };
  const STAGES = {
    day:{clock:'15:10',heading:'별장에 도착한 오후',title:'한적한 별장을 둘러보자',desc:'사진을 찍고 방도 구경해 봐. 하고 싶은 만큼 둘러본 뒤 시간을 보내도 좋아.',action:'저녁 시간으로',next:'dinner'},
    dinner:{clock:'19:30',heading:'모두가 모이는 저녁',title:'저녁을 먹고 쉬어 가자',desc:'반가운 친구들과 수다를 떨고 사진도 남겨 봐.',action:'밤으로 시간 보내기',next:'late'},
    late:{clock:'22:12',heading:'늦게 온 친구들',title:'여행의 마지막 친구들',desc:'윤타미와 야무지가 도착했어. 다 함께 사진을 남길 수 있어.',action:'마지막 게임 준비',next:'night'},
    night:{clock:'22:21',heading:'비가 쏟아지는 밤',title:'거실에서 게임 한 판',desc:'밖에 비가 거세게 내려. 친구들과 마지막으로 이야기하고 게임을 시작해 봐.',action:'게임 시작하기',next:'complete'}
  };
  const HOTSPOTS = {
    exterior:[
      {id:'view',label:'산길 풍경',x:17,y:34,when:['day','dinner','late','night']},
      {id:'car',label:'주차장',x:24,y:78,when:['day','dinner','late','night']}
    ],
    living:[
      {id:'photo',label:'단체사진',x:57,y:76,when:['day','dinner','late','night']},
      {id:'fireplace',label:'벽난로',x:23,y:57,when:['day','dinner','late','night']},
      {id:'clock',label:'벽시계',x:83,y:25,when:['day','dinner','late','night']}
    ],
    foyer:[
      {id:'guest-list',label:'투숙객 안내문',x:74,y:39,when:['day','dinner','late','night']},
      {id:'arrival-photo',label:'도착 사진',x:49,y:78,when:['late','night']},
      {id:'cctv',label:'CCTV 화면',x:23,y:45,when:['late','night']},
      {id:'luggage',label:'여행 가방',x:45,y:83,when:['day','dinner']}
    ],
    corridor:[
      {id:'argument',label:'복도에서 들리는 말',x:76,y:42,when:['dinner','late','night']},
      {id:'guest-doors',label:'객실 문',x:87,y:67,when:['day','dinner','late','night']},
      {id:'hall-paintings',label:'복도 그림',x:34,y:49,when:['day','dinner','late','night']}
    ],
    kitchen:[
      {id:'meal',label:'저녁 식탁',x:49,y:75,when:['dinner','late','night']},
      {id:'fridge',label:'냉장고',x:19,y:55,when:['day','dinner','late','night']}
    ],
    terrace:[
      {id:'storm',label:'안개 낀 산길',x:67,y:40,when:['night']},
      {id:'view',label:'숲 풍경',x:64,y:44,when:['day','dinner','late']},
      {id:'car',label:'주차된 차량',x:26,y:77,when:['day','dinner','late','night']}
    ]
  };
  const ICONS = {
    note:'<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v6h6M9 13h7M9 17h7"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 11a3 3 0 1 0-1-6M17 14a5 5 0 0 1 4 5v1"/>',
    arrow:'<path d="m5 12 14 0m-6-6 6 6-6 6"/>',
    book:'<path d="M12 7c-3-2-7-2-10-1v14c3-1 7-1 10 1 3-2 7-2 10-1V6c-3-1-7-1-10 1Zm0 0v14"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
    moon:'<path d="M20 15a8 8 0 0 1-11-11A9 9 0 1 0 20 15Z"/>',
    bolt:'<path d="m14 2-9 12h7l-2 8 9-12h-7l2-8Z"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    close:'<path d="M5 5 19 19M19 5 5 19"/>',
    restart:'<path d="M3 11a9 9 0 1 1 2 6m-2 2v-7h7"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
    hint:'<path d="M9 18h6m-5 4h4M8.6 15.3A7 7 0 1 1 15.4 15a4 4 0 0 0-1.4 3h-4a4 4 0 0 0-1.4-2.7Z"/>',
    save:'<path d="M5 3h12l4 4v14H3V3Zm2 0v6h9V3M7 21v-8h10v8"/>'
  };
  const icon=(key,klass='icon')=>`<svg class="${klass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[key]||ICONS.note}</svg>`;
  const esc = (x)=>String(x??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const app = document.getElementById('app');
  let state = load();
  let introName = state?.name || '';
  let overlay = null;
  let notebookTab = 'clues';
  let toastTimer = null;
  let showToast = '';
  function load() {
    try {
      const x = JSON.parse(localStorage.getItem(KEY)||'null');
      if(!x || x.version!==2 || !P.includes(x.phase) || !PLACES.some(p=>p.id===x.location) || !Array.isArray(x.clues) || !Array.isArray(x.talks) || typeof x.name!=='string') return null;
      return x;
    } catch {return null;}
  }
  function persist(){try{if(state)localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('저장 공간이 제한되어 자동 저장되지 않을 수 있어.');}}
  function toast(text){showToast=text;render();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{showToast='';render();},3300);}
  function addLog(text){if(!state)return;state.log=[...(state.log||[]),text].slice(-24);}
  function has(type,id){return (type==='talk'?state.talks:state.clues).includes(id);}
  function goalSummary(){const goals=GOALS[state.phase]||[];const done=goals.filter(([type,id])=>has(type,id)).length;return {goals,done,total:goals.length,ready:true};}
  function start(name){
    name=(name||'').trim().slice(0,12)||'여행 친구';
    name=name.replace(/[<>]/g,'');
    state={version:2,name,phase:'day',location:'exterior',clues:[],talks:[],log:['15:10 — 산속 별장에 도착했다.'],hintUses:0,startedAt:Date.now(),finishedAt:null};
    persist();
    lines([
      ['내레이션','늦가을의 오후. 구불구불한 산길 끝에 커다란 별장이 나타났다.'],
      ['야뿌','잠깐, 여기 배경 예쁘다. 사진부터 찍자!'],
      ['만조','가방까지 다 나오잖아. 짐부터 내려놓자.'],
      ['꾸티뉴',`${name}! 왔네. 오는 길 괜찮았어?`],
      ['모야','방은 몇 개나 있는 거야? 엄청 큰데?'],
      ['다뮤_','저쪽은 별채인가? 일단 들어가 보자.'],
      ['내레이션','친구들의 웃음소리를 따라 별장 안으로 들어갔다. 창밖으로 숲이 넓게 펼쳐졌다.']
    ]);
  }

  let dialogueTransition=false;
  let dialogueSerial=0;
  function showDialogueLine(items,index,after){
    const serial=++dialogueSerial;
    const item=items[index];
    const src=hasMemberPortrait(item[0])?portraitPath(item[0],poseForLine(item)):null;
    warmDialoguePortraits(items,index);
    const display=()=>{
      if(serial!==dialogueSerial)return;
      dialogueTransition=false;
      overlay={type:'dialogue',items,index,after};
      render();
    };
    if(!src || isPortraitReady(src)){display();return;}
    // Keep the previous line visible (rather than flashing text without its image).
    dialogueTransition=true;
    const nextButton=app.querySelector('.dialogue-controls [data-action="next"]');
    if(nextButton){nextButton.disabled=true;nextButton.textContent='이미지 준비 중…';}
    preloadPortrait(src).then(display);
  }
  function lines(items,after=null){dialogueTransition=false;showDialogueLine(items,0,after);}
  function dialogueNext(){
    if(dialogueTransition || !overlay || overlay.type!=='dialogue')return;
    if(overlay.index<overlay.items.length-1){showDialogueLine(overlay.items,overlay.index+1,overlay.after);return;}
    ++dialogueSerial;
    const fn=overlay.after;overlay=null;if(fn)fn();render();
  }
  function talk(name){
    if(!state || !(ARRIVALS[state.phase]||MEMBERS).includes(name)) return;
    const phase=state.phase;
    const key=name+(phase==='night'&&name==='꾸티뉴'?'-night':'');
    const first=!state.talks.includes(key);
    if(first){state.talks.push(key);addLog(`${STAGES[phase]?.clock||'--:--'} — ${name}와 이야기했다.`);persist();}
    let messages=[];
    if(phase==='day'){
      const script={
        '꾸티뉴':[['꾸티뉴','여기 생각보다 크지? 나도 아까 길 잘못 들어서 다른 건물까지 갈 뻔했어.'],[state.name,'별장에 우리 말고도 사람들이 있는 것 같아.'],['꾸티뉴','그러게. 공동으로 쓰는 곳인가 봐. 일단 방부터 보자.']],
        '야뿌':[['야뿌','첫 사진 잘 나왔다! 거실 탁자 위에 올려놨어.']],
        '만조':[['만조','넓은 방 하나 남았다. 누가 쓸지 정해야 되는데.']],
        '모야':[['모야','벽난로 있으니까 오늘은 늦게까지 놀아도 되겠네.']],
        '다뮤_':[['다뮤_','아까 들어오는 산길이 꽤 굽어 있더라. 밤엔 운전 조심해야겠어.']],
        '하루노츠키':[['하루노츠키','나도 왔어! 3시 반쯤 도착했는데 다들 어디 갔지?']]
      };messages=script[name]||[[name,'별장이 크네. 같이 구경하자.']];
    }else if(phase==='dinner'){
      const script={
        '난워니':[['난워니','7시 반에 겨우 도착! 저녁은 남겨 놨지?']],
        '김옥독':[['김옥독','들어오기 전부터 고기 냄새 나던데? 같이 먹자.']],
        '꾸티뉴':[['꾸티뉴','일단 먹고 게임 한 판 하면 딱이겠다.']],
        '야뿌':[['야뿌','사진 찍자. 배경에 숲 나오게!']],
        '모야':[['모야','주방 타이머는 정전되면 처음부터 다시 센대. 좀 특이하지?']]
      };messages=script[name]||[[name,'저녁 먹고 나서도 조금 놀다 가자.']];
    }else if(phase==='late'){
      const script={
        '윤타미':[['윤타미','9시 25분에 겨우 도착했어. 늦어서 미안!']],
        '야무지':[['야무지','나도 도착! 10시 2분이네. 이제 전원 다 온 거 맞지?']],
        '다뮤_':[['다뮤_','아까 윤해준 씨가 헤드랜턴 보여줬어. 빨간 불도 켜지더라. 명함도 하나 주셨어.']],
        '난워니':[['난워니','22시 12분 단체사진 올렸어. 다 같이 나왔지?']],
        '꾸티뉴':[['꾸티뉴','이제 진짜 다 왔네. 마지막으로 보드게임 한 판 하자!']]
      };messages=script[name]||[[name,'이제 다 모였으니까 사진 찍고 놀자.']];
    }else if(phase==='night'){
      const script={
        '꾸티뉴':[['꾸티뉴','{NAME}, 비가 꽤 세게 온다. 마지막 게임하고 잘까?'.replace('{NAME}',state.name)],[state.name,'그래, 다들 거실에 모여 있는 것 같아.'],['꾸티뉴','좋아. 벌칙은 설거지 정도로 하자.']],
        '모야':[['모야','천둥이 많이 치네. 아까도 전기가 잠깐 나갔잖아.']],
        '난워니':[['난워니','다들 마지막 한 판만 하고 자자!']],
        '야무지':[['야무지','밖이 완전 깜깜해. 멀리 잘 안 보인다.']]
      };messages=script[name]||[[name,'밖에 비가 많이 오네. 실내에 있자.']];
    }
    overlay=null;
    lines(messages);
  }

  function interact(id){
    if(!state)return;
    const clue=CLUES[id];
    if(clue){
      const fresh=!state.clues.includes(id);
      if(fresh){state.clues.push(id);addLog(`${STAGES[state.phase]?.clock||'--:--'} — 「${clue.title}」을 기록했다.`);persist();}
      const scripts={
        photo:[['야뿌','이거 봐! 우리가 처음 왔을 때 찍은 사진이야.'],['내레이션','오후 3시 10분. 먼저 도착한 다섯 친구의 모습이 찍혀 있다.']],
        'guest-list':[['내레이션','별장 이용 안내문에는 다른 투숙객들의 이름이 적혀 있다.'],['최도식','별채 시설 문제로 본관을 함께 이용하십니다. 불편한 점 있으면 말씀해 주세요.']],
        meal:[['김옥독','고기 식기 전에 먹어야지!'],['내레이션','난워니와 김옥독이 저녁 일곱 시 반에 도착했다. 주방은 금세 시끌벅적해졌다.']],
        argument:[['야뿌','이 사진 봐. 배경이 진짜 잘 나왔지?'],['내레이션','사진 뒤편에서 강석훈이 이유나에게 서류 봉투를 건네고 있다. 그저 별장 사람들인가 보다.']],
        'arrival-photo':[['윤타미','나 9시 25분쯤 도착했어.'],['야무지','나는 10시 2분! 이제 다 왔네.']],
        cctv:[['난워니','22시 12분에 사진 올렸어. 단톡에서 확인해 봐.'],['내레이션','관리실 모니터에도 같은 거실 장면이 잠깐 지나갔다. 영상 화면의 시계는 지금은 눈여겨보지 않았다.']],
        storm:[['내레이션','산길의 안개가 짙다. 비는 점점 거세지고 있다.'],['만조','오늘은 바깥으로 나가지 말자. 그냥 안에서 놀자.']]
      };
      lines(fresh?scripts[id]:[['내레이션',`「${clue.title}」을 다시 확인했다.`],[state.name,clue.text]]);
    }else{
      const flavor={fireplace:[['내레이션','벽난로의 장작이 타닥타닥 타오른다.']],clock:[['내레이션','배터리로 움직이는 벽시계가 규칙적으로 소리를 낸다.']],luggage:[['내레이션','가방들이 현관 옆에 쌓여 있다.']],fridge:[['내레이션','냉장고에는 음식과 음료가 가득하다.']],
        'guest-doors':[['내레이션','나란히 이어진 객실 문 앞에 여행가방이 놓여 있다. 새로 도착한 친구들은 어느 방을 쓸지 이야기 중이다.']],
        'hall-paintings':[['내레이션','복도 벽에는 오래된 산 풍경 그림들이 걸려 있다. 여행 온 첫날에는 그저 장식처럼 보인다.']],
        view:[['내레이션','멀리 산과 숲이 펼쳐져 있고 안개가 조금씩 밀려온다.']],car:[['내레이션','주차장에 차가 몇 대 세워져 있다. 아직 누구의 차인지 다 알지는 못한다.']]};
      lines(flavor[id]||[['내레이션','특별한 것은 보이지 않는다.']]);
    }
  }

  function advance(){
    if(!state || !STAGES[state.phase])return;
    // Warm night portraits as the story approaches the blackout.
    if(state.phase==='late') for(const name of MEMBERS)preloadPortrait(portraitPath(name,'night'));
    if(state.phase==='night') for(const name of MEMBERS)preloadPortrait(portraitPath(name,'surprised'));
    // 여행 파트는 체크리스트가 아니라 자유롭게 시간을 보내는 구조다.
    if(state.phase==='day'){
      state.phase='dinner';state.location='kitchen';addLog('15:41~15:48 — 잠깐 정전이 일어났다. 19:30 — 두 친구가 추가로 도착했다.');persist();
      lines([
        ['내레이션','오후 3시 반쯤 하루노츠키까지 도착했다. 그런데 오후 3시 41분, 갑자기 별장 전체의 조명이 꺼졌다.'],
        ['모야','어? 전기 나갔어?'],
        ['하루노츠키','잠깐 영상 찍고 있을게. 나중에 보면 웃길 것 같아.'],
        ['내레이션','7분쯤 지나 불이 돌아왔다. 관리인은 모니터를 보고 작은 소리로 중얼거렸다.'],
        ['최도식','시간도 또 이상하게 뜨네….'],
        ['꾸티뉴','그래도 금방 돌아와서 다행이다.'],
        ['내레이션','저녁 일곱 시 반, 난워니와 김옥독이 도착하며 주방이 다시 시끌벅적해졌다.'],
        ['난워니','우리 왔어! 늦었지?'],
        ['김옥독','오늘 저녁 아직 남았지?']
      ]);
    }else if(state.phase==='dinner'){
      state.phase='late';state.location='foyer';addLog('20:41 — 바비큐 사진. 21:25 — 윤타미 도착. 22:02 — 야무지 도착. 22:12 — 단체사진.');persist();
      lines([
        ['내레이션','밤이 되자 테라스에서는 바비큐 사진을 찍었다. 별장 다른 손님들도 각자의 시간을 보내고 있었다.'],
        ['야뿌','잠깐만. 이 구도 예쁘다! 사진 하나 찍자.'],
        ['내레이션','9시 25분 윤타미가, 10시 2분 야무지가 도착했다.'],
        ['윤타미','나 왔어! 길이 좀 복잡하더라.'],
        ['야무지','이제 다 온 거 맞지?'],
        ['윤해준','밤에는 바깥 통로가 미끄럽습니다. 낮에 점검할 때도 그랬어요.'],
        ['다뮤_','아까 그 헤드랜턴 보여주시던 분이군요. 빨간 불도 켜졌었죠?'],
        ['꾸티뉴','그럼 우리 다 모였으니까 사진 찍고 게임하자!'],
        ['난워니','22시 12분, 기념사진! 단톡에 올릴게.']
      ]);
    }else if(state.phase==='late'){
      state.phase='night';state.location='living';addLog('22:12 — 전원 단체사진을 남겼다. 22:21 — 거실에서 게임 준비.');persist();
      lines([
        ['내레이션','조금 전 찍은 단체사진이 단체 채팅에 올라왔다.'],
        ['만조','게임 지는 사람 설거지하기 어때?'],
        ['김옥독','그건 너무 무서운 벌칙인데?'],
        ['모야','밖에 비 오는 소리 엄청 크다.'],
        ['꾸티뉴','이제 마지막 한 판만 하고 자자. 내일도 놀아야지.']
      ]);
    }else if(state.phase==='night'){
      state.phase='complete';state.finishedAt=Date.now();addLog('22:24 — 갑작스러운 정전.');persist();
      lines([
        ['내레이션','오후 10시 21분. 거실에서 게임을 준비하던 중 구조 점검을 하러 왔다는 윤해준이 복도 쪽으로 지나갔다.'],
        ['윤해준','아까 분전반이 조금 마음에 걸려서요. 확인하고 오겠습니다.'],
        ['만조','아, 네. 아까도 전기가 잠깐 나갔었죠.'],
        ['야뿌','자, 게임 시작하자!'],
        ['내레이션','오후 10시 24분. 천둥이 울리는 순간 별장의 불이 전부 꺼졌다.'],
        ['모야','어, 아까처럼 금방 돌아오겠지?'],
        ['꾸티뉴','일단 움직이지 말고 휴대폰 불부터 켜자.'],
        ['내레이션','그날 밤의 긴 어둠은 그렇게 시작됐다.']
      ],()=>{render();});
    }
    render();
  }

  function hint(){const info=goalSummary(),missing=info.goals.find(([type,id])=>!has(type,id));if(!missing){toast('이제 다음 시간으로 넘어가도 좋아.');return;}state.hintUses=(state.hintUses||0)+1;addLog(`오늘의 추천 활동 — ${missing[2]}`);persist();overlay={type:'detail',title:'이런 건 어때?',body:`<p><strong>${esc(missing[2])}</strong></p><p>${esc(missing[3])}</p><p class="credit">추천 활동 확인 ${state.hintUses}회 · 이후 결과 화면에 반영됩니다.</p>`};render();}
  function elapsed(){if(!state)return '00:00';const seconds=Math.max(0,Math.round(((state.finishedAt||Date.now())-state.startedAt)/1000));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
  function fmtList(a){return a.map(x=>esc(x)).join(' · ');}
  function artDefs(){return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#172943"/><stop offset=".58" stop-color="#3e5370"/><stop offset="1" stop-color="#536477"/></linearGradient><linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5d6476"/><stop offset="1" stop-color="#27364e"/></linearGradient><linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#554637"/><stop offset="1" stop-color="#241d22"/></linearGradient><linearGradient id="goldwindow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff1bd"/><stop offset="1" stop-color="#b77f4f"/></linearGradient><radialGradient id="lamp"><stop stop-color="#ffd89b" stop-opacity=".65"/><stop offset="1" stop-color="#e8a95d" stop-opacity="0"/></radialGradient><radialGradient id="fog"><stop stop-color="#d1dce0" stop-opacity=".35"/><stop offset="1" stop-color="#c6d3dc" stop-opacity="0"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="8"/></filter></defs>`;}
  function artVilla(){return `<svg aria-label="안개 낀 산속 별장 일러스트" viewBox="0 0 800 950" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${artDefs()}<rect width="800" height="950" fill="url(#sky)"/><circle cx="625" cy="155" r="58" fill="#e7ddc2" opacity=".75"/><circle cx="625" cy="155" r="101" fill="url(#fog)"/><path d="M0 480 160 180 260 385 405 135 650 450 750 280 800 430v520H0Z" fill="#233953"/><path d="M0 555 124 335 270 550 435 290 610 555 770 370 800 440v510H0Z" fill="#1a3040"/>${Array.from({length:14},(_,i)=>{let x=i*68-40;let y=340+(i%3)*43;return `<path d="M${x} ${y+250}v-110m-40 55 40-135 40 135m-31-55 31-108 31 108" stroke="#132a31" stroke-width="18" fill="none" opacity=".8"/>`;}).join('')}<ellipse cx="390" cy="715" rx="500" ry="200" fill="url(#fog)"/><path d="M89 550 400 350 718 550v344H89Z" fill="#202938" stroke="#1c222c" stroke-width="10"/><path d="M45 565 400 313 758 565 724 600 398 377 85 600Z" fill="#433b40" stroke="#141c2c" stroke-width="12"/><path d="M192 545V435l138-92v97" stroke="#5d4f4a" stroke-width="20" fill="none"/><path d="M100 605h612M100 660h612M100 715h612M100 770h612M100 825h612" stroke="#394050" stroke-width="7"/><path d="M388 650h106v244H388Z" fill="#121925" stroke="#9d7c54" stroke-width="10"/><path d="M398 664h87v218h-87Z" fill="#51413b"/><circle cx="470" cy="778" r="5" fill="#e8ca8c"/><path d="M160 630h138v120H160zM531 630h138v120H531z" fill="url(#goldwindow)" stroke="#352a2c" stroke-width="13"/><path d="M229 630v120m-69-60h138M600 630v120m-69-60h138" stroke="#5b463a" stroke-width="9"/><path d="M333 480h132v109H333Z" fill="url(#goldwindow)" stroke="#55453f" stroke-width="12"/><path d="M399 480v109m-66-55h132" stroke="#5d4a40" stroke-width="7"/><ellipse cx="399" cy="892" rx="440" ry="44" fill="#c4c7be" opacity=".28"/><g fill="#122734"><path d="m0 775 50-220 55 220zM0 760 48 500 100 760zM650 820 720 475 800 820zM720 760l48-260 65 260z"/></g><ellipse cx="190" cy="835" rx="340" ry="70" fill="url(#fog)"/><ellipse cx="650" cy="860" rx="310" ry="90" fill="url(#fog)"/><path d="M0 920q180-95 400-20t400 0v80H0" fill="#182b31"/></svg>`;}
  function baseRoom(night=false){return `${artDefs()}<rect width="1000" height="560" fill="url(#wall)"/><path d="M0 0 155 95v355L0 560ZM1000 0 845 95v355l155 110Z" fill="#1c293c" opacity=".5"/><path d="M0 416 500 322 1000 416v144H0Z" fill="url(#floor)"/><path d="M0 418 500 323 1000 418" fill="none" stroke="#a18b75" stroke-width="5" opacity=".4"/><path d="M155 95 500 60 845 95v325L500 322 155 420Z" fill="#617080" opacity=".11"/><path d="M155 95v325m690-325v325M500 60v263" stroke="#8f837c" opacity=".24" stroke-width="8"/><ellipse cx="505" cy="420" rx="375" ry="125" fill="url(#lamp)" opacity="${night?.2:.75}"/>`}
  function sceneLiving(night){return `<svg class="scene-art" role="img" aria-label="별장 거실 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${baseRoom(night)}<rect x="336" y="103" width="328" height="211" rx="4" fill="#2d2d3d" stroke="#a58b69" stroke-width="19"/><rect x="356" y="123" width="288" height="172" fill="url(#sky)"/><path d="M356 256 435 165 485 228 551 149 644 255v40H356Z" fill="#25394d"/><path d="M356 268 419 205 467 249 553 187 644 270" fill="none" stroke="#172d39" stroke-width="29"/><path d="M500 123v172M356 212h288" stroke="#7f7466" stroke-width="12"/><path d="M330 110q52 96 23 198h-27M669 110q-52 96-23 198h27" fill="#8b666b" stroke="#6c5460" stroke-width="13"/><rect x="84" y="258" width="208" height="171" fill="#584c4c" stroke="#aa8669" stroke-width="10"/><rect x="107" y="281" width="163" height="116" fill="#2e3039"/><path d="M115 385 162 312l33 49 22-31 43 55" fill="#ba754d" opacity=".8"/><path d="M145 382 166 345l17 36" stroke="#edd19a" stroke-width="9" fill="none"/><rect x="99" y="426" width="181" height="12" fill="#8f6c55"/><rect x="682" y="312" width="240" height="119" rx="22" fill="#3b455b" stroke="#1c293d" stroke-width="12"/><rect x="706" y="285" width="184" height="68" rx="18" fill="#657087"/><path d="M706 430v20m176-20v20" stroke="#211f29" stroke-width="13"/><ellipse cx="572" cy="454" rx="171" ry="54" fill="#161c2b" opacity=".34"/><path d="M443 412h270l-35 48H420Z" fill="#ad8160" stroke="#4c3e40" stroke-width="10"/><path d="M451 460v62m214-62v62" stroke="#4e3434" stroke-width="15"/><rect x="531" y="390" width="76" height="49" rx="3" fill="#e5ddc1" transform="rotate(8 570 413)"/><path d="M545 408h45m-40 11h35" stroke="#979181" stroke-width="3"/><circle cx="832" cy="115" r="47" fill="#ac9983" stroke="#5b4e4b" stroke-width="11"/><circle cx="832" cy="115" r="39" fill="#eee5c8"/><path d="M832 115v-25m0 25 15 11" stroke="#4b4c53" stroke-width="4"/><circle cx="832" cy="115" r="4" fill="#3a3840"/><path d="M720 315v-150m0 0-27 42h54z" fill="#d6b785" stroke="#5c4c42" stroke-width="8"/><circle cx="720" cy="242" r="95" fill="url(#lamp)"/><rect width="1000" height="560" fill="#101a2b" opacity="${night?.43:.05}"/></svg>`}
  function sceneFoyer(night){return `<svg class="scene-art" role="img" aria-label="별장 현관 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${baseRoom(night)}<rect x="337" y="70" width="315" height="361" fill="#211f27" stroke="#a58c70" stroke-width="22"/><rect x="359" y="94" width="271" height="324" fill="#514542"/><rect x="387" y="120" width="214" height="268" fill="#3b393c" stroke="#927b5f" stroke-width="8"/><rect x="416" y="155" width="159" height="95" fill="url(#sky)"/><path d="M416 249 470 172 530 244l45-55v61Z" fill="#1a313e"/><circle cx="569" cy="325" r="9" fill="#e5bf7c"/><rect x="700" y="131" width="209" height="197" fill="#e2d5b5" stroke="#584b43" stroke-width="15"/><path d="M725 165h150m-150 25h130m-130 25h138m-138 25h101m-101 25h146" stroke="#8e816c" stroke-width="8" opacity=".65"/><rect x="150" y="171" width="157" height="111" rx="7" fill="#1d2939" stroke="#827e77" stroke-width="9"/><rect x="169" y="187" width="119" height="70" fill="#4c667a"/><path d="M183 231 209 207h22l22 24h15" stroke="#c2d7c4" stroke-width="5" fill="none"/><circle cx="285" cy="283" r="6" fill="#ddad6f"/><rect x="460" y="419" width="132" height="71" rx="9" fill="#775461" stroke="#392d37" stroke-width="9"/><path d="M485 426v-24h82v24" fill="none" stroke="#bda184" stroke-width="9"/><rect x="248" y="448" width="157" height="73" rx="13" fill="#3b5362" stroke="#222a34" stroke-width="10"/><path d="M275 453v-18h92v18" stroke="#b2ab98" stroke-width="7" fill="none"/><path d="M85 415h77l28 68H57Z" fill="#607467"/><path d="M128 415v-99" stroke="#3a4b40" stroke-width="13"/><path d="M128 355q-75-20-49-69 59 15 49 69m0-19q60-49 81-4-55 34-81 4" fill="#546b58"/><rect width="1000" height="560" fill="#101a2b" opacity="${night?.45:.04}"/></svg>`}
  function sceneKitchen(night){return `<svg class="scene-art" role="img" aria-label="별장 주방과 식당 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${baseRoom(night)}<rect x="89" y="110" width="216" height="240" fill="#413c43" stroke="#9c8061" stroke-width="12"/><rect x="108" y="127" width="181" height="202" fill="#b9ad98"/><rect x="111" y="227" width="181" height="8" fill="#746457"/><rect x="165" y="137" width="9" height="187" fill="#796353"/><g fill="#587064"><rect x="128" y="158" width="32" height="59" rx="4"/><rect x="185" y="149" width="35" height="67" rx="4"/><rect x="230" y="157" width="36" height="61" rx="4"/></g><rect x="680" y="97" width="245" height="327" fill="#2c2730" stroke="#826952" stroke-width="13"/><rect x="703" y="119" width="197" height="283" fill="#4a3e3c"/><rect x="714" y="145" width="172" height="190" fill="#302f39"/><circle cx="877" cy="290" r="7" fill="#d2b080"/><path d="M340 70v150m-9 0h60l-18 33h-24Z" fill="#eac792" stroke="#a48260" stroke-width="9"/><circle cx="362" cy="217" r="125" fill="url(#lamp)"/><path d="M290 358 740 358 840 423 195 423Z" fill="#9e785b" stroke="#503d38" stroke-width="12"/><path d="M231 417v118m550-118v118" stroke="#61483f" stroke-width="25"/><ellipse cx="520" cy="346" rx="120" ry="29" fill="#e0d2b0" stroke="#746551" stroke-width="7"/><ellipse cx="520" cy="343" rx="93" ry="17" fill="#a24d3a"/><ellipse cx="395" cy="368" rx="57" ry="23" fill="#e2d6bd" stroke="#746551" stroke-width="6"/><ellipse cx="662" cy="368" rx="50" ry="23" fill="#e2d6bd" stroke="#746551" stroke-width="6"/><path d="M364 364q30-29 64 0" stroke="#51704c" stroke-width="10" fill="none"/><path d="M644 361q25-33 43-4" stroke="#726a44" stroke-width="10" fill="none"/><rect x="66" y="334" width="135" height="112" fill="#313b47" stroke="#93806c" stroke-width="8"/><circle cx="150" cy="384" r="20" fill="#bd8970"/><circle cx="103" cy="384" r="20" fill="#74917f"/><rect width="1000" height="560" fill="#101a2b" opacity="${night?.43:.05}"/></svg>`}
  function sceneTerrace(night){return `<svg class="scene-art" role="img" aria-label="안개 낀 별장 테라스 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${artDefs()}<rect width="1000" height="560" fill="url(#sky)"/><circle cx="790" cy="100" r="46" fill="${night?'#dadce1':'#f6d79d'}" opacity=".6"/><path d="M0 355 155 115 314 320 475 100 780 340 900 215 1000 290v270H0Z" fill="#263d50"/><path d="M0 399 152 243 325 387 548 203 765 375 1000 250v310H0Z" fill="#203343"/>${Array.from({length:22},(_,i)=>{let x=i*53-33;let y=215+(i%4)*26;return `<path d="M${x} 446v-${175+(i%2)*40}m-37 111 37-${170+(i%2)*40} 38 ${170+(i%2)*40}" stroke="#1a3339" stroke-width="12" fill="none" opacity=".85"/>`;}).join('')}<path d="M0 417h1000v143H0Z" fill="#554d4e"/><path d="M0 417h1000" stroke="#bdac8d" stroke-width="18"/><path d="M0 417v-65m150 65v-65m170 65v-65m170 65v-65m170 65v-65m170 65v-65m170 65v-65" stroke="#c1b297" stroke-width="15"/><path d="M0 351h1000" stroke="#bdae92" stroke-width="17"/><path d="M10 490h980m-850 70 30-140m100 140 30-140m100 140 30-140m100 140 30-140m100 140 30-140m100 140 30-140m100 140 30-140" stroke="#a59680" opacity=".4" stroke-width="4"/><path d="M100 430h212l45 39H58Z" fill="#243746" stroke="#748390" stroke-width="6"/><path d="M126 430 161 383h121l34 47Z" fill="#354e61" stroke="#748390" stroke-width="5"/><circle cx="119" cy="473" r="19" fill="#171f2a" stroke="#657481" stroke-width="6"/><circle cx="291" cy="473" r="19" fill="#171f2a" stroke="#657481" stroke-width="6"/><ellipse cx="550" cy="310" rx="500" ry="110" fill="url(#fog)"/><ellipse cx="720" cy="445" rx="450" ry="100" fill="url(#fog)"/><rect width="1000" height="560" fill="#0a1725" opacity="${night?.32:.02}"/>${night?Array.from({length:44},(_,i)=>{let x=(i*131)%1000,y=(i*67)%540;return `<path d="M${x} ${y}l-10 30" stroke="#b8cfdf" stroke-width="2" opacity=".38"/>`}).join(''):''}</svg>`}
  const SCENE_BACKGROUND_IMAGES = Object.freeze({
    exterior:['villa-exterior.webp','산속에 자리한 안개 낀 별장 외관'],
    living:['living.webp','벽난로와 커다란 창이 있는 따뜻한 별장 거실'],
    kitchen:['kitchen.webp','큰 식탁과 조명이 있는 별장 주방과 식당'],
    corridor:['corridor.webp','객실로 이어지는 나무 복도와 문들'],
    terrace:['terrace.webp','산과 숲이 보이는 밤의 별장 테라스']
  });
  function sceneArt(){
    const bg=SCENE_BACKGROUND_IMAGES[state.location];
    if(bg) return `<img class="scene-art scene-photo ${state.phase==='night'?'scene-photo-night':''}" src="assets/backgrounds/${bg[0]}" alt="${bg[1]}" loading="eager" decoding="async">`;
    return sceneFoyer(state.phase==='night');
  }
  function renderLanding(){return `<div class="app-shell"><main class="landing"><header class="landing-header"><div class="brand"><span class="brand-mark">✦</span><span>꾸한성 미스터리 프로젝트</span></div><span class="note">INTERACTIVE DETECTIVE STORY · CHAPTER 01</span></header><section class="landing-main"><div class="landing-copy"><div class="mini-title"><span class="tag">FIRST PLAYABLE CHAPTER</span><span class="upper">CASE 00 / PROLOGUE</span></div><h1>별장 여행에<br/><em>함께할래?</em></h1><p class="synopsis">열 명의 친구들과 떠난 조금 특별한 여행.<br/>웃음으로 시작한 그날 밤, 별장에선 아무도 예상하지 못한 일이 벌어진다.<br/><strong style="color:#f0dfc3">오늘은 그냥 함께 놀러 온 열한 번째 여행 친구다.</strong></p><div class="meta"><span>✦ 스토리형 추리</span><span>✦ PC · 모바일</span><span>✦ 로컬 자동 저장</span><span>✦ 챕터 1 공개</span></div><label class="nickname-label" for="nickname">어떤 이름으로 불리고 싶어?</label><div class="nickname-row"><input class="nickname-input" id="nickname" maxlength="12" placeholder="여행에서 사용할 닉네임 (최대 12자)" value="${esc(introName)}" autocomplete="nickname" /><button class="btn btn-primary" data-action="start">여행 시작 ${icon('arrow')}</button></div><div class="start-buttons">${state?`<button class="btn btn-secondary" data-action="resume">${state.phase==='complete'?'기록 확인':'이어하기'} ${icon('arrow')}</button><button class="btn btn-ghost" data-action="confirm-reset">진행 초기화</button>`:''}</div><div class="landing-alert" aria-live="polite">${esc(showToast)}</div></div><div class="landing-visual"><div class="landing-picture"><img class="landing-hero-img" src="assets/backgrounds/villa-main.webp" alt="꾸한성 멤버 열 명이 별장 앞에서 여행 사진을 찍은 메인 일러스트, 꾸한성: 안개 속 별장" fetchpriority="high" decoding="async" /></div></div></section><footer class="landing-foot"><span>이 작품은 팬 창작 게임이며, 등장인물과 사건은 모두 허구입니다.</span><span>v0.1 · 데모 · 이후 챕터 미공개</span></footer></main></div>`;}
  function notebookContent(){
    if(notebookTab==='clues'){
      const found=state.clues.map(id=>CLUES[id]).filter(Boolean);
      return found.length?found.map(c=>`<div class="entry"><h4><span style="color:var(--gold)">◈</span> ${esc(c.title)}</h4><p>${esc(c.text)}</p></div>`).join(''):`<div class="empty">아직 남긴 사진이나 메모가 없어. 이곳저곳 구경해 봐.</div>`;
    }
    if(notebookTab==='people'){
      const arr=ARRIVALS[state.phase]||MEMBERS;
      return `<div class="entry"><h4>꾸한성 멤버 · ${arr.length} / 10명 도착</h4><p>${fmtList(arr)}</p></div><div class="entry"><h4>별장에서 만난 사람들</h4><p>${fmtList(GUESTS)}</p></div><div class="entry"><h4>꾸티뉴와 당신</h4><p>꾸티뉴는 이번 여행에 <strong>${esc(state.name)}</strong>도 함께 왔다.</p></div>`;
    }
    return (state.log||[]).slice().reverse().map(l=>`<div class="entry"><p>• ${esc(l)}</p></div>`).join('');
  }
  function renderGame(){const st=STAGES[state.phase],sum=goalSummary();const done=Object.keys(CLUES).length;const avail=HOTSPOTS[state.location].filter(x=>x.when.includes(state.phase));const loc=PLACES.find(x=>x.id===state.location);const pct=(P.indexOf(state.phase)/4*100)|0;
    return `<div class="app-shell"><div class="game-layout"><aside class="rail"><div class="rail-brand brand"><span class="brand-mark">✦</span><span>안개 속 별장</span></div><div><div class="nav-title">EXPLORATION / 장소</div><nav class="location-nav" aria-label="장소 이동">${PLACES.map(l=>`<button class="location-button ${state.location===l.id?'active':''}" data-action="loc" data-id="${l.id}" aria-current="${state.location===l.id?'page':'false'}"><span class="number">${l.num}</span><span>${l.label}</span></button>`).join('')}</nav></div><div class="rail-stat"><h3>CHAPTER 01 · 진행도</h3><div class="progress-track"><div class="progress-bar" style="width:${pct}%"></div></div><p class="small muted" style="margin-top:8px">${st.heading}</p><p class="small muted" style="margin-top:6px">구경한 곳 ${sum.done} / ${sum.total}</p></div><div class="rail-bottom"><button class="btn btn-secondary" data-action="talk">${icon('people')} 동료와 대화</button><button class="btn btn-ghost" data-action="home">${icon('book')} 타이틀 화면</button></div></aside><main class="game-main"><header class="topbar panel"><div class="left"><span class="tag">CH.01</span><div><span class="upper">${esc(st.heading)}</span><h2>꾸한성: 안개 속 별장</h2></div></div><div class="right"><span class="muted small saved">${icon('save')} 자동 저장</span><span class="clock">${st.clock}</span></div></header><div class="mobile-location" aria-label="장소 이동">${PLACES.map(l=>`<button class="btn btn-compact ${l.id===state.location?'btn-primary':'btn-secondary'}" data-action="loc" data-id="${l.id}">${l.label}</button>`).join('')}</div><section class="scene-frame" aria-label="${esc(loc.label)} 탐색 화면">${sceneArt()}<div class="scene-vignette"></div><div class="scene-title"><strong>${esc(loc.label)}</strong><span>${esc(loc.sub)}</span></div>${state.location==='exterior'?`<button class="hotspot" style="left:63%;top:79%" data-action="loc" data-id="foyer" aria-label="현관으로 들어가기"><span class="hotspot-pin">→</span>별장 안으로</button>`:''}${scenePeople()}${avail.map(h=>`<button class="hotspot" style="left:${h.x}%;top:${h.y}%" data-action="interact" data-id="${h.id}" aria-label="${esc(h.label)} 조사"><span class="hotspot-pin">${state.clues.includes(h.id)?'✓':'?'}</span>${esc(h.label)}</button>`).join('')}<div class="scene-bottom"><div class="scene-direction">궁금한 물건을 누르거나 다른 장소를 구경해 봐.</div><div class="scene-controls"><button class="btn btn-compact btn-secondary" data-action="talk">${icon('people')} 동료와 대화</button></div></div></section><section class="quest-box panel"><div class="quest-icon">${icon('search')}</div><div class="quest-content"><div class="chapter-step">TODAY’S PLAN · 선택 활동</div><h3>${esc(st.title)}</h3><p>${esc(st.desc)}</p></div><div class="quest-actions"><button class="btn ${sum.ready?'btn-primary':'btn-secondary'}" data-action="advance" ${sum.ready?'':'disabled'}>${esc(st.action)} ${icon('arrow')}</button></div></section><section class="log-panel panel"><div class="section-heading"><h3>가볍게 둘러볼 거리</h3><button class="btn btn-ghost btn-compact" data-action="talk">${icon('people')} 인물 대화</button></div><div style="display:grid;gap:10px">${sum.goals.map(([type,id,label])=>`<div style="display:flex;align-items:center;gap:9px;font-size:12px;color:${has(type,id)?'#a4d6b9':'#d7dbe6'}"><span style="width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:${has(type,id)?'#315648':'#354058'};font-size:10px">${has(type,id)?'✓':'·'}</span><span style="${has(type,id)?'opacity:.75':''}">${esc(label)}</span></div>`).join('')}</div></section></main><aside class="aside"><div class="notebook panel"><div class="eyebrow">TRAVEL ALBUM</div><h3>여행 기록</h3><p class="notebook-sub">${esc(state.name)}의 여행 사진과 메모 · ${state.clues.length}개</p><div class="tab-row" role="tablist" aria-label="수첩 탭">${[['clues','사진·메모'],['people','사람들'],['timeline','일지']].map(([id,title])=>`<button class="tab ${notebookTab===id?'active':''}" data-action="tab" data-id="${id}" role="tab" aria-selected="${notebookTab===id}">${title}</button>`).join('')}</div><div class="tab-pane" role="tabpanel">${notebookContent()}</div><button class="btn btn-secondary" data-action="hint">${icon('hint')} 추천할 거리</button></div><div class="aside-people panel"><div class="eyebrow">OUR TEAM</div><h3 style="font-size:14px;margin-top:6px">꾸한성 멤버 10명</h3><div class="avatars">${MEMBERS.map((n,i)=>`<span class="avatar" style="--c:${['#817668','#88728d','#577b7c','#9a6a6e','#7c7295','#867c62','#6985a0','#947b74','#657d75','#997e99'][i]}" title="${n}" aria-label="${n}">${avatarImage(n)}<span class="avatar-fallback">${esc(n.substring(0,1))}</span></span>`).join('')}</div><p class="people-note">꾸티뉴와 9명의 친구들이 함께 여행 중이야.</p></div><div class="aside-stamp">FICTIONAL FAN PROJECT<br/>CHAPTER 01 · VACATION</div></aside></div></div>`;
  }
  function renderFinish(){return `<div class="finish"><div class="finish-card"><div class="finish-picture"><img class="finish-image" src="assets/backgrounds/villa-exterior.webp" alt="안개에 싸인 별장 외관" loading="lazy" decoding="async"></div><div class="finish-body"><span class="tag">CHAPTER 01 · COMPLETE</span><h1>웃음이 멈춘 밤.</h1><p>별장에 모인 꾸한성 멤버 10명과 당신. 22시 24분, 모두가 웃으며 게임을 시작하려던 순간 별장 전체의 불이 꺼졌다. 긴 어둠 끝에 무엇이 기다리고 있을까?</p><div class="finish-stats"><div class="finish-stat"><small>플레이 시간</small><strong>${elapsed()}</strong></div><div class="finish-stat"><small>사진·메모</small><strong>${state.clues.length} / ${Object.keys(CLUES).length}</strong></div><div class="finish-stat"><small>추천 활동 확인</small><strong>${state.hintUses||0}회</strong></div></div><div class="finish-actions"><button class="btn btn-primary" data-action="chapter2">${icon('lock')} CH.02 미공개</button><button class="btn btn-secondary" data-action="home">타이틀로 돌아가기</button><button class="btn btn-ghost" data-action="confirm-reset">처음부터 플레이</button></div><p class="credit" style="margin-top:20px">CH.02 「새벽의 비명」은 다음 개발 단계에서 공개될 예정이야. 현재는 여행 이야기를 체험할 수 있는 챕터 1 버전이야.</p></div></div></div>`;}
  function renderOverlay(){if(!overlay)return '';
    if(overlay.type==='dialogue'){
      const item=overlay.items[overlay.index];
      const speaker=item[0];
      const narration=speaker==='내레이션';
      const label=speaker==='나'?state.name:speaker;
      const memberImage = hasMemberPortrait(speaker) ? portraitPath(speaker,poseForLine(item)) : null;
      const portrait = memberImage ? `<img class="char-portrait" src="${esc(memberImage)}" alt="${esc(speaker)} 캐릭터" loading="eager" decoding="sync" fetchpriority="high">` : '';
      const illustration=narration?'':`<div class="dialogue-illustration ${memberImage?'has-portrait':''}"><span class="top-left">STORY / ${esc(STAGES[state.phase]?.heading||'프롤로그')}</span>${memberImage?'':`<div class="speaker-emblem" aria-hidden="true">${esc(speaker==='나'?'나':speaker.slice(0,1))}</div>`}${portrait}</div>`;
      return `<div class="modal-backdrop" role="presentation"><section class="dialogue ${narration?'dialogue-narration':''}" role="dialog" aria-modal="true" aria-label="${narration?'이야기': '대화'}">${illustration}<div class="dialogue-body">${narration?'':`<div class="speaker-name">${esc(label)}</div>`}<div class="dialogue-text">${esc(item[1])}</div><div class="dialogue-footer"><span class="dialogue-progress">${overlay.index+1} / ${overlay.items.length} · Enter 또는 버튼으로 계속</span><div class="dialogue-controls"><button class="btn btn-primary" data-action="next">${overlay.index===overlay.items.length-1?'확인':'다음'} ${icon('arrow')}</button></div></div></div></section></div>`;

    }
    if(overlay.type==='talk-select'){
      const visible=ARRIVALS[state.phase]||MEMBERS;
      return `<div class="modal-backdrop"><section class="detail-modal" role="dialog" aria-modal="true" aria-label="동료와 대화"><div class="detail-head"><div><span class="eyebrow">FRIENDS</span><h2>누구와 대화할까?</h2></div><button class="btn btn-ghost btn-compact" data-action="close" aria-label="닫기">${icon('close')}</button></div><p class="muted small" style="margin-bottom:15px">함께 도착한 친구에게 자유롭게 말을 걸어 봐.</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:45vh;overflow-y:auto">${visible.map((m,i)=>`<button class="choice" data-action="talk-member" data-id="${esc(m)}" style="display:flex;align-items:center;gap:10px"><span class="avatar" style="--c:${['#817668','#88728d','#577b7c','#9a6a6e','#7c7295','#867c62','#6985a0','#947b74','#657d75','#997e99'][i]};margin:0;flex:none">${avatarImage(m)}<span class="avatar-fallback">${esc(m.slice(0,1))}</span></span><span>${esc(m)}<small class="friend-room">${memberRoom(m)===state.location?"여기에 있음":(PLACES.find(p=>p.id===memberRoom(m))?.label||"")}</small></span></button>`).join('')}</div></section></div>`;
    }
    if(overlay.type==='detail')return `<div class="modal-backdrop"><section class="detail-modal" role="dialog" aria-modal="true" aria-label="${esc(overlay.title)}"><div class="detail-head"><h2>${esc(overlay.title)}</h2><button class="btn btn-ghost btn-compact" data-action="close" aria-label="닫기">${icon('close')}</button></div><div class="detail-body">${overlay.body}</div><div class="detail-footer"><button class="btn btn-primary" data-action="close">확인</button></div></section></div>`;
    if(overlay.type==='confirm')return `<div class="modal-backdrop"><section class="detail-modal confirm-modal" role="alertdialog" aria-modal="true" aria-label="진행 초기화 확인"><h2>정말 처음부터 시작할까?</h2><p>지금까지 수집한 단서와 챕터 1의 진행 상황이 사라져. 취소하면 지금 상태를 유지할 수 있어.</p><div class="actions"><button class="btn btn-secondary" data-action="close">취소</button><button class="btn btn-danger" data-action="reset">초기화하기</button></div></section></div>`;
    return '';
  }
  function render(){
    const view=state && state.phase==='complete'?renderFinish():!state||currentView==='landing'?renderLanding():renderGame();
    app.innerHTML=view+renderOverlay()+(showToast&&!(!state||currentView==='landing')?`<div class="toast" role="status">${esc(showToast)}</div>`:'');
  }
  let currentView='landing';
  function handleAction(action,id){
    switch(action){
      case 'start':{
        const input=document.getElementById('nickname');introName=input?.value||introName; currentView='game';start(introName);break;
      }
      case 'resume':currentView='game';render();break;
      case 'home':overlay=null;currentView='landing';introName=state?.name||'';render();break;
      case 'confirm-reset':overlay={type:'confirm'};render();break;
      case 'reset':try{localStorage.removeItem(KEY);}catch{}state=null;introName='';overlay=null;currentView='landing';render();break;
      case 'loc':if(state&&PLACES.some(p=>p.id===id)){state.location=id;for(const m of peopleIn(id))preloadPortrait(portraitPath(m,state.phase==='night'?'night':'normal'));persist();render();}break;
      case 'interact':interact(id);break;
      case 'talk':overlay={type:'talk-select'};render();break;
      case 'talk-member':{
        const where=memberRoom(id);
        if(where && state.location!==where){state.location=where;persist();}
        talk(id);break;
      }
      case 'advance':advance();break;
      case 'tab':if(['clues','people','timeline'].includes(id)){notebookTab=id;render();}break;
      case 'hint':hint();break;
      case 'next':dialogueNext();break;
      case 'close':overlay=null;render();break;
      case 'chapter2':toast('CHAPTER 02는 다음 업데이트에서 공개돼.');break;
    }
  }
  app.addEventListener('error',(event)=>{if(event.target.matches?.('.char-portrait,.char-avatar'))event.target.classList.add('failed-image');},true);
  app.addEventListener('click',(event)=>{const target=event.target.closest('[data-action]');if(!target)return;event.preventDefault();handleAction(target.dataset.action,target.dataset.id);});
  app.addEventListener('input',(event)=>{if(event.target.id==='nickname')introName=event.target.value;});
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape' && overlay&&overlay.type!=='dialogue'){overlay=null;render();return;}
    if(event.key==='Enter'&&overlay?.type==='dialogue'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName)){event.preventDefault();dialogueNext();return;}
    if(event.key==='Enter'&&currentView==='landing'&&document.activeElement?.id==='nickname'){event.preventDefault();handleAction('start');}
  });
  render();
})();