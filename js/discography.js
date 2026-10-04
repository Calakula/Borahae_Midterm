// Discography page (Neda): search + type filter for the albums table
const rows = document.querySelectorAll('#albums tbody tr');
const searchInput = document.getElementById('search');
const filterButtons = document.querySelectorAll('[data-filter]');
const noResults = document.getElementById('no-results');
let activeFilter = 'all';

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  rows.forEach(function (row) {
    const title = row.querySelector('th').textContent.toLowerCase();
    const typeOk = activeFilter === 'all' || row.dataset.type === activeFilter;
    const searchOk = title.includes(query);
    const show = typeOk && searchOk;
    row.classList.toggle('d-none', !show);
    if (show) visible++;
  });

  noResults.classList.toggle('d-none', visible > 0);
}

searchInput.addEventListener('input', applyFilters);

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});
