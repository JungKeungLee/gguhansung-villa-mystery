/* 꾸한성: 안개 속 별장 — CHAPTER 04 (fictional fan work).
 * No murderer identity, full crime method or private author-only facts are embedded.
 * Free-form question notes are offline, deterministic examples, NOT AI API calls.
 */
(() => {
'use strict';
const KEY='gguhansung-fog-villa-ch4-v1';
const CH3_KEY='gguhansung-fog-villa-ch3-v1';
const CH2_KEY='gguhansung-fog-villa-ch2-v1';
const CH1_KEY='gguhansung-fog-villa-save-v2';
const app=document.getElementById('ch4-app');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PERSON={'꾸티뉴':'kkutinyu','난워니':'nanwoni','김옥독':'kimokdok','야뿌':'yappu','하루노츠키':'harunotsuki','만조':'manjo','모야':'moya','윤타미':'yuntami','야무지':'yamuji','다뮤_':'damyu'};
const MEMBERS=Object.keys(PERSON);
const OUTSIDERS=['박태성','최도식','오세린','윤해준','이유나','장도윤'];
const ROOMS=[
{id:'living',name:'거실',bg:'living.webp',sub:'거짓말마다 다른 이유가 있었다'},
{id:'corridor',name:'서재 앞 복도',bg:'corridor.webp',sub:'경찰에게 전달할 현장 사진을 확인한다'},
{id:'terrace',name:'테라스·외부 통로',bg:'terrace.webp',sub:'붉은 불빛이 지나간 길'},
{id:'parking',name:'주차장',bg:'villa-exterior.webp',sub:'차량 기록과 장도윤의 증언'},
{id:'management',name:'관리실',bg:'management.webp',sub:'장비별로 다른 시간 유지 방식'},
{id:'basement',name:'지하 보일러실',bg:'boiler-room.webp',sub:'외부문과 이어지는 젖은 흔적'},
{id:'storage',name:'창고·자료 보관실',bg:'storage-room.webp',sub:'별장 매매와 과거 공사 자료'}
];
const E={
'E04b':{name:'22:31 정전 중 휴대폰 영상',where:'챕터 3',text:'김옥독의 휴대폰은 정전 중에도 실제 시간을 기록했다. CCTV와 달리 전원 영향을 받지 않는다.'},
'E06':{name:'주방 경과 타이머 기록',where:'관리실',text:'23:20에 00:36을 표시한 타이머는 복구 시각이 약 22:44임을 뒷받침한다.'},
'E07':{name:'오세린의 면담 녹음',where:'거실',text:'22:07~22:16 서재에서 강석훈과 면담한 녹음. 숨겼던 방문 사실은 인정했지만 범죄를 증명하진 않는다.'},
'E08':{name:'서재 출입 기록·메모',where:'서재 앞 복도',text:'22:01 입실, 22:07~22:16 면담, 23:34 비상키 개방. 메모 흔적에는 22:30 테라스 쪽 약속이 언급된다.'},
'E09':{name:'바비큐 사진 속 봉투',where:'거실',text:'20:41 사진에는 강석훈이 이유나에게 서류 봉투를 건네는 모습이 찍혔다.'},
'E10':{name:'사고 보고서 사본',where:'거실 · 이유나',text:'기자가 확인을 허락한 사고 보고서의 사본. 일부 등록번호와 책임자 항목이 남아 있으며, 원문 전체는 공개되지 않았다.'},
'E11':{name:'테라스 문 안쪽 발자국 사진',where:'서재 앞 복도 · 현장 보존 사진',text:'젖은 붉은 황토와 안전화 밑창 자국. 뒤꿈치에 V자 모양의 특이한 마모가 보인다. 신발 크기만으로는 소유자를 알 수 없다.'},
'E12':{name:'차량 블랙박스 영상',where:'주차장 · 장도윤',text:'독립 배터리 시각 22:27 전후와 22:42 전후에 외부 통로의 작은 붉은 불빛이 보인다. 차 안에서는 장도윤이 계속 작업한다. 촬영된 인물의 얼굴은 구분할 수 없다.'},
'E13':{name:'분전반 독립 기록',where:'관리실 · 관리인 동행',text:'배터리로 시각을 유지한 분전반 로거가 실제 22:24:18 수동 OFF, 22:44:05 수동 ON을 기록했다. NVR의 시계와는 독립적으로 작동한다.'},
'E14':{name:'은닉 장비의 현장 사진',where:'지하 보일러실 · 경찰 전달용',text:'보일러실 선반 뒤 안전화·젖은 우비·적색 모드 헤드랜턴. 보존 사진 속 안전화 뒤꿈치에는 V자 마모가 있다. 소유자는 아직 증명되지 않았다.'},
'E15':{name:'벽난로 서류 잔해 사진',where:'서재 앞 복도 · 현장 사진',text:'경찰에 전달하기 전 복도에서 촬영한 현장 사진 속, 불탄 서류의 가장자리에 보고서 등록번호 일부가 보인다. 물건은 만지지 않았다.'},
'C01':{name:'윤해준이 건넨 명함',where:'거실 · 다뮤_',text:'당일 낮 받은 명함. 전문 기술자 등록번호가 적혀 있다. 이 번호는 소유 관계가 아닌 과거 문서의 인적 연결 단서다.'},
'C02':{name:'헤드랜턴 시연 사진',where:'거실 · 다뮤_',text:'오후에 윤해준이 헤드랜턴의 적색 모드를 보여 준 사진. 같은 기능의 제품이 여러 개 있을 수 있다는 점에 유의해야 한다.'},
'C03':{name:'야무지의 붉은 불빛 목격',where:'테라스',text:'정전 중 22:27 전후 창밖에서 붉은 점이 움직이는 것을 봤다. 멀어서 누군지는 알아보지 못했다.'},
'C04':{name:'8년 전 사고 기사',where:'창고',text:'별장 증축 중 옹벽 붕괴로 작업자가 사망한 사실을 다룬 과거 기사. 공식 발표에는 폭우가 원인으로 기록됐다.'},
'C05':{name:'잠기지 않은 분전반 커버',where:'지하 보일러실',text:'오후 점검 이후 잠금이 완전하지 않았던 커버. 여러 사람이 접근할 가능성이 있으므로 특정인의 범행 증거는 아니다.'},
'C06':{name:'박태성이 숨긴 균열 점검서',where:'창고',text:'별장 매매 전에 확인한 옹벽 균열 점검서. 박태성이 문서를 숨긴 이유는 매매 파기 우려일 수 있다.'},
'C07':{name:'관리실 휴게 자리와 술병',where:'관리실',text:'관리인이 졸았을 수 있다는 흔적. 개인의 직무 태만 의심 자료이며, 전기를 내린 사람을 뜻하지 않는다.'},
'C08':{name:'외부문까지 이어지는 황토 흔적',where:'지하 보일러실',text:'테라스 주변과 같은 황토가 지하 외부문 앞에도 남아 있다. 현장은 만지지 않고 사진으로만 기록한다.'},
'C09':{name:'안전화 특이 마모 비교 사진',where:'지하 보일러실',text:'서재 사진 속 V자 뒤꿈치 마모와 보일러실 은닉 신발의 밑창 자국이 같은 위치·형태를 보인다. 신발 주인은 별도 확인이 필요하다.'},
'C10':{name:'과거 공사 일지의 등록번호',where:'창고',text:'오래된 공사 일지에는 당시 검사 담당자의 기술자 등록번호가 기록됐다. 기사와 함께 문서의 출처를 확인할 수 있다.'}
};
const EVIDENCE_IMAGES = {
  E10:'assets/evidence/e10-accident-report.webp',
  C01:'assets/evidence/c01-yoon-haejun-business-card.webp',
  C04:'assets/evidence/c04-accident-news.webp',
  C09:'assets/evidence/c09-boot-heel-comparison.webp',
  C10:'assets/evidence/c10-construction-log.webp',
  E04b:'assets/evidence/phone-video-blackout-2231.webp',
  E06:'assets/evidence/kitchen-timer-0036.webp',
  E07:'assets/evidence/e07-ohserin-interview-recording.webp',
  E08:'assets/evidence/e08-study-access-log.webp',
  E11:'assets/evidence/e11-terrace-footprints.webp',
  E12:'assets/evidence/e12-vehicle-dashcam-2227.webp',
  E13:'assets/evidence/e13-breaker-log.webp',
  E14:'assets/evidence/e14-hidden-equipment.webp',
  E15:'assets/evidence/e15-burned-document.webp',
  C02:'assets/evidence/c02-headlamp-demo.webp'
};
const ACTIONS={
living:[['E09','야뿌의 바비큐 사진','봉투의 수령자를 재확인'],['E10','이유나의 사고보고서 사본','기자에게 사진을 근거로 열람 요청'],['C01','다뮤_의 명함','당일 받은 기술자 명함'],['C02','헤드랜턴 시연 사진','적색 모드가 찍혀 있다'],['E07','오세린의 제공 녹음','면담이 실제로 있었다는 자료']],
corridor:[['E08','서재 출입기록과 메모','테라스 약속 단서'],['E11','서재 현장 사진','문 안쪽의 젖은 발자국'],['E15','벽난로 현장 사진','타다 남은 문서의 번호']],
terrace:[['C03','야무지의 목격담','멀리서 본 작은 붉은 불빛'],['C08','외부문 방향 살펴보기','테라스 아래로 이어진 황토 흔적']],
parking:[['E12','장도윤의 차량 기록','외부 통로에 움직인 빛']],
management:[['C07','관리실 휴게 자리','술병과 잠든 흔적'],['E06','정전 경과 기록','복구 시간을 비교'],['E13','관리인과 분전반 로그 열람','기록 시각은 배터리로 유지됨']],
basement:[['C05','분전반 커버 사진','오후부터 잠겨 있지 않다'],['C08','지하 외부문 바닥','황토 자국을 사진으로 기록'],['E14','선반 뒤 은닉 장비 발견','경찰 전달용 사진을 확보'],['C09','특이 마모 흔적 비교','서재 신발 자국과 대조']],
storage:[['C04','8년 전 사고 기사','과거 공사에 대한 보도'],['C06','균열 점검서 사본','매매에 영향을 줄 내용'],['C10','공사 일지의 등록번호','담당 기술자 번호 확인']]
};
const PUZZLES=[
{id:'P08',name:'붉은 불빛이 지나간 길',description:'목격담과 차량 영상을 연결하면 무엇까지 말할 수 있을까?',required:['C03','C02','E12'],options:[['route','적색 모드의 조명을 지닌 인물이 외부 통로를 이동했을 가능성이 높다'],['doyun','차량 영상이 있으니 운전자가 직접 이동했다'],['face','사진만으로 윤해준의 얼굴이 확인된다']],correct:'route',reason:'실루엣과 적색 조명으로 경로를 추정할 수 있다. 차량 실내 영상이 장도윤의 행적을 뒷받침하지만 누구의 얼굴인지 알 수 없어 단정할 수 없다.',hints:['붉은 빛을 본 위치와 차량 촬영 방향을 생각해 봐.','블랙박스의 차 안 인물과 바깥 불빛은 같은 사람이었을까?','확정되는 것은 이동 경로의 가능성이며, 얼굴이나 신원은 아니다.']},
{id:'P09',name:'손으로 끈 전기',description:'오래된 CCTV와 별개의 배터리 기록이 알려 주는 정전 원인은?',required:['C05','E13'],options:[['manual','메인 차단기가 수동으로 내려갔다가 다시 올려졌다'],['storm','천둥 때문에 자동 차단됐다'],['camera','CCTV가 이 시간을 임의로 만들었다']],correct:'manual',reason:'독립 로거에 수동 OFF/ON이 기록됐다. 누가 차단했는지는 이 자료만으로 알 수 없다.',hints:['CCTV가 아니라 어떤 장치의 시계를 확인했지?','22:24:18과 22:44:05의 이벤트 종류를 봐.','로그에는 천둥 트립이 아니라 수동 OFF와 ON이 기록됐다.']},
{id:'P07',name:'발자국의 주인',description:'서재 발자국과 은닉된 안전화를 어떻게 비교해야 할까?',required:['E11','E14','C09'],prereqAny:['P08','P09'],options:[['specific','특이한 V자 마모가 같은 신발로 이어질 가능성을 지지한다'],['size','280mm면 바로 한 사람의 신발로 확정된다'],['everyone','젖은 발자국만으로 그날 모든 출입자를 특정한다']],correct:'specific',reason:'같은 위치의 독특한 마모는 특정 신발 연결의 근거다. 하지만 발견 장소와 신발 소유자를 별도 입증하지 않으면 범인까지 특정할 수 없다.',hints:['신발 크기만으로 구분할 수 있을까?','안전화 뒤꿈치의 흔적이 어디에 찍혔는지 비교해.','밑창의 V자 마모와 자국의 V자 마모 위치를 비교해.']},
{id:'P10',name:'지워진 서명',description:'사본과 불탄 문서, 옛 공사일지와 명함을 비교하면 알 수 있는 것은?',required:['E10','C01','E15','C04','C10'],options:[['signer','같은 등록번호가 8년 전 점검 문서의 실무 서명자와 오늘의 기술자를 연결한다'],['daughter','유족이라는 사실만으로 오세린이 서류를 썼다'],['forgery','누군가 서명을 위조했다는 사실이 확정된다']],correct:'signer',reason:'등록번호 일치로 과거 서류의 서명자를 특정할 근거가 생겼다. 서명 위조 여부와 현재의 범행 여부까지 증명한 것은 아니다.',hints:['이름보다 변하지 않는 식별번호를 찾아 봐.','명함, 공사 일지, 사본의 숫자를 나란히 놓아 봐.','번호가 일치해도 문서 작성 경위나 범죄 행위까지 증명하는 것은 아니야.']}
];
const MOTIVES=[
{name:'이유나',quote:'“강석훈 씨와 따로 얘기하지 않았습니다.”',required:['E09','E10'],correct:'source',label:'취재원 보호',reason:'취재원과 자료의 출처를 숨기려 했다.'},
{name:'최도식',quote:'“정전 내내 관리실 모니터를 지켰습니다.”',required:['C07'],correct:'duty',label:'직무 태만',reason:'잠들었던 사실을 인정하면 해고될까 두려웠다.'},
{name:'장도윤',quote:'“객실에서 장비를 정리했습니다.”',required:['E12'],correct:'contract',label:'계약 위반',reason:'차에서 촬영본을 외부로 보낸 사실을 숨겼다.'},
{name:'박태성',quote:'“22시 이후 주인실에서 쉬었습니다.”',required:['C06'],correct:'sale',label:'매매 문제',reason:'별장 상태와 점검 서류가 매매에 악영향을 줄 것을 우려했다.'},
{name:'오세린',quote:'“객실에서 편집하고 있었습니다.”',required:['E07','C04'],correct:'identity',label:'신분·방문 은닉',reason:'과거 사고 유족인 자신의 신분과 서재 면담 사실이 의심으로 이어질까 두려웠다.'}
];
const MOTIVE_OPTIONS=[['','이유 선택'],['sale','매매 문제'],['source','취재원 보호'],['duty','직무 태만'],['contract','계약 위반'],['identity','신분·방문 은닉']];
const CH3=load(CH3_KEY),CH2=load(CH2_KEY),CH1=load(CH1_KEY);
let state=load(KEY),tab='records',modal=null,picks=new Set(),answers={},motiveChoices={},note='',question='',toast='',sequence=0,afterDialogue=null,loadedImages=new Map(),hintLevels={};
if(!valid(state))state=null;
function load(key){try{const data=JSON.parse(localStorage.getItem(key)||'null');return data&&typeof data==='object'?data:null;}catch{return null;}}
function valid(s){return s&&s.version===1&&['investigate','complete'].includes(s.stage)&&Array.isArray(s.evidence)&&Array.isArray(s.solved)&&Array.isArray(s.talked)&&s.classified&&typeof s.classified==='object'&&ROOMS.some(r=>r.id===s.room);}
function save(){if(!state)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{console.warn('로컬 저장 실패');}}
function has(id){return !!state?.evidence.includes(id);}
function solved(id){return !!state?.solved.includes(id);}
function getRoom(){return ROOMS.find(r=>r.id===state.room)||ROOMS[0];}
const GUEST_PORTRAITS={'박태성':'taesung','탁태성':'taesung','최도식':'dosik','오세린':'serin'};
function portrait(name){if(GUEST_PORTRAITS[name])return `assets/characters/guests/${GUEST_PORTRAITS[name]}.webp`;return PERSON[name]?`assets/characters/${PERSON[name]}/night.webp`:null;}
function warm(src){if(!src)return Promise.resolve();if(loadedImages.has(src))return loadedImages.get(src);const img=new Image();img.src=src;const promise=img.decode?img.decode().catch(()=>null):new Promise(r=>{img.onload=img.onerror=r;});loadedImages.set(src,promise);return promise;}
function say(lines,callback=null){afterDialogue=callback;modal={type:'dialogue',lines,index:0,loading:false};lines.forEach(l=>warm(portrait(l[0])));prepareLine();}
async function prepareLine(){if(modal?.type!=='dialogue')return;const ticket=++sequence,src=portrait(modal.lines[modal.index][0]);modal.loading=!!src;render();await warm(src);if(sequence!==ticket||modal?.type!=='dialogue')return;modal.loading=false;render();}
function next(){if(modal?.type!=='dialogue'||modal.loading)return;if(modal.index<modal.lines.length-1){modal.index++;prepareLine();return;}const cb=afterDialogue;afterDialogue=null;modal=null;render();if(cb)cb();}
function detail(title,text,tag='자료',evidenceId=''){modal={type:'detail',title,text,tag,image:EVIDENCE_IMAGES[evidenceId]||null};render();}
function alertUser(message){toast=message;render();}
function log(text){state.log=[...(state.log||[]),text].slice(-35);}
function begin(){const name=CH3?.name||CH2?.name||CH1?.name||'여행 친구';const prev=CH3?.stage==='complete'&&Array.isArray(CH3.evidence)?CH3.evidence.filter(id=>E[id]):[];state={version:1,name,stage:'investigate',room:'living',evidence:prev,solved:[],talked:[],classified:{},motiveDraft:{},log:['02:00 — 서로 다른 거짓말의 이유를 조사하기로 했다.'],asked:[],startedAt:Date.now(),finishedAt:null};save();say([
['내레이션','새벽 2시. 모두의 말이 조금씩 달라졌다. 사소한 거짓말도 있었지만, 그것만으로 사건과 연결할 수는 없었다.'],
['꾸티뉴',`${name}, 누군가 거짓말했어도 그 사람이 범인이라는 뜻은 아니잖아. 기록부터 확인해 보자.`],
['야무지','아까 바깥의 붉은 불빛, 지금도 신경 쓰여. 나 혼자 잘못 본 걸 수도 있어.'],
['윤타미','전원 장치 쪽 기록은 CCTV하고 다른 시계로 남는대. 관리인에게 확인을 부탁하자.'],
['내레이션','물건은 그대로 보존하고, 촬영해 둔 기록과 허락받은 서류만 비교하기로 했다.']]);}
function collect(id){if(!state||state.stage!=='investigate'||!E[id])return;
if(id==='E13'&&!(has('C07')&&state.talked.includes('최도식'))){alertUser('관리실 휴게 흔적(C07)을 확인한 뒤 최도식에게 기록 열람을 부탁해 보자.');return;}
if(id==='E14'&&!(has('C08')&&has('E11')&&(solved('P08')||solved('P09')))){alertUser('서재 발자국과 지하 외부문의 황토 경로를 기록하고, 붉은 불빛 또는 정전 퍼즐을 검증해야 선반 뒤를 조사할 수 있어.');return;}
if(id==='C09'&&!has('E14')){alertUser('은닉 장비의 사진을 먼저 확보하고 밑창을 비교해 보자.');return;}
if(id==='E10'&&!(has('E09')&&state.talked.includes('이유나'))){alertUser('봉투 사진을 확인한 뒤 이유나에게 이야기하고 사본 열람을 요청하자.');return;}
if(!has(id)){state.evidence.push(id);log(`새 자료 확보 · ${E[id].name}`);save();}
detail(E[id].name,E[id].text,E[id].where,id);
}
function talk(name){if(!state||state.stage!=='investigate')return;if(!state.talked.includes(name)){state.talked.push(name);save();}
const t={
'꾸티뉴':[['꾸티뉴','눈에 띄는 사람부터 의심하고 싶었는데, 거짓말의 이유는 다를 수 있겠네. 증거 없이는 누구도 단정하지 말자.']],
'난워니':[['난워니','20:41 바비큐 사진도 다시 봤어? 뒤쪽에 봉투가 찍혔더라.']],
'김옥독':[['김옥독','그때 거실 영상은 내가 찍었어. 정전 중인 건 맞지만 창밖 사람의 얼굴은 보이지 않아.']],
'야뿌':[['야뿌','그냥 여행 사진인 줄 알았는데, 뒤쪽에서 사람들이 서류를 주고받았어.']],
'하루노츠키':[['하루노츠키','낮에 전기가 나간 건 우연이었을지 몰라도, 밤에도 같았을까?']],
'만조':[['만조','서재 발자국이 외부 통로 쪽과 이어지는 것 같아. 발자국은 밟지 말고 사진만 남기자.']],
'모야':[['모야','23:20에 주방 경과 타이머가 00:36이었어. 전기가 돌아온 시각을 거꾸로 계산할 수 있지.']],
'윤타미':[['윤타미','분전반 기록은 별도 배터리로 시간을 유지한대. CCTV의 시계랑 섞으면 안 돼.']],
'야무지':[['야무지','붉은 불빛이 22시 27분쯤 바깥 통로로 지나갔어. 사람이 누군지는 전혀 몰라.']],
'다뮤_':[['다뮤_','헤드랜턴은 낮에 적색 모드를 시연했어. 그 기종이 흔한지는 모르겠네.']],
'박태성':[['박태성','창고에 점검서를 숨겼습니다. 별장 매매가 깨질까 봐 두려웠어요. 하지만 이 문서가 그날 밤 범행을 설명하진 못합니다.']],
'최도식':[['최도식',has('C07')?'관리실에서 졸았던 건 맞습니다. 해고가 무서웠어요. 분전반 독립 로거는 제가 화면을 열어 보여 드릴 수 있습니다. 원본은 건드리지 마세요.':'관리실에서 계속 상황을 보고 있었다고 말했는데… 그 자리의 흔적을 확인하시면 더 이야기하겠습니다.']],
'오세린':[['오세린',has('C04')?'사고로 가족을 잃었어요. 그 사실이 드러나면 모두 저부터 의심할 것 같아서 방문 사실도 숨겼어요.':'그날 서재에서 만난 건 사실이에요. 왜 갔는지는 사고 기사부터 봐 주세요.']],
'윤해준':[['윤해준','제가 낮에 분전반 상태를 확인한 것은 맞습니다. 하지만 누가 그날 밤 전기를 내렸는지는 모르겠습니다.']],
'이유나':[['이유나',has('E09')?'봉투를 받은 건 사실이에요. 불완전한 자료라 취재원 보호 때문에 숨겼습니다. 사본은 직접 확인해 보세요.':'별장에 있던 모든 대화를 공개할 수는 없습니다. 받은 자료의 출처가 중요하니까요.']],
'장도윤':[['장도윤','저는 차량에서 외부로 촬영본을 전송했어요. 계약을 어기는 일이라 숨겼죠. 블랙박스에는 바깥의 불빛이 찍혔지만 누구인지는 모르겠습니다.']]
};say(t[name]||[[name,'지금은 할 말이 없습니다.']]);}
function puzzleReady(p){return !p.prereqAny||p.prereqAny.some(solved);}
function selectEvidence(id){if(picks.has(id))picks.delete(id);else picks.add(id);note='';render();}
function attempt(id){const p=PUZZLES.find(x=>x.id===id);if(!p||solved(id))return;if(!puzzleReady(p)){note='붉은 불빛 또는 수동 정전 중 하나의 경로부터 검증해야 해.';render();return;}
const absent=p.required.filter(x=>!has(x));if(absent.length){note='먼저 수집해야 할 자료: '+absent.map(x=>E[x].name).join(', ');render();return;}
const notLinked=p.required.filter(x=>!picks.has(x));if(notLinked.length){note='답을 고르는 것만으로는 충분하지 않아. 관련 증거를 직접 선택해 연결해 봐.';render();return;}
if(answers[id]!==p.correct){note='선택한 결론은 현재 자료만으로 입증할 수 없어. 특정 인물을 단정하지 말고 확인할 수 있는 범위만 골라 봐.';render();return;}
state.solved.push(id);log(`${p.name} · 검증 완료`);picks.clear();answers={};note='';save();detail('추리 완료 · '+p.name,p.reason,'추리 검증');}
function motiveChange(name,value){motiveChoices[name]=value;state.motiveDraft={...(state.motiveDraft||{}),[name]:value};note='';save();render();}
function checkMotives(){const missing=MOTIVES.flatMap(m=>m.required.filter(x=>!has(x)));if(missing.length){note='진술의 근거가 부족해. 필요한 자료: '+[...new Set(missing)].map(x=>E[x].name).join(', ');render();return;}
const invalid=MOTIVES.filter(m=>(motiveChoices[m.name]||state.motiveDraft?.[m.name])!==m.correct);if(invalid.length){note=`아직 ${invalid.length}명의 사정이 확보한 자료와 맞지 않아. 일상적인 은닉과 범행 관련 사실은 구분해야 해.`;render();return;}
state.classified=Object.fromEntries(MOTIVES.map(m=>[m.name,m.correct]));if(!solved('P11'))state.solved.push('P11');log('5명의 거짓말 이유를 증거로 검증했다.');note='';save();detail('P11 · 거짓말의 이유 검증 완료','거짓말을 인정한 사람이 모두 범인인 것은 아니다. 각자가 숨긴 사실을 구분했고, 이제 남은 것은 시간·경로·동기 세 축의 연결이다.','추리 검증');}
function conclude(){if(!['P07','P08','P09','P10','P11'].every(solved)){alertUser('다섯 가지 검증을 마쳐야 최종 추리 준비를 정리할 수 있어.');return;}state.stage='complete';state.finishedAt=Date.now();log('03:15 — 경로·수단·동기 자료를 경찰에 전달할 메모로 정리했다.');save();render();}
function ask(q){const clean=String(q||'').trim().slice(0,140);if(!clean)return;if((state.asked||[]).length>=15){alertUser('질문 데모는 15회까지만 사용 가능해.');return;}
let a='알 수 없음',reason='아직 기록만으로 확인할 수 없거나 현재 지원하는 질문 유형이 아니야.';const s=clean.replace(/\s+/g,'');
if(/범인|진범|살해한|누가죽|누가범행|공범|윤해준.*범인/.test(s)){a='현재 공개 불가';reason='최종 지목은 챕터 5의 시간·경로·동기 재구성에 남겨 두었어.';}
else if(/전기.*(수동|인위)|분전반.*수동|누가.*전기/.test(s)){a=solved('P09')?'YES':'현재 공개 불가';reason=solved('P09')?'수동 조작은 기록으로 확인했지만 조작자는 특정하지 못했어.':'독립 로거의 작동 기록을 먼저 검증해야 해.';}
else if(/붉은불빛|헤드랜턴|외부통로/.test(s)){a=solved('P08')?'YES':'현재 공개 불가';reason=solved('P08')?'붉은 조명을 지닌 인물의 이동 가능성은 있지만, 신원은 알 수 없어.':'목격과 차량 기록을 먼저 비교해야 해.';}
else if(/서명|등록번호|8년전|공사/.test(s)){a=solved('P10')?'YES':'현재 공개 불가';reason=solved('P10')?'문서 서명자와 오늘의 기술자 등록번호가 연결돼. 그가 범인이라는 결론은 아니야.':'사고 기사와 문서·명함의 등록번호를 검증해야 해.';}
else if(/거짓말.*(모두|전부).*범인|거짓말.*범인/.test(s)){a=solved('P11')?'NO':'현재 공개 불가';reason=solved('P11')?'거짓말의 이유는 서로 달랐고 그것만으로 범인을 특정하지 않아.':'각 진술에 대한 반박 자료를 먼저 확인해 보자.';}
else if(/안녕|hello|hi/i.test(s)){a='관련 없음';reason='사건 기록에 관해 물어봐.';}
state.asked.push({q:clean,answer:a,reason});question='';save();render();}
function head(){return `<header class="top"><a class="brand" href="index.html"><span class="brand-icon">✦</span><span>꾸한성 · 안개 속 별장</span></a><div class="top-right"><span class="tag">CHAPTER 04</span><span class="muted small">감춰진 진실 · 로컬 자동 저장</span></div></header>`;}
function welcome(){return `${head()}<main class="welcome"><div class="welcome-card"><div class="welcome-art" role="img" aria-label="별장의 긴 복도"></div><section class="welcome-copy"><div class="eyebrow">CHAPTER 04 / HIDDEN MOTIVES</div><h1>감춰진<br>진실</h1><p>모두가 조금씩 거짓말했다. 하지만 그 이유까지 같지는 않았다. 빗속의 발자국과 오래된 문서를 통해, 거짓말과 범행을 구분해 보자.</p><div class="chip-row"><span class="chip">P07 · 발자국</span><span class="chip">P08 · 붉은 불빛</span><span class="chip">P09 · 정전</span><span class="chip">P10 · 서명</span><span class="chip">P11 · 진술</span></div><div class="buttons"><button class="btn btn-primary" data-act="begin">${CH3?.stage==='complete'?'챕터 4 이어서 시작':'챕터 4 체험 시작'}</button><a class="btn" href="chapter3.html">챕터 3 돌아가기</a></div><p class="small muted">${CH3?.stage==='complete'?'챕터 3의 여행 친구와 확인한 기록을 이어받아 시작해.':'이전 챕터를 완료하지 않아도 체험할 수 있어. 필요한 증거는 다시 조사할 수 있어.'}</p></section></div></main>`;}
function game(){const r=getRoom();const progress=PUZZLES.filter(p=>solved(p.id)).length+(solved('P11')?1:0);return `${head()}<div class="story-shell"><aside class="rail card"><div class="rail-title">장소 이동</div><nav class="room-nav" aria-label="챕터 4 장소">${ROOMS.map((p,i)=>`<button class="room ${r.id===p.id?'active':''}" data-act="room" data-id="${p.id}" aria-current="${r.id===p.id?'page':'false'}"><small>${String(i+1).padStart(2,'0')}</small>${esc(p.name)}</button>`).join('')}</nav><div class="line"></div><div class="rail-title">조사 도구</div><div class="rail-bottom"><button class="btn btn-small" data-act="tab" data-id="people">인물 심문</button><button class="btn btn-small" data-act="tab" data-id="board">증거 연결</button><button class="btn btn-small" data-act="tab" data-id="motives">진술 이유</button><a class="btn btn-small btn-subtle" href="chapter3.html">이전 장</a></div></aside><main class="main"><div class="context card"><div><div class="eyebrow">HIDDEN MOTIVES · 02:00</div><h2>${esc(r.name)}</h2><p class="context-text">${esc(r.sub)}</p></div><span class="tag">CH.04</span></div><section class="scene" aria-label="${esc(r.name)} 탐색 화면"><img src="assets/backgrounds/${esc(r.bg)}" alt="${esc(r.name)} 배경"><div class="scene-badge"><strong>${esc(r.name)}</strong><span>꾸한성 · CHAPTER 04</span></div><p class="scene-copy">${esc(r.sub)}. 의심은 증거가 아니야. 기록으로 확인하자.</p></section><div class="info-grid"><div class="info-cell"><small>수집한 자료</small><strong>${state.evidence.length}</strong></div><div class="info-cell"><small>추리 완료</small><strong>${progress} <span class="small muted">/ 5</span></strong></div></div><section class="actions card"><h3 class="section-title">이 장소의 조사 자료</h3><div class="action-grid">${ACTIONS[r.id].map(([id,label,desc])=>`<button class="action-tile ${has(id)?'done':''}" data-act="collect" data-id="${id}"><strong>${has(id)?'✓ ':''}${esc(label)}</strong><span>${esc(desc)}</span></button>`).join('')}</div></section><section class="checkpoint card"><h3>거짓말의 이유를 알아냈을까?</h3><p>증거를 선택해 경로·정전 원인·발자국·문서·진술을 각각 검증해 보자. 범인 지목은 마지막 챕터에서 하게 돼.</p><div class="chapter-progress">${['P07','P08','P09','P10','P11'].map(id=>`<span class="chip ${solved(id)?'good':''}">${id} ${solved(id)?'완료':'미해결'}</span>`).join('')}</div><div class="footer-actions"><button class="btn btn-primary" data-act="tab" data-id="board">증거 연결 보드</button><button class="btn" data-act="tab" data-id="motives">진술 이유 분류</button><button class="btn btn-subtle" data-act="conclude" ${progress===5?'':'disabled'}>조사 기록 정리</button></div></section></main><aside class="side"><section class="card"><div class="eyebrow">CASE NOTES / CH.04</div><h3>${tab==='records'?'수집한 자료':tab==='people'?'인물과 대화':tab==='board'?'증거 연결 보드':tab==='motives'?'거짓말의 이유': '질문 노트'}</h3><p class="description">${tab==='records'?'확인된 사실과 주장, 아직 불확실한 부분을 구분하자.':tab==='people'?'상대방의 거짓말은 범행 증거가 아닐 수 있어.':tab==='board'?'필수 증거를 실제로 선택해야 추리가 검증돼.':tab==='motives'?'외부인의 말과 관련 자료를 비교해 이유를 분류하자.':'무료 오프라인 규칙 데모이며 AI API는 연결되지 않았어.'}</p><div class="segment">${[['records','기록'],['people','대화'],['board','추리'],['motives','이유'],['ask','질문']].map(([id,t])=>`<button class="${tab===id?'active':''}" data-act="tab" data-id="${id}">${t}</button>`).join('')}</div>${tabContent()}</section></aside></div>`;}
function tabContent(){if(tab==='records')return state.evidence.length?state.evidence.map(id=>`<div class="record"><div class="record-title"><span>${esc(E[id]?.name||id)}</span><button class="btn btn-small btn-subtle" data-act="read" data-id="${id}">보기</button></div><p>${esc(E[id]?.where||'')}</p></div>`).join(''):'<p class="empty">장소에서 사진과 기록을 확인해 보자.</p>';
if(tab==='people')return `<div class="witness-list">${[...MEMBERS,...OUTSIDERS].map(name=>`<button class="witness" data-act="talk" data-id="${name}">${portrait(name)?`<img src="${portrait(name)}" alt="" loading="lazy">`:'<span aria-hidden="true">◈</span>'}<span><strong>${esc(name)}</strong><span class="role">${state.talked.includes(name)?'대화 완료 · ':''}${OUTSIDERS.includes(name)?'외부 관계자':'함께 여행 중인 친구'}</span></span></button>`).join('')}</div>`;
if(tab==='board')return `<p class="small muted">먼저 아래에서 확보한 자료를 선택하고, 퍼즐의 가설을 직접 선택해 검증해 봐. 자료만 수집하거나 답만 찍어서는 통과하지 않아.</p><div class="proof-group">${state.evidence.map(id=>`<button class="proof ${picks.has(id)?'selected':''}" data-act="pick" data-id="${id}" aria-pressed="${picks.has(id)}">${picks.has(id)?'✓ ':''}${esc(E[id]?.name||id)}</button>`).join('')||'<p class="empty">아직 자료가 없어.</p>'}</div>${PUZZLES.map(p=>`<section class="board-card ${puzzleReady(p)?'':'locked'}" id="card-${p.id}"><span class="tag ${solved(p.id)?'good':!puzzleReady(p)?'lock':''}">${p.id} · ${solved(p.id)?'완료':puzzleReady(p)?'검증 가능':'선행 단서 필요'}</span><h4>${esc(p.name)}</h4><p>${esc(p.description)}</p><p class="requirements">필요 자료: ${p.required.map(x=>esc(E[x].name)).join(' · ')}</p><div class="board-options">${p.options.map(([id,title])=>`<label class="board-option"><input type="radio" name="answer-${p.id}" data-answer="${p.id}" value="${id}" ${answers[p.id]===id?'checked':''} ${solved(p.id)||!puzzleReady(p)?'disabled':''}><span>${esc(title)}</span></label>`).join('')}</div><div class="hint-control"><p>${esc(p.hints[Math.max(0,(hintLevels[p.id]||0)-1)]||(hintLevels[p.id]?'':'필요하면 힌트를 한 단계씩 열어 봐.'))}</p><button class="btn btn-small btn-subtle" data-act="hint" data-id="${p.id}" ${solved(p.id)||hintLevels[p.id]>=3?'disabled':''}>힌트 ${hintLevels[p.id]||0}/3</button></div><button class="btn ${solved(p.id)?'btn-subtle':'btn-primary'}" data-act="solve" data-id="${p.id}" ${solved(p.id)||!puzzleReady(p)?'disabled':''}>${solved(p.id)?'검증 완료':'선택한 증거로 검증'}</button></section>`).join('')}${note?`<div class="notice-box" role="status">${esc(note)}</div>`:''}`;
if(tab==='motives')return `<p class="small muted">각자의 거짓말이 어떤 사정 때문이었는지 분류해 봐. 이를 맞힌다고 특정 인물의 범행이 입증되지는 않아.</p>${MOTIVES.map(m=>`<div class="matrix-row"><label for="motive-${esc(m.name)}">${esc(m.name)}</label><p>${esc(m.quote)}</p><div class="evidence-hint">관련 자료: ${m.required.map(id=>esc(E[id].name)).join(' · ')}</div><select id="motive-${esc(m.name)}" data-motive="${esc(m.name)}" ${solved('P11')?'disabled':''}>${MOTIVE_OPTIONS.map(([v,t])=>`<option value="${v}" ${((state.classified[m.name]||motiveChoices[m.name]||state.motiveDraft?.[m.name]||'')===v)?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`).join('')}<button class="btn ${solved('P11')?'btn-subtle':'btn-primary'}" style="width:100%;margin-top:12px" data-act="check-motives" ${solved('P11')?'disabled':''}>${solved('P11')?'모든 진술 검증 완료':'진술 이유 검증하기'}</button>${note?`<div class="notice-box" role="status">${esc(note)}</div>`:''}`;
return `<p class="small muted">질문은 사건 기록 일부에 정해진 규칙으로 답하는 오프라인 데모야. 실제 AI가 아니라서 다양한 말투를 모두 이해하지는 못해.</p><form id="q-form" class="qa-row"><input id="question-input" value="${esc(question)}" maxlength="140" autocomplete="off" placeholder="예: 정전은 수동으로 일어났나요?" aria-label="질문 입력"><button class="btn btn-primary" ${(state.asked||[]).length>=15?'disabled':''}>질문</button></form><p class="small muted">${(state.asked||[]).length}/15 질문</p><div class="history">${[...(state.asked||[])].reverse().map(x=>`<div class="qa-answer"><p>${esc(x.q)}</p><strong>${esc(x.answer)}</strong><p>${esc(x.reason)}</p></div>`).join('')}</div>`;}
function finish(){return `${head()}<main class="finish-screen"><div class="finish-card"><div class="finish-art" role="img" aria-label="비 내린 산장 테라스"></div><div class="finish-copy"><span class="tag good">CHAPTER 04 COMPLETE</span><h1>서로 다른<br>거짓말의 이유</h1><p>발자국의 경로, 붉은 불빛, 수동 차단, 오래된 서류까지 조사했다. 모두의 거짓말에는 각자 다른 이유가 있었다. 어떤 것이 범행의 증거인지는 마지막 추리에서 직접 입증해야 한다.</p><div class="chip-row">${['P07','P08','P09','P10','P11'].map(id=>`<span class="chip good">${id} 검증</span>`).join('')}</div><div class="buttons"><a class="btn btn-primary" href="chapter5.html">CHAPTER 05 · 마지막 추리</a><button class="btn" data-act="revisit">다시 조사하기</button><a class="btn btn-subtle" href="index.html">메인으로</a></div></div></div></main>`;}
function modalHtml(){if(!modal)return '';if(modal.type==='dialogue'){const row=modal.lines[modal.index],narr=row[0]==='내레이션',src=portrait(row[0]);return `<div class="modal-cover"><div class="modal ${narr?'narration':''}" role="dialog" aria-modal="true" aria-label="대화">${modal.loading?`<div class="dialogue-text"><p>장면을 준비 중이야…</p></div>`:`${narr?'':`<div class="dialogue-view">${src?`<img src="${esc(src)}" alt="">`:''}</div>`}<div class="dialogue-text">${narr?'':`<div class="speaker">${esc(row[0])}</div>`}<p>${esc(row[1])}</p></div><div class="dialogue-next"><span class="small muted">${modal.index+1} / ${modal.lines.length}</span><button class="btn btn-primary" data-act="next">${modal.index===modal.lines.length-1?'확인':'다음 ›'}</button></div>`}</div></div>`;}
return `<div class="modal-cover"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(modal.title)}"><div class="modal-head"><h3>${esc(modal.title)}</h3><button class="btn btn-small btn-subtle" data-act="close">✕</button></div><div class="modal-body"><span class="tag">${esc(modal.tag)}</span><div class="line"></div>${modal.image?`<img class="ch4-evidence-image" src="${esc(modal.image)}" alt="${esc(modal.title)} 증거 이미지" loading="eager" onerror="this.remove()">`:``}<p>${esc(modal.text)}</p><div class="modal-buttons"><button class="btn btn-primary" data-act="close">확인</button></div></div></div></div>`;}
function render(){app.innerHTML=`<div class="ch3 ch4">${!state?welcome():state.stage==='complete'?finish():game()}${modalHtml()}${toast?`<div class="toast" role="status">${esc(toast)}</div>`:''}</div>`;}
app.addEventListener('click',e=>{const btn=e.target.closest('[data-act]');if(!btn)return;const action=btn.dataset.act,id=btn.dataset.id||'';toast='';switch(action){case 'begin':begin();break;case 'room':if(state&&ROOMS.some(r=>r.id===id)){state.room=id;note='';save();render();}break;case 'collect':collect(id);break;case 'read':if(has(id))detail(E[id].name,E[id].text,E[id].where,id);break;case 'talk':talk(id);break;case 'tab':if(['records','people','board','motives','ask'].includes(id)){tab=id;note='';render();}break;case 'pick':selectEvidence(id);break;case 'solve':attempt(id);break;case 'hint':hintLevels[id]=Math.min(3,(hintLevels[id]||0)+1);render();break;case 'check-motives':checkMotives();break;case 'conclude':conclude();break;case 'next':next();break;case 'close':modal=null;render();break;case 'revisit':if(state){state.stage='investigate';save();render();}break;default:break;}});
app.addEventListener('change',e=>{if(e.target.dataset.answer){answers[e.target.dataset.answer]=e.target.value;note='';render();}if(e.target.dataset.motive)motiveChange(e.target.dataset.motive,e.target.value);});
app.addEventListener('input',e=>{if(e.target.id==='question-input')question=e.target.value;});
app.addEventListener('submit',e=>{if(e.target.id==='q-form'){e.preventDefault();ask(question);}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&modal?.type==='dialogue'){e.preventDefault();next();}if(e.key==='Escape'&&modal?.type==='detail'){modal=null;render();}});
render();
})();