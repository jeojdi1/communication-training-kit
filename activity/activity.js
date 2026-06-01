(function () {
  var COL = { ink:'#2a3350', coral:'#e8615d', blue:'#5571c0', gold:'#d6a23e' };

  // Describable pictures — simple shapes only.
  var TARGETS = [
    // 1 · House
    '<rect x="120" y="140" width="160" height="120" rx="6" fill="#fff" stroke="'+COL.ink+'" stroke-width="6"/>'+
    '<polygon points="110,140 200,70 290,140" fill="'+COL.coral+'"/>'+
    '<rect x="150" y="180" width="50" height="50" fill="'+COL.blue+'"/>'+
    '<rect x="225" y="190" width="40" height="70" rx="4" fill="'+COL.gold+'"/>'+
    '<circle cx="320" cy="80" r="26" fill="'+COL.gold+'"/>',
    // 2 · Snowman
    '<circle cx="200" cy="220" r="60" fill="#fff" stroke="'+COL.ink+'" stroke-width="6"/>'+
    '<circle cx="200" cy="140" r="44" fill="#fff" stroke="'+COL.ink+'" stroke-width="6"/>'+
    '<circle cx="200" cy="78" r="30" fill="#fff" stroke="'+COL.ink+'" stroke-width="6"/>'+
    '<circle cx="190" cy="74" r="4" fill="'+COL.ink+'"/><circle cx="210" cy="74" r="4" fill="'+COL.ink+'"/>'+
    '<polygon points="200,82 224,88 200,94" fill="'+COL.coral+'"/>'+
    '<circle cx="200" cy="130" r="6" fill="'+COL.coral+'"/><circle cx="200" cy="150" r="6" fill="'+COL.blue+'"/>',
    // 3 · Abstract arrangement
    '<circle cx="150" cy="160" r="70" fill="'+COL.blue+'"/>'+
    '<polygon points="300,60 360,160 240,160" fill="'+COL.coral+'"/>'+
    '<rect x="250" y="180" width="90" height="90" rx="8" fill="'+COL.gold+'"/>'+
    '<line x1="60" y1="40" x2="360" y2="270" stroke="'+COL.ink+'" stroke-width="6" stroke-linecap="round"/>',
    // 4 · Rocket
    '<rect x="170" y="110" width="60" height="120" rx="24" fill="#fff" stroke="'+COL.ink+'" stroke-width="6"/>'+
    '<polygon points="200,50 230,115 170,115" fill="'+COL.coral+'"/>'+
    '<polygon points="170,200 140,250 170,235" fill="'+COL.blue+'"/>'+
    '<polygon points="230,200 260,250 230,235" fill="'+COL.blue+'"/>'+
    '<circle cx="200" cy="150" r="18" fill="'+COL.gold+'"/>'+
    '<polygon points="185,235 215,235 200,275" fill="'+COL.coral+'"/>',
    // 5 · Sun + cloud + flower
    '<circle cx="120" cy="100" r="44" fill="'+COL.gold+'"/>'+
    '<ellipse cx="280" cy="110" rx="70" ry="36" fill="#fff" stroke="'+COL.ink+'" stroke-width="6"/>'+
    '<rect x="195" y="190" width="10" height="80" fill="'+COL.blue+'"/>'+
    '<circle cx="200" cy="180" r="22" fill="'+COL.coral+'"/>'+
    '<circle cx="170" cy="195" r="16" fill="'+COL.coral+'"/><circle cx="230" cy="195" r="16" fill="'+COL.coral+'"/>'+
    '<circle cx="200" cy="180" r="9" fill="'+COL.gold+'"/>'
  ];

  var TIME = 90;
  var el = function (id) { return document.getElementById(id); };
  var round = 0, order = [], timeLeft = TIME, timer = null, running = false;

  // ---- canvas setup ----
  var pad = el('pad'), ctx = pad.getContext('2d');
  var strokes = [], cur = null, penColor = COL.ink, drawing = false, dpr = window.devicePixelRatio || 1;

  function sizeCanvas() {
    var r = pad.getBoundingClientRect();
    pad.width = Math.max(2, r.width * dpr);
    pad.height = Math.max(2, r.height * dpr);
    redraw();
  }
  function redraw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var r = pad.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    strokes.forEach(function (s) {
      ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
      ctx.strokeStyle = s.c; ctx.lineWidth = s.w; ctx.beginPath();
      s.pts.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
      ctx.stroke();
    });
    ctx.globalCompositeOperation = 'source-over';
  }
  function pos(e) {
    var r = pad.getBoundingClientRect();
    var t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  function down(e) { e.preventDefault(); drawing = true; var erase = penColor === '#FBF4EA'; cur = { c: penColor, w: erase ? 24 : 4, erase: erase, pts: [pos(e)] }; strokes.push(cur); redraw(); }
  function move(e) { if (!drawing) return; e.preventDefault(); cur.pts.push(pos(e)); redraw(); }
  function up() { drawing = false; cur = null; }
  pad.addEventListener('pointerdown', down);
  pad.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('resize', function () { if (!el('gameScreen').classList.contains('hidden')) sizeCanvas(); });

  // pen swatches
  var tools = el('tools');
  var palette = [COL.ink, COL.coral, COL.blue, COL.gold, '#FBF4EA'];
  var sp = tools.querySelector('.sp');
  palette.forEach(function (c, i) {
    var s = document.createElement('span');
    s.className = 'swatch' + (i === 0 ? ' sel' : '');
    s.style.background = c;
    if (c === '#FBF4EA') { s.title = 'Eraser'; s.style.boxShadow = 'inset 0 0 0 1.5px #ccc'; }
    s.addEventListener('click', function () {
      penColor = c;
      tools.querySelectorAll('.swatch').forEach(function (x) { x.classList.remove('sel'); });
      s.classList.add('sel');
    });
    tools.insertBefore(s, sp);
  });

  el('undoBtn').addEventListener('click', function () { strokes.pop(); redraw(); });
  el('clearBtn').addEventListener('click', function () { strokes = []; redraw(); });

  // ---- flow ----
  el('startBtn').addEventListener('click', function () { round = 0; order = shuffle([0,1,2,3,4]); begin(); });
  el('compareBtn').addEventListener('click', compare);
  el('nextRoundBtn').addEventListener('click', function () { round++; begin(); });
  el('restartBtn').addEventListener('click', function () { round = 0; order = shuffle([0,1,2,3,4]); begin(); });
  el('playPause').addEventListener('click', toggleTimer);
  el('cover').addEventListener('click', function () { el('cover').classList.add('lifted'); });

  function shuffle(a) { a = a.slice(); for (var i = a.length-1; i>0; i--){ var j = Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

  function begin() {
    el('startScreen').classList.add('hidden');
    el('compareScreen').classList.add('hidden');
    el('gameScreen').classList.remove('hidden');

    var ti = order[round % order.length];
    el('target').innerHTML = TARGETS[ti];
    el('target').dataset.cur = ti;
    el('cover').classList.remove('lifted');
    el('roundLbl').textContent = 'Round ' + (round + 1) + (round > 0 ? ' · swap roles!' : '');
    strokes = [];

    requestAnimationFrame(function(){ sizeCanvas(); });
    resetTimer(); startTimer();
  }

  function fmt(s) { var m = Math.floor(s/60); var ss = s % 60; return m + ':' + (ss<10?'0':'') + ss; }
  function resetTimer() { timeLeft = TIME; el('clock').textContent = fmt(timeLeft); el('clock').classList.remove('low'); }
  function startTimer() {
    running = true; el('playPause').textContent = '⏸ Pause';
    clearInterval(timer);
    timer = setInterval(function () {
      timeLeft--;
      el('clock').textContent = fmt(Math.max(0, timeLeft));
      if (timeLeft <= 15) el('clock').classList.add('low');
      if (timeLeft <= 0) { clearInterval(timer); running = false; el('playPause').textContent = "Time's up"; }
    }, 1000);
  }
  function toggleTimer() {
    if (timeLeft <= 0) return;
    if (running) { clearInterval(timer); running = false; el('playPause').textContent = '▶ Resume'; }
    else { startTimer(); }
  }

  function compare() {
    clearInterval(timer); running = false;
    el('gameScreen').classList.add('hidden');
    el('compareScreen').classList.remove('hidden');
    el('targetReveal').innerHTML = TARGETS[+el('target').dataset.cur];
    el('drawingReveal').src = pad.toDataURL('image/png');
  }
})();
