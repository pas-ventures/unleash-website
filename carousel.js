// Auto-advance every carousel by one card; pause while the visitor hovers, touches or focuses it.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.rail,.vrail,.srail').forEach((r, i) => {
    let paused = false, idle = 0;
    const hold = () => { paused = true; idle = Date.now(); };
    ['mouseenter', 'touchstart', 'focusin', 'wheel'].forEach(e => r.addEventListener(e, hold, { passive: true }));
    r.addEventListener('mouseleave', () => { paused = false; });
    const sec = r.closest('section');
    sec && sec.querySelectorAll('.ctrl button').forEach(b => b.addEventListener('click', hold));
    setTimeout(() => setInterval(() => {
      if (paused && Date.now() - idle < 8000) return;
      if (paused && !r.matches(':hover')) paused = false;
      if (paused || document.hidden) return;
      const c = r.firstElementChild; if (!c) return;
      const step = c.getBoundingClientRect().width + 16;
      const end = r.scrollLeft + r.clientWidth >= r.scrollWidth - 4;
      r.scrollTo({ left: end ? 0 : r.scrollLeft + step, behavior: 'smooth' });
    }, 4000), i * 700);
  });
})();
