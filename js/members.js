// Members page (Aruzhan): tap-to-flip for touch screens + keyboard support
document.querySelectorAll('.flip').forEach(function (card) {
  card.addEventListener('click', function () {
    card.classList.toggle('flipped');
  });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});
