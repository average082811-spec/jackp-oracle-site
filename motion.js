(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...document.querySelectorAll('.reveal')];
  let observer;
  function showAll() {
    observer?.disconnect();
    document.documentElement.classList.remove('motion-enabled');
    elements.forEach(element => element.classList.add('is-visible'));
  }
  if (media.matches || !('IntersectionObserver' in window)) return;
  // Reveal is independent of the hero's animation lifecycle.
  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(element => observer.observe(element));
    document.documentElement.classList.add('motion-enabled');
    media.addEventListener('change', event => { if (event.matches) showAll(); });
    window.addEventListener('beforeprint', showAll);
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
    window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  } catch { showAll(); }
})();
