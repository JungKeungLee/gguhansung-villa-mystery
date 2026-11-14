// 증거 이미지 확대 보기(챕터 1~5 공용). 증거 이미지를 누르면 화면 전체로 크게 보고, 아무 곳이나 누르거나 Esc로 닫는다.
// 기존 대사·증거 창의 진행에는 영향을 주지 않는다(확대 창이 열린 동안의 클릭·키 입력은 게임으로 전달하지 않음).
(function () {
  'use strict';
  if (window.EVIDENCE_ZOOM) return;
  const SEL = 'img.dlg-evidence-img, img.ch2-evidence-image, img.ch3-evidence-image, img.ch4-evidence-image, img.ch5-evidence-image';
  let box = null;
  function style() {
    const st = document.createElement('style');
    st.textContent = `${SEL}{cursor:zoom-in}#ev-zoom{position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;padding:12px;background:#05080fef;cursor:zoom-out}`
      + '#ev-zoom img{max-width:100%;max-height:calc(100% - 44px);object-fit:contain;border-radius:8px;box-shadow:0 12px 40px #000c}'
      + '#ev-zoom p{position:absolute;left:0;right:0;bottom:10px;margin:0;text-align:center;color:#d9d3c6;font:12px/1.4 sans-serif}';
    document.head.appendChild(st);
  }
  function open(img) {
    close();
    box = document.createElement('div'); box.id = 'ev-zoom'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', '증거 이미지 확대');
    const big = document.createElement('img'); big.src = img.currentSrc || img.src; big.alt = img.alt || '증거 이미지';
    const p = document.createElement('p'); p.textContent = '누르거나 Esc를 눌러 닫기';
    box.append(big, p); document.body.appendChild(box);
  }
  function close() { if (box) { box.remove(); box = null; } }
  function boot() {
    style();
    // 캡처 단계에서 먼저 받아 게임의 클릭 처리(대사 넘김 등)로 전달되지 않게 한다
    document.addEventListener('click', e => {
      if (box) { e.preventDefault(); e.stopPropagation(); close(); return; }
      const img = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (img) { e.preventDefault(); e.stopPropagation(); open(img); }
    }, true);
    document.addEventListener('keydown', e => { if (box && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); close(); } }, true);
  }
  window.EVIDENCE_ZOOM = { open, close, isOpen: () => !!box };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
