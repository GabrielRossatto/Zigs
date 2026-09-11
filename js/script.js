document.addEventListener('DOMContentLoaded', () => {

  /* PRELOADER */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 300);
  });
  setTimeout(() => preloader && preloader.classList.add('hidden'), 1800);

  /* HEADER SCROLL STATE */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (header) {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    if (backToTop) {
      if (window.scrollY > 600) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  /* MOBILE NAV */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('open');
    });
    document.querySelectorAll('.main-nav .nav-link, .dropdown-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mainNav.classList.remove('open');
      });
    });
  }

  /* MOBILE DROPDOWN TOGGLE */
  const navDropdown = document.querySelector('.nav-dropdown');
  if (navDropdown) {
    const dropdownTrigger = navDropdown.querySelector('.nav-link');
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        navDropdown.classList.toggle('open');
      }
    });
  }

  /* BACK TO TOP */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* HERO VIDEO FALLBACK: hide video element if source fails to load */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; }, true);
    const source = heroVideo.querySelector('source');
    if (source) {
      source.addEventListener('error', () => { heroVideo.style.display = 'none'; });
    }
  }

  /* STAT COUNTER */
  const counters = document.querySelectorAll('.stat-number');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* CURRENT YEAR */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* GALLERY CAROUSEL */
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const images = [...gallery.querySelectorAll('[data-gallery-image]')];
    const prevPeek = gallery.querySelector('[data-gallery-prev]');
    const nextPeek = gallery.querySelector('[data-gallery-next]');
    if (!images.length) return;

    let current = 0;

    function show(index) {
      current = (index + images.length) % images.length;
      images.forEach((img, i) => img.classList.toggle('active', i === current));
      if (prevPeek) prevPeek.src = images[(current - 1 + images.length) % images.length].src;
      if (nextPeek) nextPeek.src = images[(current + 1) % images.length].src;
    }

    gallery.querySelector('.gallery-prev').addEventListener('click', () => show(current - 1));
    gallery.querySelector('.gallery-next').addEventListener('click', () => show(current + 1));

    show(0);
  });

  /* SPECS ACCORDION (Diferenciais e Características) */
  document.querySelectorAll('.emp-specs-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.emp-specs-text');
      if (!wrap) return;
      const isOpen = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* PLAN FULLSCREEN LIGHTBOX */
  const planImages = document.querySelectorAll('.plan-block img');
  if (planImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'plan-lightbox';
    lightbox.innerHTML = '<button class="plan-lightbox-close" aria-label="Fechar">&times;</button><img alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.plan-lightbox-close');

    const openLightbox = (img) => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    planImages.forEach(img => img.addEventListener('click', () => openLightbox(img)));
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

});
