// 헤드리스 Chrome으로 템플릿을 그려 WebP로 저장한다. 브라우저 제어는 기존 테스트 도구(tests/lib/browser.js)를 그대로 쓴다.
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { launch } = require('../../../tests/lib/browser');
const { buildHtml, FONTS } = require('./templates');
const { sha256 } = require('./image');

// 페이지 안에서: 글자 목록, 글꼴 사용 가능 여부, 글자 크기, 캔버스 밖으로 나간 글자
const PROBE = fonts => `(async()=>{
  await document.fonts.ready;
  await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
  const broken=[...document.images].filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.src);
  const c=document.createElement('canvas').getContext('2d');
  const avail=(name,sample)=>['monospace','serif','sans-serif'].some(g=>{c.font='40px '+g;const a=c.measureText(sample).width;c.font='40px "'+name+'",'+g;return c.measureText(sample).width!==a;});
  const F=${JSON.stringify(fonts)},fonts=[];
  const used=new Set([...document.querySelectorAll('#canvas .t')].map(e=>getComputedStyle(e).fontFamily.replace(/["']/g,'')));
  for(const [role,list] of Object.entries(F)){if(![...used].some(u=>u.startsWith(list[0])))continue;
    const sample=role==='mono'?'REC 22:34:13 H.264':'가나다 제 2015-0387호';const hit=list.find(n=>avail(n,sample));fonts.push({role,used:hit||null,ok:!!hit});}
  const cv=document.getElementById('canvas').getBoundingClientRect(),overflow=[],metrics=[];
  for(const e of document.querySelectorAll('#canvas .t')){const r=e.getBoundingClientRect();
    if(r.left<cv.left-1||r.top<cv.top-1||r.right>cv.right+1||r.bottom>cv.bottom+1)overflow.push(e.dataset.label);
    if(e.dataset.fit&&e.scrollWidth>e.clientWidth+1)overflow.push(e.dataset.label+'(가로)');
    metrics.push({label:e.dataset.label,key:e.dataset.key==='1',size:parseFloat(getComputedStyle(e).fontSize)});}
  // 글자끼리 겹침(작은 쪽 면적의 5% 넘게 겹치면 문제로 봄). 종이·조각의 회전에 영향받지 않도록 회전 전 배치 좌표로 비교
  const box=e=>{let x=0,y=0,n=e;while(n&&n.id!=='canvas'){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}return {left:x,top:y,right:x+e.offsetWidth,bottom:y+e.offsetHeight,width:e.offsetWidth,height:e.offsetHeight};};
  const ts=[...document.querySelectorAll('#canvas .t')].map(e=>({l:e.dataset.label,r:box(e)})),overlaps=[];
  for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length;j++){const a=ts[i].r,b=ts[j].r;
    const w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
    if(w>0&&h>0&&w*h>0.05*Math.min(a.width*a.height,b.width*b.height))overlaps.push(ts[i].l+' ↔ '+ts[j].l);}
  const text=[...document.querySelectorAll('#canvas .t')].map(e=>e.textContent).join('\\n');
  return {text,fonts,metrics,overflow,overlaps,broken};
})()`;

async function render(item, layout, common, { base, outFile, sample = false, drawClock = false, cctvFilter = false, clock }) {
  const baseAbs = path.resolve(base);
  if (!fs.existsSync(baseAbs)) throw new Error('입력 이미지가 없습니다: ' + base);
  const baseHashBefore = sha256(baseAbs);
  const [W, H] = item.size;
  const html = buildHtml(item, layout, common, { baseUrl: pathToFileURL(baseAbs).href, sample, drawClock, cctvFilter, clock });
  const workDir = path.join(path.dirname(outFile), '_html');
  fs.mkdirSync(workDir, { recursive: true });
  const htmlFile = path.join(workDir, path.basename(outFile).replace(/\.webp$/, '.html'));
  fs.writeFileSync(htmlFile, html);
  const page = await launch({ width: W, height: H });
  try {
    await page.go(pathToFileURL(htmlFile).href);
    const probe = await page.ev(PROBE(FONTS));
    if (probe.broken.length) throw new Error('이미지를 불러오지 못했습니다: ' + probe.broken.join(', '));
    const shot = await page.cdp('Page.captureScreenshot', { format: 'webp', quality: 92, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
    if (!shot.result || !shot.result.data) throw new Error('스크린샷 실패: ' + JSON.stringify(shot.error || shot));
    fs.writeFileSync(outFile, Buffer.from(shot.result.data, 'base64'));
    return { ...probe, output: outFile, html: htmlFile, base: baseAbs, baseHashBefore, baseHashAfter: sha256(baseAbs) };
  } finally { await page.close(); }
}

// 샘플용 바탕 그림(나무 탁자 질감)을 PNG로 만든다. 실제 제작에서는 AI가 만든 바탕 그림을 쓴다.
async function makeSampleBase(file, [W, H]) {
  const page = await launch({ width: W, height: H });
  try {
    await page.go('data:text/html,' + encodeURIComponent(`<body style="margin:0;width:${W}px;height:${H}px;background:
      radial-gradient(ellipse at 50% 40%,#5a3d27 0%,#2a1a10 70%,#140c07 100%),repeating-linear-gradient(90deg,#0000 0 40px,#00000018 40px 43px)"></body>`));
    const shot = await page.cdp('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  } finally { await page.close(); }
}

module.exports = { render, makeSampleBase };
