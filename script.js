(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     NAV: scrolled state + mobile burger + active link
  --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  const sections = ['vision', 'works', 'plans', 'process', 'contact'].map(id => document.getElementById(id));
  const navAnchors = Array.from(navLinks.querySelectorAll('a'));
  const setActiveLink = () => {
    let current = sections[0];
    sections.forEach(sec => { if (sec && window.scrollY + window.innerHeight * 0.4 >= sec.offsetTop) current = sec; });
    navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------------------------------------------------------
     Reading progress bar
  --------------------------------------------------------- */
  const progressBar = document.getElementById('progressBar');
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  };
  window.addEventListener('scroll', onScrollProgress, { passive: true });
  onScrollProgress();

  /* ---------------------------------------------------------
     Custom cursor dot (desktop / mouse only)
  --------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  if (window.matchMedia('(hover:hover)').matches) {
    let cx = 0, cy = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursorDot.classList.add('is-active');
    });
    const raf = () => {
      dx += (cx - dx) * 0.18;
      dy += (cy - dy) * 0.18;
      cursorDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    raf();
    document.querySelectorAll('a, button, .plan, .works__thumb, input, textarea')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.classList.add('is-grown'));
        el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-grown'));
      });
  }

  /* ---------------------------------------------------------
     Hero ambient glow follows the pointer
  --------------------------------------------------------- */
  const hero = document.getElementById('hero');
  const heroGlow = document.getElementById('heroGlow');
  if (hero && heroGlow && !reduceMotion) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      heroGlow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });
  }

  /* ---------------------------------------------------------
     Hero video sound toggle
  --------------------------------------------------------- */
  const soundToggle = document.getElementById('soundToggle');
  const heroVideo = document.querySelector('.hero__video');
  if (soundToggle && heroVideo) {
    const iconOff = soundToggle.querySelector('.icon-sound-off');
    const iconOn = soundToggle.querySelector('.icon-sound-on');

    soundToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      const isMuted = heroVideo.muted;
      iconOff.style.display = isMuted ? 'block' : 'none';
      iconOn.style.display = isMuted ? 'none' : 'block';
      soundToggle.setAttribute('aria-label', isMuted ? 'Activer le son' : 'Désactiver le son');
    });
  }

  /* ---------------------------------------------------------
     Scroll reveals (IntersectionObserver)
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal, .process__connector');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     Timeline: fill line + light up dots as they enter view
  --------------------------------------------------------- */
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timelineFill');
  const timelineItems = timeline ? Array.from(timeline.querySelectorAll('.timeline__item')) : [];
  if (timeline) {
    const tio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = timelineItems.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('is-hit'), idx * 140);
          tio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    timelineItems.forEach(item => tio.observe(item));

    const fio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineFill.style.width = '100%';
          fio.disconnect();
        }
      });
    }, { threshold: 0.3 });
    fio.observe(timeline);
  }

  /* ---------------------------------------------------------
     Magnetic hover on the discovery-call button
  --------------------------------------------------------- */
  const magneticBtn = document.getElementById('magneticBtn');
  if (magneticBtn && window.matchMedia('(hover:hover)').matches && !reduceMotion) {
    magneticBtn.addEventListener('mousemove', e => {
      const r = magneticBtn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      magneticBtn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    magneticBtn.addEventListener('mouseleave', () => { magneticBtn.style.transform = ''; });
  }

  /* ---------------------------------------------------------
     Contact form — visual confirmation
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-pill');
      btn.classList.add('is-sent');
      setTimeout(() => {
        btn.classList.remove('is-sent');
        contactForm.reset();
      }, 2200);
    });
  }

})();
