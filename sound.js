// 꾸한성 미스터리 공통 사운드(메인·챕터 1~5·엔딩). 외부 음원 파일 없이 Web Audio로 직접 합성한다(저작권·라이선스 문제 없음).
// - 브라우저 자동 재생 정책: 첫 클릭·터치·키 입력 뒤에 오디오를 시작한다(페이지마다 1회 필요할 수 있음)
// - 설정(localStorage 'gguhansung-sound-v1'): bgm·sfx 켜짐 여부, 전체 음량 0~100
// - 효과음은 클릭한 버튼의 동작 이름과, 클릭 직후 저장 데이터의 변화(증거 획득·검증·정전·문 열림·엔딩)로 고른다
//   → 게임 로직·저장 형식은 건드리지 않는다. 오디오를 쓸 수 없는 환경이면 아무것도 하지 않고 게임은 그대로 진행된다
(function () {
  'use strict';
  if (window.SOUND) return;
  const SET_KEY = 'gguhansung-sound-v1';
  const SAVE_KEYS = { ch1: 'gguhansung-fog-villa-save-v2', ch2: 'gguhansung-fog-villa-ch2-v1', ch3: 'gguhansung-fog-villa-ch3-v1', ch4: 'gguhansung-fog-villa-ch4-v1', ch5: 'gguhansung-fog-villa-ch5-v1' };
  const readJson = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  let settings = Object.assign({ bgm: true, sfx: true, vol: 60 }, readJson(SET_KEY) || {});
  const saveSettings = () => { try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch (e) {} };

  // ── 페이지·분위기 판단 ──
  const page = (() => { const m = location.pathname.match(/chapter([2-5])/); return m ? 'ch' + m[1] : 'ch1'; })();
  function currentMood() {
    if (page === 'ch1') return document.querySelector('.landing') ? 'title' : 'ch1';
    if (page === 'ch5') { const s = readJson(SAVE_KEYS.ch5); if (s && s.ending && ['bad', 'normal', 'true'].includes(s.ending)) return s.ending; }
    return page;
  }
  // 분위기: 템포(BPM), 으뜸음(MIDI), 음계, 화음 진행(음계 도수), 패턴, 비(빗소리 배경)
  const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10], PHR = [0, 1, 3, 5, 7, 8, 10];
  const MOODS = {
    title:  { bpm: 64, root: 57, scale: MIN, prog: [0, 5, 3, 4], arp: 'slow', pad: 0.05, bass: false, lead: 0.35, rain: false },
    ch1:    { bpm: 84, root: 53, scale: MAJ, prog: [0, 3, 4, 0, 5, 3, 1, 4], arp: 'warm', pad: 0.06, bass: true, lead: 0.3, rain: false },
    ch2:    { bpm: 70, root: 50, scale: MIN, prog: [0, 5, 3, 6], arp: 'sparse', pad: 0.06, bass: true, lead: 0.2, rain: true },
    ch3:    { bpm: 90, root: 52, scale: PHR, prog: [0, 1, 0, 6], arp: 'pulse', pad: 0.07, bass: true, lead: 0.15, rain: true },
    ch4:    { bpm: 108, root: 48, scale: MIN, prog: [0, 5, 6, 4], arp: 'drive', pad: 0.06, bass: true, lead: 0.15, rain: true },
    ch5:    { bpm: 96, root: 55, scale: MIN, prog: [0, 3, 5, 4], arp: 'pulse', pad: 0.07, bass: true, lead: 0.2, rain: true },
    bad:    { bpm: 54, root: 47, scale: MIN, prog: [0, 5, 3, 0], arp: 'sparse', pad: 0.08, bass: true, lead: 0.1, rain: true },
    normal: { bpm: 72, root: 48, scale: MAJ, prog: [0, 5, 3, 4], arp: 'slow', pad: 0.05, bass: true, lead: 0.2, rain: false },
    true:   { bpm: 76, root: 50, scale: MAJ, prog: [0, 4, 5, 3, 0, 4, 3, 4], arp: 'warm', pad: 0.06, bass: true, lead: 0.4, rain: false },
  };

  // ── 오디오 그래프(첫 사용자 입력 뒤에 생성) ──
  let ctx = null, master, bgmBus, sfxBus, track = null, rain = null, mood = null, timer = null, noiseBuf = null;
  const log = []; let active = 0; const lastAt = {};
  const now = () => (ctx ? ctx.currentTime : 0);
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return !!ctx; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    try { ctx = new AC(); } catch (e) { ctx = null; return false; }
    const comp = ctx.createDynamicsCompressor(); comp.connect(ctx.destination);
    master = ctx.createGain(); master.connect(comp);
    bgmBus = ctx.createGain(); bgmBus.connect(master); sfxBus = ctx.createGain(); sfxBus.connect(master);
    // 간단한 공간감(지연 되먹임)
    const dl = ctx.createDelay(1); dl.delayTime.value = 0.32; const fb = ctx.createGain(); fb.gain.value = 0.28; const wet = ctx.createGain(); wet.gain.value = 0.22;
    bgmBus.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // iOS Safari: 무음 버퍼를 한 번 재생해 오디오를 연다
    try { const b = ctx.createBufferSource(); b.buffer = ctx.createBuffer(1, 1, 22050); b.connect(ctx.destination); b.start(0); } catch (e) {}
    applySettings(true); return true;
  }
  function applySettings(instant) {
    if (!ctx) return; const t = now(), r = instant ? 0.01 : 0.25;
    master.gain.setTargetAtTime(Math.max(0, Math.min(1, settings.vol / 100)) * 0.9, t, r);
    bgmBus.gain.setTargetAtTime(settings.bgm ? 0.55 : 0, t, r);
    sfxBus.gain.setTargetAtTime(settings.sfx ? 0.9 : 0, t, r);
  }

  // ── 악기(합성) ──
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function piano(out, m, t, vel, dur) {
    const g = ctx.createGain(); g.connect(out); env(g, t, 0.008, vel, dur);
    [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(([h, type, amp]) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = mtof(m) * h; og.gain.value = amp; o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 0.1); });
  }
  function pad(out, notes, t, len, vol) {
    const g = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; f.connect(g); g.connect(out);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + len * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + len * 1.05);
    notes.forEach(m => [-6, 6].forEach(det => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det; o.connect(f); o.start(t); o.stop(t + len * 1.1); }));
  }
  function bass(out, m, t, dur, vol) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = mtof(m); o.connect(g); g.connect(out); env(g, t, 0.01, vol, dur); o.start(t); o.stop(t + dur + 0.05); }
  function noise(out, t, dur, type, freq, vol, q) { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; s.loop = true; f.type = type; f.frequency.value = freq; if (q) f.Q.value = q; s.connect(f); f.connect(g); g.connect(out); env(g, t, Math.min(0.02, dur / 4), vol, dur); s.start(t, Math.random()); s.stop(t + dur + 0.05); return { f, g }; }

  // ── 배경음악 스케줄러(16분음표 단위로 0.25초 앞까지 예약) ──
  let rng = 1; const rand = () => { rng = (rng * 16807) % 2147483647; return rng / 2147483647; };
  function chordOf(M, deg) { const sc = M.scale, n = i => M.root + sc[((deg + i) % 7 + 7) % 7] + 12 * Math.floor((deg + i) / 7); return [n(0), n(2), n(4)]; }
  function startTrack(name) {
    const M = MOODS[name]; if (!M || !ctx) return;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(bgmBus); g.gain.setTargetAtTime(1, now(), 0.8);
    const tr = { name, M, g, step: 0, next: now() + 0.1, alive: true }; rng = name.length * 7919 + 13;
    if (track) stopTrack(track); track = tr;
  }
  function stopTrack(tr) { tr.alive = false; tr.g.gain.setTargetAtTime(0.0001, now(), 0.5); setTimeout(() => { try { tr.g.disconnect(); } catch (e) {} }, 3000); }
  function schedule() {
    if (!ctx || !track || !track.alive || !settings.bgm) return;
    const tr = track, M = tr.M, s16 = 60 / M.bpm / 4;
    while (tr.next < now() + 0.25) {
      const t = tr.next, st = tr.step, bar = Math.floor(st / 16), pos = st % 16, deg = M.prog[bar % M.prog.length], ch = chordOf(M, deg);
      if (pos === 0) { pad(tr.g, ch.map(m => m - 12), t, s16 * 16, M.pad); if (M.bass) bass(tr.g, ch[0] - 24, t, s16 * 6, 0.16); }
      if (M.bass && (M.arp === 'drive' ? pos % 2 === 0 : M.arp === 'pulse' ? pos % 4 === 0 : pos === 8)) bass(tr.g, ch[0] - 24 + (M.arp === 'drive' && pos % 4 === 2 ? 12 : 0), t, s16 * 1.6, M.arp === 'drive' ? 0.11 : 0.13);
      const arpHit = { slow: pos % 4 === 0, warm: pos % 2 === 0, sparse: pos % 4 === 0 && rand() < 0.6, pulse: pos % 2 === 0 && rand() < 0.75, drive: pos % 2 === 0 }[M.arp];
      if (arpHit) piano(tr.g, ch[(pos / 2) % 3 | 0] + (pos >= 8 ? 12 : 0), t, M.arp === 'drive' ? 0.07 : 0.09, M.arp === 'slow' ? 1.6 : 0.8);
      if (M.lead && pos % 8 === 4 && rand() < M.lead) piano(tr.g, M.root + 12 + M.scale[(deg + [0, 2, 4, 6][rand() * 4 | 0]) % 7], t, 0.11, 1.4);
      tr.next += s16; tr.step++;
    }
  }
  function setRain(on) {
    if (!ctx) return;
    if (on && !rain) { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; s.loop = true; f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.5; s.connect(f); f.connect(g); g.connect(sfxBus); g.gain.value = 0.0001; g.gain.setTargetAtTime(0.035, now(), 1.5); s.start(); rain = { s, g }; }
    if (!on && rain) { const r = rain; rain = null; r.g.gain.setTargetAtTime(0.0001, now(), 0.6); setTimeout(() => { try { r.s.stop(); } catch (e) {} }, 3000); }
  }
  function setMood(name) {
    if (!MOODS[name]) return; const changed = name !== mood; mood = name;
    if (!ctx) return;
    if (changed || !track) { startTrack(name); }
    setRain(MOODS[name].rain);
  }

  // ── 효과음 ──
  const MIN_GAP = { click: 0.06, hotspot: 0.12, move: 0.2, question: 0.1, evidence: 0.3, correct: 0.4, wrong: 0.4, cctv: 0.3, door: 0.8, thunder: 2, blackout: 1.5, ending: 1.5, investigate: 0.12 };
  const MAX_ACTIVE = 5;
  function sfx(name) {
    if (!settings.sfx || !ensure() || !ctx) return false;
    const t = now(); if (lastAt[name] && t - lastAt[name] < (MIN_GAP[name] || 0.1)) return false;
    if (active >= MAX_ACTIVE) return false;
    lastAt[name] = t; active++; const len = play(name, t); setTimeout(() => { active = Math.max(0, active - 1); }, (len || 0.3) * 1000);
    log.push(name); if (log.length > 50) log.shift(); return true;
  }
  function tone(m, t, dur, vol, type) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine'; o.frequency.value = mtof(m); o.connect(g); g.connect(sfxBus); env(g, t, 0.005, vol, dur); o.start(t); o.stop(t + dur + 0.05); return o; }
  function play(name, t) {
    switch (name) {
      case 'click': tone(88, t, 0.04, 0.05); return 0.06;
      case 'hotspot': case 'investigate': tone(76, t, 0.08, 0.08); tone(83, t + 0.06, 0.1, 0.06); return 0.2;
      case 'move': { const n = noise(sfxBus, t, 0.3, 'bandpass', 600, 0.06, 0.8); n.f.frequency.exponentialRampToValueAtTime(2000, t + 0.3); return 0.35; }
      case 'question': { const o = tone(74, t, 0.09, 0.07); o.frequency.exponentialRampToValueAtTime(mtof(79), t + 0.08); return 0.12; }
      case 'evidence': [84, 88, 91, 96].forEach((m, i) => piano(sfxBus, m, t + i * 0.07, 0.07, 0.9)); return 1.1;
      case 'correct': [72, 76, 79, 84].forEach((m, i) => piano(sfxBus, m, t + i * 0.09, 0.09, 1.0)); return 1.2;
      case 'wrong': tone(52, t, 0.18, 0.08, 'square'); tone(48, t + 0.16, 0.3, 0.08, 'square'); return 0.5;
      case 'cctv': noise(sfxBus, t, 0.22, 'highpass', 3000, 0.05); tone(93, t + 0.2, 0.06, 0.04, 'square'); return 0.3;
      case 'door': { const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(110, t); o.frequency.linearRampToValueAtTime(70, t + 0.7); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 6; o.connect(f); f.connect(g); g.connect(sfxBus); env(g, t, 0.05, 0.05, 0.7); o.start(t); o.stop(t + 0.8); noise(sfxBus, t + 0.75, 0.2, 'lowpass', 300, 0.12); return 1; }
      case 'thunder': noise(sfxBus, t, 2.6, 'lowpass', 180, 0.35); noise(sfxBus, t + 0.05, 0.4, 'lowpass', 900, 0.15); return 2.7;
      case 'blackout': { const o = tone(60, t, 0.9, 0.08, 'sawtooth'); o.frequency.exponentialRampToValueAtTime(30, t + 0.9); noise(sfxBus, t + 0.85, 0.05, 'highpass', 2000, 0.1); return 1; }
      case 'ending': [48, 55, 60].forEach((m, i) => piano(sfxBus, m, t + i * 0.25, 0.1, 2.2)); return 2.6;
      default: return 0;
    }
  }

  // ── 클릭 해석: 동작 이름 + 저장 데이터 변화 ──
  const CCTV = ['E02', 'E03', 'E17', 'E18'];
  const VERIFY = ['solve', 'timeline-check', 'check-motives', 'time-check', 'rebut-check', 'submit', 'confront'];
  function snapshot() {
    const s = readJson(SAVE_KEYS[page]) || {};
    return { ev: (s.evidence || s.clues || []).length, solved: (s.solved || []).length + (s.confronted || []).length, stage: s.stage || null, tl: !!s.timelineDone, ending: s.ending || null };
  }
  let snap = null;
  function onClick(e) {
    const gest = ensure(); // 첫 입력에서 오디오 시작
    if (gest && mood === null) setMood(currentMood()); else if (gest && !track && settings.bgm) setMood(currentMood());
    const el = e.target && e.target.closest ? e.target.closest('[data-action],[data-act],button,a') : null;
    if (!el || el.closest('#snd-panel,#snd-btn')) return;
    const act = el.getAttribute('data-action') || el.getAttribute('data-act') || '', id = el.getAttribute('data-id') || '';
    if (['room', 'loc'].includes(act)) sfx('move');
    else if (['collect', 'look', 'interact', 'read'].includes(act)) sfx(CCTV.includes(id) ? 'cctv' : el.classList.contains('hotspot') ? 'hotspot' : act === 'read' ? 'click' : 'investigate');
    else if (['qa', 'qa-note'].includes(act)) sfx('question');
    else if (!VERIFY.includes(act)) sfx('click');
    const before = snap || snapshot();
    setTimeout(() => {
      const after = snapshot(); snap = after;
      if (after.ending && after.ending !== before.ending) sfx('ending');
      else if (after.stage === 'blackout' && before.stage !== 'blackout') { sfx('thunder'); setTimeout(() => sfx('blackout'), 500); }
      else if (after.stage === 'discovery' && before.stage !== 'discovery') sfx('door');
      else if (after.solved > before.solved || (after.tl && !before.tl)) sfx('correct');
      else if (VERIFY.includes(act)) sfx('wrong');
      else if (after.ev > before.ev) sfx('evidence');
      const m = currentMood(); if (m !== mood) setMood(m);
    }, 90);
  }

  // ── 설정 UI ──
  function ui() {
    if (document.getElementById('snd-btn')) return;
    const st = document.createElement('style');
    st.textContent = '#snd-btn{position:fixed;right:14px;bottom:14px;z-index:9000;width:46px;height:46px;border-radius:50%;border:1px solid #f0c47b94;background:#111a30e6;color:#f6dfb3;font-size:20px;box-shadow:0 6px 18px #0008;cursor:pointer}#snd-btn:focus-visible,#snd-panel :focus-visible{outline:3px solid #f1cd91;outline-offset:2px}'
      + '#snd-panel{position:fixed;right:14px;bottom:70px;z-index:9000;width:min(270px,calc(100vw - 28px));padding:14px 16px;border-radius:14px;border:1px solid #586887;background:#151f34f5;color:#e9e3d6;font:13px/1.5 sans-serif;box-shadow:0 12px 34px #000a}#snd-panel[hidden]{display:none}#snd-panel h2{font-size:14px;margin:0 0 10px;color:#f2d49c}'
      + '#snd-panel label{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px}#snd-panel input[type=checkbox]{width:22px;height:22px;accent-color:#f0c47b}#snd-panel input[type=range]{flex:1;accent-color:#f0c47b;min-height:30px}#snd-panel small{display:block;color:#9aa8bf;font-size:11px;margin-top:6px}';
    document.head.appendChild(st);
    const b = document.createElement('button'); b.id = 'snd-btn'; b.type = 'button'; b.setAttribute('aria-label', '사운드 설정'); b.setAttribute('aria-expanded', 'false'); b.textContent = settings.bgm || settings.sfx ? '♪' : '🔇';
    const p = document.createElement('div'); p.id = 'snd-panel'; p.hidden = true; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', '사운드 설정');
    p.innerHTML = '<h2>사운드 설정</h2><label>배경음악 <input type="checkbox" id="snd-bgm"></label><label>효과음 <input type="checkbox" id="snd-sfx"></label><label>전체 음량 <input type="range" id="snd-vol" min="0" max="100" step="5"> <output id="snd-vol-out"></output></label><small>음악·효과음은 이 게임을 위해 직접 합성한 소리예요. 첫 터치 뒤에 재생돼요.</small>';
    document.body.append(p, b);
    const $ = id => document.getElementById(id), sync = () => { $('snd-bgm').checked = settings.bgm; $('snd-sfx').checked = settings.sfx; $('snd-vol').value = settings.vol; $('snd-vol-out').textContent = settings.vol + '%'; b.textContent = settings.bgm || settings.sfx ? '♪' : '🔇'; };
    sync();
    b.addEventListener('click', () => { ensure(); p.hidden = !p.hidden; b.setAttribute('aria-expanded', String(!p.hidden)); if (!track && settings.bgm && ctx) setMood(currentMood()); });
    p.addEventListener('change', e => {
      if (e.target.id === 'snd-bgm') { settings.bgm = e.target.checked; if (track) { stopTrack(track); track = null; } if (settings.bgm && ensure()) setMood(currentMood()); }
      if (e.target.id === 'snd-sfx') settings.sfx = e.target.checked;
      saveSettings(); applySettings(); sync();
    });
    p.addEventListener('input', e => { if (e.target.id === 'snd-vol') { settings.vol = +e.target.value; saveSettings(); applySettings(); sync(); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !p.hidden) { p.hidden = true; b.setAttribute('aria-expanded', 'false'); } });
  }

  // ── 시작 ──
  function boot() {
    ui(); snap = snapshot();
    document.addEventListener('click', onClick, true);
    ['touchend', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if (ensure() && mood === null) setMood(currentMood()); }, { capture: true, passive: true }));
    timer = setInterval(schedule, 60);
    // 다른 챕터로 이동할 때 음악을 짧게 줄여 끊김을 줄인다(다음 페이지에서 다시 서서히 시작)
    window.addEventListener('pagehide', () => { if (ctx) master.gain.setTargetAtTime(0.0001, now(), 0.05); });
    document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {}); });
  }
  window.SOUND = {
    sfx, setMood, currentMood, mood: () => mood, state: () => (ctx ? ctx.state : 'idle'), track: () => (track ? track.name : null), rain: () => !!rain,
    settings: () => Object.assign({}, settings), log: () => log.slice(), active: () => active,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
