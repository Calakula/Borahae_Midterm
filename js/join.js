// Валидация формы: ошибки под полями, без alert()
(function () {
  'use strict';
  var form = document.getElementById('joinForm');
  if (!form) return;
  var card = document.getElementById('armyResult'), f = form.elements;

  var rules = {
    name: function (v) { if (!v.trim()) return 'Please enter your name.'; if (!/^[A-Za-z\u00C0-\u024F\u0400-\u04FF][A-Za-z\u00C0-\u024F\u0400-\u04FF\s'.-]{1,39}$/.test(v.trim())) return 'Use letters only (2–40 characters).'; },
    email: function (v) { if (!v.trim()) return 'Please enter your email.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Enter a valid email, e.g. you@example.com.'; },
    phone: function (v) { if (!v.trim()) return 'Please enter your phone number.'; if (!/^\+?[0-9\s()-]{10,16}$/.test(v.trim())) return 'Phone: 10–16 digits, e.g. +7 777 123 45 67.'; },
    country: function (v) { if (!v) return 'Please choose your country.'; },
    year: function (v) { if (!v) return 'Please enter your birth year.'; if (!/^\d{4}$/.test(v) || v < 1950 || v > 2020) return 'Birth year must be between 1950 and 2020.'; },
    bias: function () { if (!form.querySelector('input[name=bias]:checked')) return 'Please pick your bias.'; },
    agree: function () { if (!f.agree.checked) return 'Please confirm to continue.'; }
  };
  function holder(n) { return form.querySelector('[data-field="' + n + '"]'); }
  function value(n) { return n === 'bias' || n === 'agree' ? '' : f[n].value; }

  function check(n) {
    var msg = rules[n](value(n)) || '', h = holder(n);
    h.classList.toggle('invalid', !!msg);
    var error = h.querySelector('.field-error');
    if (window.jQuery) {
      var $error = window.jQuery(error);
      $error.stop(true, true);
      if (msg) $error.text(msg).slideDown(180);
      else $error.slideUp(150, function () { this.textContent = ''; });
    } else {
      error.textContent = msg;
      error.style.display = msg ? 'block' : 'none';
    }
    return !msg;
  }
  Object.keys(rules).forEach(function (n) {
    holder(n).addEventListener('input', function () { check(n); });
    holder(n).addEventListener('change', function () { check(n); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var all = Object.keys(rules).map(check);
    if (all.indexOf(false) !== -1) {
      var bad = form.querySelector('.invalid'); if (bad) bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (form.dataset.submitting === 'true') return;
    var d = { name: f.name.value.trim(), bias: form.querySelector('input[name=bias]:checked').value, country: f.country.value };
    card.querySelector('h2').textContent = d.name;
    card.querySelector('.r-bias').textContent = d.bias;
    card.querySelector('.r-from').textContent = 'From ' + d.country + ' · Member #' + Math.floor(10000 + Math.random() * 90000);
    form.reset();
    form.dataset.submitting = 'true';
    if (window.jQuery) {
      var duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220;
      window.jQuery(form).stop(true, true).fadeOut(duration, function () {
        form.hidden = true;
        card.hidden = false;
        window.jQuery(card).hide().fadeIn(duration);
      });
    } else {
      form.hidden = true;
      card.hidden = false;
      form.dataset.submitting = 'false';
    }
  });
  document.getElementById('fillAgain').addEventListener('click', function () {
    if (window.jQuery) {
      var duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220;
      window.jQuery(card).stop(true, true).fadeOut(duration, function () {
        card.hidden = true;
        form.hidden = false;
        window.jQuery(form).hide().fadeIn(duration, function () {
          form.dataset.submitting = 'false';
        });
      });
    } else {
      card.hidden = true;
      form.hidden = false;
      form.dataset.submitting = 'false';
    }
  });
})();
