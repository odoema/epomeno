/* Epomeno Investment Ltd — site behaviour (no dependencies) */
(() => {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- header, progress, back-to-top ---------- */
  const header = $('.site-header');
  const progress = $('.progress');
  const toTop = $('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle('is-solid', y > 40);
    if (progress) {
      const h = doc.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
    toTop && toTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  /* ---------- mobile menu ---------- */
  const toggle = $('.menu-toggle');
  if (toggle) {
    const close = () => { document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- hero slider ---------- */
  const hero = $('.hero');
  if (hero) {
    const slides = $$('.slide', hero);
    const dots = $$('.ruler button', hero);
    const DUR = 7000;
    let i = 0, timer = null, busy = false, paused = false;
    hero.style.setProperty('--dur', DUR + 'ms');

    const setDots = n => dots.forEach((d, k) => {
      d.setAttribute('aria-current', k === n ? 'true' : 'false');
      // restart fill animation
      const f = $('.fill', d); if (f) { f.style.animation = 'none'; void f.offsetWidth; f.style.animation = ''; }
    });

    const go = n => {
      n = (n + slides.length) % slides.length;
      if (n === i || busy) return;
      busy = true;
      const cur = slides[i], next = slides[n];
      cur.classList.add('is-leaving'); cur.classList.remove('is-active');
      next.classList.add('is-entering');
      next.removeAttribute('aria-hidden'); cur.setAttribute('aria-hidden', 'true');
      setDots(n);
      const done = () => {
        next.classList.remove('is-entering'); next.classList.add('is-active');
        cur.classList.remove('is-leaving');
        busy = false;
      };
      reduced ? done() : setTimeout(done, 1150);
      i = n;
      schedule();
    };
    const schedule = () => { clearTimeout(timer); if (!paused) timer = setTimeout(() => go(i + 1), DUR); };
    const pause = v => { paused = v; hero.classList.toggle('is-paused', v); v ? clearTimeout(timer) : schedule(); };

    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    $('.slider-prev', hero)?.addEventListener('click', () => go(i - 1));
    $('.slider-next', hero)?.addEventListener('click', () => go(i + 1));
    hero.addEventListener('mouseenter', () => pause(true));
    hero.addEventListener('mouseleave', () => pause(false));
    hero.addEventListener('focusin', () => pause(true));
    hero.addEventListener('focusout', e => { if (!hero.contains(e.relatedTarget)) pause(false); });
    hero.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    });
    // swipe
    let sx = 0, sy = 0;
    hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
    });
    document.addEventListener('visibilitychange', () => pause(document.hidden));
    // preload remaining slide images after first paint
    window.addEventListener('load', () => $$('img[data-src]', hero).forEach(img => { img.src = img.dataset.src; }));

    slides.forEach((s, k) => { if (k) s.setAttribute('aria-hidden', 'true'); });
    slides[0].classList.add('is-active');
    setDots(0);
    schedule();
  }

  /* ---------- reveal on scroll ---------- */
  const revealables = $$('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    revealables.forEach(el => io.observe(el));
  } else revealables.forEach(el => el.classList.add('in'));

  /* ---------- counters ---------- */
  const counters = $$('[data-count]');
  const fmt = (v, dec) => v.toLocaleString('en-UG', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const run = el => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    if (reduced) { el.textContent = fmt(end, dec); return; }
    const t0 = performance.now(), d = 1600;
    const tick = t => {
      const p = Math.min((t - t0) / d, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(end * e, dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } }), { threshold: .6 });
    counters.forEach(c => co.observe(c));
  } else counters.forEach(run);

  /* ---------- gallery filter ---------- */
  const filterBtns = $$('.filters button');
  const items = $$('.g-item');
  filterBtns.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    filterBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    items.forEach(it => {
      const show = f === 'all' || it.dataset.cat.split(' ').includes(f);
      if (show) {
        it.classList.remove('is-hidden');
        if (!reduced) { it.style.opacity = 0; it.style.transform = 'scale(.97)'; requestAnimationFrame(() => requestAnimationFrame(() => { it.style.opacity = ''; it.style.transform = ''; })); }
      } else it.classList.add('is-hidden');
    });
  }));

  /* ---------- lightbox ---------- */
  const lb = $('.lightbox');
  if (lb && items.length) {
    const img = $('img', lb), cap = $('figcaption', lb);
    let idx = 0, lastFocus = null;
    const visible = () => items.filter(x => !x.classList.contains('is-hidden'));
    const show = n => {
      const list = visible(); idx = (n + list.length) % list.length;
      const it = list[idx], src = $('img', it);
      img.src = src.currentSrc || src.src; img.alt = src.alt;
      cap.textContent = $('figcaption', it)?.innerText.replace(/\n+/g, ' · ') || '';
    };
    const open = it => { lastFocus = document.activeElement; show(visible().indexOf(it)); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); $('.lb-close', lb).focus(); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
    items.forEach(it => {
      it.tabIndex = 0; it.setAttribute('role', 'button');
      it.addEventListener('click', () => open(it));
      it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); } });
    });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  /* ---------- contact form (static host: hands off to email / WhatsApp) ---------- */
  const form = $('#quote-form');
  if (form) {
    const build = () => {
      const d = new FormData(form);
      return `Hello Epomeno Investment Ltd,\n\nName: ${d.get('name')}\nOrganisation: ${d.get('org') || '-'}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email') || '-'}\nService: ${d.get('service')}\n\n${d.get('message')}`;
    };
    const status = $('.form-status', form);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const subject = encodeURIComponent(`Quotation request: ${new FormData(form).get('service')}`);
      window.location.href = `mailto:epomenoinvestmentsltd@gmail.com?subject=${subject}&body=${encodeURIComponent(build())}`;
      status && (status.textContent = 'Your email app has opened with the request filled in. Press send there to reach us.');
    });
    $('#send-wa')?.addEventListener('click', () => {
      if (!form.reportValidity()) return;
      window.open(`https://wa.me/256757607644?text=${encodeURIComponent(build())}`, '_blank', 'noopener');
      status && (status.textContent = 'WhatsApp has opened with your request. Press send there to reach us.');
    });
  }

  /* ---------- year ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
