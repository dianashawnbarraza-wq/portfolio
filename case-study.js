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
    initFlowExpand();
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

  function initFlowExpand() {
    const triggers = document.querySelectorAll('.cs-flow-expand');
    if (!triggers.length) return;

    const zoomLevels = [
      { label: 'Fit', scale: 'fit' },
      { label: '100%', scale: 1 },
      { label: '125%', scale: 1.25 },
      { label: '150%', scale: 1.5 }
    ];

    let lightbox = document.getElementById('cs-flow-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'cs-flow-lightbox';
      lightbox.className = 'cs-flow-lightbox';
      lightbox.hidden = true;
      lightbox.innerHTML = `
        <button type="button" class="cs-flow-lightbox__close" aria-label="Close expanded diagram">&times;</button>
        <div class="cs-flow-lightbox__toolbar" role="toolbar" aria-label="Zoom controls"></div>
        <div class="cs-flow-lightbox__inner">
          <img src="" alt="" class="cs-flow-lightbox__img">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const img = lightbox.querySelector('.cs-flow-lightbox__img');
    const inner = lightbox.querySelector('.cs-flow-lightbox__inner');
    const toolbar = lightbox.querySelector('.cs-flow-lightbox__toolbar');
    const closeBtn = lightbox.querySelector('.cs-flow-lightbox__close');
    let nativeWidth = 3072;
    let activeScale = 'fit';

    zoomLevels.forEach(({ label, scale }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cs-flow-lightbox__zoom';
      btn.textContent = label;
      btn.dataset.scale = String(scale);
      btn.addEventListener('click', () => setZoom(scale));
      toolbar.appendChild(btn);
    });

    const setZoom = (scale) => {
      activeScale = scale;
      let width = nativeWidth;
      if (scale === 'fit') {
        width = Math.min(nativeWidth, Math.max(inner.clientWidth - 32, 320));
      } else {
        width = Math.round(nativeWidth * Number(scale));
      }
      img.style.width = `${width}px`;
      toolbar.querySelectorAll('.cs-flow-lightbox__zoom').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.scale === String(scale));
      });
    };

    const close = () => {
      lightbox.hidden = true;
      img.removeAttribute('src');
      img.style.width = '';
      inner.scrollLeft = 0;
      inner.scrollTop = 0;
      document.body.style.overflow = '';
    };

    const open = (source) => {
      const fullSrc = source.dataset.flowFull || source.currentSrc || source.src;
      img.src = fullSrc;
      img.alt = source.alt;
      nativeWidth = source.naturalWidth || Number(source.getAttribute('width')) * 3 || 3072;

      img.onload = () => {
        nativeWidth = img.naturalWidth || nativeWidth;
        setZoom(activeScale);
        inner.scrollLeft = 0;
        inner.scrollTop = 0;
      };

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
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
    });
  }
})();
