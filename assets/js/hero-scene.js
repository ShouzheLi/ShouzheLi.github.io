/* Lightweight canvas hero: articulated arm with flowing ribbons.
   No dependencies, DPR-aware, pauses off-screen, static under reduced motion. */
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#1e3569', '#3f5f92', '#7fa2d9', '#2f6b5f', '#9fb0c8', '#d8b48a'];
  let w = 0, h = 0, dpr = 1, raf = 0, start = performance.now(), visible = true;

  function roundRect(x, y, rw, rh, r) {
    const rr = Math.min(r, Math.abs(rw) / 2, Math.abs(rh) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + rw, y, x + rw, y + rh, rr);
    ctx.arcTo(x + rw, y + rh, x, y + rh, rr);
    ctx.arcTo(x, y + rh, x, y, rr);
    ctx.arcTo(x, y, x + rw, y, rr);
    ctx.closePath();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ribbons(t) {
    const x0 = w * 0.40;
    const y0 = h * 0.31;
    for (let i = 0; i < COLORS.length; i++) {
      const phase = i * 0.72;
      const amp = h * (0.05 + 0.012 * (i % 3));
      const thick = h * (0.058 - i * 0.0045);
      const steps = 44;
      const top = [];
      const bottom = [];
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const x = x0 + (w + 70 - x0) * u;
        const base = y0 + h * 0.16 * u * u;
        const y = base + Math.sin(u * 3.1 + phase + t * 0.65) * amp * u;
        const taper = thick * (0.22 + 0.78 * (1 - u));
        top.push([x, y - taper / 2]);
        bottom.push([x, y + taper / 2]);
      }
      ctx.beginPath();
      top.forEach(([x, y], idx) => (idx ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      for (let s = bottom.length - 1; s >= 0; s--) ctx.lineTo(bottom[s][0], bottom[s][1]);
      ctx.closePath();
      const grad = ctx.createLinearGradient(x0, 0, w, 0);
      grad.addColorStop(0, COLORS[i]);
      grad.addColorStop(1, 'rgba(30,53,105,0.04)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.92 - i * 0.09;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function arm(t) {
    const scale = Math.min(w, h) / 520;
    const bob = reduced ? 0 : Math.sin(t * 0.8) * 3 * scale;
    ctx.save();
    ctx.translate(w * 0.335, h * 0.86 + bob);
    ctx.scale(scale, scale);

    ctx.save();
    ctx.scale(1, 0.26);
    const shadow = ctx.createRadialGradient(0, 0, 6, 0, 0, 150);
    shadow.addColorStop(0, 'rgba(30,40,60,0.22)');
    shadow.addColorStop(1, 'rgba(30,40,60,0)');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const body = ctx.createLinearGradient(-60, -60, 80, 40);
    body.addColorStop(0, '#ffffff');
    body.addColorStop(1, '#d6d6d6');
    ctx.fillStyle = body;
    ctx.strokeStyle = '#c2c2c2';
    ctx.lineWidth = 1.5;

    roundRect(-74, -52, 148, 52, 16);
    ctx.fill();
    ctx.stroke();

    roundRect(-31, -206, 62, 158, 27);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -214, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    roundRect(-36, -268, 72, 54, 12);
    ctx.fill();
    ctx.stroke();

    const jaw = ctx.createLinearGradient(-30, -330, 30, -270);
    jaw.addColorStop(0, '#f7f7f7');
    jaw.addColorStop(1, '#cfcfcf');
    ctx.fillStyle = jaw;

    roundRect(-30, -330, 15, 66, 7);
    ctx.fill();
    ctx.stroke();
    roundRect(15, -330, 15, 66, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1e3569';
    ctx.fillRect(-9, -262, 18, 3);
    ctx.restore();
  }

  function draw(now) {
    const t = reduced ? 0 : (now - start) / 1000;
    ctx.clearRect(0, 0, w, h);
    ribbons(t);
    arm(t);
  }

  function frame(now) {
    if (visible) draw(now);
    raf = requestAnimationFrame(frame);
  }

  resize();
  canvas.parentElement.classList.add('is-live');
  if (reduced) {
    draw(start);
  } else {
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => {
    resize();
    if (reduced) draw(start);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(canvas);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduced) raf = requestAnimationFrame(frame);
  });
})();
