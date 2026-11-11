/* 꾸한성: 안개 속 별장 — CHAPTER 03. Fictional fan work.
 * Player-visible observations only. No murderer, hidden motive, or chapter 4-5 solution embedded.
 * Question note is deterministic/offline, NOT generative AI. */
(() => {
'use strict';
const KEY='gguhansung-fog-villa-ch3-v1';
const CH2_KEY='gguhansung-fog-villa-ch2-v1';
const CH1_KEY='gguhansung-fog-villa-save-v2';
const app=document.getElementById('ch3-app');
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const PERSON={'꾸티뉴':'kkutinyu','난워니':'nanwoni','김옥독':'kimokdok','야뿌':'yappu','하루노츠키':'harunotsuki','만조':'manjo','모야':'moya','윤타미':'yuntami','야무지':'yamuji','다뮤_':'damyu'};
const ROOMS=[
 {id:'living',name:'거실',bg:'living.webp',sub:'사진을 남겼던 바로 그 자리'},
 {id:'management',name:'관리실',bg:'corridor.webp',sub:'녹화 장치와 두 개의 시각'},
 {id:'kitchen',name:'주방',bg:'kitchen.webp',sub:'복구 직후 남은 기록'},
 {id:'corridor',name:'복도',bg:'corridor.webp',sub:'서재 앞 경계선을 지키는 사람들'},
 {id:'terrace',name:'테라스',bg:'terrace.webp',sub:'비가 내리는 외부 통로'}
];
const E={
 E01:{name:'오후 정전 기록',where:'관리실',text:'하루노츠키의 영상은 15:41~15:48 동안 전기가 꺼졌음을 보여 준다. 복구 당시 관리인이 화면 시각이 이상하다고 말했다.'},
 E02:{name:'NVR 화면·표시 시각',where:'관리실',text:'22:12에 찍힌 단체사진과 일치하는 CCTV 장면에는 22:05가 표시돼 있다. 또 다른 영상 프레임에는 22:34:13이 표시되며, 윤해준은 거실에 있다. 장치가 실제로 언제 녹화했는지는 별도로 확인해야 한다.'},
 E04a:{name:'22:12 단체 채팅 사진',where:'거실',text:'난워니가 22:12에 보낸 사진. 화면의 배치가 CCTV 22:05 표시 영상과 일치한다. 채팅 서버의 메시지 시각은 휴대폰에 보인다.'},
 E08:{name:'서재 정문 출입 기록',where:'복도',text:'22:01 강석훈 입실, 22:07~22:16 오세린 방문, 이후 23:34 관리인 마스터키 개방까지 정문 개방 기록이 없다. 다른 출입구에 대한 정보는 없다.'},
 'ST-SERIN':{name:'오세린의 처음 진술',where:'심문',text:'“저는 객실에서 편집하고 있었어요. 서재에는 들어가지 않았습니다.”'},
 'ST-DOYUN':{name:'장도윤의 처음 진술',where:'심문',text:'“제 방에서 장비를 정리했어요. 차에는 가지 않았습니다.”'},
 'ST-HAEJUN':{name:'윤해준의 알리바이 주장',where:'심문',text:'“복구 후에는 거실에 있었어요. CCTV에도 나오잖습니까.”'},
 E07:{name:'오세린의 면담 녹음',where:'심문 후 제공',text:'22:07~22:16 서재에서 두 사람이 이야기한 녹음. 강석훈의 목소리는 분명하며 “22시 30분에 약속이 있다”는 발언이 포함돼 있다. 녹음 사실을 숨긴 이유는 아직 밝혀지지 않았다.'},
 E04b:{name:'정전 중 휴대폰 영상',where:'거실 · 김옥독',text:'실제 휴대전화 시각 22:31부터 촬영됐다. 거실의 조명이 꺼져 있고 윤해준은 보이지 않는다. 끝부분 22:40~22:42 사이 둔탁한 소리가 희미하게 녹음돼 있다.'},
 E04c:{name:'복구 직후 휴대폰 영상',where:'주방 · 모야',text:'실제 휴대전화 표시 시각 22:46. 전기가 돌아온 거실 문턱이 보이며, NVR에서는 정전 전과 숫자가 이어진 것처럼 표시된다.'},
 E06:{name:'주방 정전 타이머 기록',where:'주방',text:'이 별장의 경과 타이머는 정전 후 전원이 돌아오면 00:00에서 자동 재시작한다. 모야는 23:20에 표시 00:36을 촬영했다. 복구 추정 시각은 약 22:44다.'},
 E05:{name:'스마트워치 마지막 활동 기록',where:'경찰 전달용 현장 사진',text:'발견 시각에 경찰에 전달한 현장 사진 속 스마트워치 화면에 22:41 전후 마지막 활동 기록이 보인다. 심정지나 사망 시각을 의학적으로 확정하는 증거는 아니다.'},
 E04d:{name:'22:50 거실 사진',where:'거실 · 다뮤_',text:'22:50에 채팅방으로 공유된 거실 사진. 해당 사진에서는 윤해준이 보이지 않는다. 화면에 보이는 인원의 범위만 확인할 수 있다.'},
 E03:{name:'NVR 영상 속 벽시계',where:'관리실 확대',text:'CCTV 표시가 22:34:13인 프레임 안의 별장 배터리식 벽시계는 약 23:01을 가리킨다. 벽시계는 오후에 맞춰진 사실이 다른 사진으로 확인되며, 정전과 관계없이 작동한다.'},
 E12:{name:'차량 블랙박스 부분 영상',where:'테라스 · 장도윤',text:'장도윤이 제공한 차량 영상에는 정전 중 22:27경 외부 통로에서 붉은 빛이 이동하는 모습이 찍혀 있다. 어둡고 비가 내려 인물은 식별할 수 없다.'}
};
const EVIDENCE_IMAGES = {
  E04b:'assets/evidence/phone-video-blackout-2231.webp',
  E04c:'assets/evidence/phone-video-restored-2246.webp',
  E06:'assets/evidence/kitchen-timer-0036.webp',
  E04d:'assets/evidence/group-2250.webp',
  E03:'assets/evidence/nvr-wallclock-223413.webp',
  E05:'assets/evidence/smartwatch-last-activity-2241.webp'
};
const ROOM_ACTIONS={
 living:[['E04a','단체사진 다시 확인','처음 알아낸 시간 차이의 기준'],['E04b','김옥독의 긴 휴대폰 영상','정전 중 휴대전화의 실제 촬영 시각'],['E04d','다뮤_가 보낸 22:50 사진','복구 후에도 보이지 않는 사람']],
 management:[['E01','오후 정전 기록','7분 오차의 출발점'],['E02','녹화기 다시 보기','22:34 프레임과 끊긴 파일'],['E03','NVR 프레임 확대','영상 속 독립적인 벽시계']],
 kitchen:[['E04c','복구 직후 영상','22:46에 돌아온 조명'],['E06','주방 경과 타이머','00:36 기록이 의미하는 시각']],
 corridor:[['E08','서재 출입 기록 다시 보기','22:07~22:16 면담 흔적'],['E05','경찰에 전달한 현장 사진','워치 화면의 마지막 활동 기록']],
 terrace:[['E12','주차장의 차량 영상','붉은 불빛의 이동 경로']]
};
const PUZZLES=[
 {id:'P00',name:'처음 어긋난 7분',desc:'단체사진 시각과 NVR의 같은 장면을 비교하면 오후에는 얼마의 차이가 있었을까?',required:['E01','E02','E04a'],options:[['seven','오후 정전 뒤 7분 느려졌다'],['none','두 시계는 원래 일치한다'],['twentyseven','오후부터 27분 느려졌다']],correct:'seven',reason:'같은 사진의 시각 차이는 7분이고, 오후에 정전이 있었다. 하지만 그 뒤의 밤 영상까지 7분 차이라고 확정한 것은 아니다.',hints:['같은 순간을 찍은 두 기록의 표시를 비교해 봐.','단체사진 22:12와 NVR 표시 22:05를 확인해.','차이는 7분이지만 밤의 정전은 아직 계산하지 않았어.']},
 {id:'P04',name:'길었던 어둠',desc:'정전 전후의 휴대폰 촬영 시각과 NVR 파일 상태로 가장 타당한 설명을 고르자.',required:['E04b','E04c','E02'],options:[['recorded','NVR은 정전 중에도 계속 녹화했다'],['outage20','밤에는 약 20분 녹화가 멈췄고 장치 시계도 멈췄다'],['outage2','정전은 2분도 되지 않았다']],correct:'outage20',reason:'휴대폰은 꺼지지 않았지만 NVR은 정전 중 촬영하지 못했다. 복구 후 표시 숫자가 이어져 실제보다 시간이 더 늦어진 것으로 볼 수 있다.',hints:['휴대폰 영상 시각과 NVR의 파일 길이를 비교해 봐.','22:31에도 불이 꺼져 있었고, 22:46에는 켜져 있었어.','밤 정전이 약 20분 이어졌고, NVR에는 그 시간의 영상이 없어.']},
 {id:'P05',name:'사건이 일어난 시간대',desc:'강석훈이 마지막으로 살아 있었던 때와 이상 신호를 함께 놓아 보자. 어느 시간대를 가장 먼저 조사해야 할까?',required:['E07','E04b','E05'],options:[['before','22:16 이전'],['window','정전 중 22:40~22:42 전후'],['late','정전 복구 이후 23:00 이후']],correct:'window',reason:'22:16에는 생존 음성이 있다. 22:40~22:42 충돌음과 비슷한 시각의 워치 기록이 겹친다. 이는 유력한 사건 시간대이지 법의학적 사망 시각의 확정이 아니다.',hints:['직접 들은 마지막 생존 증언을 먼저 확인해 봐.','서재 면담 녹음, 거실 휴대폰 영상, 워치 기록을 연결해.','22:40~22:42 전후가 유력하지만 사망 시각을 단정하지는 마.']},
 {id:'P06',name:'두 번째 오차',desc:'NVR에 22:34:13으로 찍힌 윤해준의 거실 영상은 실제 언제 촬영된 것일까?',required:['E02','E03'],either:['E04d','E06'],prereq:['P00','P04','P05'],options:[['only7','7분을 더해 실제 22:41에 촬영된 것이다'],['extra','밤 정전의 시간까지 누적되어 실제 약 23:01에 촬영됐다'],['fake','CCTV 영상은 전부 조작된 것이다']],correct:'extra',reason:'오후 정전 7분에 밤 정전 약 19분 47초가 누적돼 오차는 약 26분 47초. 표시 22:34:13 + 26분47초 ≈ 실제 23:01이다. 윤해준의 해당 프레임은 사건 시간대의 알리바이가 될 수 없다. 범인이라는 뜻은 아니다.',hints:['첫 보정 시각 22:41은 정전 중이야. NVR 촬영이 가능했을까?','표시 22:34의 영상 속 벽시계는 다른 시각을 가리켜.','첫 7분 외에 밤 정전 약 20분을 더한 누적 오차를 적용해 봐.']}
];
const TIMELINE=[
 {id:'arrival',label:'강석훈의 생존 면담 종료',hint:'오세린 음성의 끝',correct:'22:16'},
 {id:'outage',label:'밤 정전 시작 (추정)',hint:'전원 차단 전후 목격',correct:'22:24'},
 {id:'noise',label:'치명적 사건 의심 시간대',hint:'충돌음과 활동기록',correct:'22:40~22:42'},
 {id:'power',label:'전원 복구 (추정)',hint:'경과 타이머에서 역산',correct:'22:44'},
 {id:'frame',label:'NVR 표시 22:34:13 영상의 실제 시각',hint:'두 번의 오차를 누적',correct:'23:01'}
];
const TIMES=['22:12','22:16','22:21','22:24','22:34','22:40~22:42','22:44','22:50','22:55','23:01'];
const CH2=loadJson(CH2_KEY),CH1=loadJson(CH1_KEY);
let state=loadJson(KEY),tab='records',modal=null,activeEvidence=new Set(),chosen={},notice='',hintLevels={},question='',toast='',toastTimer=null,sequence=0,afterDialogue=null;
function loadJson(key){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'?v:null;}catch{return null;}}
if(!state||state.version!==1||!Array.isArray(state.evidence)||!Array.isArray(state.solved)||!Array.isArray(state.confronted)||!['investigate','complete'].includes(state.stage))state=null;
function has(id){return !!state?.evidence.includes(id);}
function solved(id){return !!state?.solved.includes(id);}
function confronted(id){return !!state?.confronted.includes(id);}
function save(){if(!state)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{console.warn('진행 저장에 실패했습니다.');}}
function showToast(message){toast=message;render();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast='';render();},3500);}
function log(message){state.log=[...(state.log||[]),message].slice(-40);}
const GUEST_PORTRAITS={'박태성':'taesung','탁태성':'taesung','최도식':'dosik','오세린':'serin'};
function portrait(name,type='night'){if(GUEST_PORTRAITS[name])return `assets/characters/guests/${GUEST_PORTRAITS[name]}.webp`;return PERSON[name]?`assets/characters/${PERSON[name]}/${type}.webp`:null;}
const images=new Map();function warm(src){if(!src)return Promise.resolve();if(images.has(src))return images.get(src);const p=new Image();p.src=src;const ready=(p.decode?p.decode():new Promise((res,rej)=>{p.onload=res;p.onerror=rej;})).catch(()=>null);images.set(src,ready);return ready;}
async function prepareDialogue(){if(modal?.kind!=='dialogue')return;const token=++sequence;const row=modal.lines[modal.index];const src=portrait(row[0],row[2]||'night');modal.loading=Boolean(src);render();if(src)await warm(src);if(token!==sequence||modal?.kind!=='dialogue')return;modal.loading=false;render();}
function speak(lines,then=null){afterDialogue=then;modal={kind:'dialogue',lines,index:0,loading:false};for(const row of lines){const img=portrait(row[0],row[2]||'night');if(img)warm(img);}prepareDialogue();}
function nextDialogue(){if(modal?.kind!=='dialogue'||modal.loading)return;if(modal.index<modal.lines.length-1){modal.index++;prepareDialogue();return;}const cb=afterDialogue;afterDialogue=null;modal=null;render();if(cb)cb();}
function begin(){const name=CH2?.name||CH1?.name||'여행 친구';const imported=['E01','E02','E04a','E08'].filter(id=>CH2?.evidence?.includes(id));const baseSolved=CH2?.solved?.includes('P01');state={version:1,name,stage:'investigate',room:'living',evidence:imported,solved:baseSolved?['P00']:[],confronted:[],talked:[],timeline:{},timelineDone:false,notes:[],asked:[],log:['00:30 — 서로 다른 증언과 기록을 다시 비교하기 시작했다.'],startedAt:Date.now(),finishedAt:null};save();speak([
 ['내레이션','새벽 0시 30분. 신고를 마친 사람들이 거실에 흩어져 앉았다. 창밖으로는 여전히 비가 내리고 있었다.'],
 ['오세린','저는 객실에서 편집하고 있었어요. 서재에 들어간 적 없습니다.'],
 ['장도윤','저도 제 방에서 장비 정리를 했습니다. 차에는 가지 않았어요.'],
 ['꾸티뉴','서로 말이 달라. 이상하다는 느낌과 확인할 수 있는 사실을 분리하자.','night'],
 ['윤타미','관리실 녹화 기록도 다시 볼 수 있대. 원본은 건드리지 말고 표시 시각을 비교해 보자.','night'],
 ['내레이션','기록마다 시간은 달랐다. 같은 사건을 가리키는 시계가 하나가 아닐지도 모른다.']
 ]);}
function collect(id){if(!state||state.stage!=='investigate'||!E[id])return;if(id==='E03'&&!(solved('P04')&&solved('P05'))){showToast('아직 NVR 확대 영상이 개방되지 않았어. 정전 길이와 사건 시간대를 먼저 조사해 보자.');return;}
if(id==='E12'&&!confronted('DOYUN')){showToast('이 영상은 차량 소유자의 동의를 받은 뒤에 확인할 수 있어. 장도윤과 먼저 이야기해 보자.');return;}
if(!has(id)){state.evidence.push(id);log(`새 자료 · ${E[id].name}`);save();}
detail(E[id].name,E[id].text,E[id].where,id);}
function detail(title,body,tag='자료',evidenceId=''){modal={kind:'detail',title,body,tag,image:EVIDENCE_IMAGES[evidenceId]||null};render();}
function talk(name){if(!state||state.stage!=='investigate')return;if(!state.talked.includes(name)){state.talked.push(name);save();}
const scripts={
 '꾸티뉴':[['꾸티뉴',solved('P06')?'우리가 맞춘 건 알리바이 하나가 틀렸다는 거야. 범인을 지목하려면 이동 경로나 동기가 더 필요해.':'오후 정전만 생각하면 안 될 것 같아. 밤에 불이 꺼진 시간도 기록으로 확인해 보자.','night']],
 '김옥독':[['김옥독','정전 중에도 휴대전화 영상은 계속 찍혔어. 불빛이 없는 장면 뒤쪽에 둔탁한 소리도 들려.','night']],
 '모야':[['모야','전원이 돌아온 뒤 주방 타이머가 0부터 다시 올라갔어. 23:20에 00:36을 찍었거든.','night']],
 '다뮤_':[['다뮤_','22:50에 보낸 사진을 다시 볼래? 모두 나온 사진은 아니라는 건 기억해 줘.','night']],
 '윤타미':[['윤타미','NVR은 정전 동안 촬영하지 못했어. 표시된 시각과 실제 촬영 시각을 구별해야겠어.','night']],
 '난워니':[['난워니','22:12에 보낸 채팅 사진이 남아 있어. 채팅의 시각과 NVR의 같은 장면을 비교하면 시작점을 잡을 수 있겠지.','night']],
 '야뿌':[['야뿌','아까 바비큐 사진도 뭔가 쓸모가 있었잖아. 평범한 사진이라고 무시하면 안 되겠어.','night']],
 '하루노츠키':[['하루노츠키','오후 정전은 15:41부터 15:48까지였어. 영상 시각을 보면 확인할 수 있어.','night']],
 '만조':[['만조','서재 바깥에는 경사가 있어. 경찰이 확인할 때까지 흔적을 밟지 말자.','night']],
 '야무지':[['야무지','정전 중 바깥에서 붉은 빛을 봤어. 멀리서 본 거라 누군지는 말 못 해.','night']],
 '오세린':confronted('SERIN')?[['오세린','맞아요. 서재에서 강 대표님을 만났어요. 녹음을 한 것도 사실이에요. 다만 지금은 그 사적인 이유까지 밝히기 어려워요.']]:[['오세린','저는 객실에서 편집하고 있었어요. 서재에는 안 갔어요.']],
 '장도윤':confronted('DOYUN')?[['장도윤','사실 차에 있었습니다. 촬영 파일을 보내느라요. 블랙박스에서 움직이는 빛이 보이지만 누군지는 저도 모릅니다.']]:[['장도윤','객실에서 장비 정리 중이었습니다. 차에 간 적 없어요.']],
 '윤해준':[['윤해준','복구 후 곧바로 거실에 있었습니다. CCTV 영상에서도 그 시간에 제가 나옵니다.'],['윤해준','그때 정확한 시간이 얼마인지는… 장치에 그렇게 표시돼 있었으니까요.']],
 '최도식':[['최도식','NVR은 전원이 나가면 영상이 끊깁니다. 장비가 오래돼서 시간 유지 기능도 믿기 어려워요.']],
 '이유나':[['이유나','서류를 받았다는 점은 인정합니다. 하지만 그게 살인과 관계 있다는 뜻은 아니잖아요.']],
 '박태성':[['박태성','저는 그 시간에 쉬고 있었습니다. 누가 전기를 끈 것까지는 모릅니다.']]
};
if(name==='오세린'&&!has('ST-SERIN'))state.evidence.push('ST-SERIN');
if(name==='장도윤'&&!has('ST-DOYUN'))state.evidence.push('ST-DOYUN');
if(name==='윤해준'&&!has('ST-HAEJUN'))state.evidence.push('ST-HAEJUN');
save();speak(scripts[name]||[[name,'지금은 할 말이 없습니다.']]);}
function confront(person){if(person==='SERIN'&&!has('ST-SERIN')){showToast('오세린의 진술부터 들어 봐.');return;}if(person==='DOYUN'&&!has('ST-DOYUN')){showToast('장도윤의 진술부터 들어 봐.');return;}
const proof=person==='SERIN'?'E08':'E12'; // E12 is only provided after voluntary interview, not a forced confession.
if(person==='SERIN'){
 if(!activeEvidence.has('E08')||!has('E08')){notice='오세린의 서재 방문 여부를 검증하려면 서재 출입 기록(E08)을 먼저 확인하고 선택해 줘.';render();return;}
 if(!confronted('SERIN')){state.confronted.push('SERIN');state.evidence.push('E07');log('오세린이 서재 방문을 인정하고 녹음을 제공했다.');activeEvidence.clear();save();notice='오세린의 서재 방문 사실을 확인했어. 하지만 범행에 관련됐다는 결론은 아니야.';speak([['오세린','……서재에서 만난 건 맞아요. 제가 녹음한 게 있어요.'],['오세린','그분이 22시 30분에 또 약속이 있다고 했습니다. 다른 건 지금은 말씀드리기 어려워요.'],['내레이션','오세린이 경찰에도 전달할 수 있도록 녹음 파일의 사본을 제공했다. 원본은 보존했다.']],()=>{tab='records';render();});return;}
 }else{
 if(!confronted('DOYUN')){state.confronted.push('DOYUN');log('장도윤이 차에 있었던 사실을 인정하고 블랙박스 기록 확인을 허락했다.');save();speak([['장도윤','실은 차 안에서 작업했습니다. 계약 문제가 있어서 숨겼어요.'],['장도윤','차량 기록은 보여 드릴 수 있어요. 하지만 영상 속 사람은 저도 모르겠습니다.']],()=>{tab='records';render();});return;}
 }
 showToast('이미 확인한 진술이야.');}
function selectProof(id){if(activeEvidence.has(id))activeEvidence.delete(id);else activeEvidence.add(id);notice='';render();}
function guess(id,value){chosen[id]=value;notice='';render();}
function canSolve(p){return !p.prereq||p.prereq.every(solved);}
function attempt(id){const p=PUZZLES.find(x=>x.id===id);if(!p||solved(id))return;if(!canSolve(p)){notice='아직 다른 시간 퍼즐의 확인이 필요해. 선행 추리부터 검증하자.';render();return;}
const needs=p.required.filter(x=>!has(x));if(needs.length){notice='아직 확보하지 못한 자료가 있어: '+needs.map(id=>E[id].name).join(', ');render();return;}
const proofMissing=p.required.filter(id=>!activeEvidence.has(id));if(proofMissing.length){notice='자료를 발견하는 것만으로는 충분하지 않아. 필요한 증거를 실제로 선택해서 연결해 줘.';render();return;}
if(p.either&&!p.either.some(id=>has(id)&&activeEvidence.has(id))){notice='독립적인 비교 자료를 하나 더 선택해야 해. 거실 사진이나 주방 타이머를 확인해 봐.';render();return;}
if(chosen[id]!==p.correct){notice='선택한 결론은 연결한 기록과 충돌하거나 아직 증명되지 않아. 실제 시각과 표시 시각을 다시 비교하자.';render();return;}
state.solved.push(id);log(`추리 검증 완료 — ${p.name}`);activeEvidence.clear();chosen={};notice='';save();detail('검증 완료 · '+p.name,p.reason,'논리 검증');}
function setHint(id){hintLevels[id]=Math.min(3,(hintLevels[id]||0)+1);render();}
function timelineSet(id,value){state.timeline[id]=value;save();render();}
function checkTimeline(){if(!['P04','P05','P06'].every(solved)){notice='먼저 주요 시간 퍼즐 3개를 해결해서 시간 기록을 검증해 줘.';render();return;}
const incorrect=TIMELINE.filter(t=>state.timeline[t.id]!==t.correct);if(incorrect.length){notice=`시간표에 아직 충돌이 있어. ${incorrect.length}개의 항목을 다른 기록과 다시 비교해 봐.`;render();return;}
state.timelineDone=true;log('사건의 잠정 시간표를 직접 조립해 검증했다.');save();notice='시간표 일치! 실제 기록과 CCTV 표시 시각을 구분해 정리했어. 이것이 곧 범인 확정은 아니야.';render();}
function conclude(){if(!state||state.stage!=='investigate')return;if(!(solved('P04')&&solved('P05')&&solved('P06')&&state.timelineDone)){showToast('정전 길이, 사건 시간대, 두 번째 오차, 시간표까지 검증해야 해.');return;}
state.stage='complete';state.finishedAt=Date.now();log('01:20경 — 경찰에게 전달할 잠정 시간표와 검증 자료를 정리했다.');save();render();}
function ask(q){q=String(q||'').trim().slice(0,140);if(!q)return;if((state.asked||[]).length>=15){showToast('체험용 질문은 15회까지 사용할 수 있어.');return;}
const a=q.toLowerCase().replace(/\s+/g,'');let answer='알 수 없음',reason='질문의 대상이 확정된 사실 데이터에 없거나, 현재 기록으로 판단하기 어려워.';
if(/범인|진범|살인자|누가죽|공범|윤해준.*범행|살해/.test(a)){answer='현재 공개 불가';reason='범인 지목은 마지막 장의 시간·경로·동기 검증이 필요해.';}
else if(/7분|처음오차|오후정전.*시계/.test(a)){answer=solved('P00')?'YES':'현재 공개 불가';reason=solved('P00')?'오후 장치의 7분 차이는 검증됐어.':'먼저 오후의 같은 장면과 시계를 비교해 봐.';}
else if(/정전.*20분|20분.*정전|녹화.*끊|nvr.*꺼|전기.*20분/i.test(a)){answer=solved('P04')?'YES':'현재 공개 불가';reason=solved('P04')?'밤 정전은 약 20분이고 NVR 촬영 공백이 있어.':'밤의 휴대폰 영상과 녹화기 파일을 비교해야 해.';}
else if(/(22:41|22시41|22:40|22시40).*(사망|사건|충돌)|사건.*(22:41|22시41|22:40)/.test(a)){answer=solved('P05')?'YES':'현재 공개 불가';reason=solved('P05')?'22:40~22:42 전후가 유력하지만 사망시각을 확정한 건 아니야.':'독립적인 시간 기록이 더 필요해.';}
else if(/27분|두번째오차|두번.*정전|실제.*23:01/.test(a)){answer=solved('P06')?'YES':'현재 공개 불가';reason=solved('P06')?'누적 오차는 약 26분47초이며, 22:34 프레임은 실제 약 23:01 촬영됐어.':'시간 퍼즐을 풀어야 공개할 수 있어.';}
else if(/오세린.*서재|서재.*오세린/.test(a)){answer=confronted('SERIN')?'YES':'현재 공개 불가';reason=confronted('SERIN')?'출입기록과 증언 대조로 방문을 인정했어.':'진술에 증거를 제시해 확인해 봐.';}
else if(/안녕|hello|hi/.test(a)){answer='관련 없음';reason='사건 사실에 관한 질문을 작성해 봐.';}
state.asked=[...(state.asked||[]),{q,answer,reason}];question='';save();render();}
function displayEvidence(id){return E[id]?.name||id;}
function top(){return `<header class="top"><a class="brand" href="index.html"><span class="brand-icon">✦</span><span>꾸한성 · 안개 속 별장</span></a><div class="top-right"><span class="tag">CHAPTER 03</span><span class="muted small">엇갈리는 증언 · 로컬 자동 저장</span></div></header>`;}
function welcome(){return `${top()}<main class="welcome"><div class="welcome-card"><div class="welcome-art" role="img" aria-label="안개 낀 별장 전경"></div><section class="welcome-copy"><div class="eyebrow">CHAPTER 03 / THE SECOND CLOCK</div><h1>엇갈리는<br>증언</h1><p>사람들의 이야기는 맞지 않는다. 어제의 정전, 멈춘 영상, 서로 다른 시각을 다시 겹쳐 보자. 거짓말의 이유와 사건의 진실은 같은 것이 아닐 수도 있다.</p><div class="chip-row"><span class="chip">P04 · 긴 정전</span><span class="chip">P05 · 사건 시각</span><span class="chip">P06 · 두 번째 오차</span></div><div class="buttons"><button class="btn btn-primary" data-action="begin">${CH2?.stage==='complete'?'챕터 3 시작하기':'챕터 3 체험하기'}</button><a href="chapter2.html" class="btn">챕터 2 돌아가기</a></div><p class="small muted">${CH2?.stage==='complete'?`챕터 2의 여행 친구 ${esc(CH2.name||'')} 기록을 이어받아 시작해.`:'챕터 2를 완료하지 않아도 체험할 수 있어. 연결된 저장 기록이 없다면 필요한 단서를 직접 다시 조사할 수 있어.'}</p></section></div></main>`;}
function room(){return ROOMS.find(x=>x.id===state.room)||ROOMS[0];}
function game(){const r=room(),done=PUZZLES.filter(p=>p.id!=='P00'&&solved(p.id)).length;return `${top()}<div class="story-shell"><aside class="rail card"><div class="rail-title">장소 이동</div><nav class="room-nav" aria-label="챕터 3 장소">${ROOMS.map((it,i)=>`<button class="room ${r.id===it.id?'active':''}" data-action="room" data-id="${it.id}" aria-current="${r.id===it.id?'page':'false'}"><small>${String(i+1).padStart(2,'0')}</small>${esc(it.name)}</button>`).join('')}</nav><div class="line"></div><div class="rail-title">조사 도구</div><div class="rail-bottom"><button class="btn btn-small" data-action="tab" data-id="people">인물 심문</button><button class="btn btn-small" data-action="tab" data-id="board">증거 연결</button><button class="btn btn-small" data-action="tab" data-id="timeline">시간표 조립</button><a class="btn btn-small btn-subtle" href="chapter2.html">챕터 2</a></div></aside><main class="main"><div class="context card"><div><div class="eyebrow">THE SECOND CLOCK · 00:30</div><h2>${esc(r.name)}</h2><p class="context-text">${esc(r.sub)}</p></div><span class="tag">CH.03</span></div><section class="scene" aria-label="${esc(r.name)} 배경"><img src="assets/backgrounds/${esc(r.bg)}" alt="${esc(r.name)}"><div class="scene-badge"><strong>${esc(r.name)}</strong><span>꾸한성 · CHAPTER 03</span></div><p class="scene-copy">${esc(r.sub)}. 누군가의 말보다 자료의 실제 시각이 먼저 필요하다.</p></section><div class="info-grid"><div class="info-cell"><small>확인한 기록</small><strong>${state.evidence.length}</strong></div><div class="info-cell"><small>시간 추리 검증</small><strong>${done}<span class="small muted"> / 3</span></strong></div></div><section class="actions card"><h3 class="section-title">이 장소에서 조사할 것</h3><div class="action-grid">${(ROOM_ACTIONS[r.id]||[]).map(([id,label,desc])=>`<button class="action-tile ${has(id)?'done':''}" data-action="collect" data-id="${id}"><strong>${has(id)?'✓ ':''}${esc(label)}</strong><span>${esc(desc)}</span></button>`).join('')}</div></section><section class="checkpoint card"><h3>무엇을 확인했을까?</h3><p>증거를 모두 클릭하지 않아도 돼. 기록을 직접 골라 연결하고, 두 개의 시계가 어긋난 이유를 설명해 보자.</p><div class="chip-row">${PUZZLES.filter(p=>p.id!=='P00').map(p=>`<span class="chip ${solved(p.id)?'good':''}">${p.id} · ${solved(p.id)?'검증됨':'미검증'}</span>`).join('')}</div><div class="cta"><button class="btn btn-primary" data-action="tab" data-id="board">추리 보드 열기</button><button class="btn" data-action="tab" data-id="timeline">시간표 확인</button><button class="btn btn-subtle" data-action="conclude" ${done===3&&state.timelineDone?'':'disabled'}>기록 정리하기</button></div></section></main><aside class="side"><section class="card"><div class="eyebrow">CASE NOTES / CH.03</div><h3>${tab==='records'?'수집한 자료':tab==='people'?'증언과 심문':tab==='board'?'증거 연결 보드':tab==='timeline'?'사건 시간표':'질문 노트'}</h3><p class="description">${tab==='records'?'수집한 사실과 주장 사이의 차이를 확인한다.':tab==='people'?'누가 무엇을 숨기는지 증거로 확인한다.':tab==='board'?'증거를 직접 골라 연결해야 검증할 수 있다.':tab==='timeline'?'실제 시각과 영상에 표시된 시각은 다를 수 있다.':'무료 오프라인 규칙 데모. 실제 AI API 사용 안 함.'}</p><div class="segment">${[['records','기록'],['people','심문'],['board','추리'],['timeline','시간'],['ask','질문']].map(([t,label])=>`<button class="${tab===t?'active':''}" data-action="tab" data-id="${t}">${label}</button>`).join('')}</div>${tabContent()}</section></aside></div>`;}
function tabContent(){
if(tab==='records')return state.evidence.length?state.evidence.map(id=>`<div class="record"><div class="record-title"><span>${esc(displayEvidence(id))}</span><button class="btn btn-small btn-subtle" data-action="read" data-id="${id}">보기</button></div><p>${esc(E[id]?.where||'')}</p></div>`).join(''):'<p class="empty">거실·관리실·주방을 살펴봐. 이전 챕터의 자료도 다시 찾을 수 있어.</p>';
if(tab==='people')return `<div class="witness-list">${['오세린','장도윤','윤해준','꾸티뉴','윤타미','김옥독','모야','다뮤_','최도식','만조','하루노츠키','난워니','야뿌','야무지','이유나','박태성'].map(name=>`<button class="witness" data-action="talk" data-id="${name}">${portrait(name)?`<img src="${portrait(name)}" alt="" loading="lazy">`:'<span aria-hidden="true">◈</span>'}<span><strong>${esc(name)}</strong><span class="role">${state.talked.includes(name)?'대화 확인됨 · ':''}${name==='오세린'?'면담 부인':name==='장도윤'?'객실 주장':name==='윤해준'?'거실 알리바이':'여행 동행 / 현장 관계자'}</span></span></button>`).join('')}</div><div class="line"></div><h4 class="section-title">진술의 모순 직접 지적</h4><div class="transcript"><div class="statement"><strong>오세린</strong><p>“서재에 들어간 적 없어요.”</p><button class="btn btn-small ${confronted('SERIN')?'btn-subtle':'btn-primary'}" data-action="confront" data-id="SERIN" ${confronted('SERIN')?'disabled':''}>${confronted('SERIN')?'방문 인정 · 녹음 제공됨':'선택한 증거로 반박'}</button></div><div class="statement"><strong>장도윤</strong><p>“차에는 간 적 없습니다.”</p><button class="btn btn-small ${confronted('DOYUN')?'btn-subtle':'btn-primary'}" data-action="confront" data-id="DOYUN" ${confronted('DOYUN')?'disabled':''}>${confronted('DOYUN')?'차량 기록 공유됨':'추가 질문으로 확인'}</button></div></div><p class="small muted" style="margin-top:10px">오세린은 먼저 복도의 서재 기록을 획득하고, ‘추리’ 탭에서 해당 증거를 선택해야 반박할 수 있어.</p>${notice?`<div class="puzzle-note" role="status" style="margin-top:10px">${esc(notice)}</div>`:''}`;
if(tab==='board')return `<p class="small muted">확보한 자료를 선택하고, 해당 퍼즐에 대한 가설을 제출해 봐. 증거를 고르지 않고 정답만 찍으면 통과하지 않아.</p><div class="proof-group">${state.evidence.map(id=>`<button class="proof ${activeEvidence.has(id)?'selected':''}" data-action="proof" data-id="${id}" aria-pressed="${activeEvidence.has(id)}">${activeEvidence.has(id)?'✓ ':''}${esc(displayEvidence(id))}</button>`).join('')||'<p class="empty">아직 자료가 없어. 장소를 조사해 줘.</p>'}</div>${PUZZLES.map(p=>{const locked=!canSolve(p),complete=solved(p.id);return `<section class="board-card ${locked?'locked':''}" id="card-${p.id}"><span class="tag ${complete?'good':locked?'lock':''}">${p.id}${complete?' · 완료':locked?' · 선행 추리 필요':''}</span><h4>${esc(p.name)}</h4><p>${esc(p.desc)}</p>${p.id==='P06'&&!complete?`<div class="chip-row"><span class="chip">P00 · ${solved('P00')?'완료':'필요'}</span><span class="chip">P04 · ${solved('P04')?'완료':'필요'}</span><span class="chip">P05 · ${solved('P05')?'완료':'필요'}</span></div>`:''}<div class="board-options">${p.options.map(([val,text])=>`<label class="board-option"><input type="radio" name="answer-${p.id}" data-answer="${p.id}" value="${val}" ${chosen[p.id]===val?'checked':''} ${locked||complete?'disabled':''}><span>${esc(text)}</span></label>`).join('')}</div><div class="hint-control"><p>${hintLevels[p.id]?esc(p.hints[hintLevels[p.id]-1]):'모르겠다면 단계별 힌트 3개를 사용할 수 있어.'}</p><button class="btn btn-small btn-subtle" data-action="hint" data-id="${p.id}" ${hintLevels[p.id]>=3||complete?'disabled':''}>힌트 ${hintLevels[p.id]||0}/3</button></div><button class="btn ${complete?'btn-subtle':'btn-primary'}" data-action="solve" data-id="${p.id}" ${locked||complete?'disabled':''}>${complete?'검증 완료':'선택한 증거로 검증'}</button></section>`;}).join('')}${notice?`<div class="puzzle-note" role="status">${esc(notice)}</div>`:''}`;
if(tab==='timeline')return `<p class="small muted">사건 발생의 순서를 직접 채워 봐. 정답을 보려면 먼저 세 시간 퍼즐을 해결해야 해. 항목은 실제 시각(추정)을 뜻하며, NVR에 찍힌 표시 숫자와 달라.</p><div class="timeline-list" style="margin-top:13px">${TIMELINE.map((e,i)=>`<div class="time-slot"><label for="time-${e.id}">${i+1}. ${esc(e.label)}<small>${esc(e.hint)}</small></label><select id="time-${e.id}" data-time="${e.id}" ${state.timelineDone?'disabled':''}><option value="">시각 선택</option>${TIMES.map(t=>`<option value="${t}" ${state.timeline[e.id]===t?'selected':''}>${t}</option>`).join('')}</select></div>`).join('')}</div><div style="margin-top:12px" class="chip-row"><span class="chip ${state.timelineDone?'good':''}">${state.timelineDone?'시간표 검증 완료':'시간표 미검증'}</span><span class="chip">표시 22:34:13 ≠ 실제 22:34</span></div><button style="width:100%;margin-top:12px" class="btn ${state.timelineDone?'btn-subtle':'btn-primary'}" data-action="timeline-check" ${state.timelineDone?'disabled':''}>시간표 검증하기</button>${notice?`<div class="puzzle-note" style="margin-top:10px" role="status">${esc(notice)}</div>`:''}`;
return `<p class="small muted">질문을 자유롭게 적어 봐. 의미를 일부 규칙으로만 인식하는 오프라인 데모이며, AI가 실제로 답하는 기능은 아니야. 사건의 진실은 증거로 입증해야 해.</p><form id="q-form" class="qa-row"><input id="question-input" value="${esc(question)}" maxlength="140" autocomplete="off" placeholder="예: CCTV 시각이 27분 느렸나요?" aria-label="질문 작성"><button class="btn btn-primary" type="submit" ${(state.asked||[]).length>=15?'disabled':''}>질문하기</button></form><p class="small muted" style="margin-top:9px">${(state.asked||[]).length} / 15 질문</p><div class="history">${[...(state.asked||[])].reverse().map(row=>`<div class="qa-answer"><p>${esc(row.q)}</p><strong>${esc(row.answer)}</strong><p>${esc(row.reason)}</p></div>`).join('')}</div>`;
}
function finish(){return `${top()}<main class="finish-screen"><div class="finish-card"><div class="finish-art" role="img" aria-label="밤의 테라스"></div><div class="finish-copy"><span class="tag good">CHAPTER 03 COMPLETE</span><h1>두 번째 시계가<br>멈춘 자리</h1><p>서로 다른 영상과 진술을 연결해 정전의 길이와 사건 시간대를 좁혔다. 7분만 보정한 알리바이는 성립하지 않았다. 그렇다고 그 사람을 범인으로 확정할 수는 없다.</p><div class="chip-row"><span class="chip good">P04 검증</span><span class="chip good">P05 검증</span><span class="chip good">P06 검증</span><span class="chip good">시간표 완성</span></div><p>다음 챕터에서는 외부 통로의 흔적과 서로 다른 거짓말의 이유를 확인하게 돼.</p><div class="buttons"><a class="btn btn-primary" href="chapter4.html">CHAPTER 04 · 플레이</a><button class="btn" data-action="revisit">다시 조사하기</button><a class="btn btn-subtle" href="index.html">메인으로</a></div></div></div></main>`;}
function renderModal(){if(!modal)return '';if(modal.kind==='dialogue'){const row=modal.lines[modal.index],narr=row[0]==='내레이션',src=portrait(row[0],row[2]||'night');return `<div class="modal-cover"><div class="modal ${narr?'narration':''}" role="dialog" aria-modal="true" aria-label="대화">${modal.loading?`<div class="dialogue-text"><p>장면을 준비 중이야…</p></div>`:`${narr?'':`<div class="dialogue-view">${src?`<img src="${esc(src)}" alt="">`:''}</div>`}<div class="dialogue-text">${narr?'':`<div class="speaker">${esc(row[0])}</div>`}<p>${esc(row[1])}</p></div><div class="dialogue-next"><span class="small muted">${modal.index+1} / ${modal.lines.length}</span><button class="btn btn-primary" data-action="next">${modal.index===modal.lines.length-1?'확인':'다음 ›'}</button></div>`}</div></div>`;}
return `<div class="modal-cover"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(modal.title)}"><div class="modal-head"><h3>${esc(modal.title)}</h3><button class="btn btn-small btn-subtle" data-action="close" aria-label="닫기">✕</button></div><div class="modal-body"><span class="tag">${esc(modal.tag)}</span><div class="line"></div>${modal.image?`<img class="ch3-evidence-image" src="${esc(modal.image)}" alt="${esc(modal.title)} 증거 이미지" loading="eager" onerror="this.remove()">`:``}<p>${esc(modal.body)}</p><div class="modal-buttons"><button class="btn btn-primary" data-action="close">확인</button></div></div></div></div>`;}
function render(){app.innerHTML=`<div class="ch3">${!state?welcome():state.stage==='complete'?finish():game()}${renderModal()}${toast?`<div class="toast" role="status">${esc(toast)}</div>`:''}</div>`;}
app.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;const action=el.dataset.action,id=el.dataset.id||'';switch(action){
 case 'begin':begin();break;case 'room':if(ROOMS.some(r=>r.id===id)){state.room=id;notice='';save();render();}break;
 case 'collect':collect(id);break;case 'read':if(has(id)&&E[id])detail(E[id].name,E[id].text,E[id].where);break;
 case 'talk':talk(id);break;case 'confront':confront(id);break;case 'proof':selectProof(id);break;
 case 'tab':if(['records','people','board','timeline','ask'].includes(id)){tab=id;notice='';render();}break;
 case 'solve':attempt(id);break;case 'hint':setHint(id);break;case 'timeline-check':checkTimeline();break;
 case 'conclude':conclude();break;case 'next':nextDialogue();break;case 'close':modal=null;render();break;
 case 'revisit':state.stage='investigate';save();render();break;default:break;}
});
app.addEventListener('change',e=>{const item=e.target;if(item.dataset.answer)guess(item.dataset.answer,item.value);if(item.dataset.time)timelineSet(item.dataset.time,item.value);});
app.addEventListener('input',e=>{if(e.target.id==='question-input')question=e.target.value;});
app.addEventListener('submit',e=>{if(e.target.id==='q-form'){e.preventDefault();ask(question);}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&modal?.kind==='dialogue'){e.preventDefault();nextDialogue();}if(e.key==='Escape'&&modal?.kind==='detail'){modal=null;render();}});
render();
})();
