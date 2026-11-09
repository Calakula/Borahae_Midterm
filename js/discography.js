// Дискография: данные в массиве, рендер через DOM, поиск, плавная фильтрация, модальное окно
(function () {
  'use strict';
  var IMG = {
    youth: 'images/ZEROBASEONE.jpg',
    love: 'images/LOVE YOURSELF 轉  ‘TEAR’.jpg',
    map: 'images/630081804161637285.jpg'
  };
  function era(y) { return y <= 2016 ? IMG.youth : y <= 2019 ? IMG.love : IMG.map; }
  var raw = [
    [2013, '2 Cool 4 Skool', 'Single', 'June 2013'],
    [2013, 'O!RUL8,2?', 'Mini', 'September 2013'],
    [2014, 'Skool Luv Affair', 'Mini', 'February 2014'],
    [2014, 'Dark & Wild', 'Studio', 'August 2014'],
    [2015, 'The Most Beautiful Moment in Life, Pt. 1', 'Mini', 'April 2015'],
    [2015, 'The Most Beautiful Moment in Life, Pt. 2', 'Mini', 'November 2015'],
    [2016, 'The Most Beautiful Moment in Life: Young Forever', 'Compilation', 'May 2016'],
    [2016, 'Wings', 'Studio', 'October 2016'],
    [2017, 'Love Yourself: Her', 'Mini', 'September 2017'],
    [2018, 'Love Yourself: Tear', 'Studio', 'May 2018'],
    [2018, 'Love Yourself: Answer', 'Compilation', 'August 2018'],
    [2019, 'Map of the Soul: Persona', 'Mini', 'April 2019'],
    [2020, 'Map of the Soul: 7', 'Studio', 'February 2020'],
    [2020, 'Dynamite', 'Single', 'August 2020'],
    [2020, 'BE', 'Studio', 'November 2020'],
    [2021, 'Butter', 'Single', 'May 2021'],
    [2021, 'Permission to Dance', 'Single', 'July 2021'],
    [2022, 'Proof', 'Compilation', 'June 2022']
  ];
  var albums = raw.map(function (r) { return { year: r[0], title: r[1], type: r[2], release: r[3], image: era(r[0]) }; });

  var body = document.getElementById('albumBody'), empty = document.getElementById('emptyState');
  var search = document.getElementById('albumSearch'), btns = document.querySelectorAll('.filter-row button');
  var wrap = document.querySelector('.album-table-wrap');
  if (!body) return;
  var filter = 'All';

  function cell(tag, text) { var c = document.createElement(tag); if (text !== undefined) c.textContent = text; return c; }

  function render() {
    var q = search.value.toLowerCase().trim();
    var list = albums.filter(function (a) {
      return (filter === 'All' || a.type === filter) && (a.title.toLowerCase().indexOf(q) !== -1 || String(a.year).indexOf(q) !== -1);
    });
    body.innerHTML = '';
    list.forEach(function (a, i) {
      var tr = document.createElement('tr');
      tr.tabIndex = 0; tr.style.animationDelay = Math.min(i * 40, 400) + 'ms';
      tr.appendChild(cell('td', a.year)); tr.appendChild(cell('th', a.title));
      var td = cell('td'); td.appendChild(cell('span', a.type)); tr.appendChild(td);
      tr.appendChild(cell('td', a.release));
      var open = function () {
        window.BorahaeModal.open({
          image: a.image, tag: a.type === 'Mini' ? 'Mini album' : a.type, title: a.title,
          rows: [['Year', a.year], ['Type', a.type === 'Mini' ? 'Mini album' : a.type], ['Release', a.release]]
        });
      };
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
      body.appendChild(tr);
    });
    empty.hidden = list.length > 0;
    wrap.querySelector('table').style.display = list.length ? '' : 'none';
  }

  search.addEventListener('input', render);
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('active')) return; // защита от повторных кликов
      filter = b.dataset.filter;
      btns.forEach(function (x) { x.classList.toggle('active', x === b); });
      render();
    });
  });
  render();
})();
