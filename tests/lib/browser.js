// 헤드리스 Chrome/Edge를 Chrome DevTools Protocol(CDP)로 조종하는 최소 도우미.
// 외부 패키지 없이 Node 22+ 내장 기능(fetch, WebSocket, http)만 사용한다.
// 브라우저 경로: 환경변수 CHROME_PATH 가 있으면 우선 사용하고, 없으면 OS별 기본 설치 경로를 찾는다.
'use strict';
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

function findChrome() {
  const env = process.env.CHROME_PATH;
  if (env && fs.existsSync(env)) return env;
  const pf = process.env.PROGRAMFILES || 'C:\\Program Files', pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', local = process.env.LOCALAPPDATA || '';
  const candidates = {
    win32: [path.join(pf, 'Google/Chrome/Application/chrome.exe'), path.join(pf86, 'Google/Chrome/Application/chrome.exe'), path.join(local, 'Google/Chrome/Application/chrome.exe'),
      path.join(pf86, 'Microsoft/Edge/Application/msedge.exe'), path.join(pf, 'Microsoft/Edge/Application/msedge.exe')],
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium'],
    linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'],
  }[process.platform] || [];
  const found = candidates.find(p => p && fs.existsSync(p));
  if (!found) throw new Error('Chrome/Edge를 찾지 못했습니다. 환경변수 CHROME_PATH 에 브라우저 실행 파일 경로를 지정해 주세요.');
  return found;
}

// 프로젝트 루트를 서비스하는 정적 서버(포트 자동 할당). Vercel cleanUrls 와 무관하게 .html 경로로 접근한다.
function startServer(root = PROJECT_ROOT) {
  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(root, rel);
    // 경로 탈출 방지 + 대소문자 정확 일치(Vercel/Linux 와 동일하게 대소문자 불일치를 404 처리)
    const relNorm = path.relative(root, file);
    if (relNorm.startsWith('..') || !exactExists(root, relNorm)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(r => server.close(r)) })));
}
function exactExists(root, rel) {
  let dir = root;
  for (const part of rel.split(path.sep)) { let names; try { names = fs.readdirSync(dir); } catch { return false; } if (!names.includes(part)) return false; dir = path.join(dir, part); }
  return fs.statSync(dir).isFile();
}

// 페이지 안에서 쓰는 QA 도우미(모든 문서에 자동 주입)
const PAGE_HELPERS = `window.__qa={
  el(act,id){return [...document.querySelectorAll('[data-action],[data-act]')].find(e=>(e.dataset.action??e.dataset.act)===act&&(id==null||e.dataset.id===id));},
  click(act,id){const e=this.el(act,id);if(!e)throw new Error('버튼 없음: '+act+(id!=null?':'+id:''));if(e.disabled)throw new Error('비활성 버튼: '+act+':'+id);e.click();return true;},
  has(act,id){const e=this.el(act,id);return !!e&&!e.disabled;},
  set(sel,v){const e=document.querySelector(sel);if(!e)throw new Error('입력칸 없음: '+sel);if(e.type==='radio'||e.type==='checkbox')e.checked=true;else e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}));return true;},
  next(){return document.querySelector('[data-action="next"],[data-action="dialogue-next"],[data-act="next"]');},
  loading(){const n=this.next();return (n&&n.disabled)||/장면을 준비 중/.test(document.body.innerText);}
};`;

async function launch({ width = 1365, height = 900, mobile = false } = {}) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ggh-qa-'));
  const proc = spawn(findChrome(), ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let port;
  for (let i = 0; i < 100 && !port; i++) { try { port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim(); } catch {} if (!port) await sleep(100); }
  if (!port) { proc.kill(); throw new Error('브라우저 디버깅 포트를 열지 못했습니다.'); }
  let target;
  for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page'); } catch {} if (!target) await sleep(100); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let seq = 0; const pending = new Map(); const problems = [];
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
    const p = m.params || {};
    if (m.method === 'Runtime.exceptionThrown') problems.push('JS 예외: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text).split('\n')[0]);
    if (m.method === 'Runtime.consoleAPICalled' && p.type === 'error') problems.push('console.error: ' + p.args.map(a => a.value ?? a.description).join(' '));
    if (m.method === 'Network.responseReceived' && p.response.status >= 400 && !/favicon\.ico$/.test(p.response.url)) problems.push(`HTTP ${p.response.status}: ${p.response.url}`);
    if (m.method === 'Network.loadingFailed' && !p.canceled && p.type !== 'Other') problems.push(`로드 실패(${p.errorText}): ${p.type}`);
  };
  const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: PAGE_HELPERS });
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
  if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true });

  const page = {
    problems, width, mobile,
    async ev(expr) {
      const r = (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result;
      if (r.exceptionDetails) throw new Error('페이지 평가 오류: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).split('\n')[0]);
      return r.result.value;
    },
    async go(url) { await send('Page.navigate', { url }); await page.waitFor('document.readyState==="complete"'); await sleep(250); },
    async reload() { await send('Page.reload', { ignoreCache: true }); await sleep(300); await page.waitFor('document.readyState==="complete"'); await sleep(250); },
    async waitFor(expr, ms = 8000) { const t = Date.now(); while (Date.now() - t < ms) { try { if (await page.ev(`!!(${expr})`)) return true; } catch {} await sleep(60); } throw new Error('대기 시간 초과: ' + expr); },
    async click(act, id) { await page.ev(`__qa.click(${JSON.stringify(act)},${id == null ? 'undefined' : JSON.stringify(id)})`); await sleep(120); },
    async set(sel, v) { await page.ev(`__qa.set(${JSON.stringify(sel)},${JSON.stringify(v)})`); await sleep(80); },
    async clickLink(href) { await page.ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>a.getAttribute('href')===${JSON.stringify(href)});if(!a)throw new Error('링크 없음: ${href}');a.click();return 1})()`); await sleep(300); await page.waitFor(`location.pathname.endsWith(${JSON.stringify('/' + href)})&&document.readyState==="complete"`); await sleep(250); },
    text: () => page.ev('document.body.innerText'),
    // 실제 마우스(터치 에뮬레이션 시 탭) 입력으로 요소 중앙을 클릭 — 다른 요소에 가려지면 그 요소가 클릭된다
    // { noScroll: true } 이면 스크롤하지 않고 현재 화면 위치 그대로 클릭(스크롤 동작 검사용, 화면 밖이면 오류)
    async realClick(selector, { noScroll = false } = {}) {
      const c = await page.ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)return null;${noScroll ? '' : "e.scrollIntoView({block:'center'});"}const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,vis:r.bottom>0&&r.top<innerHeight&&r.left+r.width/2>0&&r.left+r.width/2<innerWidth}})()`);
      if (!c) throw new Error('요소 없음: ' + selector);
      if (!c.vis) throw new Error('화면 밖 요소: ' + selector);
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
      await sleep(200);
    },
    async key(key) { for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key, code: key, windowsVirtualKeyCode: key === 'Escape' ? 27 : key === 'Enter' ? 13 : 0 }); await sleep(150); },
    // 대화를 끝까지 넘기며 줄마다 화자·초상화 로드 상태를 기록
    async drain(max = 80) {
      const lines = [];
      for (let i = 0; i < max; i++) {
        await sleep(90);
        const s = await page.ev(`(()=>{const n=__qa.next();if(!n)return {state:__qa.loading()?'loading':'done'};if(n.disabled)return {state:'loading'};
          const img=document.querySelector('.dialogue-view img,.char-portrait');const sp=document.querySelector('.speaker,.speaker-name');
          return {state:'line',speaker:sp?sp.textContent.trim():'내레이션',src:img?img.getAttribute('src'):null,loaded:img?(img.complete&&img.naturalWidth>0):null}})()`);
        if (s.state === 'done') return lines;
        if (s.state === 'loading') continue;
        lines.push(s);
        await page.ev('__qa.next().click()');
      }
      throw new Error('대화가 끝나지 않음');
    },
    cdp: (method, params) => send(method, params), // 저수준 CDP 호출(마우스 누름 유지 등 재현용)
    async shot(file, clip) { const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); },
    noHScroll: () => page.ev('document.documentElement.scrollWidth<=window.innerWidth+1'),
    // 지연 로딩 이미지까지 불러온 뒤 깨진 <img> 목록 반환
    async brokenImages() {
      await page.ev('(async()=>{for(const i of document.images)i.loading="eager";window.scrollTo(0,document.body.scrollHeight);await new Promise(r=>setTimeout(r,400));window.scrollTo(0,0);await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));return 1})()');
      return page.ev('[...document.images].filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.getAttribute("src"))');
    },
    async setStorage(origin, obj, clear = true) {
      await page.go(origin + '/index.html');
      await page.ev(`(()=>{${clear ? 'localStorage.clear();' : ''}${Object.entries(obj).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(JSON.stringify(v))});`).join('')}return 1})()`);
    },
    async close() { try { ws.close(); } catch {} proc.kill(); await sleep(300); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} },
  };
  return page;
}

// 아주 작은 테스트 러너
function reporter(title) {
  let pass = 0, fail = 0; const failures = [];
  console.log(`\n=== ${title} ===`);
  return {
    ok(cond, msg) { if (cond) { pass++; console.log('  PASS', msg); } else { fail++; failures.push(msg); console.log('  FAIL', msg); } return !!cond; },
    section(name) { console.log(`\n[${name}]`); },
    done() { console.log(`\n결과(${title}): PASS ${pass} / FAIL ${fail}`); if (failures.length) console.log('실패 목록:\n - ' + failures.join('\n - ')); return { pass, fail }; },
  };
}

module.exports = { PROJECT_ROOT, findChrome, startServer, launch, reporter, sleep };
