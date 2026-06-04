// Scroll-spy: highlight the in-page section nav (left identity panel) as the
// matching section scrolls into the middle of the viewport. No-ops if absent.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.profile__nav a'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  links.forEach(function (a) {
    var sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) byId[sec.id] = a;
  });

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      var active = byId[e.target.id];
      if (active) active.classList.add('is-active');
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  Object.keys(byId).forEach(function (id) { obs.observe(document.getElementById(id)); });
})();
