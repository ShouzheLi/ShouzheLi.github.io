/* Language switch for a dual-DOM page set.
   Every translatable block ships as <span class="t-en">…</span><span class="t-zh">…</span>;
   CSS hides the inactive one, so content stays readable without JavaScript. */
(() => {
  const root = document.documentElement;
  const KEY = 'pa-lang';
  const SUPPORTED = ['en', 'zh'];

  const read = () => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  };
  const store = (value) => {
    try { localStorage.setItem(KEY, value); } catch { /* private mode */ }
  };

  function initial() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get('lang') || '').toLowerCase();
    if (SUPPORTED.includes(fromUrl)) {
      store(fromUrl);
      params.delete('lang');
      const qs = params.toString();
      const clean = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      try { window.history.replaceState(null, '', clean); } catch { /* file:// */ }
      return fromUrl;
    }
    const stored = (read() || '').toLowerCase();
    if (SUPPORTED.includes(stored)) return stored;
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    return langs.some((code) => code.toLowerCase().startsWith('zh')) ? 'zh' : 'en';
  }

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    document.querySelectorAll('[data-lang-option]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.langOption === lang));
    });
  }

  apply(initial());

  document.querySelectorAll('[data-lang-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.langOption;
      if (!SUPPORTED.includes(next)) return;
      store(next);
      apply(next);
    });
  });
})();
