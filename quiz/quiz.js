(function () {
  var Q = window.QUIZ || [];
  var TIME = 20;                 // seconds per question
  var CIRC = 2 * Math.PI * 28;   // timer ring circumference

  var idx = 0, score = 0, correct = 0, timeLeft = TIME, timer = null, answered = false;

  var el = function (id) { return document.getElementById(id); };
  var startScreen = el('startScreen'), quizScreen = el('quizScreen'), resultScreen = el('resultScreen');

  var SHAPES = [
    '<svg class="shape" viewBox="0 0 32 32"><polygon points="16,3 30,29 2,29" fill="currentColor" opacity=".55"/></svg>',
    '<svg class="shape" viewBox="0 0 32 32"><polygon points="16,2 30,16 16,30 2,16" fill="currentColor" opacity=".55"/></svg>',
    '<svg class="shape" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="currentColor" opacity=".55"/></svg>',
    '<svg class="shape" viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="4" fill="currentColor" opacity=".55"/></svg>'
  ];

  el('startBtn').addEventListener('click', start);
  el('againBtn').addEventListener('click', start);
  el('nextBtn').addEventListener('click', next);

  function start() {
    idx = 0; score = 0; correct = 0;
    el('score').querySelector('span').textContent = '0';
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    render();
  }

  function render() {
    answered = false;
    timeLeft = TIME;
    var item = Q[idx];

    el('qcount').querySelector('span').textContent = (idx + 1);
    el('progMeta').textContent = 'Question ' + (idx + 1) + ' of ' + Q.length;
    el('progBar').style.width = ((idx + 1) / Q.length * 100) + '%';
    el('qpillar').textContent = item.pillar;
    el('qtext').textContent = item.q;
    el('toast').textContent = '';
    el('toast').className = 'toast';
    el('nextBtn').classList.add('hidden');

    var card = el('qcard');
    card.classList.remove('fade'); void card.offsetWidth; card.classList.add('fade');

    var wrap = el('answers');
    wrap.innerHTML = '';
    item.opts.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.className = 'ans c' + i;
      b.innerHTML = SHAPES[i] + '<span>' + opt + '</span><span class="tick"></span>';
      b.addEventListener('click', function () { choose(i, b); });
      wrap.appendChild(b);
    });

    startTimer();
  }

  function startTimer() {
    var arc = el('timerArc');
    arc.style.transition = 'none';
    arc.style.strokeDashoffset = '0';
    el('timerNum').textContent = TIME;
    void arc.offsetWidth;
    arc.style.transition = 'stroke-dashoffset 1s linear';

    timer = setInterval(function () {
      timeLeft--;
      el('timerNum').textContent = timeLeft;
      arc.style.strokeDashoffset = (CIRC * (1 - timeLeft / TIME)).toFixed(1);
      if (timeLeft <= 5) arc.style.stroke = 'oklch(0.55 0.2 25)';
      else arc.style.stroke = 'var(--coral)';
      if (timeLeft <= 0) { timeUp(); }
    }, 1000);
  }

  function stopTimer() { clearInterval(timer); timer = null; }

  function choose(i, btn) {
    if (answered) return;
    answered = true;
    stopTimer();
    var item = Q[idx];
    var buttons = el('answers').querySelectorAll('.ans');
    buttons.forEach(function (b) { b.disabled = true; });

    if (i === item.a) {
      var pts = 500 + Math.round(500 * (timeLeft / TIME));   // 500–1000 by speed
      score += pts; correct++;
      btn.classList.add('right');
      btn.querySelector('.tick').textContent = '✓';
      el('toast').textContent = '+' + pts + ' points!';
      el('toast').className = 'toast good';
      el('toast').innerHTML = '+' + pts + ' points! <small>Nice — quick and correct.</small>';
    } else {
      btn.classList.add('wrong');
      btn.querySelector('.tick').textContent = '✗';
      buttons[item.a].classList.add('right');
      buttons[item.a].querySelector('.tick').textContent = '✓';
      el('toast').className = 'toast bad';
      el('toast').innerHTML = 'Not quite. <small>The highlighted answer is the one.</small>';
    }
    buttons.forEach(function (b) { if (!b.classList.contains('right') && !b.classList.contains('wrong')) b.classList.add('dim'); });

    el('score').querySelector('span').textContent = score;
    el('nextBtn').classList.remove('hidden');
    el('nextBtn').textContent = (idx + 1 < Q.length) ? 'Next →' : 'See my score →';
  }

  function timeUp() {
    if (answered) return;
    answered = true;
    stopTimer();
    var item = Q[idx];
    var buttons = el('answers').querySelectorAll('.ans');
    buttons.forEach(function (b) { b.disabled = true; b.classList.add('dim'); });
    buttons[item.a].classList.remove('dim');
    buttons[item.a].classList.add('right');
    buttons[item.a].querySelector('.tick').textContent = '✓';
    el('toast').className = 'toast bad';
    el('toast').innerHTML = "Time's up! <small>The highlighted answer is the one.</small>";
    el('nextBtn').classList.remove('hidden');
    el('nextBtn').textContent = (idx + 1 < Q.length) ? 'Next →' : 'See my score →';
  }

  function next() {
    idx++;
    if (idx < Q.length) { render(); }
    else { finish(); }
  }

  function finish() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    el('rscore').textContent = score;
    el('rcorrect').textContent = correct;
    el('rrecord').textContent = score;

    var pct = correct / Q.length;
    var badge, title;
    if (pct === 1)        { badge = '🏆'; title = 'Communication champ!'; }
    else if (pct >= 0.7)  { badge = '🎉'; title = 'Great listening!'; }
    else if (pct >= 0.4)  { badge = '👍'; title = 'Solid start!'; }
    else                  { badge = '🌱'; title = 'Room to grow — try again!'; }
    el('rbadge').textContent = badge;
    el('rtitle').textContent = title;
  }
})();
