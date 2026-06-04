// Theme toggle. Initial theme is set in <head> before paint (no flash); this
// only handles the click + persistence. We store an explicit choice so it
// sticks across visits; absent a choice, the OS preference wins.
(function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  var root = document.documentElement;

  function sync() {
    var isDark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
  }

  toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });

  // If the user has not made an explicit choice, follow OS changes live.
  try {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        root.dataset.theme = e.matches ? 'dark' : 'light';
        sync();
      }
    });
  } catch (e) {}

  sync();
})();
