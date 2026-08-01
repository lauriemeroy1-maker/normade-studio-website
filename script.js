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

  const sections = ['vision', 'works', 'plans', 'process', 'contact', 'about'].map(id => document.getElementById(id));
  const navAnchors = Array.from(navLinks.querySelectorAll('a'));
  const setActiveLink = () => {
    let current = sections[0];
    sections.forEach(sec => { if (window.scrollY + window.innerHeight * 0.4 >= sec.offsetTop) current = sec; });
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
     WORKS — thumbnail switcher (desktop) + swipe rail (mobile)
  --------------------------------------------------------- */
  const projects = [
    {
      tag: '▶ Full Creative',
      caption: "Seoul100K ∙ Rebranding & event design",
      image: 'https://i.ibb.co/1GVXHVhh/WEBWORKS-01.png',
      thumbImage: 'https://i.ibb.co/Z1W3XPmC/WEBWORKS-02.png',
      url: 'https://www.behance.net/gallery/252926093/FULL-BRANDING-Seoul100K-(2024-2025-2026)'
    },
    {
      tag: '▶ Full Creative',
      caption: 'Sports in Motion ∙ Sports Photography Collection',
      image: 'https://i.ibb.co/jPdvJt5J/WEBWORKS-03.png',
      thumbImage: 'https://i.ibb.co/tMfh9sPt/WEBWORKS-04.png',
      gradient: 'linear-gradient(135deg, #050505, #21201c)',
      url: 'https://www.behance.net/gallery/253011801/Sports-in-motion'
    },
    {
      tag: '▶ Brand Design',
      caption: 'Honey Turtle ∙ Brand Development for International Market',
      image: 'https://i.ibb.co/TMJH0W79/WEBWORKS-05.png',
      thumbImage: 'https://i.ibb.co/6JLjP4H7/WEBWORKS-06.png',
      gradient: 'linear-gradient(135deg, #050505, #1c1c1c)',
      url: 'https://www.behance.net/ton-projet-3'
    },
    {
      tag: '▶ Motion Flow',
      caption: 'Marathon Video ∙ Teaser, LED Vjing, Motion graphics for Sports Events',
      image: 'https://i.ibb.co/svV5ztFL/WEBWORKS-07.png',
      thumbImage: 'https://i.ibb.co/PGV9HT8V/WEBWORKS-08.png',
      gradient: 'linear-gradient(135deg, #050505, #262622)',
      url: 'https://www.behance.net/gallery/252451175/VIJING-at-Running-Events'
    },
    {
      tag: '▶ Full Creative',
      caption: 'The Korean Dream Travel ∙ Brand Design for a French travel company in Korea',
      image: 'https://i.ibb.co/84nm6yFr/WEBWORKS-09.png',
      thumbImage: 'https://i.ibb.co/fdByvW99/WEBWORKS-10.png',
      gradient: 'linear-gradient(135deg, #050505, #1e1e1e)',
      url: 'https://www.behance.net/ton-projet-5'
    }
  ];

  const WINDOW_SIZE = 3;
  const AUTOPLAY_DELAY = 7500;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const worksMedia = document.getElementById('worksMedia');
  const worksCaption = document.getElementById('worksCaption');
  const worksIndexLabel = document.getElementById('worksIndex');
  const thumbList = document.getElementById('thumbList');
  const thumbDown = document.getElementById('thumbDown');
  const worksThumbsWrap = document.getElementById('worksThumbs');

  let activeIndex = 0;
  let windowStart = 0;
  let autoplayTimer = null;

  const pad2 = n => String(n + 1).padStart(2, '0');

  const renderThumbList = () => {
    if (!thumbList) return;
    thumbList.innerHTML = '';
    for (let i = 0; i < WINDOW_SIZE; i++) {
      const idx = (windowStart + i) % projects.length;
      const p = projects[idx];
      const btn = document.createElement('button');
      btn.className = 'works__thumb' + (idx === activeIndex ? ' is-active' : '');
      btn.dataset.index = idx;
      
      if (p.thumbImage) {
        btn.style.backgroundImage = `url("${p.thumbImage}")`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
      }
      btn.addEventListener('click', () => setActiveProject(idx, { pause: true }));
      thumbList.appendChild(btn);
    }
  };

  const setActiveProject = (index, { fromRail, pause } = {}) => {    
    activeIndex = (index + projects.length) % projects.length;      
    if (activeIndex < windowStart) windowStart = activeIndex; 
    if (activeIndex > windowStart + WINDOW_SIZE - 1) windowStart = activeIndex - WINDOW_SIZE + 1; 
    windowStart = (windowStart + projects.length) % projects.length;      
    
    const project = projects[activeIndex]; 
    const worksTag = document.getElementById('worksTag');

    if (worksMedia) {
      worksMedia.style.backgroundColor = '#FFFFFF';
      worksMedia.style.transition = 'opacity .35s ease'; 
      worksMedia.style.opacity = '0'; 
      
      setTimeout(() => {      
        if (project.image) {
          worksMedia.style.backgroundImage = `url("${project.image}")`;
          worksMedia.style.backgroundSize = 'cover';
          worksMedia.style.backgroundPosition = 'center';
          worksMedia.style.backgroundRepeat = 'no-repeat';
        } else {
          worksMedia.style.backgroundImage = 'none';
          worksMedia.style.background = project.gradient; 
        }

        if (worksCaption) worksCaption.textContent = project.caption; 
        if (worksTag) worksTag.textContent = project.tag; 

        const worksLink = document.getElementById('worksLink');
        if (worksLink && project.url) {
          worksLink.href = project.url;
        }

        worksMedia.style.opacity = '1'; 
      }, 300); 
    }

    if (worksIndexLabel) worksIndexLabel.textContent = `${pad2(activeIndex)} / ${pad2(projects.length - 1)}`;      
    renderThumbList(); 
    
    const railButtons = document.querySelectorAll('#thumbRail .works__thumb'); 
    railButtons.forEach((btn, i) => btn.classList.toggle('is-active', i === activeIndex)); 
    
    if (!fromRail) {      
      const railBtn = railButtons[activeIndex]; 
      if (railBtn) railBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); 
    }      
    
    if (pause) restartAutoplay(); 
  };

  const pageWindowDown = () => {    
    windowStart = (windowStart + 1) % projects.length; 
    setActiveProject(windowStart, { pause: true }); 
  }; 

  if (thumbDown) thumbDown.addEventListener('click', pageWindowDown);      

  if (worksThumbsWrap) {    
    const rail = document.createElement('div'); 
    rail.className = 'works__thumb-rail'; 
    rail.id = 'thumbRail'; 
    projects.forEach((p, i) => {      
      const btn = document.createElement('button'); 
      btn.className = 'works__thumb' + (i === 0 ? ' is-active' : ''); 
      
      if (p.thumbImage) {
        btn.style.backgroundImage = `url("${p.thumbImage}")`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
      }

      btn.addEventListener('click', () => setActiveProject(i, { fromRail: true, pause: true })); 
      rail.appendChild(btn); 
    }); 
    worksThumbsWrap.insertAdjacentElement('afterend', rail); 
  }      

  const startAutoplay = () => {    
    if (reduceMotion || isTouchDevice) return; 
    autoplayTimer = setInterval(() => {      
      setActiveProject(activeIndex + 1); 
    }, AUTOPLAY_DELAY); 
  }; 

  const restartAutoplay = () => {    
    if (isTouchDevice) return;
    clearInterval(autoplayTimer); 
    startAutoplay(); 
  }; 

  if (worksThumbsWrap && !isTouchDevice) {    
    worksThumbsWrap.addEventListener('mouseenter', () => clearInterval(autoplayTimer)); 
    worksThumbsWrap.addEventListener('mouseleave', startAutoplay); 
  }      

  if (projects.length > 0) setActiveProject(0); 
  startAutoplay();

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
