// Страница участников: клик по карточке открывает модальное окно с подробностями.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
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

  });
})();
