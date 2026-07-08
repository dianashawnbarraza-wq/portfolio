(function () {
  const PASSWORD = 'iterate2026';
  const STORAGE_KEY = document.body.dataset.authKey || 'cs-auth-checking-adoption';

  const gate = document.getElementById('cs-gate');
  const content = document.getElementById('cs-content');
  const form = document.getElementById('cs-gate-form');
  const errorEl = document.getElementById('cs-gate-error');
  const passwordInput = document.getElementById('cs-password');

  function unlock() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    gate.classList.add('hidden');
    content.hidden = false;
    initPage();
  }

  if (sessionStorage.getItem(STORAGE_KEY)) {
    gate.classList.add('hidden');
    content.hidden = false;
    initPage();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value === PASSWORD) {
      errorEl.textContent = '';
      unlock();
    } else {
      errorEl.textContent = 'Incorrect password. Please try again.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  function initPage() {
    initStickyNav();
    initBeforeAfter();
    initMobileNav();
    initFadeIn();
    initScreenLightbox();
    initFlowPrototype();
    initCaseStudyNav();
  }

  const CASE_STUDIES = [
    { file: 'case-study-checking.html', title: 'Lifting Square Checking activation by centering design around money movement' },
    { file: 'case-study-biller-network.html', title: 'Increasing Bill Pay coverage by eliminating the cold start' },
    { file: 'case-study-debit-card-activation.html', title: 'Decoupling the debit card from Checking with virtual card-first onboarding' },
    { file: 'case-study-bill-pay-vendors.html', title: 'Getting vendors to trust their first Bill Pay payment' },
    { file: 'case-study-flyhomes-tour-booking.html', title: 'Cutting tour confirmation from hours to minutes' },
    { file: 'case-study-heal-primary-care.html', title: 'From one-time visits to ongoing primary care' },
    { file: 'case-study-heal-health-monitoring.html', title: 'Preventative care with data-driven patient health monitoring' },
  ];

  function initCaseStudyNav() {
    const main = document.querySelector('.cs-main');
    if (!main || document.querySelector('.cs-case-nav')) return;

    const currentFile = window.location.pathname.split('/').pop() || '';
    const index = CASE_STUDIES.findIndex((study) => currentFile === study.file);
    if (index === -1) return;

    const prev = index > 0 ? CASE_STUDIES[index - 1] : null;
    const next = index < CASE_STUDIES.length - 1 ? CASE_STUDIES[index + 1] : null;

    const nav = document.createElement('nav');
    nav.className = 'cs-case-nav';
    nav.setAttribute('aria-label', 'Case study navigation');

    const inner = document.createElement('div');
    inner.className = 'cs-case-nav__inner';

    if (prev) {
      const prevLink = document.createElement('a');
      prevLink.className = 'cs-case-nav__link cs-case-nav__link--prev';
      prevLink.href = prev.file;
      prevLink.innerHTML = `<span class="cs-case-nav__eyebrow">Previous</span><span class="cs-case-nav__title">${prev.title}</span>`;
      inner.appendChild(prevLink);
    } else {
      const backLink = document.createElement('a');
      backLink.className = 'cs-case-nav__link cs-case-nav__link--prev';
      backLink.href = 'index.html#featured-works';
      backLink.innerHTML = '<span class="cs-case-nav__eyebrow">Portfolio</span><span class="cs-case-nav__title">All featured work</span>';
      inner.appendChild(backLink);
    }

    const progress = document.createElement('span');
    progress.className = 'cs-case-nav__progress';
    progress.textContent = `${index + 1} / ${CASE_STUDIES.length}`;
    inner.appendChild(progress);

    if (next) {
      const nextLink = document.createElement('a');
      nextLink.className = 'cs-case-nav__link cs-case-nav__link--next';
      nextLink.href = next.file;
      nextLink.innerHTML = `<span class="cs-case-nav__eyebrow">Next case study</span><span class="cs-case-nav__title">${next.title}</span>`;
      inner.appendChild(nextLink);
    } else {
      const backLink = document.createElement('a');
      backLink.className = 'cs-case-nav__link cs-case-nav__link--next';
      backLink.href = 'index.html#featured-works';
      backLink.innerHTML = '<span class="cs-case-nav__eyebrow">Portfolio</span><span class="cs-case-nav__title">Back to all featured work</span>';
      inner.appendChild(backLink);
    }

    nav.appendChild(inner);
    main.appendChild(nav);
  }

  function initStickyNav() {
    const links = document.querySelectorAll('.cs-nav a, .cs-mobile-nav a');
    const sections = [...links]
      .map((link) => {
        const id = link.getAttribute('href').slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initBeforeAfter() {
    document.querySelectorAll('[data-before-after]').forEach((root) => {
      const slider = root.querySelector('.before-after__slider');
      const afterLayer = root.querySelector('.before-after__after');
      const handle = root.querySelector('.before-after__handle');
      if (!slider || !afterLayer || !handle) return;

      const update = (value) => {
        afterLayer.style.width = `${value}%`;
        handle.style.left = `${value}%`;
      };

      slider.addEventListener('input', (e) => update(e.target.value));
      update(slider.value || 50);
    });
  }

  function initMobileNav() {
    const btn = document.getElementById('cs-mobile-nav-btn');
    const nav = document.getElementById('cs-mobile-nav');
    const close = document.getElementById('cs-mobile-nav-close');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => nav.classList.add('open'));
    close.addEventListener('click', () => nav.classList.remove('open'));
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  function initFadeIn() {
    const items = document.querySelectorAll('.metric-card, .process-step, .chart-card, .quote-block');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  function initScreenLightbox() {
    const triggers = document.querySelectorAll('.cs-flow-expand, .cs-ipad-expand');
    if (!triggers.length) return;

    let lightbox = document.getElementById('cs-flow-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'cs-flow-lightbox';
      lightbox.className = 'cs-flow-lightbox';
      lightbox.hidden = true;
      lightbox.innerHTML = `
        <button type="button" class="cs-flow-lightbox__close" aria-label="Close expanded view">&times;</button>
        <div class="cs-flow-lightbox__inner">
          <img src="" alt="" class="cs-flow-lightbox__img">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const img = lightbox.querySelector('.cs-flow-lightbox__img');
    const closeBtn = lightbox.querySelector('.cs-flow-lightbox__close');

    const close = () => {
      lightbox.hidden = true;
      img.removeAttribute('src');
      document.body.style.overflow = '';
    };

    const open = (source) => {
      img.src = source.currentSrc || source.src;
      img.alt = source.alt;
      img.style.width = '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const source = btn.querySelector('img');
        if (source) open(source);
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hidden) close();
    });
  }

  function initFlowPrototype() {
    document.querySelectorAll('[data-flow-prototype]').forEach((root) => {
      const steps = [...root.querySelectorAll('[data-flow-step]')].map((step) => ({
        src: step.dataset.src,
        alt: step.dataset.alt,
        label: step.dataset.label,
      }));

      if (!steps.length) return;

      const img = root.querySelector('[data-flow-screen]');
      const caption = root.querySelector('[data-flow-caption]');
      const progress = root.querySelector('[data-flow-progress]');
      const prevBtn = root.querySelector('[data-flow-prev]');
      const nextBtn = root.querySelector('[data-flow-next]');
      const screen = root.querySelector('[data-flow-tap]');

      if (!img || !caption || !progress || !prevBtn || !nextBtn || !screen) return;

      let index = 0;

      const render = () => {
        const step = steps[index];
        img.src = step.src;
        img.alt = step.alt;
        caption.textContent = step.label;
        progress.textContent = `${index + 1} / ${steps.length}`;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === steps.length - 1;
        screen.setAttribute('aria-label', `${step.label}. Tap for next screen.`);
      };

      const go = (delta) => {
        const nextIndex = index + delta;
        if (nextIndex < 0 || nextIndex >= steps.length) return;
        index = nextIndex;
        render();
      };

      prevBtn.addEventListener('click', () => go(-1));
      nextBtn.addEventListener('click', () => go(1));
      screen.addEventListener('click', () => {
        if (index < steps.length - 1) go(1);
      });
      screen.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (index < steps.length - 1) go(1);
        }
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      });

      render();
    });
  }
})();
