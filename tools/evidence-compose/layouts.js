// 증거별 배치(좌표·글자 크기). 문자열은 여기에 쓰지 않고 SPEC 데이터의 키(ref)로만 가리킨다.
// 좌표는 출력 크기(1448×1086) 기준 px. sheet/phone 안의 요소는 그 상자 기준 좌표.
// 실제 AI 바탕 그림을 쓸 때는 종이·화면 위치에 맞게 이 좌표만 조정한다.
// key: true = 시각·번호 등 핵심 문자열(모바일 최소 크기 기준이 더 높음)
'use strict';

const NVR = { type: 'nvr', title: 34, channel: 34, rec: 38, codec: 30, time: 66, zoom: 32 };
const CHAT = { type: 'chat', header: 130, sender: 44, time: 40 };

module.exports = {
  // E10: work/revised/E10_blank_revised.webp(집게로 묶인 흑백 복사지 묶음, 칸선 없음)에 맞춘 좌표. 종이 윗변이 약 0.9° 기울어 있음
  E10: {
    sheet: { x: 175, y: 120, w: 1180, h: 880, rotate: 0.9, paper: 'copy' },
    elements: [
      { type: 'stamp', ref: 'stamp', x: 1010, y: 0, d: 120, size: 42 },
      { type: 'text', ref: 'title', x: 110, y: 24, w: 860, size: 62, font: 'serif', weight: 700, align: 'center' },
      { type: 'rows', ref: 'rows', x: 90, y: 150, w: 1000, labelW: 300, size: 44, labelSize: 34, gap: 30, font: 'serif', key: true },
    ],
  },
  // C10: work/revised/C10_blank_revised.webp(표선 없는 빈 낡은 종이)에 맞춘 좌표. 표는 도구가 그림. 종이가 약 -1.6° 기울어 있음
  C10: {
    sheet: { x: 175, y: 160, w: 1190, h: 880, rotate: -1.6, paper: 'old' },
    elements: [
      { type: 'text', ref: 'header', x: 0, y: 14, w: 1190, size: 58, font: 'serif', weight: 700, align: 'center' },
      { type: 'text', ref: 'project', x: 45, y: 96, w: 1000, size: 40, font: 'serif' },
      { type: 'grid', ref: 'columns', x: 35, y: 162, colW: [180, 790, 150], rows: 6, rowH: 102, size: 32, font: 'serif',
        cells: [{ row: 3, col: 1, ref: 'legible_row', size: 40, key: true }, { row: 3, col: 2, signature: true }] },
    ],
  },
  // C04: work/blank/C04_blank_base.webp(제목 칸·부제 칸·컬러 사진·아래 3단·오른쪽 단)에 맞춘 좌표. 종이가 약 0.9° 기울어 있음
  C04: {
    sheet: { x: 0, y: 0, w: 1448, h: 1086, rotate: 0.9, paper: 'news' },
    elements: [
      { type: 'text', ref: 'headline', x: 120, y: 112, w: 1225, size: 60, font: 'serif', weight: 800, align: 'center' },
      { type: 'text', ref: 'subhead', x: 122, y: 252, w: 920, size: 44, font: 'serif', weight: 600 },
      { type: 'box', x: 90, y: 324, w: 968, h: 464, sampleOnly: true },
      // SPEC: 흑백 현장 사진. quad는 바탕 그림의 사진 테두리(캔버스 좌표)
      { type: 'tone', quad: [[97, 312], [1061, 325], [1061, 793], [84, 783]], filter: 'grayscale(1) contrast(1.08) sepia(.12)' },
      { type: 'text', ref: 'body', x: 108, y: 824, w: 930, h: 212, cols: 3, colGap: 76, size: 34, font: 'serif', lineHeight: 1.55, color: '#1a1712' },
      { type: 'smudges', x: 1100, y: 290, w: 240, h: 730, lines: 14, opacity: 0.5 }, // 오른쪽 단: 판독 불가 인쇄 흔적(정보 없음)
    ],
  },
  // E15(v3, 기본): work/v3/E15_blank_v3.webp 석재 단 위 재에 놓인 탄 종이 두 장에 맞춘 좌표.
  // 종이가 작고 많이 눕혀져 있어, 글자는 가로 0.86·세로 0.78배로만 눌러 변형 후에도 모바일 핵심 9px·일반 7px 이상을 지킨다
  E15: {
    elements: [
      { type: 'fragment', ref: 'fragment_title', x: 808, y: 655, w: 280, h: 80, rotate: 6, size: 39, transform: 'rotate(6deg) scaleX(.78) scaleY(.78) skewX(-10deg)', blend: true, soft: 0.6 },
      { type: 'fragment', ref: 'fragment_number', x: 515, y: 667, w: 300, h: 90, rotate: 2, size: 50, key: true, transform: 'rotate(2deg) scaleX(.86) scaleY(.78) skewX(-8deg)', blend: true, soft: 0.6 },
    ],
  },
  // E15_v2(보존): work/revised/E15_blank_revised.crop24.png(원본 위쪽 이음매 24px 제거본) 바닥의 탄 종이 두 장에 맞춘 좌표.
  // 다시 그릴 때: render E15 --base <위 파일> --layout E15_v2
  // transform: 바닥에 누운 종이 원근(세로 0.72배). 핵심 글자는 변형 후에도 모바일 9px 이상이 되게 54px
  E15_v2: {
    elements: [
      { type: 'fragment', ref: 'fragment_title', x: 900, y: 823, w: 320, h: 100, rotate: 8, size: 46, transform: 'rotate(8deg) scaleY(.72) skewX(-8deg)', blend: true, soft: 0.7 },
      { type: 'fragment', ref: 'fragment_number', x: 488, y: 853, w: 330, h: 110, rotate: -2, size: 54, key: true, transform: 'rotate(-2deg) scaleY(.72) skewX(-6deg)', blend: true, soft: 0.7 },
    ],
  },
  E07: {
    // quad: work/blank/E07_blank_base.webp 휴대폰 화면 모서리(좌상·우상·우하·좌하, 측정값). 샘플은 x·y 평면 배치를 씀
    phone: { x: 474, y: 38, w: 500, h: 1010, quad: [[342, 120], [786, 16], [1111, 897], [620, 995]] },
    elements: [{ type: 'recorder', app: 36, title: 46, start: 44, length: 44, position: 44 }], // quad 변형으로 약 0.91배 축소되므로 변형 후에도 핵심 9px(모바일) 이상이 되게 키움
  },
  // E03: CH-03 v2 승인 바탕(work/ch03/CH-03_living_CCTV_base_v2.webp)의 x 465~1189, y 230~773을 2배 확대한 바탕 기준.
  // 시계는 원본 벽시계(중심 724,266 / 지름 약 116)를 완전히 덮도록 지름 150. 색은 원본 벽시계에서 측정한 값(판 약 #997661, 테두리 약 #1e150e~#2b190c)에 맞춤
  E03: { elements: [{ ...NVR, zoomRef: 'zoom' }], clock: { x: 649, y: 191, d: 150, face: '#a3826b', rim: '#24170f', ink: '#1a110b', shade: true, grain: 0.16, shadow: true, soft: 0.5 } },
  // E17: CH-03 v2 승인 바탕의 x 0~724, y 250~793을 2배 확대한 바탕(work/ch03/E17_bg_final_v3.png) 기준. 벽시계는 화면 밖이라 그리지 않음
  E17: { elements: [{ ...NVR, zoomRef: 'zoom' }] },
  // E18: E17과 같은 확대 바탕(work/ch03/E18_bg_final_v1.png). 벽시계 화면 밖
  E18: { elements: [{ ...NVR, zoomRef: 'zoom' }] },
  // E02: CH-03 v2 승인 바탕 전체 프레임(1.0배). 시계는 원본 벽시계(중심 827,363 / 지름 약 58)를 덮는 승인 측정값. 판독 불가(templates.js legible=false 처리)
  E02: { elements: [NVR], clock: { x: 796, y: 331, d: 62, face: '#f4efe4', rim: '#2b2219', shade: true, grain: 0.14, shadow: true } },
  E04a: { elements: [CHAT] },
  E04d: { elements: [CHAT] },
};
