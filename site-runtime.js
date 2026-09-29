(() => {
  const name = window.siteConfig?.representative;
  if (typeof name === 'string' && name.trim()) {
    document.querySelectorAll('[data-company-representative]').forEach(node => {
      node.textContent = name;
      node.closest('[data-company-row]')?.removeAttribute('hidden');
    });
  }
})();
