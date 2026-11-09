// Общий скрипт: тема (localStorage), меню, плавный скролл, «Наверх», модальное окно,
// обратный отсчёт, генератор фактов, пасхалка с конфетти.
(function () {
  'use strict';
  var root = document.documentElement, KEY = 'borahae-theme';

  /* ---------- Тема ---------- */
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var b = document.getElementById('themeToggle');
    if (b) { b.textContent = t === 'dark' ? '☾' : '☀'; b.setAttribute('aria-label', 'Switch theme (now ' + t + ')'); }
  }
  var saved = 'dark';
  try { saved = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
  applyTheme(saved);

  /* ---------- Модальное окно (глобальное API) ---------- */
  var modal = document.createElement('div');
  modal.className = 'modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = '<div class="modal-box"><button class="modal-close" aria-label="Close">✕</button><div id="modalContent"></div></div>';
  var lastFocus = null;
  window.BorahaeModal = {
    open: function (o) {
      var c = modal.querySelector('#modalContent');
      c.innerHTML = '';
      if (o.image) { var img = document.createElement('img'); img.src = o.image; img.alt = ''; c.appendChild(img); }
      var body = document.createElement('div'); body.className = 'modal-body';
      var s = document.createElement('small'); s.textContent = o.tag || ''; body.appendChild(s);
      var h = document.createElement('h3'); h.textContent = o.title; body.appendChild(h);
      var dl = document.createElement('dl');
      (o.rows || []).forEach(function (r) {
        var dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = r[0]; dd.textContent = r[1]; dl.appendChild(dt); dl.appendChild(dd);
      });
      body.appendChild(dl); c.appendChild(body);
      lastFocus = document.activeElement;
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      modal.querySelector('.modal-close').focus();
    },
    close: function () {
      modal.classList.remove('open'); document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  };
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.classList.contains('modal-close')) window.BorahaeModal.close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.BorahaeModal.close(); });

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(modal);
    applyTheme(saved);

    var music = document.getElementById('backgroundMusic');
    var musicToggle = document.getElementById('backgroundMusicToggle');
    var musicStatus = document.getElementById('backgroundMusicStatus');
    if (music && musicToggle && musicStatus) {
      music.volume = 0.15;

      var updateMusicState = function () {
        var playing = !music.paused && !music.ended;
        musicToggle.classList.toggle('is-paused', !playing);
        musicToggle.setAttribute('aria-pressed', String(playing));
        musicToggle.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' My universe');
        musicStatus.textContent = playing ? 'NOW PLAYING' : 'TAP TO PLAY';
      };

      music.addEventListener('play', updateMusicState);
      music.addEventListener('pause', updateMusicState);
      music.addEventListener('ended', updateMusicState);
      music.addEventListener('error', function () {
        musicStatus.textContent = 'AUDIO UNAVAILABLE';
        musicToggle.setAttribute('aria-label', 'My universe audio unavailable');
      });

      musicToggle.addEventListener('click', function () {
        if (music.paused) {
          music.play().catch(function (error) {
            musicStatus.textContent = 'AUDIO UNAVAILABLE';
            musicToggle.setAttribute('aria-label', 'My universe audio unavailable');
            console.error('Unable to play My universe:', error);
          });
        } else {
          music.pause();
        }
      });

      music.play().catch(function (error) {
        if (error.name === 'NotAllowedError') return;
        musicStatus.textContent = 'AUDIO UNAVAILABLE';
        musicToggle.setAttribute('aria-label', 'My universe audio unavailable');
        console.error('Unable to autoplay My universe:', error);
      });
    }

    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });

    /* Мобильное меню */
    var mb = document.querySelector('.menu-button'), nav = document.getElementById('main-nav');
    if (mb && nav) mb.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', open);
    });

    /* Плавный скролл + «Наверх» (защита от спама кликов) */
    var busy = false;
    function scrollToY(y) {
      if (busy) return; busy = true;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(function () { busy = false; }, 600);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (!t) return; e.preventDefault();
        scrollToY(t.getBoundingClientRect().top + window.scrollY - 90);
      });
    });
    var top = document.createElement('button');
    top.className = 'to-top'; top.setAttribute('aria-label', 'Back to top'); top.textContent = '↑';
    top.addEventListener('click', function () { scrollToY(0); });
    document.body.appendChild(top);
    window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 400); }, { passive: true });

    /* Участники: клик по карточке открывает модальное окно */
    document.querySelectorAll('.member-flip').forEach(function (c) {
      c.addEventListener('click', function () {
        var d = c.dataset;
        window.BorahaeModal.open({
          image: d.photo, tag: 'Member ' + d.num, title: d.name,
          rows: [['Role', d.role], ['Real name', d.real], ['Born', d.born], ['Position', d.pos], ['Known for', d.known]]
        });
      });
    });

    /* Обратный отсчёт до BTS Festa */
    var cd = document.getElementById('countdown');
    if (cd) {
      var cards = cd.querySelectorAll('.time-card strong');
      var tick = function () {
        var now = new Date(), t = new Date(now.getFullYear(), 5, 13);
        if (now > t) t = new Date(now.getFullYear() + 1, 5, 13);
        var diff = Math.max(0, t - now);
        var v = [Math.floor(diff / 864e5), Math.floor(diff % 864e5 / 36e5), Math.floor(diff % 36e5 / 6e4), Math.floor(diff % 6e4 / 1e3)];
        cards.forEach(function (el, i) { el.textContent = String(v[i]).padStart(2, '0'); });
      };
      tick(); setInterval(tick, 1000);
    }

    /* Генератор фактов: табличка «выезжает» из фигурки */
    var sign = document.getElementById('factSign');
    if (sign) {
      var facts = [
        'BTS debuted on June 13, 2013 with the single album 2 Cool 4 Skool.',
        'The name BTS comes from Bangtan Sonyeondan, often translated as Bulletproof Boy Scouts.',
        'ARMY stands for Adorable Representative M.C. for Youth.',
        'Borahae (보라해) means “I purple you” — a phrase coined by V.',
        'The English-language single “Dynamite” was released in August 2020.',
        'The anthology album Proof celebrated nine years of BTS in June 2022.'
      ];
      var text = document.getElementById('factText'), btn = document.getElementById('factBtn');
      var fig = document.getElementById('factFigure'), idx = -1, locked = false;
      var show = function () {
        if (locked) return; locked = true;
        sign.classList.remove('open'); fig.classList.remove('pulling'); void fig.offsetWidth; fig.classList.add('pulling');
        setTimeout(function () {
          var n; do { n = Math.floor(Math.random() * facts.length); } while (n === idx);
          idx = n; text.textContent = facts[n]; sign.classList.add('open');
          setTimeout(function () { locked = false; }, 450);
        }, 400);
      };
      btn.addEventListener('click', show); fig.addEventListener('click', show);
      setTimeout(show, 500);
    }

    /* Пасхалка: падающие сердечки и конфетти (чистый JS) */
    var sh = document.getElementById('secretHeart');
    if (sh) {
      var running = false;
      sh.addEventListener('click', function () {
        if (running) return; running = true;
        var cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv);
        var ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
        var cols = ['#9b6cff', '#ff85ca', '#b892ff', '#ffffff', '#c24fc9'];
        var ps = []; for (var i = 0; i < 110; i++) ps.push({
          x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .6,
          vy: 2 + Math.random() * 3.5, vx: Math.random() * 2 - 1, r: Math.random() * 6.28, vr: Math.random() * .2 - .1,
          s: 10 + Math.random() * 16, c: cols[i % cols.length], heart: Math.random() < .45
        });
        var start = performance.now();
        (function frame(now) {
          ctx.clearRect(0, 0, cv.width, cv.height);
          ps.forEach(function (p) {
            p.y += p.vy; p.x += p.vx + Math.sin(p.y / 40); p.r += p.vr;
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
            if (p.heart) { ctx.font = p.s + 'px serif'; ctx.fillText('💜', -p.s / 2, p.s / 2); }
            else ctx.fillRect(-p.s / 4, -p.s / 2, p.s / 2, p.s);
            ctx.restore();
          });
          if (now - start < 4200) requestAnimationFrame(frame);
          else { cv.remove(); running = false; }
        })(start);
      });
    }
  });
})();
