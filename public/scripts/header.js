(() => {
  const themeButton = document.querySelector('.theme-toggle');
  const syncTheme = () => themeButton?.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
  syncTheme();
  themeButton?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('lm-theme', next); } catch {}
    syncTheme();
  });

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-navigation');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const opened = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!opened));
      toggle.setAttribute('aria-label', opened ? (toggle.dataset.openLabel || 'Open menu') : (toggle.dataset.closeLabel || 'Close menu'));
      nav.classList.toggle('is-open', !opened);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }));
  }

  const header = document.querySelector('.site-header');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', toggle.dataset.openLabel || 'Open menu');
      nav?.classList.remove('is-open');
      toggle.focus();
    }
  });
})();
