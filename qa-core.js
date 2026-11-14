// 선택형 Q&A 공용 처리(챕터 2~4). 데이터는 qa-data.js, 챕터별 상태 함수(has·solved·confronted)는 ctx로 받는다.
// 잠긴 질문은 문구를 화면에 내보내지 않고 개수만 보여 준다(조기 공개 방지).
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // 조건: evidence(가진 증거) · solved(검증한 추리) · confronted(반박 완료) · asked(먼저 물어본 질문) — 모두 충족해야 열림
  function open(u, ctx) {
    u = u || {};
    return (u.evidence || []).every(ctx.has) && (u.solved || []).every(ctx.solved)
      && (u.confronted || []).every(ctx.confronted) && (u.asked || []).every(ctx.asked);
  }
  // 질문 노트: cases 중 조건을 처음 만족하는 답(마지막은 기본 답)
  function noteAnswer(n, ctx) { return n.cases.find(c => open(c.unlock, ctx)) || n.cases[n.cases.length - 1]; }
  function find(data, id) {
    for (const name in data.people || {}) { const q = data.people[name].find(x => x.id === id); if (q) return { name, q }; }
    return null;
  }
  // 대화하기(기존 첫 대사)로 들은 내용 = 지금 열린 talk 질문 중 마지막(대사 분기 조건과 같음)
  function talkQuestion(data, name, ctx) {
    const qs = (data.people?.[name] || []).filter(q => q.talk && open(q.unlock, ctx));
    return qs[qs.length - 1] || null;
  }
  function peopleHtml(data, ctx, attr) {
    return Object.entries(data.people || {}).map(([name, qs]) => {
      const opened = qs.filter(q => open(q.unlock, ctx)), locked = qs.length - opened.length;
      return `<section class="qa-box" aria-label="${esc(name)}에게 질문"><h4 class="section-title">${esc(name)}에게 묻기</h4><div class="qa-list">${opened.map(q => `<button class="qa-q ${ctx.asked(q.id) ? 'done' : ''}" ${attr}="qa" data-id="${esc(q.id)}">${q.present ? '<span class="qa-present">증거 제시</span>' : ''}<span>${esc(q.q)}</span>${ctx.asked(q.id) ? '<span class="qa-mark" aria-label="물어봄">✓</span>' : ''}</button>`).join('')}</div>${locked ? `<p class="small muted qa-locked">🔒 아직 물어볼 근거가 부족한 질문 ${locked}개</p>` : ''}</section>`;
    }).join('');
  }
  function notesHtml(data, ctx, attr) {
    const notes = data.notes || [];
    return `<p class="small muted">궁금한 질문을 골라 봐. 지금까지 확인한 기록 범위에서만 답해. 사건의 진실은 증거로 입증해야 해.</p><div class="qa-list">${notes.map(n => {
      const done = ctx.asked(n.id), a = done ? noteAnswer(n, ctx) : null;
      return `<div class="qa-note"><button class="qa-q ${done ? 'done' : ''}" ${attr}="qa-note" data-id="${esc(n.id)}"><span>${esc(n.q)}</span>${done ? '<span class="qa-mark" aria-label="물어봄">✓</span>' : ''}</button>${a ? `<div class="qa-answer"><strong>${esc(a.answer)}</strong><p>${esc(a.reason)}</p></div>` : ''}</div>`;
    }).join('')}</div>`;
  }
  window.QA_CORE = { open, noteAnswer, find, talkQuestion, peopleHtml, notesHtml };
})();
