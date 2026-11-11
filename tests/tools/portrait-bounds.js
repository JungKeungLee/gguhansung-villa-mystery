// 캐릭터 WebP의 실제 인물 영역(불투명 픽셀 경계)을 측정하는 분석 도구.
// 실행: node tests/tools/portrait-bounds.js   (Chrome/Edge 필요, CHROME_PATH 로 지정 가능)
'use strict';
const fs = require('fs'), path = require('path');
const { PROJECT_ROOT, startServer, launch } = require('../lib/browser');

(async () => {
  const server = await startServer();
  const page = await launch();
  await page.go(server.origin + '/index.html');
  const base = path.join(PROJECT_ROOT, 'assets/characters');
  const files = [];
  for (const dir of fs.readdirSync(base).sort()) {
    const d = path.join(base, dir);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).sort()) if (f.endsWith('.webp')) files.push(`assets/characters/${dir}/${f}`);
  }
  const rows = await page.ev(`(async()=>{const out=[];for(const src of ${JSON.stringify(files)}){
    const img=new Image();img.src=src;await img.decode();const w=img.naturalWidth,h=img.naturalHeight;
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,w,h).data;
    let l=w,t=h,r=-1,b=-1,transparent=0;
    for(let y=0;y<h;y++)for(let i=0;i<w;i++){const a=d[(y*w+i)*4+3];if(a<255)transparent++;if(a>16){if(i<l)l=i;if(i>r)r=i;if(y<t)t=y;if(y>b)b=y;}}
    out.push({src,w,h,alpha:transparent>0,l,t,r,b});}return out;})()`);
  console.log('파일'.padEnd(46), '원본크기', '알파', '  인물영역(px)            ', '가로%    세로%    아래여백%');
  for (const r of rows) {
    const pct = (a, b, n) => `${(a / n * 100).toFixed(1)}~${(b / n * 100).toFixed(1)}`;
    console.log(r.src.replace('assets/characters/', '').padEnd(46), `${r.w}x${r.h}`.padEnd(8), r.alpha ? 'O ' : 'X ',
      `x${r.l}-${r.r} y${r.t}-${r.b}`.padEnd(26), pct(r.l, r.r + 1, r.w).padEnd(12), pct(r.t, r.b + 1, r.h).padEnd(12), ((1 - (r.b + 1) / r.h) * 100).toFixed(1));
  }
  if (process.argv.includes('--json')) fs.writeFileSync(process.argv[process.argv.indexOf('--json') + 1], JSON.stringify(rows, null, 1));
  await page.close(); await server.close();
})().catch(e => { console.error(e); process.exit(2); });
