(function() {
  'use strict';

  // ========== FORÇAR MODO CLARO (adicional) ==========
  const enforceLightMode = () => {
    document.documentElement.style.setProperty('color-scheme', 'only light');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#1e2a3a';
    // Remove qualquer classe dark que possa ter sido injetada
    document.body.classList.remove('dark-mode', 'dark');
  };
  enforceLightMode();
  // Observador para garantir após mudanças dinâmicas
  const observer = new MutationObserver(() => enforceLightMode());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // ========== HEADER SCROLL ==========
  const header = document.getElementById('header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ========== REVEAL ANIMATIONS ==========
  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealIo.observe(el));

  // ========== CARROSSEL DE DEPOIMENTOS ==========
  const track = document.getElementById('track');
  if (track) {
    // Depoimentos estáticos (para exemplo)
    const testimonialsData = [
      { name: 'Alexandre Moraes', text: '"Nos sentimos bem confortáveis na loja, preço justo e entrega no prazo."', stars: 5 },
      { name: 'Vera Freitas', text: '"Comprei pelo WhatsApp, atendimento excelente, enviaram vídeos dos colchões. Entregador muito atencioso."', stars: 5 },
      { name: 'Evelyn Santos', text: '"Excelente atendimento, produtos de boa qualidade e preço justo. Super indico."', stars: 5 },
      { name: 'Mariana Alves', text: '"Entregadores cuidadosos, subiram 4 andares e montaram o box no lugar."', stars: 5 }
    ];
    track.innerHTML = testimonialsData.map(t => `
      <figure class="testimonial">
        <div class="stars">${'★'.repeat(t.stars)}</div>
        <blockquote>${t.text}</blockquote>
        <cite><span class="avatar">${t.name.charAt(0)}</span><span>${t.name}</span></cite>
      </figure>
    `).join('');
    
    const slides = track.children;
    const total = slides.length;
    const dotsEl = document.getElementById('dots');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let perView = window.innerWidth < 900 ? 1 : 2;
    let idx = 0;
    let timer;

    const pages = () => Math.ceil(total / perView);
    const buildDots = () => {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      for (let i = 0; i < pages(); i++) {
        const btn = document.createElement('button');
        btn.className = `dot ${i === idx ? 'active' : ''}`;
        btn.setAttribute('aria-label', `Página ${i+1}`);
        btn.addEventListener('click', () => go(i));
        dotsEl.appendChild(btn);
      }
    };
    const update = () => {
      const slideW = slides[0]?.getBoundingClientRect().width || 300;
      const gap = 24;
      track.style.transform = `translateX(-${idx * perView * (slideW + gap)}px)`;
      if (dotsEl) {
        [...dotsEl.children].forEach((d, i) => d.classList.toggle('active', i === idx));
      }
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx === pages() - 1;
    };
    const go = (n) => {
      idx = Math.max(0, Math.min(pages() - 1, n));
      update();
      resetAuto();
    };
    const next = () => {
      idx = (idx + 1) % pages();
      update();
    };
    const resetAuto = () => {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    };
    if (prevBtn) prevBtn.addEventListener('click', () => go(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(idx + 1));
    
    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    });
    
    const initCarousel = () => {
      perView = window.innerWidth < 900 ? 1 : 2;
      buildDots();
      update();
      resetAuto();
    };
    initCarousel();
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initCarousel, 150);
    });
  }

  // ========== MAPA INTERATIVO ==========
  const mapCard = document.getElementById('mapCard');
  if (mapCard) {
    const loadMap = () => {
      if (mapCard.dataset.loaded) return;
      mapCard.dataset.loaded = '1';
      const iframe = document.createElement('iframe');
      iframe.className = 'map-iframe';
      iframe.loading = 'lazy';
      iframe.title = 'Mapa ProBox Colchões';
      iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(mapCard.dataset.mapsQuery || 'Probox Colchoes Ipiranga')}&output=embed`;
      iframe.style.position = 'absolute';
      iframe.style.inset = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.style.transition = 'opacity 0.6s';
      iframe.onload = () => { iframe.style.opacity = '1'; };
      mapCard.appendChild(iframe);
    };
    const events = ['click', 'mouseenter', 'touchstart'];
    events.forEach(ev => mapCard.addEventListener(ev, loadMap, { once: true, passive: true }));
    mapCard.style.cursor = 'pointer';
  }

  // ========== FAB (opcional: exibir por 2s) ==========
  const fab = document.getElementById('fab');
  if (fab) {
    setTimeout(() => {
      fab.classList.add('expanded');
      setTimeout(() => fab.classList.remove('expanded'), 3000);
    }, 2000);
  }

})();