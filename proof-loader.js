(() => {
  const images = [...document.querySelectorAll('img[data-proof-src]')];
  function load(image) {
    image.src = image.dataset.proofSrc;
    delete image.dataset.proofSrc;
  }
  if (!('IntersectionObserver' in window)) {
    images.forEach(load);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      load(entry.target);
    });
  }, {rootMargin: '0px'});
  images.forEach(image => observer.observe(image));
  addEventListener('beforeprint', () => { observer.disconnect(); images.forEach(image => { if (image.dataset.proofSrc) load(image); }); });
})();
