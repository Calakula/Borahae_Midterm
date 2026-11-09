// Страница Timeline: плавное появление моментов при прокрутке и подробности в модальном окне.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var moments = document.querySelectorAll('.moment');
    if ('IntersectionObserver' in window) {
      document.documentElement.classList.add('tl-js');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.15 });
      moments.forEach(function (m) { observer.observe(m); });
    }
    moments.forEach(function (m) {
      var card = m.querySelector('.moment-card');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      var open = function () {
        window.BorahaeModal.open({
          image: card.querySelector('img').src,
          tag: card.querySelector('strong').textContent,
          title: card.querySelector('h2').textContent,
          rows: [['Story', card.querySelector('p').textContent]]
        });
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
  });
})();
