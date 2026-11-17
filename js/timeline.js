// Таймлайн: кнопки «Save moment» на карточках (хранение — общий модуль saved.js)
(function () {
  'use strict';
  if (!window.BorahaeSaved) return;
  document.querySelectorAll('.moment-card [data-save-id]').forEach(window.BorahaeSaved.bindButton);
})();
