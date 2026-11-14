/* 꾸한성 — 안개 속 별장 / CHAPTER 05 (fictional fan game).
 * Offline, localStorage-only final chapter. Any spoilers in client-side code are NOT secure;
 * actual AI interrogation and hidden server-side truth checks require a later backend.
 */
(()=>{'use strict';
const ROOT=document.getElementById('ch5-app');
const CH5_KEY='gguhansung-fog-villa-ch5-v1';
const CH4_KEY='gguhansung-fog-villa-ch4-v1';
const CH3_KEY='gguhansung-fog-villa-ch3-v1';
const CH1_KEY='gguhansung-fog-villa-save-v2';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(k){try{const s=JSON.parse(localStorage.getItem(k)||'null');return s&&typeof s==='object'?s:null;}catch{return null;}}
const CH4=read(CH4_KEY),CH3=read(CH3_KEY),CH1=read(CH1_KEY);
const PERSON={'꾸티뉴':'kkutinyu','난워니':'nanwoni','김옥독':'kimokdok','야뿌':'yappu','하루노츠키':'harunotsuki','만조':'manjo','모야':'moya','윤타미':'yuntami','야무지':'yamuji','다뮤_':'damyu'};
const CH4_REQUIRED=['P07','P08','P09','P10','P11'];
const ALLOWED=CH4?.stage==='complete' && CH4_REQUIRED.every(id=>CH4?.solved?.includes(id));
const E={
 'E03':['NVR 속 벽시계','CCTV 표시 22:34:13과 실내 독립 벽시계 약 23:01을 비교하는 자료.'],
 'E04b':['정전 중 휴대폰 영상','독립적인 휴대폰의 시각과 둔탁한 소리로 사건 시간대를 추정한다.'],
 'E17':['NVR 22:14 복도 문 프레임','CCTV 표시 22:14인 복도 문 쪽 확대 프레임. 윤해준이 거실에서 복도 문으로 나간다. 당시 NVR 오차를 적용해 실제 시각을 구한다.'],
 'E18':['NVR 22:28:13 복도 문 프레임','CCTV 표시 22:28:13인 복도 문 쪽 확대 프레임. 윤해준이 복도 문으로 거실에 들어온다. 밤 정전 이후의 누적 오차를 적용해 실제 시각을 구한다.'],
 'E04d':['22:50 거실 단체사진','정전 복구 이후에도 윤해준이 사진에 보이지 않는다는 기록.'],
 'E06':['주방 경과 타이머','독립적인 복구 시각 추정에 도움이 되는 기록.'],
 'E07':['오세린 면담 녹음','22:16까지 피해자가 살아 있었고 22:30 약속을 앞두고 있었음을 뒷받침한다.'],
 'E08':['서재 출입 기록','정문 출입 기록과 22:30 테라스 쪽 약속을 비교한다.'],
 'E10':['8년 전 사고 보고서','안전 점검 책임자 등록번호와 과거 사고 관련 기록.'],
 'E11':['테라스 안쪽 발자국','서재 테라스 쪽 젖은 황토와 특이한 밑창의 흔적.'],
 'E12':['차량 블랙박스','정전 중 외부 통로의 붉은 빛을 기록. 얼굴은 특정할 수 없다.'],
 'E13':['독립 분전반 로그','22:24:18 OFF, 22:44:05 ON의 수동 조작 기록.'],
 'E14':['보일러실 은닉 장비','젖은 우비·안전화·적색 헤드랜턴을 촬영한 경찰 전달용 사진.'],
 'E15':['벽난로의 불탄 종이','손상된 보고서 가장자리의 등록번호 일부.'],
 'C01':['윤해준의 기술자 명함','8년 전 공사 일지와 대조할 수 있는 기술자 등록번호.'],
 'C04':['8년 전 사고 기사','옹벽 붕괴로 작업자가 사망했던 과거 사건의 기록.'],
 'C06':['박태성의 균열 점검서','매매가 불리해질 수 있어 별장 주인이 숨긴 문서.'],
 'C09':['신발 특이 마모 비교','현장 발자국과 은닉 안전화의 V자 마모가 대응한다.'],
 'C10':['과거 공사 일지','기술자 등록번호로 당시 점검 담당자를 연결할 수 있다.'],
 'E16':['서재 현장사진 확대','앞서 촬영한 서재 벽난로 사진을 확대하면 부지깽이의 위치와 남은 그을음이 보인다. 사용 여부는 사건 정황과 함께 판단해야 한다.']
};
const EVIDENCE_IMAGES = {
  E16:'assets/evidence/e16-study-fireplace-closeup.webp',
  E17:'assets/evidence/e17-nvr-hallway-exit-2214.webp',
  E18:'assets/evidence/e18-nvr-hallway-return-222813.webp',
  E03:'assets/evidence/e03-nvr-wallclock-223413.webp',
  E04b:'assets/evidence/phone-video-blackout-2231.webp',
  E04d:'assets/evidence/e04d-group-photo-2250.webp',
  E06:'assets/evidence/kitchen-timer-0036.webp',
  E07:'assets/evidence/e07-ohserin-interview-recording.webp',
  E08:'assets/evidence/e08-study-access-log.webp',
  E10:'assets/evidence/e10-accident-report.webp',
  E11:'assets/evidence/e11-terrace-footprints.webp',
  E12:'assets/evidence/e12-vehicle-dashcam-2227.webp',
  E13:'assets/evidence/e13-breaker-log.webp',
  E14:'assets/evidence/e14-hidden-equipment.webp',
  E15:'assets/evidence/e15-burned-document.webp',
  C01:'assets/evidence/c01-yoon-haejun-business-card.webp',
  C04:'assets/evidence/c04-accident-news.webp',
  C06:'assets/evidence/c06-wall-inspection-report.webp',
  C09:'assets/evidence/c09-boot-heel-comparison.webp',
  C10:'assets/evidence/c10-construction-log.webp'
};
const FINALE_PORTRAITS={'윤해준':'yoon-haejun','이유나':'lee-yuna','장도윤':'jang-doyun'};
const TIME=[
 {id:'left',name:'윤해준이 거실을 떠남',correct:'22:21',why:'CCTV 22:14 프레임(E17)에 윤해준이 복도 문으로 나가. 그때 NVR이 오후 정전으로 얼마나 느렸는지 더해 봐.'},
 {id:'off',name:'분전반 수동 OFF',correct:'22:24',why:'분전반 독립 기록의 수동 OFF 시각을 확인해.'},
 {id:'meet',name:'서재 테라스 약속',correct:'22:30',why:'서재 메모와 면담 녹음을 교차 확인해.'},
 {id:'impact',name:'사건 발생 추정 시간대',correct:'22:40~22:42',why:'충돌음과 참고 기록이 겹치는 시간대를 찾아 봐.'},
 {id:'on',name:'전원 복구',correct:'22:44',why:'분전반 로그와 주방 타이머를 비교해.'},
 {id:'return',name:'윤해준 거실 복귀',correct:'22:55',why:'CCTV 22:28:13 프레임(E18)에 윤해준이 복도 문으로 들어와. 두 번의 정전으로 쌓인 NVR 오차를 모두 더해 봐.'}
];
const CLOCKS=['22:16','22:21','22:24','22:27','22:30','22:34','22:40~22:42','22:44','22:50','22:55','23:01','23:34'];
const SLOTS=[
 {id:'culprit',title:'범인',prompt:'누가 범행을 저질렀을까?',options:[['serin','오세린'],['taesung','박태성'],['haejun','윤해준'],['dosik','최도식'],['doyun','장도윤'],['yuna','이유나']],correct:'haejun',hint:'여러 사람이 거짓말했어. 시간·동선·동기가 동시에 성립하는 사람을 찾아야 해.'},
 {id:'when',title:'범행 시각',prompt:'사건이 실제로 일어난 시간대는?',options:[['before','22:16 이전'],['window','22:40~22:42 전후'],['after','23:01 이후']],correct:'window',hint:'정전 중 휴대폰 영상과 독립된 장치 기록을 비교해.'},
 {id:'where',title:'만남 장소',prompt:'피해자와 범인은 어느 경로로 만났을까?',options:[['front','현관에서 만나 서재 정문으로 이동'],['terrace','서재 테라스 문을 통해 서재에서 만남'],['cellar','지하 보일러실에서 만남']],correct:'terrace',hint:'서재의 정문 출입기록과 메모 속 약속 장소가 다른 이유를 생각해 봐.'},
 {id:'method',title:'범행 수법',prompt:'현장 정황에 비춰 가장 타당한 사건 전개는?',options:[['fall','계단 추락 사고'],['poker','서재에서 다툼 후 벽난로 부지깽이로 가격하고 서류 일부 소각'],['electric','분전반에서 감전 사고 발생']],correct:'poker',hint:'서재 현장사진과 불탄 서류를 함께 살펴봐.'},
 {id:'route',title:'이동 경로',prompt:'정문 로그를 피한 실제 이동 경로로 가장 유력한 것은?',options:[['hall','객실 복도 → 서재 정문 → 거실'],['roof','주차장 → 지붕 → 객실'],['outside','지하 외부문 → 외부 통로 → 테라스 → 귀환']],correct:'outside',hint:'발자국, 황토, 붉은 빛의 방향이 이어지는 경로를 찾아봐.'},
 {id:'alibi',title:'알리바이 조작',prompt:'거실 영상의 표시 시각이 왜 오해를 만들었을까?',options:[['seven','오후 정전 7분 오차만 존재'],['double','오후 7분 + 밤 19분 47초가 누적되어 약 27분 오차'],['edited','CCTV 영상 프레임을 편집하여 시간을 바꿨다']],correct:'double',hint:'정전 중에는 CCTV가 녹화하지 않았어. 실제 촬영 시각을 벽시계로 확인해.'},
 {id:'motive',title:'범행 동기',prompt:'왜 피해자를 침묵시키려 했을까?',options:[['sale','별장 매매 금액 분쟁'],['revenge','다큐 촬영에 대한 원망'],['transfer','8년 전 안전점검 서명 책임을 떠넘기려는 협박']],correct:'transfer',hint:'사고 보고서·명함·과거 일지의 등록번호를 연결해.'}
];
const PROOFS=[
 {id:'clock',label:'시간의 근거',group:['E03','E06','E13','E04d'],accepted:['E03','E13']},
 {id:'route',label:'이동 경로의 근거',group:['E11','E12','E14','C09'],accepted:['E11','C09','E14']},
 {id:'motive',label:'동기의 근거',group:['E10','C01','C10','E15'],accepted:['E10','C01','C10']}
];
const SECRET=[
 {id:'serin',title:'오세린이 사실을 숨긴 이유는?',options:[['suspect','범행을 지시했기 때문'],['identity','사망 사고 유족이라는 신분과 비공개 면담을 숨기기 위해'],['unknown','추가 확인하지 않음']],correct:'identity'},
 {id:'taesung',title:'박태성이 창고 자료를 숨긴 이유는?',options:[['sale','옹벽 균열로 매매가 불리해질까 우려해서'],['murder','범행을 도와준 사실을 감추기 위해'],['unknown','추가 확인하지 않음']],correct:'sale'}
];
const OBJECTIONS=[
 {id:'camera',claim:'“CCTV에 제가 거실에 있는 장면이 찍혔습니다. 사건 시각의 알리바이 아닌가요?”',options:['E03','E06','E08','E12'],correct:'E03',explain:'영상 내부의 벽시계는 표시 시각과 실제 촬영 시각의 차이를 드러낸다.'},
 {id:'entry',claim:'“서재 정문에는 제 출입 기록이 없습니다. 어떻게 들어갔다는 거죠?”',options:['E08','E11','E07','C01'],correct:'E11',explain:'테라스 문 안쪽 황토 발자국은 정문 외 다른 경로가 있었다는 근거다.'},
 {id:'past',claim:'“8년 전 일이 오늘 사건과 무슨 관계가 있습니까?”',options:['E12','E04d','C01','E06'],correct:'C01',explain:'기술자 등록번호를 과거 일지와 비교하면 당시 점검 서명자와 연결된다.'}
];
const NOTES={
 '꾸티뉴':['맞는 것 같은 가설도 증거 한 장으로 뒤집힐 수 있어. 네가 찾은 순서대로 얘기해 봐.','추리의 결론은 네가 내리고, 나는 어떤 자료와 모순이 있는지 같이 확인해 볼게.'],
 '난워니':['우리 사진 기록은 그대로 남아 있어. 찍힌 시간과 그때 실제로 누가 있었는지 다시 확인해 봐.'],
 '김옥독':['내 영상은 정전이 한창일 때 찍혔어. 영상의 소리가 어디서 났는지는 확신할 수 없지만 시간은 확인할 수 있어.'],
 '야뿌':['내가 찍은 여행 사진에서 봉투가 보였던 거 기억나? 그때는 아무 생각 없었는데.'],
 '하루노츠키':['오후에 7분 동안 불이 꺼졌던 건 사실이야. 그렇다고 밤에도 똑같았다는 뜻은 아니잖아.'],
 '만조':['복도 창가에서 본 길이 지하 문 쪽으로 이어져 있더라. 위험하니까 직접 내려가 보지는 않았어.'],
 '모야':['주방 타이머는 다시 켜진 시간을 확인할 단서였어. 녹화기 시계와는 구분해야 해.'],
 '윤타미':['영상의 숫자만 보고 결론 내리면 안 돼. 영상 속 벽시계는 별도 전원으로 움직이니까.'],
 '야무지':['밖에서 붉은 불빛을 본 건 맞아. 얼굴은 못 봤으니 나도 누군지는 모른다고 해야겠어.'],
 '다뮤_':['22:50 사진에는 그 사람이 안 나왔지만, 카메라 밖에 있었을 가능성은 분리해서 생각해야지.']
};
const PRESERVE=['E03','E04b','E04d','E06','E07','E08','E10','E11','E12','E13','E14','E15','C01','C04','C06','C09','C10'];
// 시간표 근거 CCTV 프레임(E17 이탈·E18 복귀): 챕터 5에서 지급. 예전 저장에도 보충(저장 형식 그대로)
const TIME_FRAMES=['E17','E18'];
let state=read(CH5_KEY),tab='timeline',modal=null,dialogueCallback=null,imageCache=new Map(),sequence=0,notice='';
function valid(s){return s&&s.version===1&&['reconstruct','rebuttal','ending'].includes(s.stage)&&s.timeline&&s.slots&&s.proofs&&s.secrets&&s.rebuttals&&Array.isArray(s.evidence);}
if(!valid(state))state=null;
if(Array.isArray(state?.evidence))for(const id of TIME_FRAMES)if(!state.evidence.includes(id))state.evidence.push(id);
if(state?.timelineDone)tab=state.stage==='rebuttal'?'rebuttal':'reconstruct';
function save(){if(state){try{localStorage.setItem(CH5_KEY,JSON.stringify(state));}catch{notice='진행 내용 저장에 실패했어. 브라우저 저장 공간을 확인해 줘.';}}}
function has(id){return !!state?.evidence.includes(id);}
function bg(name){return `assets/backgrounds/${name}.webp`;}
function portrait(n,line=''){if(FINALE_PORTRAITS[n])return `assets/characters/${FINALE_PORTRAITS[n]}/${/!|！|놀라|충격|설마/.test(String(line))?'surprised':'night'}.webp`;return PERSON[n]?`assets/characters/${PERSON[n]}/night.webp`:'';}
function warm(src){if(!src)return Promise.resolve();if(imageCache.has(src))return imageCache.get(src);const im=new Image();im.src=src;const task=(im.decode?im.decode():new Promise(r=>{im.onload=im.onerror=r;})).catch(()=>{});imageCache.set(src,task);return task;}
function speak(lines,callback=null){dialogueCallback=callback;modal={kind:'dialogue',lines,index:0,loading:false};for(const row of lines)warm(portrait(row[0],row[1]));prepareLine();}
async function prepareLine(){if(modal?.kind!=='dialogue')return;const key=++sequence,src=portrait(...modal.lines[modal.index]);modal.loading=!!src;render();await warm(src);if(key!==sequence||modal?.kind!=='dialogue')return;modal.loading=false;render();}
function nextLine(){if(modal?.kind!=='dialogue'||modal.loading)return;if(modal.index+1<modal.lines.length){modal.index++;prepareLine();return;}const cb=dialogueCallback;dialogueCallback=null;modal=null;render();if(cb)cb();}
function detail(title,body,evidenceId=''){modal={kind:'detail',title,body,image:EVIDENCE_IMAGES[evidenceId]||null};render();}
function init(){if(!ALLOWED)return;const ch4ev=CH4?.evidence||[];const ch3ev=CH3?.evidence||[];state={version:1,stage:'reconstruct',name:CH4?.name||CH3?.name||CH1?.name||'여행 친구',evidence:[...new Set([...ch3ev,...ch4ev].filter(id=>PRESERVE.includes(id)))],timeline:{},slots:{},proofs:{},secrets:{},rebuttals:{},timelineDone:false,attempts:0,ending:null,startedAt:Date.now(),finishedAt:null,log:['03:20 — 모두가 모인 자리에서 사건을 다시 정리한다.']};if(!state.evidence.includes('E03'))state.evidence.push('E03');state.evidence.push('E16');for(const id of TIME_FRAMES)if(!state.evidence.includes(id))state.evidence.push(id);save();speak([
 ['내레이션','새벽 3시 20분. 비가 조금 잦아들었다. 신고를 받은 경찰이 도착하기 전, 각자가 본 것과 들은 것을 다시 정리했다.'],
 ['꾸티뉴',`${state.name}, 이상한 사람을 고르는 걸로 끝내지 말자. 우리가 무엇을 근거로 그런 생각을 했는지가 중요해.`],
 ['윤타미','NVR 시간은 두 번 달라졌어. 시계를 한 번만 고치면 나중 영상의 시각이 맞지 않아.'],
 ['야뿌','사진에도 생각보다 많은 게 남아 있었더라. 그때는 진짜 여행 사진인 줄만 알았는데.'],
 ['내레이션','진실을 가리키는 기록은 충분했다. 이제 기록 사이의 빈칸을 채울 차례다.']
 ]);}
function countTimeline(){return TIME.filter(x=>state.timeline[x.id]).length;}
function timeWrong(){return TIME.filter(x=>state.timeline[x.id]!==x.correct);}
function validateTimeline(){if(countTimeline()<TIME.length){notice=`아직 시간표가 ${TIME.length-countTimeline()}칸 비어 있어.`;render();return;}const bad=timeWrong();if(bad.length){notice=`시간표의 ${bad.length}개 사건이 다른 기록과 맞지 않아. CCTV 표시 시각과 실제 시각을 다시 구분해 봐.`;render();return;}state.timelineDone=true;state.log.push('사건 시간표의 6개 시각을 독립 기록과 대조했다.');notice='시간표 검증 완료. 이제 범행 과정을 재구성할 수 있어.';tab='reconstruct';save();speak([['꾸티뉴','여기까지는 서로 다른 시계를 연결해 설명할 수 있어. 그럼 사건을 실제로 가능하게 만든 경로는 뭘까?'],['내레이션','같은 사건의 시간이 한 줄로 이어졌다. 하지만 누구의 범행인지는 아직 입증되지 않았다.']]);}
function claim(){if(!state.timelineDone){notice='먼저 시간표 6칸을 증거와 맞춰 검증해야 해.';tab='timeline';render();return;}
 const miss=SLOTS.filter(x=>!state.slots[x.id]);const noProof=PROOFS.filter(x=>!state.proofs[x.id]);if(miss.length||noProof.length){notice=`아직 ${miss.length}개 추리 슬롯과 ${noProof.length}개 증거 축이 비어 있어.`;render();return;}
 const unsupported=PROOFS.find(x=>!has(state.proofs[x.id]));if(unsupported){notice='실제로 확보하지 않은 자료는 결정적 근거로 제시할 수 없어.';render();return;}
 const sig=claimSignature();if((state.failedClaims||[]).includes(sig)){notice='이미 기록과 충돌한다고 확인된 추리와 똑같아. 안내받은 영역의 결론이나 근거를 바꿔서 다시 제시해 봐.';render();return;}
 state.attempts++;
 if(badAreas().length){rememberFailed(sig);state.stage='ending';state.ending='bad';state.finishedAt=Date.now();state.log.push('최종 추리에서 증거와 충돌하는 결론이 발견됐다.');save();render();return;}
 state.stage='rebuttal';tab='rebuttal';notice='정황의 연결은 성립했어. 하지만 지목된 인물의 반론에 세 가지 핵심 자료로 답해야 해.';state.log.push('최종 추리를 제시했다. 반론 검증으로 넘어간다.');save();speak([['내레이션','모든 기록을 연결하자 한 사람의 움직임이 드러났다.'],['윤해준','지금까지 정리한 자료가 곧 제가 범인이라는 증거는 아닙니다. CCTV에 제가 나온 장면도 있지 않습니까?'],['꾸티뉴','그 말을 반박할 자료를 하나씩 확인하자. 추측 대신 기록으로.']]);}
// BAD 판정 영역: 칸 단위가 아니라 4개 영역으로 묶어 안내(정답 칸을 바로 알 수 없게). 저장값이 아니라 현재 선택에서 계산하므로 기존 저장에도 동작한다.
const BAD_AREAS=[{label:'누가 (범인 지목)',slots:['culprit']},{label:'언제 (범행 시각·알리바이)',slots:['when','alibi']},{label:'어디서·어떻게 (만남 장소·수법·이동 경로)',slots:['where','method','route']}];
function badAreas(){const out=BAD_AREAS.filter(a=>a.slots.some(id=>state.slots[id]!==SLOTS.find(x=>x.id===id).correct)).map(a=>a.label);if(PROOFS.some(x=>!x.accepted.includes(state.proofs[x.id])))out.push('결정적 근거 (시간·경로·동기 근거 자료)');return out;}
// 동기는 BAD 판정에 쓰이지 않으므로 서명에서 제외한다.
function claimSignature(){return JSON.stringify([SLOTS.filter(x=>x.id!=='motive').map(x=>state.slots[x.id]||''),PROOFS.map(x=>state.proofs[x.id]||'')]);}
function rememberFailed(sig){const list=Array.isArray(state.failedClaims)?state.failedClaims:[];if(!list.includes(sig))list.push(sig);state.failedClaims=list.slice(-30);}
// 반박 단계에서 저장된 최종 추리(동기 제외 6칸 + 증거 3축)가 claim() 통과 조건을 여전히 만족하는지 재확인한다.
function claimHolds(){return SLOTS.every(x=>x.id==='motive'||state.slots[x.id]===x.correct)&&PROOFS.every(x=>has(state.proofs[x.id])&&x.accepted.includes(state.proofs[x.id]));}
function finalRebut(){if(!state||state.stage!=='rebuttal')return;
 if(!claimHolds()){state.stage='reconstruct';tab='reconstruct';notice='최종 추리 내용이 제시했을 때와 달라졌어. 「최종 추리 제시하기」로 다시 검증받아야 해.';save();render();return;}
 const missing=OBJECTIONS.filter(o=>!state.rebuttals[o.id]);if(missing.length){notice=`아직 ${missing.length}개의 반박에 증거를 선택하지 않았어.`;render();return;}
 const wrong=OBJECTIONS.find(o=>state.rebuttals[o.id]!==o.correct);if(wrong){notice=`“${wrong.claim.replace(/^[“”]/g,'').slice(0,22)}…”에 제시한 자료가 그 반박의 핵심과 맞지 않아. 다른 자료를 선택해 봐.`;render();return;}
 const truth=state.slots.motive==='transfer'&&SECRET.every(x=>state.secrets[x.id]===x.correct);
 state.ending=truth?'true':'normal';state.stage='ending';state.finishedAt=Date.now();state.log.push(`${truth?'TRUE':'NORMAL'} END — 사건에 대한 최종 설명을 경찰에 전달했다.`);save();render();}
function retry(){if(!state)return;if(state.ending==='bad'&&badAreas().length)rememberFailed(claimSignature());state.stage='reconstruct';state.ending=null;state.finishedAt=null;state.rebuttals={};tab='reconstruct';notice='최종 추리 전 상태로 돌아왔어. 선택했던 시간표와 근거는 그대로 남아 있어. 기록과 충돌한 영역을 바꿔서 다시 제시해 봐.';save();render();}
function revisit(){if(!state)return;state.stage='reconstruct';state.ending=null;state.finishedAt=null;state.rebuttals={};tab='reconstruct';notice='사건 기록을 다시 검토할 수 있어.';save();render();}
function reset(){try{localStorage.removeItem(CH5_KEY);}catch{}state=null;modal=null;notice='';tab='timeline';render();}
function selectOptions(values,current,placeholder){return `<option value="">${esc(placeholder)}</option>${values.map(([value,name])=>`<option value="${esc(value)}" ${value===current?'selected':''}>${esc(name)}</option>`).join('')}`;}
function head(){return `<header class="top"><a href="index.html" class="brand"><span class="brand-icon">✦</span><span>꾸한성: 안개 속 별장</span></a><div class="top-right"><span class="tag">CH. 05 / FINAL CASE</span><span class="small muted">자동 저장 · 로컬 플레이</span></div></header>`;}
function cover(){return `${head()}<main class="welcome"><div class="welcome-card"><div class="welcome-art" role="img" aria-label="비가 그친 별장 앞 풍경"></div><div class="welcome-copy"><div class="eyebrow">CHAPTER 05 · THE LAST DEDUCTION</div><h1>마지막<br>추리</h1><p>오래된 서류, 두 번 어긋난 시계, 비에 젖은 발자국. 단서는 흩어져 있지만, 진실은 하나다.</p><div class="chip-row"><span class="chip">시간표 6개</span><span class="chip">재구성 8칸</span><span class="chip">증거 3축</span><span class="chip">3가지 엔딩</span></div><div class="buttons">${ALLOWED?`<button class="btn btn-primary" data-act="begin">${esc(state?.name||CH4?.name||'여행 친구')}의 마지막 추리 시작</button>`:`<a class="btn btn-primary" href="chapter4.html">챕터 4부터 플레이</a>`}<a href="chapter4.html" class="btn">이전 장</a></div><p class="small muted">${ALLOWED?'챕터 4에서 검증한 증거와 여행 친구의 이름을 이어받아 시작해.':'챕터 4의 다섯 퍼즐을 해결하고 조사를 정리하면 마지막 장이 열려.'}</p></div></div></main>`;}
function formTime(){return `<section class="case-card"><div class="section-head"><div><div class="eyebrow">PART 01 / TIME</div><h3>사건 시간표를 완성해 봐</h3></div><span class="chip ${state.timelineDone?'good':''}">${countTimeline()} / ${TIME.length}</span></div><p class="small muted">시각은 실제 시간 기준이야. 녹화기의 화면에 찍힌 숫자를 그대로 사용하면 틀릴 수 있어.</p><figure class="ch5-timeline-board"><a href="assets/evidence/ch5-timeline-board.webp" target="_blank" rel="noopener noreferrer" aria-label="시간표 안내 이미지 크게 보기"><img src="assets/evidence/ch5-timeline-board.webp" alt="6개 사건의 실제 시각을 빈칸으로 표시한 시간표 정리 보드" loading="lazy"></a><figcaption>증거를 비교하여 아래 시간 선택칸을 채워 주세요. 사진을 누르면 크게 볼 수 있습니다.</figcaption></figure><div class="time-grid">${TIME.map((t,i)=>`<label class="time-row"><span class="time-count">${String(i+1).padStart(2,'0')}</span><span class="time-event">${esc(t.name)}<small>${esc(t.why)}</small></span><select data-time="${t.id}" ${state.timelineDone?'disabled':''} aria-label="${esc(t.name)} 시각 선택">${selectOptions(CLOCKS.map(x=>[x,x]),state.timeline[t.id]||'','시각 선택')}</select></label>`).join('')}</div><div class="chapter-actions"><button class="btn btn-primary" data-act="time-check" ${state.timelineDone?'disabled':''}>${state.timelineDone?'시간표 검증 완료':'사건 시각 검증하기'}</button><button class="btn" data-act="tab" data-id="evidence">기록 다시 보기</button></div></section>`;}
function formReconstruction(){return `<section class="case-card"><div class="section-head"><div><div class="eyebrow">PART 02 / RECONSTRUCTION</div><h3>그날 밤 무슨 일이 있었을까?</h3></div><span class="chip">8개의 결론</span></div><p class="small muted">범인만 맞히면 안 돼. 범행이 가능했던 시간·동선·수법·동기와 증거가 함께 성립해야 해.</p>${state.stage==='rebuttal'?`<div class="notice-box" role="note">지금은 마지막 반박 단계야. 여기서 답을 바꾸면 최종 추리를 다시 제시해야 해.</div>`:''}<figure class="ch5-suspect-board"><a href="assets/evidence/ch5-suspect-board.webp" target="_blank" rel="noopener noreferrer" aria-label="용의자 관계도 크게 보기"><img src="assets/evidence/ch5-suspect-board.webp" alt="6명 후보의 기록과 진술을 공평하게 비교하는 정답 비노출 관계도" loading="lazy"></a><figcaption>후보 간 관계를 비교하고 아래에서 범인·시간·동기 등을 선택하세요. 이미지를 누르면 확대할 수 있습니다.</figcaption></figure><div class="slot-grid">${SLOTS.map((s,i)=>`<div class="slot"><span class="slot-top"><span>${String(i+1).padStart(2,'0')} · ${esc(s.title)}</span></span><small>${esc(s.prompt)}</small><select data-slot="${s.id}" aria-label="${esc(s.title)} 선택">${selectOptions(s.options,state.slots[s.id]||'','결론 선택')}</select><details class="slot-hint"><summary>힌트 보기</summary><p>${esc(s.hint)}</p></details></div>`).join('')}<div class="slot proof-slot"><span class="slot-top">08 · 결정적 근거</span><small>시간·경로·동기를 입증하는 자료를 각각 하나씩 선택해.</small>${PROOFS.map(p=>`<label class="proof-select"><span>${esc(p.label)}</span><select data-proof="${p.id}" aria-label="${esc(p.label)} 선택">${selectOptions(p.group.filter(id=>has(id)).map(id=>[id,E[id][0]]),state.proofs[p.id]||'','증거 선택')}</select></label>`).join('')}</div></div><div class="divider"></div><div class="eyebrow">OPTIONAL / 숨은 진실</div><p class="small muted" style="margin:7px 0 12px">이 질문을 확인하지 않아도 사건 해결은 가능해. 하지만 모든 사람의 이야기를 이해하면 더 깊은 엔딩으로 이어질 수 있어.</p><div class="secrets">${SECRET.map(s=>`<label class="secret-row"><span>${esc(s.title)}</span><select data-secret="${s.id}" aria-label="${esc(s.title)}">${selectOptions(s.options,state.secrets[s.id]||'','추가 확인 안 함')}</select></label>`).join('')}</div><div class="chapter-actions"><button class="btn btn-primary" data-act="submit" ${state.timelineDone?'':'disabled'}>최종 추리 제시하기</button><button class="btn" data-act="tab" data-id="timeline">사건 시간표</button></div></section>`;}
function formRebuttal(){return `<section class="case-card"><div class="eyebrow">PART 03 / CONTRADICTIONS</div><h3>세 가지 반박에 증거로 답해 봐</h3><p class="small muted" style="margin-top:8px">이미 세운 추리를 다시 설명하는 단계야. 상대가 납득하지 않는다고 해서 새로운 증거를 만들어낼 수는 없어.</p><div class="counter-list">${OBJECTIONS.map((o,i)=>`<label class="counter"><span class="counter-number">반론 ${i+1}</span><strong>${esc(o.claim)}</strong><span class="small muted">무엇을 제시하면 이 반론을 검증할 수 있을까?</span><select data-rebut="${o.id}" aria-label="반론 ${i+1} 제시 증거">${selectOptions(o.options.filter(has).map(id=>[id,E[id][0]]),state.rebuttals[o.id]||'','증거 선택')}</select></label>`).join('')}</div><div class="chapter-actions"><button class="btn btn-primary" data-act="rebut-check">세 가지 반박 검증하기</button><button class="btn" data-act="back">재구성 다시 보기</button></div></section>`;}
function evidenceList(){return `<section class="case-card"><div class="section-head"><div><div class="eyebrow">CASE RECORDS</div><h3>확보한 기록과 자료</h3></div><span class="chip">${state.evidence.length}개</span></div><p class="small muted">자료는 원본을 훼손하지 않고 사진과 사본으로 확인했어. 사진만으로 특정인의 범행을 단정할 수 없어.</p><div class="evidence-grid">${state.evidence.filter(id=>E[id]).map(id=>`<button class="evidence-tile" data-act="read" data-id="${id}"><span class="evidence-id">${id}</span><strong>${esc(E[id][0])}</strong><small>${esc(E[id][1])}</small></button>`).join('')}</div><div class="chapter-actions"><button class="btn" data-act="tab" data-id="timeline">시간표 확인</button></div></section>`;}
function people(){return `<section class="case-card"><div class="eyebrow">TEAM / 10 FRIENDS</div><h3>꾸한성 멤버들과 대화</h3><p class="small muted">누가 정답을 대신 알려 주지는 않아. 각자 남긴 기록과 기억을 비교할 수 있어.</p><div class="people-grid">${Object.keys(PERSON).map(n=>`<button class="member-tile" data-act="talk" data-id="${esc(n)}"><img src="${esc(portrait(n))}" alt="" loading="lazy"><span>${esc(n)}</span></button>`).join('')}</div></section>`;}
function game(){return `${head()}<div class="story-shell ch5-layout"><aside class="rail card"><div class="rail-title">마지막 추리</div><nav class="room-nav ch5-nav">${[['timeline','01 · 시간표'],['reconstruct','02 · 사건 재구성'],['evidence','사건 자료'],['people','친구들과 대화'],...(state.stage==='rebuttal'?[['rebuttal','03 · 마지막 반박']]:[])].map(([id,n])=>`<button class="room ${tab===id?'active':''}" data-act="tab" data-id="${id}">${n}</button>`).join('')}</nav><div class="line"></div><p class="small muted">실제 시각은 CCTV 화면 시각과 다를 수 있어. 누군가의 거짓말이 곧 범행 증거는 아니야.</p><a class="btn btn-small btn-subtle" href="chapter4.html">챕터 4 기록</a></aside><main class="main"><div class="context card ch5-context"><div><div class="eyebrow">FINAL CASE · 03:20</div><h2>안개 속 별장 — 마지막 추리</h2><p class="context-text">${esc(state.name)}의 사건 기록 · 출처와 근거를 직접 연결해 보자</p></div><span class="tag">CHAPTER 05</span></div><section class="scene ch5-scene" aria-label="${state.stage==='rebuttal'?'최종 반론 대면 장소':'마지막 추리 회의실'}"><img src="${bg(state.stage==='rebuttal'?'ch5-culprit-confrontation-study':'ch5-final-deduction-room')}" alt="${state.stage==='rebuttal'?'최종 대면 서재':'마지막 추리 회의실'}"><div class="scene-badge"><strong>${state.stage==='rebuttal'?'마지막 반박 — 서재':'모두가 다시 모인 거실'}</strong><span>03:20 · 새벽</span></div><p class="scene-copy">이 사건의 진실은, 누군가를 의심하는 것만으로 완성되지 않는다.</p></section><div class="info-grid"><div class="info-cell"><small>시간표 검증</small><strong>${state.timelineDone?'완료':`${countTimeline()}/6`}</strong></div><div class="info-cell"><small>재구성 진행</small><strong>${SLOTS.filter(s=>state.slots[s.id]).length+(PROOFS.every(p=>state.proofs[p.id])?1:0)}/8</strong></div></div>${tab==='timeline'?formTime():tab==='reconstruct'?formReconstruction():tab==='evidence'?evidenceList():tab==='people'?people():formRebuttal()}${notice?`<div class="notice-box" role="status" aria-live="polite">${esc(notice)}</div>`:''}</main><aside class="side"><section class="card ch5-side"><div class="eyebrow">CASE NOTES · FINAL</div><h3>현재 확인한 사실</h3><div class="fact-item"><strong>${state.timelineDone?'22:24:18':'분전반 로그'}</strong><span>독립 기록: 수동 OFF</span></div><div class="fact-item"><strong>${state.timelineDone?'22:44:05':'복구 기록'}</strong><span>독립 기록: 수동 ON</span></div><div class="fact-item"><strong>${state.timelineDone?'약 27분':'두 번의 정전'}</strong><span>CCTV 시각의 누적 오차 검토</span></div><div class="fact-item"><strong>${state.timelineDone?'22:40~22:42':'워치·녹음'}</strong><span>사건 유력 시간대를 재구성 · 확정 사망 시각 아님</span></div><div class="side-friends">${['꾸티뉴','김옥독','윤타미','야뿌'].map(n=>`<img src="${esc(portrait(n))}" title="${esc(n)}" alt="">`).join('')}</div><div class="line"></div><p class="small muted">AI 질문·심문은 아직 오프라인 데모 단계야. 여기서는 이전 챕터에서 검증한 기록을 사용해 추리해.</p><a class="btn btn-small" href="index.html">타이틀 화면</a></section></aside></div>`;}
function ending(){const bad=state.ending==='bad',truth=state.ending==='true';const title=bad?'너무 이른 지목':truth?'모든 시계가 가리킨 진실':'사건은 해결됐다';const subtitle=bad?'BAD END':truth?'TRUE END':'NORMAL END';const desc=bad?'제시한 결론 일부가 확보된 기록과 충돌했다. 정황이나 거짓말만으로 누군가를 범인으로 단정할 수 없다.':'시간을 두 번 보정하면 사건 당시의 거실 알리바이는 무너진다. 지하 외부문과 테라스 흔적, 과거 사고의 서명 기록이 윤해준을 가리킨다.';
return `${head()}<main class="finish-screen"><div class="finish-card ch5-finish ${state.ending}"><div class="finish-art" role="img" aria-label="${bad?'사건 해결에 실패하고 밤의 별장 계단에서 좌절한 꾸한성 친구들':truth?'해가 뜨는 아침, 웃으며 자동차를 타고 돌아가는 꾸한성 친구들':'새벽 안개 속에서 사건을 되짚으며 여전히 고민하는 꾸한성 친구들'}"></div><div class="finish-copy"><span class="tag ${bad?'':'good'}">${subtitle} · CHAPTER 05</span><h1>${esc(title)}</h1><p>${esc(desc)}</p>${bad?`<p class="bad-areas"><strong>기록과 충돌한 영역</strong> · ${esc(badAreas().join(' · ')||'확인할 수 없음')}</p><p>마지막 추리 직전으로 돌아가 결론과 근거를 바꿀 수 있어. 범인은 공개되지 않아.</p>`:`<p>${truth?'오세린이 신분을 숨긴 이유와 박태성이 서류를 숨긴 이유도 확인했다. 모두의 거짓말이 같은 의미가 아니었다는 사실까지 밝혀졌다.':'핵심 물증을 통해 사건의 경위를 설명했다. 하지만 모두의 사정과 과거의 진실까지 파악하지는 못했다.'}</p><p>도착한 경찰에게 보존한 기록과 재구성 내용을 전달했다. 꾸한성 일행은 서로의 이야기를 끝까지 들은 뒤, 조용히 별장을 떠났다.</p>`}<div class="chapter-actions">${bad?`<button class="btn btn-primary" data-act="retry">최종 추리 다시 하기</button>`:`<button class="btn btn-primary" data-act="review">다른 결론 검토하기</button>`}<a class="btn" href="index.html">여행 처음으로</a><a class="btn btn-subtle" href="chapter4.html">챕터 4 기록</a></div><p class="small muted">이 팬게임의 인물·사건은 허구이며 실제 인물의 행위와 무관해.</p></div></div></main>`;}
function modalHtml(){if(!modal)return '';if(modal.kind==='dialogue'){const [who,line]=modal.lines[modal.index],narr=who==='내레이션',src=portrait(who,line);return `<div class="modal-cover"><div class="modal ${narr?'narration':''}" role="dialog" aria-modal="true" aria-label="대화">${modal.loading?`<div class="dialogue-text"><p>장면을 준비 중이야…</p></div>`:`${narr?'':`<div class="dialogue-view">${src?`<img src="${esc(src)}" alt="">`:''}</div>`}<div class="dialogue-text">${narr?'':`<div class="speaker">${esc(who)}</div>`}<p>${esc(line)}</p></div><div class="dialogue-next"><span class="small muted">${modal.index+1} / ${modal.lines.length}</span><button class="btn btn-primary" data-act="next">${modal.index===modal.lines.length-1?'확인':'다음 ›'}</button></div>`}</div></div>`;}
return `<div class="modal-cover"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(modal.title)}"><div class="modal-head"><h3>${esc(modal.title)}</h3><button class="btn btn-small btn-subtle" data-act="close" aria-label="닫기">✕</button></div><div class="modal-body">${modal.image?`<img class="ch5-evidence-image" src="${esc(modal.image)}" alt="${esc(modal.title)} 증거 이미지" loading="eager" onerror="this.remove()">`:``}<p>${esc(modal.body)}</p><div class="modal-buttons"><button class="btn btn-primary" data-act="close">확인</button></div></div></div></div>`;}
function render(){ROOT.innerHTML=`<div class="ch3 ch4 ch5">${!state?cover():state.stage==='ending'?ending():game()}${modalHtml()}</div>`;}
ROOT.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const act=b.dataset.act,id=b.dataset.id||'';notice='';switch(act){case 'begin':init();break;case 'tab':if(['timeline','reconstruct','evidence','people','rebuttal'].includes(id)){if(id==='rebuttal'&&state.stage!=='rebuttal')break;tab=id;render();}break;case 'time-check':validateTimeline();break;case 'submit':claim();break;case 'rebut-check':finalRebut();break;case 'back':tab='reconstruct';render();break;case 'read':if(has(id)&&E[id])detail(E[id][0],E[id][1],id);break;case 'talk':if(PERSON[id])speak(NOTES[id].map(x=>[id,x]));break;case 'next':nextLine();break;case 'close':modal=null;render();break;case 'retry':retry();break;case 'review':revisit();break;case 'reset':reset();break;}}
);
ROOT.addEventListener('change',e=>{if(!state)return;const el=e.target;const claimField=!!(el.dataset.slot||el.dataset.proof||el.dataset.secret);if(el.dataset.time){state.timeline[el.dataset.time]=el.value;state.timelineDone=false;}else if(el.dataset.slot)state.slots[el.dataset.slot]=el.value;else if(el.dataset.proof)state.proofs[el.dataset.proof]=el.value;else if(el.dataset.secret)state.secrets[el.dataset.secret]=el.value;else if(el.dataset.rebut)state.rebuttals[el.dataset.rebut]=el.value;else return;notice='';
 // 반박 단계에서 최종 추리 답변을 바꾸면 반박 단계를 닫고 최종 추리 제시(claim)부터 다시 검증받게 한다.
 if(claimField&&state.stage==='rebuttal'){state.stage='reconstruct';tab='reconstruct';notice='최종 추리 내용이 바뀌었어. 반박으로 넘어가려면 「최종 추리 제시하기」로 다시 검증받아야 해.';}
 save();render();});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&modal?.kind==='dialogue'&&document.activeElement?.tagName!=='BUTTON'){e.preventDefault();nextLine();}if(e.key==='Escape'&&modal?.kind==='detail'){modal=null;render();}});
render();
})();