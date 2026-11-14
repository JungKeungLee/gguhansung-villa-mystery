// 검증: (1) 합성 전 데이터 검사  (2) 합성 후 결과 검사
'use strict';
const fs = require('fs'), path = require('path');
const { ROOT, nvrToReal, toSec, fmt, visibleStrings } = require('./data');
const { imageSize } = require('./image');

// 게임 증거 이미지의 모바일 표시 폭(390px 화면 − 좌우 여백, 보수적으로 잡음)
const MOBILE_DISPLAY_WIDTH = 340;
const MIN_KEY_PX = 9;     // 시각·번호 등 핵심 문자열의 모바일 최소 글자 크기
const MIN_TEXT_PX = 7;    // 그 밖의 글자

const REG_RE = /\d{4}-\d{4}/g;

function forbiddenHits(str, common, item) {
  const hits = [];
  for (const p of common.forbidden.patterns) { const m = str.match(new RegExp(p)); if (m) hits.push(`날짜·요일 형식 "${m[0]}"`); }
  for (const w of [...common.forbidden.words, ...(item.forbidden || [])]) if (str.includes(w)) hits.push(`금지 문구 "${w}"`);
  return hits;
}

function registrationHits(str, canon, item) {
  const official = canon.registration.match(/\d{4}-\d{4}/)[0];
  const hits = [];
  for (const m of str.match(REG_RE) || []) {
    if (item.no_registration) hits.push(`등록번호 표시 금지인데 "${m}"가 있음`);
    else if (m !== official) hits.push(`잘못된 등록번호 "${m}" (공식: ${official})`);
  }
  return hits;
}

// 합성 전: SPEC 데이터 자체가 CANON·규칙과 맞는지
function checkData(item, ctx) {
  const { canon, common, items } = ctx;
  const res = [], add = (ok, msg, level) => res.push({ level: level || (ok ? 'PASS' : 'FAIL'), msg });
  const all = visibleStrings(item.text).join('\n');
  add(['document', 'phone-recorder', 'nvr', 'chat-photo', 'fragments'].includes(item.template), `템플릿 "${item.template}"`);
  const fb = forbiddenHits(all, common, item); add(!fb.length, fb.length ? '금지 내용: ' + fb.join(', ') : '날짜·금지 문구 없음');
  const rg = registrationHits(all, canon, item); add(!rg.length, rg.length ? rg.join(', ') : '등록번호 표기 규칙 준수');
  if (item.requires_registration) add(all.includes(canon.registration), `공식 등록번호 "${canon.registration}" 포함`);
  if (item.partial_registration) {
    const frag = item.text[item.partial_registration].replace(/…/g, '');
    const digits = canon.registration.match(/\d{4}-\d{4}/)[0];
    add(digits.includes(frag) && frag.length < digits.length, `번호 일부 "${frag}"가 공식 번호의 일부이고 전체가 아님`);
  }
  if (item.template === 'nvr') {
    const real = nvrToReal(item.text.time, canon.offsets);
    add(fmt(real) === item.wall_clock, `NVR 표시 ${item.text.time} → 실제 ${fmt(real, true)} = 벽시계 ${item.wall_clock}`);
  }
  if (item.same_moment_as) {
    const other = items[item.same_moment_as];
    const real = fmt(nvrToReal(other.text.time, canon.offsets));
    add(real === item.text.sent_time, `${item.id} 공유 ${item.text.sent_time} = ${other.id} 표시 ${other.text.time}의 실제 시각 ${real} (같은 순간)`);
  }
  if (item.template === 'phone-recorder') {
    const { start, length, position } = item.text;
    const [lm, ls] = length.split(':').map(Number), end = toSec(start) + lm * 60 + ls;
    add(start === canon.recording.start, `녹음 시작 ${start} = CANON ${canon.recording.start}`);
    add(fmt(end) === canon.recording.end, `시작 ${start} + 길이 ${length} → ${fmt(end)} 종료 = CANON ${canon.recording.end}`);
    const [pm, ps] = position.split(':').map(Number); add(pm * 60 + ps < lm * 60 + ls, `재생 위치 ${position} < 길이 ${length}`);
  }
  for (const r of item.refs || []) add(fs.existsSync(path.join(ROOT, r)), `참조 파일 ${r}`);
  // new_evidence: 게임에 아직 없는 새 증거에만 쓰는 표시. current는 출력 파일명(게임에 넣을 경로)으로만 쓴다.
  // 기존 증거(표시 없음)의 파일 누락은 계속 실패. 표시가 있는데 파일이 이미 게임에 있으면 표시가 잘못된 것이므로 실패
  const curExists = item.current ? fs.existsSync(path.join(ROOT, item.current)) : false;
  if (item.current && item.new_evidence) {
    if (curExists) add(false, `new_evidence 표시 오류: ${item.current}가 이미 게임에 있음(기존 증거면 표시 제거)`);
    else add(true, `새 증거: ${item.current}는 게임에 아직 없음(출력 파일명으로만 사용)`, 'WARN');
  } else if (item.current) add(curExists, `기존 이미지 ${item.current}`);
  if (String(item.status).startsWith('blocked')) add(true, `제작 상태: ${item.status} → 완성본 합성 불가(샘플만 가능)`, 'WARN');
  else if (item.status !== 'ready') add(true, `제작 상태: ${item.status} → 조건 확인 후 제작(SPEC §1)`, 'WARN');
  return res;
}

// 합성 후: 화면에 찍힌 글자, 글꼴, 크기, 원본 보존
function checkOutput(item, ctx, r) {
  const { canon, common } = ctx;
  const res = [], add = (ok, msg, level) => res.push({ level: level || (ok ? 'PASS' : 'FAIL'), msg });
  const shown = r.text.replace(/\s+/g, ' ');
  for (const s of visibleStrings(item.text)) add(shown.includes(s.replace(/\s+/g, ' ')), `필수 문자열 "${s}"`);
  const fb = forbiddenHits(shown, common, item); add(!fb.length, fb.length ? '결과 글자에 금지 내용: ' + fb.join(', ') : '결과 글자에 날짜·금지 문구 없음');
  const rg = registrationHits(shown, canon, item); add(!rg.length, rg.length ? rg.join(', ') : '결과 글자의 등록번호 정상');
  const size = imageSize(r.output);
  add(size.type === 'webp', `출력 형식 ${size.type}`);
  add(size.width === item.size[0] && size.height === item.size[1], `출력 크기 ${size.width}×${size.height} (지정 ${item.size.join('×')})`);
  add(Math.abs(size.width / size.height - item.size[0] / item.size[1]) < 0.002, `비율 ${(size.width / size.height).toFixed(3)}`);
  add(r.baseHashBefore === r.baseHashAfter, '입력 원본 해시 변경 없음');
  add(fs.statSync(r.output).size > 10000, `출력 파일 ${Math.round(fs.statSync(r.output).size / 1024)}KB`);
  for (const f of r.fonts) add(f.ok, f.ok ? `글꼴(${f.role}): ${f.used}` : `글꼴(${f.role}): 지원 글꼴 없음 → 대체 글꼴로 표시됨`);
  const scale = MOBILE_DISPLAY_WIDTH / item.size[0];
  for (const e of r.metrics) {
    const px = +(e.size * scale).toFixed(1), min = e.key ? MIN_KEY_PX : MIN_TEXT_PX;
    if (px < min) add(false, `모바일 글자 크기 "${e.label}" ${px}px < ${min}px`);
  }
  const keyMin = Math.min(...r.metrics.filter(e => e.key).map(e => e.size));
  if (isFinite(keyMin)) add(keyMin * scale >= MIN_KEY_PX, `모바일 판독: 핵심 문자열 최소 ${(keyMin * scale).toFixed(1)}px (기준 ${MIN_KEY_PX}px, 표시 폭 ${MOBILE_DISPLAY_WIDTH}px 가정)`);
  const allMin = Math.min(...r.metrics.map(e => e.size));
  if (isFinite(allMin)) add(allMin * scale >= MIN_TEXT_PX, `모바일 판독: 전체 글자 최소 ${(allMin * scale).toFixed(1)}px (기준 ${MIN_TEXT_PX}px)`);
  if (r.overflow.length) add(false, '글자가 상자를 넘침: ' + r.overflow.join(', '));
  add(!r.overlaps.length, r.overlaps.length ? '글자끼리 겹침: ' + r.overlaps.join(', ') : '글자끼리 겹침 없음');
  return res;
}

// 자동으로 확인할 수 없어 사람이 봐야 하는 항목(템플릿 종류별)
const MANUAL = {
  common: ['바탕 그림(AI)에 생긴 가짜 글자·숫자·날짜가 없는지(자동 검사는 합성한 글자만 확인함)', '합성 글자가 종이·화면 원근과 자연스럽게 맞는지', 'SPEC 해당 ID의 금지 내용(인물·소품)이 바탕 그림에 없는지'],
  nvr: ['인물 식별: 윤해준(진회색 작업복·목 수건·공구 파우치·모자 없음)인지, 다른 인물이 섞이지 않았는지', '벽시계 바늘이 지정 시각인지(바탕 그림 시계를 쓸 때) / 판독 불가여야 하는 장면에서 실제로 읽히지 않는지', '대표 거실(living.webp)과 같은 공간으로 보이는지(CANON A장 거실 방위·CH-03)'],
  'chat-photo': ['등장 멤버가 스프라이트 구별 포인트로 식별되는지(다뮤_↔윤타미)', 'E02·E04a 같은 순간이면 인물 위치·자세가 일치하는지'],
  document: ['이름 가림 칸 아래에 글자가 비치지 않는지', '번진 줄(판독 불가)이 실제로 읽히지 않는지'],
  fragments: ['탄 자국 경계가 글자를 자연스럽게 자르는지, 번호 전체가 보이지 않는지'],
  'phone-recorder': ['휴대폰 화면에 상태바 시각·날짜가 없는지'],
};
const manualFor = item => [...MANUAL.common, ...(MANUAL[item.template] || [])];

module.exports = { checkData, checkOutput, manualFor, MOBILE_DISPLAY_WIDTH };
