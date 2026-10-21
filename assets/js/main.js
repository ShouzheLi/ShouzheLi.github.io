(() => {
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- theme ---------- */
  const stored = localStorage.getItem('pa-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));
  $$('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('pa-theme', next);
    });
  });

  /* ---------- mobile nav ---------- */
  const menuBtn = $('.menu-btn');
  const nav = $('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('.nav a').forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- sticky header ---------- */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
  // Safety: never leave content hidden if the observer misses (anchors, print, odd browsers).
  setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 1600);

  /* ---------- reading progress ---------- */
  const progress = $('.read-progress');
  if (progress) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      progress.style.width = `${pct}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- compare slider ---------- */
  $$('.compare').forEach((box) => {
    const range = $('.compare-range', box);
    if (!range) return;
    const set = () => box.style.setProperty('--pos', `${range.value}%`);
    set();
    range.addEventListener('input', set);
  });

  /* ---------- carousel ---------- */
  $$('.carousel').forEach((carousel) => {
    const track = $('.carousel-track', carousel);
    const prev = $('.carousel-btn--prev', carousel);
    const next = $('.carousel-btn--next', carousel);
    if (!track) return;
    const step = () => Math.min(track.clientWidth * 0.82, 440);
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });

  /* ---------- project filters ---------- */
  const filters = $$('.filter');
  const cards = $$('[data-tags]');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- copy bibtex ---------- */
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copy);
      if (!target) return;
      const text = target.innerText;
      const done = () => {
        const old = btn.textContent;
        btn.textContent = 'COPIED';
        setTimeout(() => { btn.textContent = old; }, 1600);
      };
      try {
        await navigator.clipboard.writeText(text);
        done();
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        done();
      }
    });
  });

  /* ---------- lightbox ---------- */
  const lightbox = $('.lightbox');
  if (lightbox) {
    const img = $('img', lightbox);
    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    $$('.zoomable').forEach((el) => {
      el.addEventListener('click', () => {
        const src = el.dataset.full || el.currentSrc || el.src;
        if (!src || !img) return;
        img.src = src;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
    $('.lightbox-close', lightbox)?.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) close();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }

  /* ---------- year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- hero spotlight ---------- */
  const hero = $('.hero');
  if (hero) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      hero.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  }

  /* ---------- tiny toast helper ---------- */
  window.PA = window.PA || {};
  window.PA.toast = (message) => {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };
})();
