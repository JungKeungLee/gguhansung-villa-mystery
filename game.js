/* 꾸한성: 안개 속 별장 — CHAPTER 01 playable prototype
 * Local-first story engine. No network requests, accounts, analytics or backend.
 * Member roles/lines are fictional. Actual portraits intentionally not bundled.
 */
(() => {
  'use strict';
  const KEY = 'gguhansung-fog-villa-save-v1';
  const P = ['day', 'dinner', 'late', 'night', 'complete'];
  const MEMBERS = ['꾸티뉴', '난워니', '김옥독', '만조', '야뿌', '모야', '하루노츠키', '윤타미', '야무지', '다뮤_'];
  const GUESTS = ['박태성', '최도식', '오세린', '윤해준', '이유나', '장도윤'];
  const PLACES = [
    {id:'living',label:'별장 거실',sub:'따뜻한 벽난로와 오래된 시계',num:'01'},
    {id:'foyer',label:'현관과 복도',sub:'여행 가방과 투숙객 안내문',num:'02'},
    {id:'kitchen',label:'주방과 식당',sub:'저녁 준비와 작은 소란',num:'03'},
    {id:'terrace',label:'별장 테라스',sub:'산길과 안개 낀 숲',num:'04'}
  ];
  const CLUES = {
    photo: {title:'첫 단체사진',tag:'사진',text:'오후 3시 10분, 먼저 도착한 꾸티뉴·난워니·김옥독·만조·야뿌·모야의 사진. 별장 주인도 멀리 배경에 잠깐 찍혀 있다.'},
    'guest-list':{title:'별장 투숙객 안내문',tag:'문서',text:'별장 본관에는 꾸한성 일행 외에도 여러 외부인이 머무르고 있다. 관리인은 별채 시설 문제로 공동 사용하게 되었다고 설명한다.'},
    meal:{title:'저녁 준비 기록',tag:'기록',text:'오후 7시 30분쯤 하루노츠키·윤타미·야무지가 도착했다. 저녁을 준비하는 동안 대부분의 멤버가 주방과 거실을 오갔다.'},
    argument:{title:'낯선 사람들의 대화',tag:'증언',text:'식당 옆 복도에서 오세린과 이유나가 심각하게 대화하는 소리가 들렸다. “오늘 밤에 정말 공개할 거예요?”라는 말이 기억난다.'},
    'arrival-photo':{title:'다뮤_의 도착 사진',tag:'사진',text:'오후 10시 10분, 다뮤_가 현관 앞에서 찍어 단체 채팅방에 전송한 사진. 사진과 채팅 기록의 시간이 일치한다.'},
    cctv:{title:'현관 CCTV 화면',tag:'영상',text:'관리실 모니터의 현관 CCTV에는 마지막 멤버의 도착 장면이 22:03으로 표시되어 있다. 별장 시계와 같은 시간인지는 아직 확인하지 않았다.'},
    storm:{title:'폭우와 산길',tag:'관찰',text:'늦은 밤 안개가 짙어지고 빗줄기가 거세졌다. 별장 앞 산길은 가로등이 드물고, 멀리서 천둥이 울리고 있다.'}
  };
  const GOALS = {
    day: [ ['clue','photo','거실의 단체사진 살펴보기','거실 탁자 위의 사진을 조사해 봐.'], ['clue','guest-list','현관의 투숙객 안내문 조사','현관 벽에 붙은 안내문을 조사해 봐.'], ['talk','꾸티뉴','꾸티뉴와 대화하기','「동료와 대화」에서 꾸티뉴를 선택해 봐.'], ['talk','야뿌','야뿌와 대화하기','「동료와 대화」에서 야뿌를 선택해 봐.'] ],
    dinner: [ ['clue','meal','주방에서 저녁 준비 살펴보기','주방 식탁의 저녁 준비를 조사해 봐.'], ['clue','argument','복도 쪽 낯선 대화 듣기','주방 오른쪽 복도 방향을 눌러 봐.'], ['talk','윤타미','뒤늦게 도착한 윤타미와 대화','「동료와 대화」에서 윤타미를 선택해 봐.'] ],
    late: [ ['clue','arrival-photo','현관에서 다뮤_의 도착 사진 확인','현관 출입문 근처의 사진을 살펴봐.'], ['clue','cctv','현관 CCTV 화면 확인','현관 벽에 있는 CCTV 모니터를 확인해 봐.'], ['talk','다뮤_','마지막으로 도착한 다뮤_와 대화','「동료와 대화」에서 다뮤_를 선택해 봐.'] ],
    night: [ ['clue','storm','테라스에서 날씨 확인','테라스에서 안개 낀 산길을 살펴봐.'], ['talk','꾸티뉴-night','꾸티뉴와 마지막으로 대화','「동료와 대화」에서 꾸티뉴에게 말을 걸어 봐.'] ]
  };
  const STAGES = {
    day:{clock:'15:10',heading:'설레는 첫날',title:'별장을 둘러보자',desc:'사진도 찍고, 먼저 도착한 친구들과 인사해 보자.',action:'저녁 준비로 넘어가기',next:'dinner'},
    dinner:{clock:'19:30',heading:'웃음이 가득한 저녁',title:'모두 함께 저녁을 준비하자',desc:'새로 도착한 멤버와 인사하고, 식당에서 들리는 이야기를 확인해 보자.',action:'마지막 친구 맞이하기',next:'late'},
    late:{clock:'22:10',heading:'마지막 도착',title:'다뮤_를 맞이하자',desc:'현관에서 도착 기념사진과 CCTV를 확인하고 이야기를 나눠 보자.',action:'밤의 거실로 이동하기',next:'night'},
    night:{clock:'23:35',heading:'고요한 밤',title:'여행의 마지막 게임을 준비하자',desc:'밖의 날씨를 보고, 꾸티뉴에게 말을 걸어 보자.',action:'보드게임 시작하기',next:'complete'}
  };
  const HOTSPOTS = {
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
    kitchen:[
      {id:'meal',label:'저녁 식탁',x:49,y:75,when:['dinner','late','night']},
      {id:'argument',label:'복도에서 들리는 말',x:82,y:43,when:['dinner','late','night']},
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
      if(!x || x.version!==1 || !P.includes(x.phase) || !PLACES.some(p=>p.id===x.location) || !Array.isArray(x.clues) || !Array.isArray(x.talks) || typeof x.name!=='string') return null;
      return x;
    } catch {return null;}
  }
  function persist(){try{if(state)localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('저장 공간이 제한되어 자동 저장되지 않을 수 있어.');}}
  function toast(text){showToast=text;render();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{showToast='';render();},3300);}
  function addLog(text){if(!state)return;state.log=[...(state.log||[]),text].slice(-24);}
  function has(type,id){return (type==='talk'?state.talks:state.clues).includes(id);}
  function goalSummary(){const goals=GOALS[state.phase]||[];const done=goals.filter(([type,id])=>has(type,id)).length;return {goals,done,total:goals.length,ready:goals.length>0&&done===goals.length};}
  function start(name){
    name=(name||'').trim().slice(0,12)||'탐정';
    if(/[<>]/.test(name))name=name.replace(/[<>]/g,'');
    state={version:1,name,phase:'day',location:'living',clues:[],talks:[],log:['15:10 — 꾸한성 일행과 산속 별장에 도착했다.'],hintUses:0,startedAt:Date.now(),finishedAt:null};
    persist();
    lines([
      ['내레이션','늦가을의 오후. 구불구불한 산길을 따라 도착한 곳은, 안개에 반쯤 가려진 커다란 별장이었다.'],
      ['난워니','드디어 도착! 다들 짐부터 옮기자.'],
      ['야뿌','잠깐만! 우리 사진부터 찍자. 나중에 봐도 웃길 것 같아.'],
      ['꾸티뉴',`${name}! 잘 왔어. 오늘은 우리랑 편하게 놀면 돼.`],
      ['꾸티뉴','근데 별장 분위기가 좀 수상하지 않아? 여기… 뭔가 비밀이 있을 것 같은데.'],
      ['만조','탐정 놀이는 나중에 하고 방부터 고르자 ㅋㅋ'],
      ['내레이션','당신은 웃으며 거실로 들어섰다. 이것이 평범한 여행이 아니게 될 줄은 아무도 몰랐다.']
    ]);
  }
  function lines(items,after=null){overlay={type:'dialogue',items,index:0,after};render();}
  function dialogueNext(){if(!overlay||overlay.type!=='dialogue')return; if(overlay.index<overlay.items.length-1){overlay.index++;render();return;} const fn=overlay.after;overlay=null;if(fn)fn();render();}
  function talk(name){
    if(!state)return;
    const phase=state.phase;
    const key=name+(phase==='night'&&name==='꾸티뉴'?'-night':'');
    const first=!state.talks.includes(key);
    if(first){state.talks.push(key);addLog(`${STAGES[phase]?.clock||'--:--'} — ${name}와 대화했다.`);persist();}
    let messages=[];
    const vars={name:state.name};
    if(phase==='day'){
      const script={
        '꾸티뉴':[['꾸티뉴','오늘은 내가 탐정 놀이를 해볼까? 별장 안에 수상한 게 있으면 알려줘!'],['나','탐정은 내가 할게. 넌 조수 해.'],['꾸티뉴','좋아 ㅋㅋ 그럼 오늘부터 네가 탐정이야. 내가 같이 도와줄게.']],
        '난워니':[['난워니','내가 오늘 일정 정리할게. 사진 찍은 시간도 기록해 두면 좋겠지?']],
        '김옥독':[['김옥독','마당이 꽤 넓어. 나중에 바비큐 할 때 바깥도 한번 둘러보자.']],
        '만조':[['만조','여기 방이 이렇게 많은데 왜 다들 제일 큰 방만 찾는 거야?']],
        '야뿌':[['야뿌','우리 첫 단체사진 잘 나왔다! 거실 탁자에 올려놨어. 꼭 봐봐.']],
        '모야':[['모야','거실 벽시계 소리 들려? 밤엔 조금 무서울 것 같아 ㅋㅋ']]
      };messages=script[name]||[[name,'나도 별장 구경 중이야. 조금 있다가 같이 놀자!']];
    }else if(phase==='dinner'){
      const script={
        '윤타미':[['윤타미','우리 조금 늦게 왔지? 7시 30분쯤 도착했어.'],['꾸티뉴','이제 저녁 먹고 다 같이 게임하자!']],
        '하루노츠키':[['하루노츠키','별장이 생각보다 크네. 근데 다른 사람들도 있는 거야?']],
        '야무지':[['야무지','주방에서 복도 쪽으로 가면 낯선 사람들 목소리가 들리던데.']],
        '꾸티뉴':[['꾸티뉴','주방으로 가보자. 음식 다 식겠다!']],
        '난워니':[['난워니','19시 30분, 세 명 추가 도착! 일정표 갱신 완료.']]
      };messages=script[name]||[[name,'오늘 저녁 분위기 좋은데? 다 같이 먹자!']];
    }else if(phase==='late'){
      const script={
        '다뮤_':[['다뮤_','늦어서 미안! 도착한 게 10시 10분이야. 현관 앞에서 사진 찍어서 단톡에 올렸어.'],[state.name,'고생했어. 현관 CCTV에도 찍혔겠네?'],['다뮤_','아마? 근데 현관 쪽에 있던 모니터 시간이 조금 이상한 것 같기도 해.']],
        '난워니':[['난워니','마지막 멤버도 도착! 10명 전원 집합!']],
        '꾸티뉴':[['꾸티뉴','이제 정말 다 모였네. 마지막으로 게임 한 판 하고 자자.']]
      };messages=script[name]||[[name,'다뮤_도 왔으니 이제 전부 모였네!']];
    }else if(phase==='night'){
      const script={
        '꾸티뉴':[['꾸티뉴','탐정님, 오늘 여행은 마음에 들어?'],[state.name,'아주 좋아. 근데 밖에 비가 너무 세게 온다.'],['꾸티뉴','그러게. 뭐 별일 없겠지? 다들 거실에서 기다리고 있어. 게임 시작하자.']],
        '모야':[['모야','밖에 천둥 소리 무섭다. 얼른 안으로 들어가자!']],
        '난워니':[['난워니','다들 11시 반 넘었는데 안 자? 마지막 게임만 하자!']]
      };messages=script[name]||[[name,'오늘 밤은 비가 많이 오네. 다 같이 거실에 있자.']];
    }
    overlay=null;
    lines(messages);
  }
  function interact(id){
    if(!state)return;
    const clue=CLUES[id];
    if(clue){
      const newClue=!state.clues.includes(id);
      if(newClue){state.clues.push(id);addLog(`${STAGES[state.phase]?.clock||'--:--'} — 단서 「${clue.title}」 발견`);persist();}
      const scripts={
        photo:[['야뿌','자, 이거 봐! 우리가 처음 왔을 때 찍은 사진이야.'],['내레이션','오후 3시 10분. 웃고 있는 여섯 명의 뒤편으로 별장 주인이 희미하게 보인다.']],
        'guest-list':[['내레이션','현관 안내문에는 여러 외부 투숙객의 이름과 별장 관계자 정보가 적혀 있다.'],['최도식','별채 시설에 문제가 있어서 오늘은 본관을 같이 쓰게 됐습니다. 불편하시더라도 양해 부탁드립니다.']],
        meal:[['김옥독','고기 타기 전에 먹어야지! 다들 모여 봐!'],['내레이션','하루노츠키, 윤타미, 야무지가 오후 7시 30분 무렵 도착했다. 즐거운 저녁이 시작된다.']],
        argument:[['내레이션','식당 옆 복도에서 낯선 목소리들이 작게 들려온다.'],['이유나','그 자료를… 오늘 밤에 정말 공개할 거예요?'],['오세린','이제 더는 미룰 수 없어요.'],['내레이션','당신이 돌아보자 두 사람은 대화를 멈췄다.']],
        'arrival-photo':[['다뮤_','현관에서 사진 찍었지! 단톡에 올린 시간이 22시 10분이야.'],['내레이션','사진과 단체 채팅 기록에 동일한 도착 시각이 남아 있다.']],
        cctv:[['내레이션','현관 관리용 모니터를 살펴보니 마지막 멤버가 들어오는 장면에 22:03이라는 숫자가 보인다.'],[state.name,'다뮤_가 올린 사진은 22시 10분인데…? 나중에 한번 확인해 봐야겠다.']],
        storm:[['내레이션','테라스 난간 너머로 짙은 안개가 밀려든다. 빗방울이 굵어지고 산길이 거의 보이지 않는다.'],['김옥독','오늘은 밖에 나가지 말자. 날씨가 심상치 않아.']]
      };
      const display=newClue?scripts[id]:[['내레이션',`「${clue.title}」을 다시 확인했다.`],[state.name,clue.text]];
      lines(display);
    }else{
      const flavor={fireplace:[['내레이션','벽난로에 장작이 타닥타닥 타고 있다. 밖은 춥지만 실내는 따뜻하다.']],clock:[['내레이션','커다란 벽시계가 조용히 움직인다. 밤이 될수록 초침 소리가 더 크게 들릴 것 같다.']],luggage:[['내레이션','현관 옆에 여러 사람의 여행 가방이 쌓여 있다. 아직 도착하지 않은 친구들의 자리도 남아 있다.']],fridge:[['내레이션','냉장고 안에는 음식과 음료가 가득하다. 누군가 벌써 디저트를 숨겨둔 모양이다.']],view:[['내레이션','별장 너머로 산과 숲이 펼쳐져 있다. 해가 지면서 안개가 조금씩 짙어진다.']],car:[['내레이션','주차장에 차가 몇 대 세워져 있다. 어느 차가 누구의 것인지는 아직 모른다.']]};
      lines(flavor[id]||[['내레이션','특별한 것은 발견하지 못했다.']]);
    }
  }
  function advance(){
    if(!state||!STAGES[state.phase])return;
    const {ready}=goalSummary(); if(!ready){toast('아직 조사할 목표가 남아 있어.');return;}
    if(state.phase==='day'){
      state.phase='dinner';state.location='kitchen';addLog('19:30 — 세 명이 추가로 도착했다. 저녁 식사 준비 시작.');persist();
      lines([['내레이션','해가 지기 시작할 즈음, 별장 입구에서 반가운 목소리가 들린다.'],['하루노츠키','늦었지? 길이 좀 막혔어.'],['윤타미','이제 정말 여행 온 느낌이다!'],['야무지','그런데 여기, 우리 말고도 투숙객들이 있네.'],['박태성','불편한 점이 있으면 저에게 말씀해 주세요. 좋은 저녁 보내시길 바랍니다.'],['내레이션','밝은 조명 아래서 저녁 준비가 시작된다. 한편 복도 끝에서는 누군가 낮은 목소리로 다투고 있었다.']]);
    }else if(state.phase==='dinner'){
      state.phase='late';state.location='foyer';addLog('22:10 — 다뮤_가 별장에 도착했다.');persist();
      lines([['내레이션','저녁 시간이 지나고, 시계가 밤 10시를 넘어섰다.'],['난워니','한 명만 더 오면 드디어 전원 집합인데!'],['다뮤_','나 왔어! 산길이 엄청 어둡더라.'],['꾸티뉴','드디어 10명 다 모였네! 다뮤_, 얼른 들어와.'],['내레이션','늦게 도착한 친구는 현관 앞에서 사진을 찍어 단체 채팅방에 올렸다.']]);
    }else if(state.phase==='late'){
      state.phase='night';state.location='living';addLog('23:35 — 거실에 모여 마지막 보드게임을 준비한다.');persist();
      lines([['내레이션','별장에는 이제 열 명의 꾸한성 멤버와 당신, 그리고 여섯 명의 외부인이 있다.'],['만조','우리 이번 게임 지는 사람이 설거지하는 거 어때?'],['김옥독','그건 너무 위험한 내기 아니야? ㅋㅋ'],['모야','잠깐, 밖에 비 오는 소리 들려?'],['내레이션','멀리서 천둥이 울린다. 창밖은 안개와 비로 가득하다.'],['꾸티뉴','다들 너무 늦게까지 놀지 말자. 마지막 한 판만!']]);
    }else if(state.phase==='night'){
      state.phase='complete';state.finishedAt=Date.now();addLog('23:47 — 별장 전체가 정전되었다. 2층에서 비명이 들렸다.');persist();
      lines([['내레이션','오후 11시 40분. 마지막 게임을 시작하려던 순간, 다른 층에서 무언가 부딪치는 듯한 소리가 들린다.'],['야뿌','방금 무슨 소리야?'],['꾸티뉴','위층에서 난 것 같은데… 일단 다 같이 있자.'],['내레이션','23시 47분. 번쩍이는 번개와 함께 별장 전체의 불이 꺼진다.'],['모야','꺄악! 뭐야, 정전?!'],['내레이션','어둠 속에서 몇 초가 흘렀다. 그리고 2층에서 날카로운 비명소리가 울려 퍼졌다.'],['꾸티뉴',`${state.name}… 방금 들었지? 우리, 확인하러 가야 할 것 같아.`],['내레이션','웃음으로 시작한 여행의 끝. 진실을 찾아야 하는 밤이 시작되었다.']],()=>{render();});
    }
    render();
  }
  function hint(){const info=goalSummary(),missing=info.goals.find(([type,id])=>!has(type,id));if(!missing){toast('현재 목표는 모두 끝났어. 다음 단계로 진행해 봐.');return;}state.hintUses=(state.hintUses||0)+1;addLog(`힌트 확인 — ${missing[2]}`);persist();overlay={type:'detail',title:'꾸티뉴의 힌트',body:`<p><strong>${esc(missing[2])}</strong></p><p>${esc(missing[3])}</p><p class="credit">힌트 사용 ${state.hintUses}회 · 이후 결과 화면에 반영됩니다.</p>`};render();}
  function elapsed(){if(!state)return '00:00';const seconds=Math.max(0,Math.round(((state.finishedAt||Date.now())-state.startedAt)/1000));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
  function fmtList(a){return a.map(x=>esc(x)).join(' · ');}
  function artDefs(){return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#172943"/><stop offset=".58" stop-color="#3e5370"/><stop offset="1" stop-color="#536477"/></linearGradient><linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5d6476"/><stop offset="1" stop-color="#27364e"/></linearGradient><linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#554637"/><stop offset="1" stop-color="#241d22"/></linearGradient><linearGradient id="goldwindow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff1bd"/><stop offset="1" stop-color="#b77f4f"/></linearGradient><radialGradient id="lamp"><stop stop-color="#ffd89b" stop-opacity=".65"/><stop offset="1" stop-color="#e8a95d" stop-opacity="0"/></radialGradient><radialGradient id="fog"><stop stop-color="#d1dce0" stop-opacity=".35"/><stop offset="1" stop-color="#c6d3dc" stop-opacity="0"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="8"/></filter></defs>`;}
  function artVilla(){return `<svg aria-label="안개 낀 산속 별장 일러스트" viewBox="0 0 800 950" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${artDefs()}<rect width="800" height="950" fill="url(#sky)"/><circle cx="625" cy="155" r="58" fill="#e7ddc2" opacity=".75"/><circle cx="625" cy="155" r="101" fill="url(#fog)"/><path d="M0 480 160 180 260 385 405 135 650 450 750 280 800 430v520H0Z" fill="#233953"/><path d="M0 555 124 335 270 550 435 290 610 555 770 370 800 440v510H0Z" fill="#1a3040"/>${Array.from({length:14},(_,i)=>{let x=i*68-40;let y=340+(i%3)*43;return `<path d="M${x} ${y+250}v-110m-40 55 40-135 40 135m-31-55 31-108 31 108" stroke="#132a31" stroke-width="18" fill="none" opacity=".8"/>`;}).join('')}<ellipse cx="390" cy="715" rx="500" ry="200" fill="url(#fog)"/><path d="M89 550 400 350 718 550v344H89Z" fill="#202938" stroke="#1c222c" stroke-width="10"/><path d="M45 565 400 313 758 565 724 600 398 377 85 600Z" fill="#433b40" stroke="#141c2c" stroke-width="12"/><path d="M192 545V435l138-92v97" stroke="#5d4f4a" stroke-width="20" fill="none"/><path d="M100 605h612M100 660h612M100 715h612M100 770h612M100 825h612" stroke="#394050" stroke-width="7"/><path d="M388 650h106v244H388Z" fill="#121925" stroke="#9d7c54" stroke-width="10"/><path d="M398 664h87v218h-87Z" fill="#51413b"/><circle cx="470" cy="778" r="5" fill="#e8ca8c"/><path d="M160 630h138v120H160zM531 630h138v120H531z" fill="url(#goldwindow)" stroke="#352a2c" stroke-width="13"/><path d="M229 630v120m-69-60h138M600 630v120m-69-60h138" stroke="#5b463a" stroke-width="9"/><path d="M333 480h132v109H333Z" fill="url(#goldwindow)" stroke="#55453f" stroke-width="12"/><path d="M399 480v109m-66-55h132" stroke="#5d4a40" stroke-width="7"/><ellipse cx="399" cy="892" rx="440" ry="44" fill="#c4c7be" opacity=".28"/><g fill="#122734"><path d="m0 775 50-220 55 220zM0 760 48 500 100 760zM650 820 720 475 800 820zM720 760l48-260 65 260z"/></g><ellipse cx="190" cy="835" rx="340" ry="70" fill="url(#fog)"/><ellipse cx="650" cy="860" rx="310" ry="90" fill="url(#fog)"/><path d="M0 920q180-95 400-20t400 0v80H0" fill="#182b31"/></svg>`;}
  function baseRoom(night=false){return `${artDefs()}<rect width="1000" height="560" fill="url(#wall)"/><path d="M0 0 155 95v355L0 560ZM1000 0 845 95v355l155 110Z" fill="#1c293c" opacity=".5"/><path d="M0 416 500 322 1000 416v144H0Z" fill="url(#floor)"/><path d="M0 418 500 323 1000 418" fill="none" stroke="#a18b75" stroke-width="5" opacity=".4"/><path d="M155 95 500 60 845 95v325L500 322 155 420Z" fill="#617080" opacity=".11"/><path d="M155 95v325m690-325v325M500 60v263" stroke="#8f837c" opacity=".24" stroke-width="8"/><ellipse cx="505" cy="420" rx="375" ry="125" fill="url(#lamp)" opacity="${night?.2:.75}"/>`}
  function sceneLiving(night){return `<svg class="scene-art" role="img" aria-label="별장 거실 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${baseRoom(night)}<rect x="336" y="103" width="328" height="211" rx="4" fill="#2d2d3d" stroke="#a58b69" stroke-width="19"/><rect x="356" y="123" width="288" height="172" fill="url(#sky)"/><path d="M356 256 435 165 485 228 551 149 644 255v40H356Z" fill="#25394d"/><path d="M356 268 419 205 467 249 553 187 644 270" fill="none" stroke="#172d39" stroke-width="29"/><path d="M500 123v172M356 212h288" stroke="#7f7466" stroke-width="12"/><path d="M330 110q52 96 23 198h-27M669 110q-52 96-23 198h27" fill="#8b666b" stroke="#6c5460" stroke-width="13"/><rect x="84" y="258" width="208" height="171" fill="#584c4c" stroke="#aa8669" stroke-width="10"/><rect x="107" y="281" width="163" height="116" fill="#2e3039"/><path d="M115 385 162 312l33 49 22-31 43 55" fill="#ba754d" opacity=".8"/><path d="M145 382 166 345l17 36" stroke="#edd19a" stroke-width="9" fill="none"/><rect x="99" y="426" width="181" height="12" fill="#8f6c55"/><rect x="682" y="312" width="240" height="119" rx="22" fill="#3b455b" stroke="#1c293d" stroke-width="12"/><rect x="706" y="285" width="184" height="68" rx="18" fill="#657087"/><path d="M706 430v20m176-20v20" stroke="#211f29" stroke-width="13"/><ellipse cx="572" cy="454" rx="171" ry="54" fill="#161c2b" opacity=".34"/><path d="M443 412h270l-35 48H420Z" fill="#ad8160" stroke="#4c3e40" stroke-width="10"/><path d="M451 460v62m214-62v62" stroke="#4e3434" stroke-width="15"/><rect x="531" y="390" width="76" height="49" rx="3" fill="#e5ddc1" transform="rotate(8 570 413)"/><path d="M545 408h45m-40 11h35" stroke="#979181" stroke-width="3"/><circle cx="832" cy="115" r="47" fill="#ac9983" stroke="#5b4e4b" stroke-width="11"/><circle cx="832" cy="115" r="39" fill="#eee5c8"/><path d="M832 115v-25m0 25 15 11" stroke="#4b4c53" stroke-width="4"/><circle cx="832" cy="115" r="4" fill="#3a3840"/><path d="M720 315v-150m0 0-27 42h54z" fill="#d6b785" stroke="#5c4c42" stroke-width="8"/><circle cx="720" cy="242" r="95" fill="url(#lamp)"/><rect width="1000" height="560" fill="#101a2b" opacity="${night?.43:.05}"/></svg>`}
  function sceneFoyer(night){return `<svg class="scene-art" role="img" aria-label="별장 현관 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${baseRoom(night)}<rect x="337" y="70" width="315" height="361" fill="#211f27" stroke="#a58c70" stroke-width="22"/><rect x="359" y="94" width="271" height="324" fill="#514542"/><rect x="387" y="120" width="214" height="268" fill="#3b393c" stroke="#927b5f" stroke-width="8"/><rect x="416" y="155" width="159" height="95" fill="url(#sky)"/><path d="M416 249 470 172 530 244l45-55v61Z" fill="#1a313e"/><circle cx="569" cy="325" r="9" fill="#e5bf7c"/><rect x="700" y="131" width="209" height="197" fill="#e2d5b5" stroke="#584b43" stroke-width="15"/><path d="M725 165h150m-150 25h130m-130 25h138m-138 25h101m-101 25h146" stroke="#8e816c" stroke-width="8" opacity=".65"/><rect x="150" y="171" width="157" height="111" rx="7" fill="#1d2939" stroke="#827e77" stroke-width="9"/><rect x="169" y="187" width="119" height="70" fill="#4c667a"/><path d="M183 231 209 207h22l22 24h15" stroke="#c2d7c4" stroke-width="5" fill="none"/><circle cx="285" cy="283" r="6" fill="#ddad6f"/><rect x="460" y="419" width="132" height="71" rx="9" fill="#775461" stroke="#392d37" stroke-width="9"/><path d="M485 426v-24h82v24" fill="none" stroke="#bda184" stroke-width="9"/><rect x="248" y="448" width="157" height="73" rx="13" fill="#3b5362" stroke="#222a34" stroke-width="10"/><path d="M275 453v-18h92v18" stroke="#b2ab98" stroke-width="7" fill="none"/><path d="M85 415h77l28 68H57Z" fill="#607467"/><path d="M128 415v-99" stroke="#3a4b40" stroke-width="13"/><path d="M128 355q-75-20-49-69 59 15 49 69m0-19q60-49 81-4-55 34-81 4" fill="#546b58"/><rect width="1000" height="560" fill="#101a2b" opacity="${night?.45:.04}"/></svg>`}
  function sceneKitchen(night){return `<svg class="scene-art" role="img" aria-label="별장 주방과 식당 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${baseRoom(night)}<rect x="89" y="110" width="216" height="240" fill="#413c43" stroke="#9c8061" stroke-width="12"/><rect x="108" y="127" width="181" height="202" fill="#b9ad98"/><rect x="111" y="227" width="181" height="8" fill="#746457"/><rect x="165" y="137" width="9" height="187" fill="#796353"/><g fill="#587064"><rect x="128" y="158" width="32" height="59" rx="4"/><rect x="185" y="149" width="35" height="67" rx="4"/><rect x="230" y="157" width="36" height="61" rx="4"/></g><rect x="680" y="97" width="245" height="327" fill="#2c2730" stroke="#826952" stroke-width="13"/><rect x="703" y="119" width="197" height="283" fill="#4a3e3c"/><rect x="714" y="145" width="172" height="190" fill="#302f39"/><circle cx="877" cy="290" r="7" fill="#d2b080"/><path d="M340 70v150m-9 0h60l-18 33h-24Z" fill="#eac792" stroke="#a48260" stroke-width="9"/><circle cx="362" cy="217" r="125" fill="url(#lamp)"/><path d="M290 358 740 358 840 423 195 423Z" fill="#9e785b" stroke="#503d38" stroke-width="12"/><path d="M231 417v118m550-118v118" stroke="#61483f" stroke-width="25"/><ellipse cx="520" cy="346" rx="120" ry="29" fill="#e0d2b0" stroke="#746551" stroke-width="7"/><ellipse cx="520" cy="343" rx="93" ry="17" fill="#a24d3a"/><ellipse cx="395" cy="368" rx="57" ry="23" fill="#e2d6bd" stroke="#746551" stroke-width="6"/><ellipse cx="662" cy="368" rx="50" ry="23" fill="#e2d6bd" stroke="#746551" stroke-width="6"/><path d="M364 364q30-29 64 0" stroke="#51704c" stroke-width="10" fill="none"/><path d="M644 361q25-33 43-4" stroke="#726a44" stroke-width="10" fill="none"/><rect x="66" y="334" width="135" height="112" fill="#313b47" stroke="#93806c" stroke-width="8"/><circle cx="150" cy="384" r="20" fill="#bd8970"/><circle cx="103" cy="384" r="20" fill="#74917f"/><rect width="1000" height="560" fill="#101a2b" opacity="${night?.43:.05}"/></svg>`}
  function sceneTerrace(night){return `<svg class="scene-art" role="img" aria-label="안개 낀 별장 테라스 배경" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">${artDefs()}<rect width="1000" height="560" fill="url(#sky)"/><circle cx="790" cy="100" r="46" fill="${night?'#dadce1':'#f6d79d'}" opacity=".6"/><path d="M0 355 155 115 314 320 475 100 780 340 900 215 1000 290v270H0Z" fill="#263d50"/><path d="M0 399 152 243 325 387 548 203 765 375 1000 250v310H0Z" fill="#203343"/>${Array.from({length:22},(_,i)=>{let x=i*53-33;let y=215+(i%4)*26;return `<path d="M${x} 446v-${175+(i%2)*40}m-37 111 37-${170+(i%2)*40} 38 ${170+(i%2)*40}" stroke="#1a3339" stroke-width="12" fill="none" opacity=".85"/>`;}).join('')}<path d="M0 417h1000v143H0Z" fill="#554d4e"/><path d="M0 417h1000" stroke="#bdac8d" stroke-width="18"/><path d="M0 417v-65m150 65v-65m170 65v-65m170 65v-65m170 65v-65m170 65v-65m170 65v-65" stroke="#c1b297" stroke-width="15"/><path d="M0 351h1000" stroke="#bdae92" stroke-width="17"/><path d="M10 490h980m-850 70 30-140m100 140 30-140m100 140 30-140m100 140 30-140m100 140 30-140m100 140 30-140m100 140 30-140" stroke="#a59680" opacity=".4" stroke-width="4"/><path d="M100 430h212l45 39H58Z" fill="#243746" stroke="#748390" stroke-width="6"/><path d="M126 430 161 383h121l34 47Z" fill="#354e61" stroke="#748390" stroke-width="5"/><circle cx="119" cy="473" r="19" fill="#171f2a" stroke="#657481" stroke-width="6"/><circle cx="291" cy="473" r="19" fill="#171f2a" stroke="#657481" stroke-width="6"/><ellipse cx="550" cy="310" rx="500" ry="110" fill="url(#fog)"/><ellipse cx="720" cy="445" rx="450" ry="100" fill="url(#fog)"/><rect width="1000" height="560" fill="#0a1725" opacity="${night?.32:.02}"/>${night?Array.from({length:44},(_,i)=>{let x=(i*131)%1000,y=(i*67)%540;return `<path d="M${x} ${y}l-10 30" stroke="#b8cfdf" stroke-width="2" opacity=".38"/>`}).join(''):''}</svg>`}
  function sceneArt(){return state.location==='living'?sceneLiving(state.phase==='night'):state.location==='foyer'?sceneFoyer(state.phase==='night'):state.location==='kitchen'?sceneKitchen(state.phase==='night'):sceneTerrace(state.phase==='night');}
  function renderLanding(){return `<div class="app-shell"><main class="landing"><header class="landing-header"><div class="brand"><span class="brand-mark">✦</span><span>꾸한성 미스터리 프로젝트</span></div><span class="note">INTERACTIVE DETECTIVE STORY · CHAPTER 01</span></header><section class="landing-main"><div class="landing-copy"><div class="mini-title"><span class="tag">FIRST PLAYABLE CHAPTER</span><span class="upper">CASE 00 / PROLOGUE</span></div><h1>안개 속<br/><em>별장</em></h1><p class="synopsis">열 명의 친구들과 떠난 조금 특별한 여행.<br/>웃음으로 시작한 그날 밤, 별장에선 아무도 예상하지 못한 일이 벌어진다.<br/><strong style="color:#f0dfc3">이번 이야기의 탐정은 바로 당신이다.</strong></p><div class="meta"><span>✦ 스토리형 추리</span><span>✦ PC · 모바일</span><span>✦ 로컬 자동 저장</span><span>✦ 챕터 1 공개</span></div><label class="nickname-label" for="nickname">어떤 이름으로 불리고 싶어?</label><div class="nickname-row"><input class="nickname-input" id="nickname" maxlength="12" placeholder="탐정 닉네임 (최대 12자)" value="${esc(introName)}" autocomplete="nickname" /><button class="btn btn-primary" data-action="start">여행 시작 ${icon('arrow')}</button></div><div class="start-buttons">${state?`<button class="btn btn-secondary" data-action="resume">${state.phase==='complete'?'기록 확인':'이어하기'} ${icon('arrow')}</button><button class="btn btn-ghost" data-action="confirm-reset">진행 초기화</button>`:''}</div><div class="landing-alert" aria-live="polite">${esc(showToast)}</div></div><div class="landing-visual"><div class="landing-picture">${artVilla()}<div class="poster-overlay"><div class="poster-line">AN INTERACTIVE MYSTERY</div><div class="poster-title">열한 번째 손님에게</div><div class="poster-subtitle">잊지 못할 밤이 시작된다.</div></div></div><div class="floating-stamp">CHAPTER<br/><strong>01</strong><span>OPEN</span></div></div></section><footer class="landing-foot"><span>이 작품은 팬 창작 게임이며, 등장인물과 사건은 모두 허구입니다.</span><span>v0.1 · 데모 · 이후 챕터 미공개</span></footer></main></div>`;}
  function notebookContent(){
    if(notebookTab==='clues'){
      const found=state.clues.map(id=>CLUES[id]).filter(Boolean);
      return found.length?found.map(c=>`<div class="entry"><h4><span style="color:var(--gold)">◈</span> ${esc(c.title)}</h4><p>${esc(c.text)}</p></div>`).join(''):`<div class="empty">아직 발견한 단서가 없어.<br/>방 안의 반짝이는 조사 지점을 눌러 봐.</div>`;
    }
    if(notebookTab==='people'){
      const arr=MEMBERS.filter((x,i)=>i<6||state.phase!=='day'&&i<9||P.indexOf(state.phase)>=2);
      return `<div class="entry"><h4>꾸한성 수사팀 · ${arr.length} / 10명 도착</h4><p>${fmtList(arr)}</p></div><div class="entry"><h4>별장에서 만난 사람들</h4><p>${fmtList(GUESTS)}</p></div><div class="entry"><h4>꾸티뉴와 당신</h4><p>꾸티뉴는 탐정 놀이를 좋아하는 친구. 이번 여행의 탐정은 <strong>${esc(state.name)}</strong>이다.</p></div>`;
    }
    return (state.log||[]).slice().reverse().map(l=>`<div class="entry"><p>• ${esc(l)}</p></div>`).join('');
  }
  function renderGame(){const st=STAGES[state.phase],sum=goalSummary();const done=Object.keys(CLUES).length;const avail=HOTSPOTS[state.location].filter(x=>x.when.includes(state.phase));const loc=PLACES.find(x=>x.id===state.location);const pct=(P.indexOf(state.phase)/4*100)|0;
    return `<div class="app-shell"><div class="game-layout"><aside class="rail"><div class="rail-brand brand"><span class="brand-mark">✦</span><span>안개 속 별장</span></div><div><div class="nav-title">EXPLORATION / 장소</div><nav class="location-nav" aria-label="장소 이동">${PLACES.map(l=>`<button class="location-button ${state.location===l.id?'active':''}" data-action="loc" data-id="${l.id}" aria-current="${state.location===l.id?'page':'false'}"><span class="number">${l.num}</span><span>${l.label}</span></button>`).join('')}</nav></div><div class="rail-stat"><h3>CHAPTER 01 · 진행도</h3><div class="progress-track"><div class="progress-bar" style="width:${pct}%"></div></div><p class="small muted" style="margin-top:8px">${st.heading}</p><p class="small muted" style="margin-top:6px">현재 목표 ${sum.done} / ${sum.total} 완료</p></div><div class="rail-bottom"><button class="btn btn-secondary" data-action="talk">${icon('people')} 동료와 대화</button><button class="btn btn-ghost" data-action="home">${icon('book')} 타이틀 화면</button></div></aside><main class="game-main"><header class="topbar panel"><div class="left"><span class="tag">CH.01</span><div><span class="upper">${esc(st.heading)}</span><h2>꾸한성: 안개 속 별장</h2></div></div><div class="right"><span class="muted small saved">${icon('save')} 자동 저장</span><span class="clock">${st.clock}</span></div></header><div class="mobile-location" aria-label="장소 이동">${PLACES.map(l=>`<button class="btn btn-compact ${l.id===state.location?'btn-primary':'btn-secondary'}" data-action="loc" data-id="${l.id}">${l.label}</button>`).join('')}</div><section class="scene-frame" aria-label="${esc(loc.label)} 탐색 화면">${sceneArt()}<div class="scene-vignette"></div><div class="scene-title"><strong>${esc(loc.label)}</strong><span>${esc(loc.sub)}</span></div>${avail.map(h=>`<button class="hotspot" style="left:${h.x}%;top:${h.y}%" data-action="interact" data-id="${h.id}" aria-label="${esc(h.label)} 조사"><span class="hotspot-pin">${state.clues.includes(h.id)?'✓':'?'}</span>${esc(h.label)}</button>`).join('')}<div class="scene-bottom"><div class="scene-direction">조사할 대상을 누르거나 장소를 이동해 봐.</div><div class="scene-controls"><button class="btn btn-compact btn-secondary" data-action="talk">${icon('people')} 동료와 대화</button></div></div></section><section class="quest-box panel"><div class="quest-icon">${icon('search')}</div><div class="quest-content"><div class="chapter-step">CURRENT OBJECTIVE · ${sum.done}/${sum.total}</div><h3>${esc(st.title)}</h3><p>${esc(st.desc)}</p></div><div class="quest-actions"><button class="btn ${sum.ready?'btn-primary':'btn-secondary'}" data-action="advance" ${sum.ready?'':'disabled'}>${esc(st.action)} ${icon('arrow')}</button></div></section><section class="log-panel panel"><div class="section-heading"><h3>이번 단계의 조사 목표</h3><button class="btn btn-ghost btn-compact" data-action="talk">${icon('people')} 인물 대화</button></div><div style="display:grid;gap:10px">${sum.goals.map(([type,id,label])=>`<div style="display:flex;align-items:center;gap:9px;font-size:12px;color:${has(type,id)?'#a4d6b9':'#d7dbe6'}"><span style="width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:${has(type,id)?'#315648':'#354058'};font-size:10px">${has(type,id)?'✓':'·'}</span><span style="${has(type,id)?'text-decoration:line-through;opacity:.75':''}">${esc(label)}</span></div>`).join('')}</div></section></main><aside class="aside"><div class="notebook panel"><div class="eyebrow">INVESTIGATION NOTEBOOK</div><h3>탐정의 수첩</h3><p class="notebook-sub">${esc(state.name)}의 여행 기록 · 획득한 단서 ${state.clues.length}/${done}</p><div class="tab-row" role="tablist" aria-label="수첩 탭">${[['clues','단서'],['people','인물'],['timeline','일지']].map(([id,title])=>`<button class="tab ${notebookTab===id?'active':''}" data-action="tab" data-id="${id}" role="tab" aria-selected="${notebookTab===id}">${title}</button>`).join('')}</div><div class="tab-pane" role="tabpanel">${notebookContent()}</div><button class="btn btn-secondary" data-action="hint">${icon('hint')} 꾸티뉴에게 힌트</button></div><div class="aside-people panel"><div class="eyebrow">OUR TEAM</div><h3 style="font-size:14px;margin-top:6px">꾸한성 멤버 10명</h3><div class="avatars">${MEMBERS.map((n,i)=>`<span class="avatar" style="--c:${['#817668','#88728d','#577b7c','#9a6a6e','#7c7295','#867c62','#6985a0','#947b74','#657d75','#997e99'][i]}" title="${n}" aria-label="${n}">${esc(n.substring(0,1))}</span>`).join('')}</div><p class="people-note">모두 같은 편이야. 꾸티뉴와 9명의 친구들이 여행을 함께하고 있어.</p></div><div class="aside-stamp">FICTIONAL FAN PROJECT<br/>CHAPTER 01 · PROLOGUE</div></aside></div></div>`;
  }
  function renderFinish(){return `<div class="finish"><div class="finish-card"><div class="finish-picture">${artVilla()}</div><div class="finish-body"><span class="tag">CHAPTER 01 · COMPLETE</span><h1>웃음이 멈춘 밤.</h1><p>산속 별장에 모인 꾸한성 멤버 10명과 당신. 안개가 짙어지던 23시 47분, 정전과 함께 2층에서 비명이 울렸다. 평범했던 여행은 이제 끝났다. 다음 장에서는 진짜 사건이 시작된다.</p><div class="finish-stats"><div class="finish-stat"><small>플레이 시간</small><strong>${elapsed()}</strong></div><div class="finish-stat"><small>발견한 단서</small><strong>${state.clues.length} / ${Object.keys(CLUES).length}</strong></div><div class="finish-stat"><small>힌트 사용</small><strong>${state.hintUses||0}회</strong></div></div><div class="finish-actions"><button class="btn btn-primary" data-action="chapter2">${icon('lock')} CH.02 미공개</button><button class="btn btn-secondary" data-action="home">타이틀로 돌아가기</button><button class="btn btn-ghost" data-action="confirm-reset">처음부터 플레이</button></div><p class="credit" style="margin-top:20px">CH.02 「새벽의 비명」은 다음 개발 단계에서 공개될 예정이야. 이 버전은 챕터 1의 플레이 가능한 프로토타입이야.</p></div></div></div>`;}
  function renderOverlay(){if(!overlay)return '';
    if(overlay.type==='dialogue'){
      const item=overlay.items[overlay.index];const speaker=item[0];const letter=speaker==='내레이션'?'✦':speaker==='나'?'나':speaker.substring(0,1);const label=speaker==='나'?state.name:speaker;
      return `<div class="modal-backdrop" role="presentation"><section class="dialogue" role="dialog" aria-modal="true" aria-label="대화"><div class="dialogue-illustration"><span class="top-left">STORY / ${esc(STAGES[state.phase]?.heading||'프롤로그')}</span><div class="speaker-emblem">${esc(letter)}</div></div><div class="dialogue-body"><div class="speaker-name">${esc(label)}</div><div class="dialogue-text">${esc(item[1])}</div><div class="dialogue-footer"><span class="dialogue-progress">${overlay.index+1} / ${overlay.items.length} · Enter 또는 버튼으로 계속</span><div class="dialogue-controls"><button class="btn btn-primary" data-action="next">${overlay.index===overlay.items.length-1?'확인':'다음'} ${icon('arrow')}</button></div></div></div></section></div>`;
    }
    if(overlay.type==='talk-select'){
      const limit=state.phase==='day'?6:state.phase==='dinner'?9:10;
      return `<div class="modal-backdrop"><section class="detail-modal" role="dialog" aria-modal="true" aria-label="동료와 대화"><div class="detail-head"><div><span class="eyebrow">TEAM CONVERSATION</span><h2>누구와 대화할까?</h2></div><button class="btn btn-ghost btn-compact" data-action="close" aria-label="닫기">${icon('close')}</button></div><p class="muted small" style="margin-bottom:15px">등장한 멤버를 선택하면 이야기를 나눌 수 있어.</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:45vh;overflow-y:auto">${MEMBERS.slice(0,limit).map((m,i)=>`<button class="choice" data-action="talk-member" data-id="${esc(m)}" style="display:flex;align-items:center;gap:10px"><span class="avatar" style="--c:${['#817668','#88728d','#577b7c','#9a6a6e','#7c7295','#867c62','#6985a0','#947b74','#657d75','#997e99'][i]};margin:0;flex:none">${esc(m.slice(0,1))}</span><span>${esc(m)}</span></button>`).join('')}</div></section></div>`;
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
      case 'loc':if(state&&PLACES.some(p=>p.id===id)){state.location=id;persist();render();}break;
      case 'interact':interact(id);break;
      case 'talk':overlay={type:'talk-select'};render();break;
      case 'talk-member':talk(id);break;
      case 'advance':advance();break;
      case 'tab':if(['clues','people','timeline'].includes(id)){notebookTab=id;render();}break;
      case 'hint':hint();break;
      case 'next':dialogueNext();break;
      case 'close':overlay=null;render();break;
      case 'chapter2':toast('CHAPTER 02는 다음 업데이트에서 공개돼.');break;
    }
  }
  app.addEventListener('click',(event)=>{const target=event.target.closest('[data-action]');if(!target)return;event.preventDefault();handleAction(target.dataset.action,target.dataset.id);});
  app.addEventListener('input',(event)=>{if(event.target.id==='nickname')introName=event.target.value;});
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape' && overlay&&overlay.type!=='dialogue'){overlay=null;render();return;}
    if(event.key==='Enter'&&overlay?.type==='dialogue'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName)){event.preventDefault();dialogueNext();return;}
    if(event.key==='Enter'&&currentView==='landing'&&document.activeElement?.id==='nickname'){event.preventDefault();handleAction('start');}
  });
  render();
})();
