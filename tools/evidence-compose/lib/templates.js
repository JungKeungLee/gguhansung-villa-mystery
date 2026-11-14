// HTML/CSS 템플릿: 바탕 그림 위에 정확한 글자를 얹는다. 종류: document, fragments, phone-recorder, nvr, chat-photo
'use strict';

const FONTS = {
  sans: ['Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans CJK KR', 'Noto Sans KR'],
  serif: ['Batang', 'AppleMyungjo', 'Noto Serif CJK KR', 'Noto Serif KR'],
  mono: ['Consolas', 'Menlo', 'DejaVu Sans Mono'],
};
// style="…" 속성 안에 들어가므로 글꼴 이름은 작은따옴표로 감싼다
const q = list => list.map(f => `'${f}'`).join(',');
const stack = role => q(FONTS[role]) + (role === 'mono' ? ',' + q(FONTS.sans) + ',monospace' : role === 'serif' ? ',serif' : ',sans-serif');

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const px = n => `${n}px`;
// 고정 시드 난수(같은 ID는 항상 같은 파형·서명·번짐)
function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }

// 글자 요소: class t + data-label/data-key 로 크기 검사 대상이 됨
// 등록번호가 두 줄로 갈라지지 않게(공백뿐 아니라 '-' 뒤에서도 줄이 바뀌므로 통째로 줄바꿈 금지)
const keepReg = s => esc(s).replace(/제 (\d{4}-\d{4}호)/g, '<span style="white-space:nowrap">제&nbsp;$1</span>');
const T = (label, value, style, key, extra = '') => `<div class="t" data-label="${esc(label)}" data-key="${key ? 1 : 0}" style="${style}" ${extra}>${keepReg(value)}</div>`;

function signature(seed, w = 150, h = 50) {
  const r = rng(seed); let d = `M 6 ${h * 0.6}`;
  for (let i = 1; i <= 7; i++) d += ` Q ${(i - 0.5) * w / 7} ${h * (0.1 + r() * 0.8)} ${i * w / 7 - 4} ${h * (0.3 + r() * 0.5)}`;
  return `<svg class="sig" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="#1d2a55" stroke-width="3" stroke-linecap="round"/></svg>`;
}
const smudge = (seed, w) => { const r = rng(seed); return `<div class="smudge">${[0, 1].map(() => `<i style="width:${Math.round(w * (0.45 + r() * 0.45))}px"></i>`).join('')}</div>`; };

// 색을 비율만큼 어둡게(f<1)/밝게(f>1)
const shade = (hex, f) => '#' + hex.replace('#', '').match(/../g).map(v => Math.max(0, Math.min(255, Math.round(parseInt(v, 16) * f))).toString(16).padStart(2, '0')).join('');
// 벽시계. st(선택, layout.clock에서 전달): face·rim·ink 색, shade(판 가장자리 명암), grain(미세 노이즈), shadow(벽 그림자), soft(흐림 px).
// st가 없으면 이전과 같은 모양으로 그린다.
function clockSvg(time, d, legible, st = {}) {
  const [h, m] = time.split(':').map(Number);
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6, c = d / 2;
  // 판독 불가(legible=false): 바늘·눈금 대비를 낮추고(dimInk) 3.5px 흐림 + 유리 반사 하이라이트로 확대해도 바늘 방향이 읽히지 않게 함(E02, F26)
  const dim = st.dimInk || '#a29d94';
  const face = st.face || '#f4efe4', rim = st.rim || '#4a3624', tick = legible ? (st.ink || '#222') : dim, hand = legible ? (st.ink || '#111') : dim;
  const ticks = Array.from({ length: 12 }, (_, i) => `<line x1="${c}" y1="${d * 0.07}" x2="${c}" y2="${d * 0.15}" stroke="${tick}" stroke-width="${d * 0.02}" transform="rotate(${i * 30} ${c} ${c})"/>`).join('');
  const glareDef = legible ? '' : `<radialGradient id="clk-glare" cx="40%" cy="45%" r="50%"><stop offset="0" stop-color="#fff6e1" stop-opacity=".85"/><stop offset=".45" stop-color="#fff0d7" stop-opacity=".45"/><stop offset=".75" stop-color="#fff0d7" stop-opacity="0"/></radialGradient>`;
  const glare = legible ? '' : `<ellipse cx="${d * 0.5}" cy="${d * 0.42}" rx="${d * 0.44}" ry="${d * 0.32}" fill="url(#clk-glare)"/>`;
  const defs = (st.shade || st.grain || !legible) ? `<defs>${st.shade ? `<radialGradient id="clk-face" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="${shade(face, 1.06)}"/><stop offset="1" stop-color="${shade(face, 0.82)}"/></radialGradient>` : ''}${st.grain ? `<filter id="clk-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceAlpha" operator="in"/></filter>` : ''}${glareDef}</defs>` : ''; // 노이즈를 원(시계판) 모양으로만 자름
  const filters = [legible ? (st.soft ? `blur(${st.soft}px)` : '') : 'blur(3.5px)', st.shadow ? 'drop-shadow(0 2px 2px #0007)' : ''].filter(Boolean).join(' ');
  const style = (filters ? `filter:${filters};` : '') + (legible ? '' : 'opacity:1');
  return `<svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}" style="${style}" data-clock="${esc(time)}">${defs}
<circle cx="${c}" cy="${c}" r="${c - 3}" fill="${st.shade ? 'url(#clk-face)' : face}" stroke="${rim}" stroke-width="${d * (st.rim ? 0.06 : 0.05)}"/>${ticks}
<line x1="${c}" y1="${c}" x2="${c}" y2="${d * 0.27}" stroke="${hand}" stroke-width="${d * 0.045}" stroke-linecap="round" transform="rotate(${ha} ${c} ${c})"/>
<line x1="${c}" y1="${c}" x2="${c}" y2="${d * 0.12}" stroke="${hand}" stroke-width="${d * 0.025}" stroke-linecap="round" transform="rotate(${ma} ${c} ${c})"/>
<circle cx="${c}" cy="${c}" r="${d * 0.03}" fill="${hand}"/>${glare}${st.grain ? `<circle cx="${c}" cy="${c}" r="${c - 3}" filter="url(#clk-grain)" opacity="${st.grain === true ? 0.14 : st.grain}" style="mix-blend-mode:multiply"/>` : ''}</svg>`;
}

function renderElement(e, item, common, o) {
  const txt = item.text, f = stack(e.font || 'sans');
  const box = `left:${px(e.x)};top:${px(e.y)};${e.w ? `width:${px(e.w)};` : ''}`;
  switch (e.type) {
    case 'text': {
      // 선택: cols(신문 단 나누기) + h(높이). 내용이 높이를 넘으면 단이 늘어나 가로 넘침 검사에 걸린다
      const cols = e.cols ? `height:${px(e.h)};column-count:${e.cols};column-gap:${px(e.colGap || 40)};column-fill:auto;` : '';
      return T(e.ref, txt[e.ref], `${box}${cols}font:${e.weight || 400} ${px(e.size)}/${e.lineHeight || 1.25} ${f};text-align:${e.align || 'left'};${e.color ? `color:${e.color};` : ''}`, e.key, 'data-fit="1"');
    }
    case 'smudges': // 판독 불가 흐린 인쇄 줄(글자 아님). 바탕 그림의 빈 칸을 채울 때
      return `<div style="${box}height:${px(e.h)};position:absolute;overflow:hidden;opacity:${e.opacity ?? 1}">${Array.from({ length: e.lines }, (_, i) => smudge(`${item.id}s${e.x}${i}`, e.w)).join('')}</div>`;
    case 'tone': // 사진 영역 색감 보정(예: 흑백). ink 밖에서 그려야 하므로 buildHtml에서 처리
      return '';
    case 'stamp':
      return `<div class="stamp" style="${box}width:${px(e.d)};height:${px(e.d)}">${T(e.ref, txt[e.ref], `position:static;font:700 ${px(e.size)} ${stack('serif')}`, false)}</div>`;
    case 'rows':
      return `<div class="rows" style="${box}row-gap:${px(e.gap)};grid-template-columns:${px(e.labelW)} 1fr">${txt[e.ref].map(([lab, val], i) => {
        const v = typeof val === 'string' ? T(`${e.ref}.${lab}`, val, `position:static;font:500 ${px(e.size)}/1.25 ${f}`, e.key, 'data-fit="1"')
          : val.redact ? `<div class="redact" style="height:${px(e.size * 1.1)}"></div>` : val.signature ? signature(item.id + i) : smudge(item.id + i, 400);
        return T(`${e.ref}.label`, lab, `position:static;font:400 ${px(e.labelSize)}/1.3 ${f};color:#333`, false) + `<div>${v}</div>`;
      }).join('')}</div>`;
    case 'grid': {
      let html = `<div class="grid" style="${box}grid-template-columns:${e.colW.map(px).join(' ')};grid-auto-rows:${px(e.rowH)}">`;
      html += txt[e.ref].map(c => `<div class="cell head">${T('columns', c, `position:static;font:700 ${px(e.size)} ${f}`, false)}</div>`).join('');
      for (let r = 0; r < e.rows; r++) for (let c = 0; c < e.colW.length; c++) {
        const cell = (e.cells || []).find(x => x.row === r && x.col === c);
        const inner = !cell ? smudge(`${item.id}${r}${c}`, e.colW[c] - 30)
          : cell.signature ? signature(item.id + 'sig', Math.min(140, e.colW[c] - 10), 46)
          : T(cell.ref, txt[cell.ref], `position:static;font:500 ${px(cell.size)}/1.2 ${f};color:#1d2a55`, cell.key, 'data-fit="1"');
        html += `<div class="cell">${inner}</div>`;
      }
      return html + '</div>';
    }
    case 'box':
      return o.sample ? `<div class="photo-ph" style="${box}height:${px(e.h)}">사진 자리 (바탕 그림)</div>` : '';
    case 'fragment':
      // 선택: transform(바닥에 놓인 종이의 원근 등, 샘플이 아닐 때만 rotate 대신 사용), blend(종이에 인쇄된 느낌으로 곱하기 합성)
      return `<div class="frag ${o.sample ? 'drawn' : ''}" style="${box}height:${px(e.h)};transform:${e.transform && !o.sample ? e.transform : `rotate(${e.rotate}deg)`};${e.blend && !o.sample ? 'mix-blend-mode:multiply;' : ''}${e.soft && !o.sample ? `filter:blur(${e.soft}px);opacity:.9;` : ''}">${T(e.ref, txt[e.ref], `position:static;font:700 ${px(e.size)} ${stack('serif')};color:${e.color || '#2b1d12'}`, e.key)}</div>`;
    case 'recorder': {
      const r = rng(item.id), [lm, ls] = txt.length.split(':').map(Number), [pm, ps] = txt.position.split(':').map(Number);
      const ratio = (pm * 60 + ps) / (lm * 60 + ls), bars = 56;
      const wave = Array.from({ length: bars }, (_, i) => `<i style="height:${Math.round(8 + r() * 150)}px;background:${i / bars < ratio ? '#ff5a4f' : '#5c6470'}"></i>`).join('');
      return `<div class="rec">
${T('app', txt.app, `position:static;font:700 ${px(e.app)} ${f};color:#fff;text-align:center`, false)}
<div class="rec-item">${T('title', txt.title, `position:static;font:700 ${px(e.title)} ${f};color:#fff`, true)}
<div class="rec-meta">${T('start', txt.start, `position:static;font:500 ${px(e.start)} ${f};color:#aab`, true)}${T('length', txt.length, `position:static;font:500 ${px(e.length)} ${f};color:#aab`, true)}</div></div>
<div class="wave">${wave}<b style="left:${(ratio * 100).toFixed(1)}%"></b></div>
<div class="bar"><span style="width:${(ratio * 100).toFixed(1)}%"></span></div>
<div class="rec-times">${T('position', txt.position, `position:static;font:500 ${px(e.position)} ${f};color:#fff`, true)}${T('length(끝)', txt.length, `position:static;font:500 ${px(e.position)} ${f};color:#aab`, true)}</div>
<div class="ctrl"><span class="pause"></span></div></div>`;
    }
    case 'nvr': {
      const u = common.nvr, m = stack('mono');
      return `<div class="nvr">
<div class="nvr-tl">${T('nvr.title', u.title, `position:static;font:500 ${px(e.title)} ${m}`, false)}${T('nvr.channel', u.channel, `position:static;font:500 ${px(e.channel)} ${m}`, false)}</div>
<div class="nvr-tr">${T('nvr.rec', u.rec, `position:static;font:600 ${px(e.rec)} ${m}`, false)}${e.zoomRef && txt[e.zoomRef] ? T('zoom', txt[e.zoomRef], `position:static;font:500 ${px(e.zoom)} ${m}`, false) : ''}</div>
<div class="nvr-bl">${T('nvr.codec', u.codec, `position:static;font:500 ${px(e.codec)} ${m}`, false)}</div>
<div class="nvr-br">${T('time', txt.time, `position:static;font:600 ${px(e.time)} ${m};letter-spacing:2px`, true)}</div>
<i class="cn a"></i><i class="cn b"></i><i class="cn c"></i><i class="cn d"></i></div>`;
    }
    case 'chat':
      return `<div class="chat-head" style="height:${px(e.header)}"><span class="back">‹</span><div>${T('sender', txt.sender, `position:static;font:700 ${px(e.sender)} ${f};color:#fff`, true)}${T('sent_time', txt.sent_time, `position:static;font:500 ${px(e.time)} ${f};color:#c9ced8`, true)}</div></div>`;
  }
  throw new Error('알 수 없는 요소 종류: ' + e.type);
}

const CSS = `*{box-sizing:border-box;margin:0}html,body{background:#000;overflow:hidden}
#canvas{position:relative;overflow:hidden;background:#111}#base{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.t{position:absolute;white-space:pre-wrap;word-break:keep-all}
.sheet{position:absolute;transform-origin:50% 50%}.sheet .ink{mix-blend-mode:multiply}
.paper-copy{background:#efefeb;box-shadow:0 10px 40px #0009;background-image:radial-gradient(#0000000d 1px,transparent 1.5px);background-size:7px 7px}
.paper-old{background:#e6d9b8;box-shadow:0 10px 40px #0009;background-image:radial-gradient(circle at 80% 30%,#a0784020,transparent 40%),radial-gradient(circle at 20% 80%,#80603030,transparent 35%)}
.paper-news{background:#e9dfc2;box-shadow:0 10px 40px #0009}
.stamp{position:absolute;border:6px solid #b3261e;border-radius:50%;display:grid;place-items:center;color:#b3261e;opacity:.8;transform:rotate(-14deg)}.stamp .t{color:#b3261e}
.rows{position:absolute;display:grid;column-gap:20px;align-items:center;color:#111}
.redact{background:#0b0b0b;width:330px;border-radius:3px}
.grid{position:absolute;display:grid;border-top:2px solid #6b5a3e;border-left:2px solid #6b5a3e}
.cell{border-right:2px solid #6b5a3e;border-bottom:2px solid #6b5a3e;padding:6px 12px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}.cell.head{justify-content:center;align-items:center}
.smudge i{display:block;height:13px;margin:12px 0;background:#4a4a5a;border-radius:6px;filter:blur(5px);opacity:.45}
.photo-ph{position:absolute;background:repeating-linear-gradient(45deg,#8a8578,#8a8578 12px,#9a9588 12px,#9a9588 24px);display:grid;place-items:center;color:#2228;font:600 30px sans-serif}
.frag{position:absolute;display:grid;place-items:center;-webkit-mask-image:radial-gradient(ellipse 62% 70% at 50% 50%,#000 58%,transparent 92%)}
.frag.drawn{background:#d8c9a6;clip-path:polygon(4% 18%,30% 0,62% 8%,96% 2%,100% 60%,86% 100%,40% 92%,8% 100%,0 55%);box-shadow:inset 0 0 50px 18px #1a0f07}
.phone{position:absolute;border-radius:58px;padding:22px}.phone.drawn{background:#16181d;box-shadow:0 30px 60px #000c,inset 0 0 0 3px #2c2f36}
.rec{height:100%;border-radius:40px;background:#0f1115;padding:40px 30px;display:flex;flex-direction:column;gap:30px;color:#fff}
.rec-item{border-bottom:1px solid #2a2e36;padding:18px 0 22px}.rec-meta{display:flex;justify-content:space-between;margin-top:10px}
.wave{position:relative;height:220px;display:flex;align-items:center;gap:3px;margin-top:30px}.wave i{flex:1;border-radius:3px}.wave b{position:absolute;top:-12px;bottom:-12px;width:3px;background:#ff5a4f}
.bar{height:8px;border-radius:4px;background:#2c313a}.bar span{display:block;height:100%;border-radius:4px;background:#ff5a4f}
.rec-times{display:flex;justify-content:space-between}.ctrl{display:grid;place-items:center;margin-top:auto}
.pause{width:120px;height:120px;border-radius:50%;background:#ff5a4f;position:relative}.pause:before,.pause:after{content:"";position:absolute;top:36px;width:14px;height:48px;background:#fff;border-radius:3px;left:40px}.pause:after{left:66px}
.nvr{position:absolute;inset:0;color:#f2f2f2;text-shadow:0 0 4px #000,0 0 2px #000}
.nvr-tl{position:absolute;left:44px;top:40px;border:2px solid #f2f2f2cc;padding:8px 18px;background:#0006}.nvr-tl .t:first-child{border-bottom:2px solid #f2f2f2aa;padding-bottom:6px;margin-bottom:6px}
.nvr-tr{position:absolute;right:56px;top:44px;text-align:right}.nvr-tr .t:first-child{color:#ff3b30}
.nvr-bl{position:absolute;left:56px;bottom:44px}.nvr-br{position:absolute;right:56px;bottom:40px;border:2px solid #f2f2f2cc;padding:6px 22px;background:#0006}
.cn{position:absolute;width:60px;height:60px;border:3px solid #f2f2f2cc}.cn.a{left:18px;top:18px;border-right:0;border-bottom:0}.cn.b{right:18px;top:18px;border-left:0;border-bottom:0}.cn.c{left:18px;bottom:18px;border-right:0;border-top:0}.cn.d{right:18px;bottom:18px;border-left:0;border-top:0}
.cctv #base,.cctv .clock-layer{filter:saturate(.55) contrast(1.05) brightness(.8)}.cctv:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff08 0 2px,transparent 2px 4px);pointer-events:none}
.chat-head{position:absolute;left:0;right:0;top:0;background:#14161b;display:flex;align-items:center;gap:28px;padding:0 40px;border-bottom:1px solid #2a2e36}.chat-head .back{color:#fff;font:300 80px sans-serif;margin-top:-12px}
.chat-photo{position:absolute;left:0;right:0;bottom:0;background:#000}.chat-photo img{width:100%;height:100%;object-fit:contain}
#sample-mark{position:fixed;right:10px;top:50%;transform:rotate(90deg);transform-origin:100% 0;font:700 22px sans-serif;color:#ff3b30;background:#fff;padding:4px 10px;opacity:.85}`;

// w×h 상자를 사각형 quad([[x,y]×4], 좌상·우상·우하·좌하)로 보내는 원근 변환(CSS matrix3d)
function quadMatrix(w, h, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (dx3 * dy2 - dx2 * dy3) / den, k = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map(v => +v.toFixed(8)).join(',')})`;
}

// 템플릿별 HTML 조립
function buildHtml(item, layout, common, o) {
  const [W, H] = item.size;
  const els = layout.elements.map(e => renderElement(e, item, common, o)).join('');
  let body;
  if (item.template === 'document') {
    const s = layout.sheet, drawn = o.sample || s.draw;
    // tone: 바탕 그림 사본에 filter를 걸고 quad(캔버스 좌표, 좌상·우상·우하·좌하) 영역만 잘라 덮는다. 샘플에는 사진이 없으므로 생략
    const tones = o.sample ? '' : layout.elements.filter(e => e.type === 'tone').map(e => `<img src="${o.baseUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${e.filter};clip-path:polygon(${e.quad.map(([x, y]) => `${px(x)} ${px(y)}`).join(',')})">`).join('');
    body = `<img id="base" src="${o.baseUrl}">${tones}<div class="sheet ${drawn ? 'paper-' + s.paper : ''}" style="left:${px(s.x)};top:${px(s.y)};width:${px(s.w)};height:${px(s.h)};transform:rotate(${s.rotate}deg)"><div class="ink" id="overlay" style="position:absolute;inset:0">${els}</div></div>`;
  } else if (item.template === 'phone-recorder') {
    const p = layout.phone;
    // 선택: quad(화면 네 모서리 [좌상, 우상, 우하, 좌하]) → 원근에 맞춰 matrix3d로 변형. 샘플은 평면 배치
    const pos = p.quad && !o.sample ? `left:0;top:0;width:${px(p.w)};height:${px(p.h)};transform-origin:0 0;transform:${quadMatrix(p.w, p.h, p.quad)}`
      : `left:${px(p.x)};top:${px(p.y)};width:${px(p.w)};height:${px(p.h)}`;
    body = `<img id="base" src="${o.baseUrl}"><div class="phone ${o.sample || p.draw ? 'drawn' : ''}" style="${pos}" id="overlay">${els}</div>`;
  } else if (item.template === 'chat-photo') {
    const head = layout.elements[0].header;
    body = `<div class="chat-photo" style="top:${px(head)}"><img id="base" src="${o.baseUrl}" style="position:static"></div><div id="overlay">${els}</div>`;
  } else {
    const c = o.clock || layout.clock, clock = (o.drawClock && c) ? `<div class="clock-layer" style="position:absolute;left:${px(c.x)};top:${px(c.y)}">${clockSvg(item.wall_clock, c.d, item.wall_clock_legible, c)}</div>` : '';
    body = `<img id="base" src="${o.baseUrl}">${clock}<div id="overlay">${els}</div>`;
  }
  const cls = item.template === 'nvr' && (o.sample || o.cctvFilter) ? 'cctv' : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div id="canvas" class="${cls}" style="width:${px(W)};height:${px(H)}">${body}</div>${o.sample ? '<div id="sample-mark">SAMPLE · 게임용 아님</div>' : ''}</body></html>`;
}

module.exports = { buildHtml, FONTS };
