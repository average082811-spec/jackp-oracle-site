(() => {
  const host = document.querySelector('.sculpture');
  if (!host) return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const lowPower = () => navigator.hardwareConcurrency <= 4 || Boolean(connection?.saveData);
  const eligible = () => !media.matches && !lowPower() && !document.hidden;
  let requested = false;
  let paintObserved = false;
  let observer;
  const scripts = new Map();
  function script(src) {
    if (scripts.has(src)) return scripts.get(src);
    const pending = new Promise((resolve, reject) => {
      const node = document.createElement('script');
      node.src = src;
      node.onload = resolve;
      node.onerror = reject;
      document.head.append(node);
    });
    scripts.set(src, pending);
    return pending;
  }
  async function load() {
    host.dataset.powerMode = media.matches ? 'reduced' : lowPower() ? 'low' : 'full';
    if (!eligible() || !paintObserved || requested) return;
    requested = true;
    performance.mark('logo-load-start');
    try {
      await script('restored-ambient.js');
      if (!eligible()) { requested = false; return; }
      await script(matchMedia('(max-width: 700px)').matches ? 'hero-mobile.js' : 'sculpture.js');
    } catch {
      host.dataset.render = 'static';
      host.querySelector('canvas')?.setAttribute('hidden', '');
    }
  }
  function afterPaint() {
    observer?.disconnect();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      paintObserved = true;
      performance.mark('hero-text-painted');
      load();
    }));
  }
  if (performance.getEntriesByName('first-contentful-paint').length) afterPaint();
  else if (window.PerformanceObserver?.supportedEntryTypes.includes('paint')) {
    observer = new PerformanceObserver(list => {
      if (list.getEntries().some(entry => entry.name === 'first-contentful-paint')) afterPaint();
    });
    observer.observe({type: 'paint', buffered: true});
  } else afterPaint();
  media.addEventListener('change', load);
  connection?.addEventListener('change', load);
  document.addEventListener('visibilitychange', load);
  load();
})();
