/* 꾸한성: 안개 속 별장 — Chapter 02. All characters/incidents are fictional.
   This chapter contains only player-visible observations, never the culprit or later-chapter answers.
   Offline question prototype is a deterministic ruleset, NOT an AI model. */
(() => {
'use strict';
const KEY = 'gguhansung-fog-villa-ch2-v1';
const CH1_KEY = 'gguhansung-fog-villa-save-v2';
const ROOMS = [
  {id:'living',name:'거실',sub:'다시 모인 사람들의 이야기',bg:'living.webp',clock:'23:42'},
  {id:'corridor',name:'1층 복도',sub:'서재로 이어지는 조용한 복도',bg:'corridor.webp',clock:'23:45'},
  {id:'study',name:'서재 문 앞',sub:'출입이 제한된 사건 현장',bg:'corridor.webp',clock:'23:49'},
  {id:'terrace',name:'테라스',sub:'비가 내리는 외부 통로',bg:'terrace.webp',clock:'00:05'},
  {id:'management',name:'관리실',sub:'녹화기의 표시 시각',bg:'corridor.webp',clock:'00:15'},
  {id:'kitchen',name:'주방',sub:'뒤늦게 떠오르는 기억들',bg:'kitchen.webp',clock:'23:54'}
];
const MEMBER_PATHS = {'꾸티뉴':'kkutinyu','난워니':'nanwoni','김옥독':'kimokdok','야뿌':'yappu','하루노츠키':'harunotsuki','만조':'manjo','모야':'moya','윤타미':'yuntami','야무지':'yamuji','다뮤_':'damyu'};
const PERSONS = [
  {name:'꾸티뉴',role:'여행 친구'}, {name:'난워니',role:'여행 친구'}, {name:'김옥독',role:'여행 친구'},
  {name:'야뿌',role:'여행 친구'}, {name:'하루노츠키',role:'여행 친구'}, {name:'만조',role:'여행 친구'},
  {name:'모야',role:'여행 친구'}, {name:'윤타미',role:'여행 친구'}, {name:'야무지',role:'여행 친구'},
  {name:'다뮤_',role:'여행 친구'}, {name:'이유나',role:'기자'}, {name:'최도식',role:'관리인'},
  {name:'박태성',role:'별장 주인'}, {name:'오세린',role:'제작자'}, {name:'장도윤',role:'영상 기술자'}, {name:'윤해준',role:'기술자'}
];
const EVIDENCE = {
  'E04a': {name:'22:12 단체 채팅 사진',tag:'사진 · 난워니',text:'22시 12분에 단체 채팅방으로 전송된 거실 사진이다. 인물들의 배치와 벽난로 앞 테이블이 선명하다. 휴대전화 전송 시각이 남아 있다.'},
  'E09': {name:'20:41 바비큐 사진',tag:'사진 · 야뿌',text:'테라스에서 찍은 여행 사진. 배경에는 강석훈이 이유나에게 종이봉투를 전달하는 모습이 있다. 사진을 촬영한 시각은 20:41이다.'},
  'E01': {name:'오후 정전 영상',tag:'영상 · 하루노츠키',text:'15:41부터 15:48까지 별장 불이 꺼졌다가 돌아온 영상. 당시의 짧은 정전을 실제 휴대전화 시계로 확인할 수 있다. 관리인은 복구 후 모니터 시각이 이상하다고 말했다.'},
  'E02': {name:'거실 CCTV 일부 영상',tag:'기록 · NVR',text:'거실에 모인 일행의 위치가 단체 채팅 사진과 동일한 프레임이 있다. NVR 화면에 찍힌 표시는 22:05. 영상 장치의 실제 시계 정확도는 아직 검증하지 않았다.'},
  'E08': {name:'서재 출입문 기록',tag:'기록 · 최도식',text:'강석훈이 22:01 정문으로 들어가고 오세린이 22:07에 방문했다가 22:16에 나온 것으로 기록돼 있다. 그 후 관리인이 23:34에 마스터키로 열 때까지 정문의 별도 출입 기록이 없다. 기록이 곧 모든 출입을 의미하지는 않는다.'},
  'E11': {name:'테라스 쪽 젖은 흔적',tag:'현장 관찰',text:'서재 테라스 쪽 실내 바닥에 물기와 붉은 흙으로 보이는 신발 자국이 있다. 직접 밟거나 채취하지 않고, 문 밖에서 위치를 적고 사진만 남겼다.'},
  'ST-YUNA':{name:'이유나의 첫 진술',tag:'증언',text:'"저는 객실에 있었어요. 강석훈 대표님과 따로 얘기한 적은 없습니다." — 23:42 공용 거실에서의 첫 진술.'},
  'ST-DO':{name:'최도식의 첫 진술',tag:'증언',text:'"관리실을 지켰고, 전기가 꺼졌을 때는 분전반도 살펴봤습니다." 출입 기록을 보여주는 것에는 동의했다.'},
  'ST-OTHERS':{name:'나머지 외부인들의 주장',tag:'증언',text:'박태성은 방에서 쉬었다고, 오세린은 편집을 했다고, 장도윤은 장비를 정리했다고 말했다. 윤해준은 전기를 확인하러 갔다가 돌아왔다고 설명했다. 모두 아직 검증되지 않은 주장이다.'}
};
const DISCOVERIES = {
  living:[['E04a','단체 채팅 사진','22:12에 올라온 거실 사진을 다시 본다'],['E09','야뿌의 바비큐 사진','20:41 테라스에서 남긴 기록']],
  corridor:[['doorway','서재 쪽 복도','복도 끝에서 사건 현장을 바라본다'],['people','사람들이 있던 곳','사건 이후 위치를 확인한다']],
  study:[['E08','서재 출입 기록','정문을 사용한 사람들의 기록'],['E11','테라스 쪽 젖은 흔적','사람이 밟지 않도록 멀리서 관찰']],
  terrace:[['outside','테라스 바깥','비를 피하며 서재 방향을 확인']],
  management:[['E02','녹화 기록 확인','같은 장면의 표시 시각을 비교한다'],['E01','오후 정전 영상','하루노츠키의 휴대전화 기록']],
  kitchen:[['meal','식탁과 남은 그릇','저녁 식사 당시를 떠올린다'],['E01','정전 때 찍은 영상','오후에 촬영한 기록을 다시 확인']]
};
const PUZZLES = [
  {id:'P03',title:'봉투의 주인',prompt:'“강석훈과 따로 이야기한 적 없다”는 주장과 어긋나는 기록은?',required:['ST-YUNA','E09'],options:[['unsure','사진만으로 아무것도 말할 수 없다'],['yuna','이유나의 접촉 부인 진술과 사진이 모순된다'],['do','최도식이 봉투를 받았다는 뜻이다']],correct:'yuna',success:'20:41에 두 사람이 접촉했다는 사실을 확인했다. 그러나 봉투 내용이나 범행과의 관계는 아직 알 수 없다.'},
  {id:'P01',title:'두 시계',prompt:'단체 채팅은 22:12, 같은 장면의 CCTV 표시는 22:05다. 지금 가장 근거가 충분한 가설은?',required:['E04a','E02','E01'],options:[['fake','사진 자체가 조작됐다'],['different','두 화면은 서로 다른 순간이다'],['offset7','오후 정전 이후 CCTV 표시가 약 7분 느리다']],correct:'offset7',success:'오후 정전 직후 CCTV의 표시 시각은 실제 시각보다 약 7분 느렸다는 가설을 검증했다. 밤 영상까지 같은 오차라고 확정한 것은 아니다.'},
  {id:'P02',title:'닫힌 문',prompt:'서재 정문에 기록이 없는데도, 사건 현장에 다른 사람이 접근할 수 있었을까?',required:['E08','E11'],options:[['locked','정문 기록이 없으니 아무도 출입할 수 없었다'],['forged','출입 기록은 조작되었다고 단정한다'],['terrace','서재와 이어진 테라스 쪽 경로를 조사해야 한다']],correct:'terrace',success:'정문 외에 확인해야 할 출입 경로가 있다는 사실을 발견했다. 젖은 흔적의 주인이나 범행 경로를 확정한 것은 아니다.'}
];
const PHOTO_CACHE = new Map();
const app=document.getElementById('ch2-app');
const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ch1=readCh1();
let state=readSave();
let tab='records',modal=null,selection=new Set(),chosen={},boardNotice='',queryText='',toastText='',timer=null,sequence=0,dialogueAfter=null;
function readCh1(){try{const o=JSON.parse(localStorage.getItem(CH1_KEY)||'null');return o&&o.version===2?o:null;}catch{return null;}}
function readSave(){try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(!o||o.version!==1||!['blackout','discovery','investigate','complete'].includes(o.stage)||!Array.isArray(o.evidence)||!Array.isArray(o.solved)||!Array.isArray(o.talked))return null;return o;}catch{return null;}}
function save(){if(!state)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{showToast('저장 공간을 확인해 주세요.');}}
function showToast(t){toastText=t;render();clearTimeout(timer);timer=setTimeout(()=>{toastText='';render();},3300);}
function log(t){state.log=[...(state.log||[]),t].slice(-40);}
const has=(id)=>state?.evidence.includes(id);
const solved=(id)=>state?.solved.includes(id);
const GUEST_PORTRAITS={'박태성':'taesung','탁태성':'taesung','최도식':'dosik','오세린':'serin'};
function portrait(name,variant='normal'){if(GUEST_PORTRAITS[name])return `assets/characters/guests/${GUEST_PORTRAITS[name]}.webp`;return MEMBER_PATHS[name]?`assets/characters/${MEMBER_PATHS[name]}/${variant}.webp`:null;}
function warmPortrait(src){if(!src)return Promise.resolve();if(PHOTO_CACHE.has(src))return PHOTO_CACHE.get(src);const pic=new Image();pic.src=src;const p=(typeof pic.decode==='function'?pic.decode():new Promise((resolve,reject)=>{pic.onload=resolve;pic.onerror=reject;})).catch(()=>null);PHOTO_CACHE.set(src,p);return p;}
async function prepareDialogue(){if(!modal||modal.type!=='dialogue')return;const id=++sequence;const item=modal.lines[modal.index];const src=portrait(item[0],item[2]||'normal');modal.loading=!!src;render();if(src)await warmPortrait(src);if(id!==sequence||modal?.type!=='dialogue')return;modal.loading=false;render();}
function speak(lines,after=null){dialogueAfter=after;modal={type:'dialogue',lines,index:0,loading:false};for(const item of lines){const p=portrait(item[0],item[2]||'normal');if(p)warmPortrait(p);}prepareDialogue();}
function nextDialogue(){if(modal?.type!=='dialogue'||modal.loading)return;if(modal.index<modal.lines.length-1){modal.index++;prepareDialogue();return;}const cb=dialogueAfter;dialogueAfter=null;modal=null;render();if(cb)cb();}
function begin(){const name=ch1?.name||'여행 친구';state={version:1,name,stage:'blackout',room:'living',reported:false,secured:false,evidence:[],solved:[],talked:[],asked:[],log:['22:24 — 별장에 정전이 발생했다.'],startedAt:Date.now()};save();speak([
 ['내레이션','밤 10시 24분. 천둥소리와 함께 별장 전체의 불이 꺼졌다.'],['김옥독','다들 가만히 있어. 휴대폰 라이트 켤게. 혹시 모르니까 영상도 찍어둘게.','surprised'],
 ['야무지','저기 창밖에 빨간 불빛 봤어? 무언가 지나가는 것 같았는데.','surprised'],['꾸티뉴','관리인인가? 이 비에 바깥으로 나갈 이유가 있을까?','surprised'],
 ['모야','이번에는 진짜 오래 간다…. 오후랑은 다르네.','surprised'],['내레이션','밤 10시 44분 무렵, 불이 돌아왔다. 모두 큰 사고 없이 거실에 모였다. 하지만 한 외부 투숙객이 보이지 않았다.']
 ]);}
function found(){state.stage='discovery';state.room='corridor';log('23:34 — 관리인이 서재 문을 열었고 강석훈이 쓰러진 채 발견됐다.');save();speak([
 ['이유나','강 대표님, 아직도 안 나오신 거예요?'],['최도식','문이 잠겨 있습니다. 비상키로 확인해 보겠습니다.'],
 ['내레이션','서재 문이 열리자 최도식은 한 걸음 멈춰 섰다. 안쪽에 강석훈이 쓰러져 있었다.'],['오세린','……이게 무슨 일이에요?'],
 ['꾸티뉴','더 들어가지 말자. 경찰에 먼저 연락해야 해.','surprised'],['내레이션','모두는 서재 앞 복도에서 물러났다. 현장은 그대로 두어야 한다.']
 ]);}
function report(choice){if(!state||state.stage!=='discovery')return;state.reported=true;state.secured=true;state.stage='investigate';state.room='living';log('23:39 — 신고 접수. 산길 통제로 출동이 지연될 수 있다는 안내. 사건 현장 보존.');save();modal=null;speak([
 ['내레이션',choice==='self'?'경찰에 직접 신고했다.':'최도식에게 즉시 신고를 부탁하고 옆에서 내용을 확인했다.'],
 ['내레이션','경찰은 산길 일부가 통제되어 도착이 늦어질 수 있다고 안내했다. 현장에 들어가지 않고 증언과 기록만 정리하기로 했다.'],
 ['박태성','저는 10시 이후 줄곧 방에 있었습니다.'],['최도식','관리실을 지키다가 정전 때 분전반도 확인했어요.'],
 ['이유나','저는 제 방에 있었어요. 강 대표님과 따로 얘기한 적 없습니다.'],['장도윤','제 방에서 장비 정리하고 있었어요.'],
 ['윤해준','전기 상태를 확인하러 내려갔다가 복구 후 거실로 돌아왔습니다.'],['오세린','저는 객실에서 편집하고 있었어요.'],
 ['꾸티뉴','다들 다른 이야기를 하고 있어. 누가 거짓말한다고 단정하기 전에 기록을 봐야겠어.','night']
 ]);}
function collect(id){if(!state||state.stage!=='investigate'||!EVIDENCE[id])return;const first=!has(id);if(first){state.evidence.push(id);log(`${EVIDENCE[id].tag} — ${EVIDENCE[id].name} 기록`);save();}modal={type:'detail',title:EVIDENCE[id].name,body:EVIDENCE[id].text,tag:EVIDENCE[id].tag};render();}
function look(id){const f={doorway:'서재 앞에는 현장 보존을 위한 임시 경계가 생겼다. 안쪽으로 들어가지 않고 복도에서 기록만 확인한다.',people:'복도로 이동한 사람들은 서로 누가 어디에 있었는지 묻고 있다. 지금은 기억과 사실을 구분해야 한다.',outside:solved('P02')?'서재로 이어진 테라스 쪽 문이 보인다. 경찰이 확인할 때까지 손대지 않고 위치만 기록한다.':'주변에는 테라스와 외부 통로가 연결돼 있다. 서재까지 이어지는지는 더 확인해 봐야 한다.',meal:'식탁에는 밤에 놀다가 남긴 컵과 그릇이 있다. 사건과 관계없는 물건도 많아 무턱대고 수집할 필요는 없어.'};modal={type:'detail',title:'주변 살펴보기',body:f[id]||'특이한 점은 보이지 않는다.',tag:'관찰'};render();}
function talk(name){if(!state||state.stage!=='investigate')return;const p=PERSONS.find(x=>x.name===name);if(!p)return;if(!state.talked.includes(name)){state.talked.push(name);save();}
if(name==='이유나'&&!has('ST-YUNA')){state.evidence.push('ST-YUNA');save();}
if(name==='최도식'&&!has('ST-DO')){state.evidence.push('ST-DO');save();}
const scripts={
 '꾸티뉴':[['꾸티뉴','뭔가 이상한 건 맞는데, 지금 누구를 지목할 수는 없겠어. 본 것과 들은 것을 구분해 보자.','night']],
 '난워니':[['난워니','우리 단체사진은 22:12에 올렸어. 전송 시간은 채팅방에 남아 있잖아.','night']],
 '김옥독':[['김옥독','정전 때 내 휴대전화로 찍은 영상이 있어. 당장 모두 확인할 필요는 없지만 잘 보관해 두자.','night']],
 '야뿌':[['야뿌','아까 바비큐 사진 찍었던 거 있잖아. 배경에 다른 손님들이 나왔어.','night']],
 '하루노츠키':[['하루노츠키','오후에도 정전 있었지? 그때 찍은 영상이 휴대전화에 남아 있어.','night']],
 '만조':[['만조','서재 쪽으로는 경찰 올 때까지 들어가지 않는 게 좋겠어.','night']],
 '모야':[['모야','밤에 불이 꺼졌을 때 꽤 오랫동안 기다렸던 것 같아. 아까 낮이랑은 달랐어.','night']],
 '윤타미':[['윤타미','관리실 화면을 확인해 볼 수 있대. 원본 파일은 건드리지 말고 화면에 표시된 시각부터 적자.','night']],
 '야무지':[['야무지','정전 중에 거실 창밖으로 붉은 빛이 움직이는 걸 봤어. 멀어서 누군지는 몰라.','night']],
 '다뮤_':[['다뮤_','아까 헤드랜턴을 보여주던 사람 기억해? 그렇다고 지금 불빛 주인을 단정할 순 없겠지.','night']],
 '이유나':solved('P03')?[['이유나','맞아요. 그날 밤 강 대표님께 봉투를 받은 건 사실이에요. 다만 지금은 안의 내용을 말하기 어려워요.']]:[['이유나','저는 객실에 있었어요. 강 대표님과 따로 이야기한 적은 없습니다.']],
 '최도식':[['최도식','서재 정문 사용 기록은 보여드릴 수 있어요. 하지만 다른 곳까지 카메라가 모두 찍는 건 아닙니다.']],
 '박태성':[['박태성','저는 10시가 넘어서부터 제 방에 있었습니다. 별장 매매 문제로 일이 많아 피곤했어요.']],
 '오세린':[['오세린','객실에서 편집하느라 시간을 잘 모르겠어요. 내일 경찰에게 자세히 말씀드릴게요.']],
 '장도윤':[['장도윤','장비 정리하고 있었습니다. 제가 영상 기술자라고 해서 CCTV를 다 알고 있는 건 아닙니다.']],
 '윤해준':[['윤해준','전기 상태가 마음에 걸려 확인하러 갔었습니다. 복구 후에는 거실로 돌아왔고요.']]
};
const rows=scripts[name]||[[name,'지금은 더 말씀드릴 게 없습니다.']];speak(rows);}
function guess(id,value){chosen[id]=value;boardNotice='';render();}
function toggleProof(id){if(selection.has(id))selection.delete(id);else selection.add(id);boardNotice='';render();}
function attempt(id){const p=PUZZLES.find(x=>x.id===id);if(!p||solved(id))return;const missing=p.required.filter(x=>!has(x));if(missing.length){boardNotice='아직 확인하지 않은 자료가 있어. 사람과 이야기하거나 관련 장소를 다시 조사해 봐.';render();return;}const missingSelected=p.required.filter(x=>!selection.has(x));if(missingSelected.length){boardNotice='증거를 읽는 것만으로 충분하지 않아. 이 추리를 뒷받침할 자료를 연결 보드에서 직접 선택해 줘.';render();return;}
if(chosen[id]!==p.correct){boardNotice='해당 결론은 현재 증거들로 입증되지 않아. 사진·기록과 증언에서 실제로 일치하지 않는 부분을 다시 확인해 봐.';render();return;}
state.solved.push(id);log(`추리 검증 — ${p.title}`);selection.clear();chosen={};boardNotice='';save();modal={type:'detail',title:`추리 완료 · ${p.title}`,body:p.success,tag:'검증 완료'};render();}
const UNRELATED_MESSAGE='이 사건과 관련 없는 질문입니다.';
function isCaseQuestion(q){
 const text=String(q||'').replace(/\s+/g,'').toLowerCase();
 // Common unrelated topics. This has priority over incidental words like '시간' or '사건'.
 if(/대통령|국회의원|총선|대선|정당|정치|외교|전쟁|주식|코인|비트코인|환율|부동산|경제|사회문제|뉴스|날씨|기온|맛집|음식추천|요리법|레시피|축구|야구|농구|연예인|아이돌|영화추천|노래추천|숙제|수학|영어번역|프로그래밍|자바스크립트|파이썬|코딩|철학|종교|세계사/.test(text))return false;
 // Named people, case places, clues, timelines and investigation language.
 if(/꾸한성|꾸티뉴|난워니|김옥독|야뿌|하루노츠키|만조|모야|윤타미|야무지|다뮤|강석훈|박태성|최도식|오세린|윤해준|이유나|장도윤|별장|서재|거실|테라스|관리실|사건|수사|조사|추리|증거|단서|심문|진술|목격|알리바이|범인|살인|침입|잠입|정전|분전반|전기|카메라|cctv|nvr|녹화|시계|봉투|사진|바비큐|발자국|흙|젖은|출입|마스터키|문이잠|시신|쓰러|사망|현장|경찰|범행|용의자|누가죽|의심|거짓말|22:12|22:05|20:41|23:34|22:24|22:44|7분/.test(text))return true;
 // Short follow-up questions within the game's detective notebook.
 return /^(원인|이유|왜|어째서|어떻게|언제|누가|누구|무슨일|무슨일이|뭐가문제|어떤문제|가능성|확실해|정말이야|그게맞아)/.test(text);
}
function offlineResult(q) {
 if(!isCaseQuestion(q))return {answer:UNRELATED_MESSAGE,reason:''};
 const lower=q.replace(/\s+/g,'').toLowerCase();
 const knows=id=>has(id);
 const confirmed=id=>solved(id);
 let answer='수사 노트',reason='지금까지 확인된 자료만으로는 단정하기 어려워. 관련 장소의 기록과 인물 진술을 비교해 보면 새로운 단서가 나올 수 있어.';
 if(/(누가|누구|외부인|낯선사람|침입자|잠입|침입).*(죽|살인|범행|범인)|죽(였|인|였나)|살인.*(잠입|침입)/.test(lower)) {
   answer='가능성은 남아 있어';
   reason=knows('E08')&&knows('E11')?'서재 정문 기록만으로 모든 접근을 설명할 수는 없어. 테라스 쪽 젖은 흔적도 확인됐지만 외부 침입이나 살인 여부, 흔적의 주인은 아직 입증되지 않았어.':'외부인이 들어왔다고 단정할 수 없어. 서재 출입 기록과 테라스 쪽 흔적을 함께 조사해야 판단할 수 있어.';
 } else if(/범인|진범|살인자|공범|누가죽|죽인사람|범행동기|범행원인/.test(lower)) {
   answer='아직 특정할 수 없어';
   reason='지금 이 자리에 범인이 있는지조차 확인되지 않았어. 누군가를 지목하기보다 시간 기록과 서로 어긋나는 진술을 차례로 검증해야 해.';
 } else if(/(cctv|녹화|녹화기|카메라|nvr|시계|시간).*(문제|이상|오류|오차|느린|늦|빠른|정확|맞|7분)|(?:7분|오차|시각).*(cctv|녹화|카메라|시계|nvr)/i.test(lower)) {
   answer=confirmed('P01')?'시간 오차의 단서가 확인됐어':'시간 표시를 비교해 봐야 해';
   reason=confirmed('P01')?'22:12에 공유된 사진과 같은 장면이 CCTV에는 22:05로 남아 있어. 오후 정전 뒤 표시 시각이 약 7분 느렸다는 가설을 검증했지만, 밤에도 같은 오차가 유지됐는지는 아직 몰라.':knows('E04a')&&knows('E02')?'단체 채팅 사진과 같은 장면의 CCTV 표시 시각이 달라. 오후 정전 기록과 비교하면 시계가 정확한지 판단할 실마리가 있어.':'거실 단체 채팅 사진의 시간과 관리실 CCTV 표시 시간을 비교해 봐. 오후 정전 영상도 중요한 단서일 수 있어.';
 } else if(/(정전|전기|불).*(원인|이유|왜|문제|고장|꺼)|(?:원인|이유|왜).*(정전|전기|불)/.test(lower)) {
   answer='정전 원인은 미확인';
   reason='오후와 밤에 정전이 있었지만 원인은 확인되지 않았어. 관리실 기록과 전기 상태를 확인했다는 사람의 진술을 비교해 봐.';
 } else if(/(원인|이유|왜|어떻게).*(뭔|무엇|뭐|인가|까요|지)|^(원인|이유|왜)(이|은|가)?/.test(lower)) {
   answer='어떤 원인을 묻는지 확인이 필요해';
   reason='정전 원인을 말하는 거라면 아직 확인되지 않았어. 강석훈이 쓰러진 이유를 말하는 거라면 경찰 조사 전에는 단정할 수 없어. 현재 확인된 시간대와 현장 기록부터 살펴봐.';
 } else if(/(이유나|강석훈).*(봉투|만났|접촉|대화)|봉투.*(이유나|강석훈)/.test(lower)) {
   answer=confirmed('P03')?'접촉 사실이 검증됐어':'진술과 사진을 비교해 봐';
   reason=confirmed('P03')?'20:41 바비큐 사진에 강석훈이 이유나에게 봉투를 건네는 모습이 있어. 접촉을 부인한 첫 진술과 모순되지만, 봉투 내용이나 범행 연관성은 몰라.':knows('E09')&&knows('ST-YUNA')?'바비큐 사진과 이유나의 첫 진술을 나란히 읽어 봐. 두 기록 사이에 확인할 부분이 있어.':'바비큐 사진과 이유나의 진술이 도움이 될 수 있어.';
 } else if(/(서재|출입|문).*(테라스|밖|외부|다른문|다른길|잠|잠김|기록)|(?:테라스|외부|문).*(서재|출입)/.test(lower)) {
   answer=confirmed('P02')?'다른 출입 경로를 살펴볼 필요가 있어':'정문 기록만으로 판단할 수 없어';
   reason=confirmed('P02')?'서재는 정문 외에도 테라스 쪽 경로를 조사해야 해. 하지만 그 길을 누가 이용했는지는 아직 확인하지 못했어.':knows('E08')&&knows('E11')?'정문 출입 기록과 테라스 쪽 젖은 흔적을 함께 보면 정문 기록만으로는 설명되지 않는 가능성이 있어.':'서재 정문 출입 기록과 테라스 쪽 현장 흔적을 확인해 봐.';
 } else if(/(강석훈|대표).*(쓰러|상태|죽|발견)|(?:쓰러|발견).*(강석훈|대표)/.test(lower)) {
   answer='서재에서 쓰러진 채 발견됐어';
   reason='23:34에 관리인이 서재 문을 열었을 때 강석훈이 쓰러져 있었어. 왜 그런 상태였는지는 아직 단정할 수 없어.';
 } else if(/(정전).*(있었|발생)|전기.*(나갔|꺼졌)/.test(lower)) {
   answer='정전은 있었어';
   reason='오후와 밤에 정전이 발생했다는 사실은 확인돼. 원인과 사건의 관련성은 아직 알 수 없어.';
 } else if(/^(안녕|hi|hello)/i.test(lower)) {
   answer='안녕, 탐정!';
   reason='궁금한 사건 기록이나 인물의 진술을 질문해 줘.';
 }
 return {answer,reason};
}
function askOffline(q){
 q=(q||'').trim().slice(0,140);
 if(!q||!state||state.stage!=='investigate')return;
 if((state.asked?.length||0)>=15){showToast('이 챕터의 시험 질문 15회를 모두 사용했어.');return;}
 const result=offlineResult(q);
 state.asked=[...(state.asked||[]),{q,...result}].slice(-15);
 queryText='';save();render();
}
let aiBusy=false;
async function ask(q){
 q=(q||'').trim().slice(0,140);
 if(!q||!state||state.stage!=='investigate'||aiBusy)return;
 if((state.asked?.length||0)>=15){showToast('이 챕터의 시험 질문 15회를 모두 사용했어.');return;}
 if(!isCaseQuestion(q)){askOffline(q);return;}
 // Chapter spoilers and common evidence questions are answered deterministically.
 // This avoids unsupported AI claims and keeps results consistent with the game puzzles.
 if(/범인|진범|살인|죽인|누가죽|공범|침입|잠입|cctv|nvr|녹화|시계|오차|7분|정전|전기|봉투|이유나|강석훈|서재|테라스|원인|챕터\s*[345]/i.test(q)){
   askOffline(q);return;
 }
 aiBusy=true;render();
 try{
  const controller=new AbortController(),tid=setTimeout(()=>controller.abort(),14500);
  let response;
  try{response=await fetch('/api/gemini-chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q}),signal:controller.signal});}
  finally{clearTimeout(tid);}
  if(!response.ok)throw Error('AI request unavailable');
  const data=await response.json();
  if(typeof data.answer!=='string'||!data.answer.trim())throw Error('Empty AI response');
  state.asked=[...(state.asked||[]),{q,answer:'AI 조사 도우미',reason:data.answer.slice(0,900)}].slice(-15);
  queryText='';save();render();
 }catch{
  // No intrusive warning: use the local evidence-aware answer instead.
  askOffline(q);
 }finally{aiBusy=false;render();}
}
function conclude(){if(!state||state.stage!=='investigate')return;if(state.solved.length<2){showToast('증거를 연결해 추리 2개 이상을 검증해야 해.');return;}state.stage='complete';state.finishedAt=Date.now();log('00:25경 — 검증된 사실들을 경찰에게 전달하기 위한 기록을 정리했다.');save();render();}
function renderTop(){return `<header class="top"><a class="brand" href="index.html"><span class="brand-icon">✦</span><span>꾸한성 · 안개 속 별장</span></a><div class="top-right"><span class="tag">CHAPTER 02</span><span class="muted">사건 발생 · 로컬 자동 저장</span></div></header>`;}
function renderWelcome(){return `${renderTop()}<main class="welcome"><div class="welcome-card"><div class="welcome-art" role="img" aria-label="밤의 별장 외관"></div><section class="welcome-copy"><div class="eyebrow">CHAPTER 02 / THE INCIDENT</div><h1>꺼진 불빛 뒤에<br>남은 것들</h1><p>함께 웃던 별장의 불이 꺼진 밤. 누군가의 말과 기록이 서로 어긋나기 시작한다. 이야기를 듣고, 필요한 자료를 연결해 스스로 가설을 확인해 보자.</p><span class="tag">CH2 · P01 · P02 · P03 플레이 가능</span><div class="buttons"><button class="btn btn-primary" data-action="begin">${ch1?.phase==='complete'?'챕터 2 시작하기':'챕터 2 체험하기'}</button><a class="btn" href="index.html">챕터 1 돌아가기</a></div><p class="small muted">${ch1?.phase==='complete'?`여행 친구 ${esc(ch1.name||'')}의 챕터 1 기록을 이어받아 시작해.`:'챕터 1 기록이 없어도 챕터 2를 체험할 수 있어. 이야기의 흐름을 보려면 챕터 1을 먼저 플레이하는 걸 추천해.'}</p></section></div></main>`;}
function currentRoom(){return ROOMS.find(r=>r.id===state?.room)||ROOMS[0];}
function renderGame(){const room=currentRoom(),isInvest=state.stage==='investigate';const hasP=state.solved.length>=2;const displayTime=state.stage==='blackout'?'22:24~22:44':state.stage==='discovery'?'23:34':room.clock;
return `${renderTop()}<div class="story-shell"><aside class="rail card"><div class="rail-title">장소 이동</div><nav class="room-nav">${ROOMS.map((r,i)=>`<button class="room ${state.room===r.id?'active':''}" data-action="room" data-id="${r.id}" ${isInvest?'':'disabled'}><small>${String(i+1).padStart(2,'0')}</small>${esc(r.name)}</button>`).join('')}</nav><div class="line"></div><div class="rail-title">수사 기록</div><div class="rail-bottom"><button class="btn btn-small" data-action="tab" data-id="board" ${isInvest?'':'disabled'}>증거 연결 보드</button><button class="btn btn-small" data-action="tab" data-id="people" ${isInvest?'':'disabled'}>인물 대화</button><button class="btn btn-small btn-subtle" data-action="back">챕터 1</button></div></aside><main class="main"><div class="context card"><div><div class="eyebrow">${state.stage==='blackout'?'BLACKOUT':state.stage==='discovery'?'THE DISCOVERY':'INVESTIGATION'}</div><h2>${esc(room.name)}</h2><p class="context-text">${esc(room.sub)}</p></div><span class="tag">${displayTime}</span></div><section class="scene" style="--darkness:${state.stage==='blackout'?'.7':state.room==='study'?'.4':'.1'}" aria-label="${esc(room.name)} 배경"><img src="assets/backgrounds/${esc(room.bg)}" alt="${esc(room.name)}"><div class="scene-badge"><strong>${esc(room.name)}</strong><span>꾸한성 · CHAPTER 02</span></div><p class="scene-copy">${state.stage==='blackout'?'천둥이 울리자 별장의 불이 꺼졌다.':state.stage==='discovery'?'서재 쪽에서 사람들이 웅성거리기 시작했다.':esc(room.sub)}</p></section>${state.stage==='blackout'?`<section class="notice card"><div><h3>사라진 불빛</h3><p>정전이 끝난 뒤 무슨 일이 있었는지 확인하자.</p></div><button class="btn btn-primary" data-action="found">이후 이야기 확인</button></section>`:state.stage==='discovery'?`<section class="notice card"><div><h3>먼저 신고하고 현장을 보존하자</h3><p>시신이나 물건을 만지지 않고 신고하는 선택을 해 줘.</p></div><button class="btn btn-primary" data-action="report">경찰에 신고하기</button></section>`:`<section class="notice card"><div><h3>${hasP?'지금까지 확인한 사실을 정리할 수 있어':'증거를 비교하며 의문을 풀어 보자'}</h3><p>단서 ${state.evidence.length}개 · 추리 검증 ${state.solved.length}/3개 · 기록은 자동 저장돼.</p></div><button class="btn ${hasP?'btn-primary':'btn-subtle'}" data-action="conclude" ${hasP?'':'disabled'}>기록 정리하기</button></section><section class="actions card"><h3 class="section-title">이 장소에서 할 수 있는 일</h3><div class="action-grid">${(DISCOVERIES[state.room]||[]).map(([id,label,desc])=>`<button class="action-tile ${has(id)?'done':''}" data-action="${EVIDENCE[id]?'collect':'look'}" data-id="${id}"><strong>${has(id)?'✓ ':''}${esc(label)}</strong><span>${esc(desc)}</span></button>`).join('')}</div></section><section class="paper card"><h3>첫 사건의 세 가지 의문</h3><p>모든 단서를 누르는 대신, 궁금한 자료를 찾아 보드에서 직접 연결해 봐.</p><div class="paper-list">${PUZZLES.map(p=>`<button class="btn" data-action="open-puzzle" data-id="${p.id}"><span>${esc(p.title)}</span><span class="tag ${solved(p.id)?'good':'lock'}">${solved(p.id)?'검증 완료':'미검증'}</span></button>`).join('')}</div></section>`}</main><aside class="side"><section class="card"><div class="eyebrow">DETECTIVE NOTES</div><h3>${tab==='records'?'수집한 자료':tab==='people'?'대화와 진술':tab==='board'?'증거 연결 보드':'질문 노트'}</h3><p class="description">${tab==='records'?'확인한 사실과 누군가의 주장을 구분해 적는다.':tab==='people'?'외부인과 꾸한성 친구에게 직접 이야기를 듣는다.':tab==='board'?'확보한 증거를 연결하고 가설을 검증한다.':'Gemini 조사 도우미 · 연결 불가 시 기존 규칙 답변'}</p><div class="segment">${[['records','자료'],['people','인물'],['board','추리'],['questions','질문']].map(([id,label])=>`<button class="${tab===id?'active':''}" data-action="tab" data-id="${id}">${label}</button>`).join('')}</div>${isInvest?renderTab():`<div class="empty">사건을 확인하고 경찰에 신고한 뒤 조사 기록이 열려.</div>`}</section></aside></div>`;}
function renderTab(){if(tab==='records'){return state.evidence.length?state.evidence.map(id=>`<div class="record"><div class="record-title"><span>${esc(EVIDENCE[id]?.name||id)}</span><button class="btn btn-small btn-subtle" data-action="read" data-id="${id}">보기</button></div><p>${esc(EVIDENCE[id]?.tag||'')}</p></div>`).join(''):'<div class="empty">아직 확인한 자료가 없어. 거실이나 관리실부터 둘러보자.</div>';}
if(tab==='people')return `<div class="witness-list">${PERSONS.map(p=>`<button class="witness" data-action="talk" data-id="${esc(p.name)}">${portrait(p.name)?`<img src="${portrait(p.name)}" alt="" loading="lazy">`:'<span aria-hidden="true">◈</span>'}<span><strong>${esc(p.name)}</strong><span class="role">${esc(p.role)}${state.talked.includes(p.name)?' · 대화함':''}</span></span></button>`).join('')}</div>`;
if(tab==='board')return `<div class="small muted">증거를 클릭해 선택한 다음 퍼즐의 가설을 검증해 봐.</div><div class="board-proof" style="margin-top:12px">${state.evidence.length?state.evidence.map(id=>`<button class="proof ${selection.has(id)?'selected':''}" data-action="select-proof" data-id="${id}" aria-pressed="${selection.has(id)}">${selection.has(id)?'✓ ':''}${esc(EVIDENCE[id]?.name||id)}</button>`).join(''):'<span class="muted small">먼저 기록을 수집해 줘.</span>'}</div>${PUZZLES.map(p=>`<section class="board-card"><div class="tag ${solved(p.id)?'good':''}">${esc(p.id)} ${solved(p.id)?'· 검증 완료':''}</div><h4>${esc(p.title)}</h4><p>${esc(p.prompt)}</p><div class="board-options">${p.options.map(([value,label])=>`<label class="board-option"><input type="radio" name="choice-${p.id}" value="${value}" data-puzzle="${p.id}" ${chosen[p.id]===value?'checked':''} ${solved(p.id)?'disabled':''}><span>${esc(label)}</span></label>`).join('')}</div><button class="btn ${solved(p.id)?'btn-subtle':'btn-primary'}" data-action="solve" data-id="${p.id}" ${solved(p.id)?'disabled':''}>${solved(p.id)?'검증 완료':'선택한 증거로 검증'}</button></section>`).join('')}${boardNotice?`<div class="board-result" role="status">${esc(boardNotice)}</div>`:''}`;
return `<div class="small muted">예/아니요로 답할 수 있는 질문을 적어 봐. <strong>Gemini AI 조사 도우미</strong> · AI 답변은 추리 정답의 근거가 아니며, 미확인 내용은 검증해야 해.</div><form class="qa-row" id="ask-form"><input id="q" maxlength="140" autocomplete="off" placeholder="예: CCTV 시계가 7분 느렸나요?" value="${esc(queryText)}" aria-label="사건 질문"><button class="btn btn-primary" type="submit" ${(state.asked?.length||0)>=15||aiBusy?'disabled':''}>${aiBusy?'답변 중…':'질문'}</button></form><div class="small muted" style="margin-top:9px">${(state.asked?.length||0)} / 15 질문 사용</div><div class="history">${[...(state.asked||[])].reverse().map(x=>`<div class="qa-answer"><p>${esc(x.q)}</p><strong>${esc(x.answer)}</strong><p>${esc(x.reason)}</p></div>`).join('')}</div>`;}
function renderFinish(){return `${renderTop()}<main class="finish-screen"><div class="finish-card"><div class="finish-art" role="img" aria-label="안개 낀 별장"></div><div class="finish-copy"><span class="tag good">CHAPTER 02 COMPLETE</span><h1>서로 맞지 않는<br>첫 기록</h1><p>사건 현장을 보존하고 처음으로 증거들을 연결했다. 누군가의 거짓말은 밝혀졌지만, 그것만으로 범인을 정할 수는 없다.</p><p>검증한 추리 ${state.solved.length} / 3개 · 수집한 기록 ${state.evidence.length}개</p><p>다음 챕터에서는 서로 다른 시간 기록과 알리바이를 본격적으로 비교하게 돼.</p><div class="buttons"><a class="btn btn-primary" href="chapter3.html">CHAPTER 03 · 이어서 플레이</a><button class="btn" data-action="revisit">챕터 2 다시 조사</button><a class="btn btn-subtle" href="index.html">메인으로</a></div></div></div></main>`;}
function renderModal(){if(!modal)return '';if(modal.type==='dialogue'){
const item=modal.lines[modal.index],isNarr=item[0]==='내레이션',src=portrait(item[0],item[2]||'normal');return `<div class="modal-cover" role="presentation"><div class="modal ${isNarr?'narration':''}" role="dialog" aria-modal="true" aria-label="장면 대화">${modal.loading?`<div class="dialogue-text"><p>장면을 준비 중이야…</p></div>`:`<div class="dialogue-view">${src?`<img src="${src}" alt="">`:`<span class="speaker-placeholder" aria-hidden="true">◈</span>`}</div><div class="dialogue-text">${isNarr?'':`<div class="speaker">${esc(item[0])}</div>`}<p>${esc(item[1])}</p></div><div class="dialogue-next"><span class="small muted">${modal.index+1} / ${modal.lines.length} · Enter로 계속</span><button class="btn btn-primary" data-action="dialogue-next">${modal.index===modal.lines.length-1?'확인':'다음 ›'}</button></div>`}</div></div>`;}
if(modal.type==='report')return `<div class="modal-cover"><div class="modal" role="dialog" aria-modal="true" aria-label="경찰 신고"><div class="modal-head"><h3>신고 방법</h3></div><div class="modal-body"><p>현장에 손대지 않고 바로 경찰에 연락해야 해. 어떤 방법을 택하든 신고가 접수되고 현장은 보존돼.</p><div class="modal-buttons"><button class="btn btn-primary" data-action="report-choice" data-id="self">직접 경찰에 신고한다</button><button class="btn" data-action="report-choice" data-id="manager">관리인에게 신고를 부탁한다</button></div></div></div></div>`;
return `<div class="modal-cover"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(modal.title||'상세 정보')}"><div class="modal-head"><h3>${esc(modal.title||'상세 정보')}</h3><button class="btn btn-small btn-subtle" data-action="close" aria-label="닫기">✕</button></div><div class="modal-body">${modal.tag?`<span class="tag">${esc(modal.tag)}</span><div class="line"></div>`:''}<p>${esc(modal.body||'')}</p><div class="modal-buttons"><button class="btn btn-primary" data-action="close">확인</button></div></div></div></div>`;
}
function render(){app.innerHTML=(!state?renderWelcome():state.stage==='complete'?renderFinish():renderGame())+renderModal()+(toastText?`<div class="toast" role="status">${esc(toastText)}</div>`:'');}
app.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action,id=el.dataset.id||'';
switch(a){case 'begin':begin();break;case 'found':found();break;case 'report':modal={type:'report'};render();break;case 'report-choice':report(id);break;case 'room':if(state?.stage==='investigate'&&ROOMS.some(r=>r.id===id)){state.room=id;save();render();}break;case 'collect':collect(id);break;case 'look':look(id);break;case 'read':if(EVIDENCE[id])modal={type:'detail',title:EVIDENCE[id].name,body:EVIDENCE[id].text,tag:EVIDENCE[id].tag};render();break;case 'talk':talk(id);break;case 'tab':if(['records','people','board','questions'].includes(id)){tab=id;render();}break;case 'open-puzzle':tab='board';boardNotice='';render();{const n=document.querySelector('.board-card');n?.scrollIntoView({behavior:'smooth',block:'nearest'});}break;case 'select-proof':toggleProof(id);break;case 'solve':attempt(id);break;case 'dialogue-next':nextDialogue();break;case 'close':modal=null;render();break;case 'conclude':conclude();break;case 'revisit':state.stage='investigate';save();render();break;case 'back':location.href='index.html';break;default:break;}});
app.addEventListener('change',e=>{const t=e.target;if(t instanceof HTMLInputElement&&t.dataset.puzzle){guess(t.dataset.puzzle,t.value);}});
app.addEventListener('input',e=>{if(e.target.id==='q')queryText=e.target.value;});
app.addEventListener('submit',e=>{if(e.target.id==='ask-form'){e.preventDefault();ask(queryText);}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&modal?.type==='dialogue'){e.preventDefault();nextDialogue();}if(e.key==='Escape'&&modal&&modal.type==='detail'){modal=null;render();}});
render();
})();