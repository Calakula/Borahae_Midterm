// «My ARMY»: общий модуль сохранённого (localStorage).
// Избранное хранится как JSON-массив объектов в ключе 'borahae-saved',
// лучший результат квиза — в ключе 'borahae-quiz'.
// Добавляем на страницах Members / Discography / Timeline, показываем в навбаре (счётчик) и на странице Join.
(function () {
  'use strict';

  var KEY = 'borahae-saved', QUIZ_KEY = 'borahae-quiz';
  var TYPE_LABEL = { member: 'Member', album: 'Album', moment: 'Moment' };
  var HEART = '<svg aria-hidden="true" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';

  var items = null;      // копия данных в памяти: сайт работает, даже если localStorage пуст или недоступен
  var quizMemory = null;
  var listeners = [];

  /* ---------- Хранилище ---------- */
  function isValid(x) { return !!x && typeof x.id === 'string' && typeof x.title === 'string'; }

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      items = Array.isArray(data) ? data.filter(isValid) : [];
    } catch (e) { items = []; }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    emit();
  }
  function emit() { listeners.slice().forEach(function (fn) { fn(); }); }
  function onChange(fn) {
    listeners.push(fn);
    return function () { listeners = listeners.filter(function (f) { return f !== fn; }); };
  }

  function all() { if (!items) load(); return items.slice(); }
  function has(id) { return all().some(function (i) { return i.id === id; }); }
  function count() { return all().length; }
  function toggle(item) {
    if (!items) load();
    var had = has(item.id);
    items = had ? items.filter(function (i) { return i.id !== item.id; }) : items.concat([item]);
    persist();
    return !had;
  }
  function remove(id) {
    if (!items) load();
    items = items.filter(function (i) { return i.id !== id; });
    persist();
  }
  function clear() { items = []; persist(); }

  /* ---------- Результат квиза ---------- */
  function getQuiz() {
    try {
      var q = JSON.parse(localStorage.getItem(QUIZ_KEY));
      if (q && typeof q.best === 'number' && typeof q.total === 'number') return q;
    } catch (e) {}
    return quizMemory;
  }
  function recordQuiz(score, total) {
    var prev = getQuiz();
    var q = { best: prev ? Math.max(prev.best, score) : score, total: total, plays: (prev ? prev.plays || 0 : 0) + 1 };
    quizMemory = q;
    try { localStorage.setItem(QUIZ_KEY, JSON.stringify(q)); } catch (e) {}
    emit();
    return q;
  }

  /* ---------- Кнопка «Save» (одна функция для карточек, таймлайна и модального окна) ---------- */
  function bindButton(btn) {
    var d = btn.dataset;
    var item = { id: d.saveId, type: d.saveType || 'item', title: d.saveTitle || '', sub: d.saveSub || '', page: d.savePage || '' };
    btn.type = 'button';
    btn.classList.add('save-btn');
    btn.innerHTML = HEART + '<span></span>';
    var label = btn.querySelector('span');
    function refresh() {
      var on = has(item.id);
      btn.setAttribute('aria-pressed', String(on));
      label.textContent = on ? 'Saved' : (d.saveLabel || 'Save');
      btn.setAttribute('aria-label', (on ? 'Remove ' + item.title + ' from' : 'Save ' + item.title + ' to') + ' My ARMY');
    }
    btn.addEventListener('click', function () {
      var on = toggle(item);
      if (window.BorahaeFx) window.BorahaeFx.toast(on ? item.title + ' saved to My ARMY' : item.title + ' removed from My ARMY');
    });
    var off = onChange(function () {
      if (!document.body.contains(btn)) { off(); return; }   // кнопка из закрытого окна больше не нужна
      refresh();
    });
    refresh();
  }

  /* ---------- Счётчик в навбаре (на каждой странице) ---------- */
  function mountNav() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    var a = document.createElement('a');
    a.className = 'nav-saved';
    a.href = 'join.html#saved';
    a.innerHTML = HEART + '<b hidden>0</b>';
    nav.insertBefore(a, document.getElementById('themeToggle'));
    var badge = a.querySelector('b');
    function refresh() {
      var n = count();
      badge.textContent = n;
      badge.hidden = !n;
      a.classList.toggle('has-items', n > 0);
      a.setAttribute('aria-label', 'My ARMY: ' + n + ' saved');
    }
    onChange(refresh);
    refresh();
  }

  /* ---------- Панель «My ARMY» на странице Join ---------- */
  function mountPanel() {
    var list = document.getElementById('savedList');
    if (!list) return;
    var total = document.getElementById('savedTotal'), stats = document.getElementById('savedStats');
    var quiz = document.getElementById('savedQuiz'), empty = document.getElementById('savedEmpty');
    var clearBtn = document.getElementById('savedClear'), armed = false, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function removeItem(li, id) {
      if (li.dataset.removing) return;               // защита от повторных кликов
      li.dataset.removing = '1';
      if (window.jQuery) window.jQuery(li).fadeOut(reduce ? 0 : 180, function () { remove(id); });
      else remove(id);
    }
    function render() {
      var data = all(), byType = {};
      total.textContent = data.length;
      data.forEach(function (i) { byType[i.type] = (byType[i.type] || 0) + 1; });   // посчитанные значения
      stats.innerHTML = '';
      Object.keys(byType).forEach(function (t) {
        var n = byType[t], name = TYPE_LABEL[t] || 'Other';
        stats.appendChild(el('span', 'saved-chip', n + ' ' + name.toLowerCase() + (n === 1 ? '' : 's')));
      });
      list.innerHTML = '';
      data.forEach(function (i) {
        var li = el('li', 'saved-item');
        var text = el('div', 'saved-text');
        text.appendChild(el('small', '', TYPE_LABEL[i.type] || 'Other'));
        text.appendChild(el('strong', '', i.title));
        if (i.sub) text.appendChild(el('span', '', i.sub));
        li.appendChild(text);
        if (i.page) { var v = el('a', 'saved-view', 'View'); v.href = i.page; li.appendChild(v); }
        var x = el('button', 'saved-remove', '✕');
        x.type = 'button';
        x.setAttribute('aria-label', 'Remove ' + i.title);
        x.addEventListener('click', function () { removeItem(li, i.id); });
        li.appendChild(x);
        list.appendChild(li);
      });
      empty.hidden = data.length > 0;
      clearBtn.disabled = data.length === 0;

      var q = getQuiz();
      quiz.innerHTML = '';
      if (q) quiz.appendChild(document.createTextNode('Quiz best: ' + q.best + ' / ' + q.total + ' · played ' + q.plays + (q.plays === 1 ? ' time' : ' times')));
      else {
        quiz.appendChild(document.createTextNode('Quiz: not played yet — '));
        var link = el('a', '', 'take the ARMY quiz'); link.href = 'quiz.html';
        quiz.appendChild(link);
      }
    }
    function resetClear() { armed = false; clearBtn.textContent = 'Clear all'; clearTimeout(timer); }
    clearBtn.addEventListener('click', function () {
      if (!count()) return;
      if (!armed) {                                   // подтверждение без alert(): второй клик в течение 3 секунд
        armed = true; clearBtn.textContent = 'Click again to clear';
        timer = setTimeout(resetClear, 3000);
        return;
      }
      resetClear(); clear();
    });
    onChange(function () { if (!count()) resetClear(); render(); });
    render();
  }

  window.BorahaeSaved = {
    all: all, has: has, count: count, toggle: toggle, remove: remove, clear: clear,
    onChange: onChange, bindButton: bindButton, getQuiz: getQuiz, recordQuiz: recordQuiz
  };

  // обновление при изменениях из другой вкладки
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { load(); emit(); }
    else if (e.key === QUIZ_KEY) emit();
  });

  function init() { mountNav(); mountPanel(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
