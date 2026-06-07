(() => {
  'use strict';

  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => revealIO.observe(el));

  setTimeout(() => {
    const fab = document.getElementById('fab');
    if (!fab) return;
    fab.classList.add('expanded');
    setTimeout(() => fab.classList.remove('expanded'), 3200);
  }, 4000);

  const tilt = document.querySelector('.hero-tilt');
  if (tilt && matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const visual = document.querySelector('.hero-visual');
    visual.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(1200px) rotateY(${-3 + x * 6}deg) rotateX(${1 - y * 6}deg) translateY(${y * -4}px)`;
    });
    visual.addEventListener('mouseleave', () => { tilt.style.transform = ''; });
  }

  const track = document.getElementById('track');
  if (track) {
    const slides = track.children;
    const total = slides.length;
    const dotsEl = document.getElementById('dots');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let perView = 2, idx = 0, timer;

    const pages = () => Math.ceil(total / perView);
    const buildDots = () => {
      dotsEl.innerHTML = '';
      for (let i = 0; i < pages(); i++) {
        const b = document.createElement('button');
        b.className = 'dot' + (i === 0 ? ' active' : '');
        b.setAttribute('aria-label', `Página ${i + 1}`);
        b.addEventListener('click', () => go(i));
        dotsEl.appendChild(b);
      }
    };
    const update = () => {
      const slideW = slides[0].getBoundingClientRect().width;
      const gap = 24;
      track.style.transform = `translateX(-${idx * perView * (slideW + gap)}px)`;
      [...dotsEl.children].forEach((d, i) => d.classList.toggle('active', i === idx));
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === pages() - 1;
    };
    const go = (n) => { idx = Math.max(0, Math.min(pages() - 1, n)); update(); resetAuto(); };
    const next = () => { idx = (idx + 1) % pages(); update(); };
    const resetAuto = () => { clearInterval(timer); timer = setInterval(next, 6000); };

    prevBtn.addEventListener('click', () => go(idx - 1));
    nextBtn.addEventListener('click', () => go(idx + 1));

    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    });

    const init = () => {
      perView = innerWidth < 900 ? 1 : 2;
      buildDots();
      update();
      resetAuto();
    };
    init();
    let rT;
    addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(init, 150); });
  }

  const mapCard = document.getElementById('mapCard');
  if (mapCard) {
    // Lazy load REAL: só carrega o iframe Google Maps após interação do usuário.
    // Antes disso, zero requests/cookies pro google.com — protege performance e privacidade.
    const loadMap = () => {
      if (mapCard.dataset.loaded) return;
      mapCard.dataset.loaded = '1';
      const iframe = document.createElement('iframe');
      iframe.className = 'map-iframe';
      iframe.loading = 'lazy';
      iframe.title = 'Mapa interativo da loja ProBox Colchões';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(mapCard.dataset.mapsQuery || 'Probox Colchoes Ipiranga') + '&output=embed';
      iframe.addEventListener('load', () => mapCard.classList.add('is-loaded'), { once: true });
      mapCard.appendChild(iframe);
    };

    // Carrega no primeiro clique/hover ou após scroll significativo (consent implícito por interação).
    const onInteract = () => {
      loadMap();
      mapCard.removeEventListener('click', onInteract);
      mapCard.removeEventListener('mouseenter', onInteract);
      mapCard.removeEventListener('touchstart', onInteract);
    };
    mapCard.addEventListener('click', onInteract);
    mapCard.addEventListener('mouseenter', onInteract);
    mapCard.addEventListener('touchstart', onInteract, { passive: true });
    mapCard.style.cursor = 'pointer';
  }
})();