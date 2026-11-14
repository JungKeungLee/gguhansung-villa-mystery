// 포인트 앤 클릭 핫스팟(챕터 2~4). 배경 사진(16:9) 위 좌표 %로 사물을 누르면 기존 획득 처리(collect/look)를 그대로 부른다.
// 항목: [증거·조사 ID, x%, y%, 사진 속 이름, (선택) 그림 밖 안내]
//   그림 밖 안내가 있으면 사진에 없는 대상(휴대폰 영상·진술·명함 등) → 점선 테두리 + 돋보기로 표시
//   좌표는 모바일(장면이 좌우로 잘림)에서도 보이도록 x 18~82% 안에 둔다
// ID·획득 조건·잠금은 각 챕터의 기존 목록(DISCOVERIES/ROOM_ACTIONS/ACTIONS)과 collect()가 그대로 판단한다
(function () {
  const OFF = '그림 밖';
  const DATA = {
    ch2: {
      living: [['E04a', 30, 50, '단체 채팅 사진', '휴대폰 화면'], ['E09', 72, 50, '야뿌의 바비큐 사진', '휴대폰 화면']],
      corridor: [['doorway', 56, 47, '복도 끝 아치'], ['people', 54, 77, '복도 바닥']],
      study: [['E08', 78, 62, '서재 문 출입 기록'], ['E11', 26, 40, '테라스 쪽 젖은 흔적', '서재 안쪽']],
      terrace: [['outside', 22, 60, '테라스 난간']],
      management: [['E02', 66, 30, 'CCTV 모니터'], ['E01', 37, 77, '책상 위 기록']],
      kitchen: [['meal', 40, 64, '식탁과 남은 그릇'], ['E01', 72, 30, '정전 때 찍은 영상', '휴대폰 화면']],
    },
    ch3: {
      living: [['E04a', 25, 50, '단체사진', '휴대폰 화면'], ['E04b', 72, 30, '김옥독의 휴대폰 영상', '휴대폰 화면'], ['E04d', 72, 62, '다뮤_의 22:50 사진', '휴대폰 화면']],
      management: [['E01', 37, 77, '책상 위 기록'], ['E02', 66, 30, 'CCTV 모니터'], ['E03', 66, 62, '녹화기(NVR)']],
      kitchen: [['E04c', 72, 28, '복구 직후 영상', '휴대폰 화면'], ['E06', 72, 58, '주방 경과 타이머', OFF]],
      corridor: [['E08', 78, 62, '서재 문 출입 기록'], ['E05', 26, 40, '경찰에 전달한 현장 사진', OFF]],
      terrace: [['E12', 70, 30, '주차장 차량 영상', '블랙박스']],
    },
    ch4: {
      living: [['E09', 72, 18, '야뿌의 바비큐 사진', '휴대폰 화면'], ['E10', 72, 42, '이유나의 사고보고서 사본', '이유나에게 요청'], ['C01', 27, 45, '다뮤_의 명함', OFF], ['C02', 72, 66, '헤드랜턴 시연 사진', '휴대폰 화면'], ['E07', 27, 70, '오세린의 제공 녹음', '녹음 파일']],
      corridor: [['E08', 78, 62, '서재 문 출입기록과 메모'], ['E11', 26, 34, '서재 현장 사진', OFF], ['E15', 26, 62, '벽난로 현장 사진', OFF]],
      terrace: [['C03', 70, 30, '야무지의 목격담', '증언'], ['C08', 22, 82, '테라스 아래쪽 바닥']],
      parking: [['E12', 24, 72, '장도윤의 차량 기록', '← 사진 밖']],
      management: [['C07', 82, 74, '관리실 휴게 자리'], ['E06', 36, 20, '벽에 붙은 정전 기록'], ['E13', 60, 50, '분전반 로그(관리 장비)']],
      basement: [['C05', 60, 38, '분전반'], ['C08', 36, 72, '지하 외부문 쪽 바닥'], ['E14', 84, 28, '선반 뒤'], ['C09', 78, 62, '작업화 바닥']],
      storage: [['C04', 34, 76, '흑백 사진과 기사'], ['C06', 68, 72, '점검서 사본'], ['C10', 50, 48, '묶은 공사 일지']],
    },
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // o: { has(id), lock(id) → 잠김 이유 문자열('' = 열림), attr('data-action'|'data-act'), action(id) → 'collect'|'look' }
  function html(ch, room, o) {
    const list = DATA[ch]?.[room]; if (!list) return '';
    return `<div class="scene-stage">${list.map(([id, x, y, label, off]) => {
      const done = o.has(id), lock = !done && o.lock ? o.lock(id) : '';
      const note = lock ? '조건 필요' : off || '';
      const pin = done ? '✓' : lock ? '🔒' : off ? '🔍' : '?';
      const aria = `${label} 조사${done ? ' (조사함)' : ''}${lock ? ` (잠김: ${lock})` : ''}${off ? ' (그림에는 보이지 않음)' : ''}`;
      return `<button class="hotspot ${done ? 'done' : ''} ${lock ? 'locked' : ''} ${off ? 'hotspot-offscene' : ''}" style="left:${x}%;top:${y}%" ${o.attr}="${o.action(id)}" data-id="${esc(id)}" aria-label="${esc(aria)}"${lock ? ` title="${esc(lock)}"` : ''}><span class="hotspot-pin" aria-hidden="true">${pin}</span><span class="hotspot-text">${esc(label)}${note ? `<small class="hotspot-note">${esc(note)}</small>` : ''}</span></button>`;
    }).join('')}</div>`;
  }
  window.HOTSPOTS = { DATA, html, has: (ch, room) => !!DATA[ch]?.[room] };
})();
