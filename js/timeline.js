// Timeline page (Zarina): reveal each item when it scrolls into view
const items = document.querySelectorAll('.tl-item');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(function (item) { observer.observe(item); });
} else {
  // Old browsers: just show everything
  items.forEach(function (item) { item.classList.add('show'); });
}
