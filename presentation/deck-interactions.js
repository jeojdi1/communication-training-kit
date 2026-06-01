/* Interactive moments inside the deck. Slides stay in the DOM, so we can
   bind listeners once on load. */
(function () {
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {

    /* ---- Slide 02: guess poll → reveal ~50% ---- */
    var poll = document.getElementById('poll');
    if (poll) {
      var hint = document.getElementById('pollHint');
      poll.querySelectorAll('.pollbar').forEach(function (bar) {
        bar.style.cursor = 'pointer';
        bar.addEventListener('click', function () {
          poll.querySelectorAll('.pollbar').forEach(function (b) {
            b.querySelector('i').style.width = b.dataset.fill + '%';
            b.querySelector('i').style.background = (b === bar) ? 'var(--coral)' : 'var(--line-strong)';
          });
          if (hint) hint.innerHTML = '<span>👉</span> Good guess — next slide has the real number.';
        });
      });
    }

    /* ---- Slide 06: listening levels flip ---- */
    var levels = document.getElementById('levels');
    if (levels) {
      levels.querySelectorAll('.reveal-card').forEach(function (c) {
        c.addEventListener('click', function () { c.classList.toggle('is-flipped'); });
      });
    }

    /* ---- Slide 09: before / after email toggle ---- */
    var btn = document.getElementById('baToggle');
    if (btn) {
      var after = false;
      var body  = document.getElementById('emBody');
      var subj  = document.getElementById('emSubj');
      var badge = document.getElementById('emBadge');
      var notes = document.getElementById('baNotes');
      var card  = document.getElementById('emailCard');
      btn.addEventListener('click', function () {
        after = !after;
        if (after) {
          subj.textContent = 'Slides draft — need your bit by Fri 3pm';
          body.innerHTML = 'Hi team! 👋<br><br>Could you each finish your two slides by <b>Friday 3pm</b> so I can combine them over the weekend? If slide 4\'s numbers look off to you, flag it and I\'ll fix it.<br><br>Thanks so much — Sam';
          badge.textContent = 'After'; badge.style.color = '#fff'; badge.style.background = 'var(--coral)';
          card.style.boxShadow = 'var(--shadow-md)';
          notes.style.display = 'flex';
          btn.textContent = '← Show the before';
          btn.classList.remove('tap-pulse');
        } else {
          subj.textContent = 'stuff';
          body.textContent = 'hey did u finish the thing?? need it asap. also the other stuff isnt right';
          badge.textContent = 'Before'; badge.style.color = 'var(--coral-deep)'; badge.style.background = 'var(--coral-soft)';
          card.style.boxShadow = 'var(--shadow-sm)';
          notes.style.display = 'none';
          btn.textContent = 'Show the fix →';
        }
      });
    }

    /* ---- Slide 12: build the SBI sentence ---- */
    var sbi = document.getElementById('sbi');
    if (sbi) {
      sbi.querySelectorAll('.sbi-step').forEach(function (step) {
        step.addEventListener('click', function () {
          var on = step.style.opacity === '1';
          step.style.opacity = on ? '0.5' : '1';
          var ex = step.querySelector('.sbi-ex');
          var lbl = step.querySelector('.sbi-lbl');
          ex.style.display = on ? 'none' : 'block';
          lbl.style.display = on ? 'block' : 'none';
        });
      });
    }

  });
})();
