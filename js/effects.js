// jQuery-эффекты, общие для всего сайта (подключается на каждой странице после jQuery).
// Эффекты сайта: .fadeIn/.delay/.fadeOut (уведомление), .animate (плавная прокрутка наверх, в main.js),
// .fadeTo (таблица дискографии), .fadeOut/.fadeIn (квиз, форма Join), .slideDown/.slideUp (ошибки формы Join).
(function ($) {
  'use strict';
  if (!$) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) $.fx.off = true;

  var $toast = null;
  function toast(message) {
    if (!$toast) {
      $toast = $('<div class="toast-note" role="status" aria-live="polite"></div>').appendTo(document.body).hide();
    }
    $toast.stop(true, true).text(message).fadeIn(160).delay(1800).fadeOut(300);
  }
  window.BorahaeFx = { toast: toast };
})(window.jQuery);
