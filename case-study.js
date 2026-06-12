(function () {
  const PASSWORD = 'iterate2026';
  const STORAGE_KEY = 'cs-auth-checking-adoption';

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
})();
