// Home page (Ravil): countdown to June 13 + animated number counters

// --- Countdown to the next June 13 (debut anniversary) ---
function nextFesta() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 5, 13); // month 5 = June
  if (now > target) {
    target = new Date(now.getFullYear() + 1, 5, 13);
  }
  return target;
}

function updateCountdown() {
  const diff = nextFesta() - new Date();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// --- Count-up numbers ---
document.querySelectorAll('[data-count]').forEach(function (el) {
  const end = Number(el.dataset.count);
  const steps = 40;
  let i = 0;
  const timer = setInterval(function () {
    i++;
    el.textContent = Math.round((end * i) / steps);
    if (i >= steps) clearInterval(timer);
  }, 30);
});
