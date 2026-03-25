// ── INIT ──

/** Bootstraps the app on page load. */
async function init() {
  await includeHTML();
  fixSubpageNavLinks();
  await loadTranslations();
  initBurger();
  await initProjectPreview();
  initLangToggle();
  initOverlay();
  initTicker();
  initFormValidation();
  restoreSavedLanguage();
}

/**
 * On sub-pages (datenschutz/, impressum/), rewrite anchor links
 * like '#about' → '../#about' so header nav works.
 */
function fixSubpageNavLinks() {
  const isSubpage = window.location.pathname.includes('/datenschutz/') ||
                    window.location.pathname.includes('/impressum/');
  if (!isSubpage) return;
  document.querySelectorAll('nav a[href^="#"], .nav-mobile a[href^="#"]').forEach((a) => {
    a.href = '../' + a.getAttribute('href');
  });
  // Also fix logo link
  const logoLink = document.querySelector('.logo-nav');
  if (logoLink && logoLink.getAttribute('href') === '#hero') {
    logoLink.href = '../#hero';
  }
}

/** Fetches and injects HTML partials via [w3-include-html] or [data-include-html] attributes. */
async function includeHTML() {
  const elements = document.querySelectorAll('[w3-include-html], [data-include-html]');
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const attr = el.hasAttribute('w3-include-html') ? 'w3-include-html' : 'data-include-html';
    let path = el.getAttribute(attr);
    if (path.startsWith('/')) path = path.substring(1);
    const resp = await fetch(getBasePath() + path);
    el.innerHTML = resp.ok ? await resp.text() : 'Page not found';
  }
}



// Initialize side cards moved to applyLang directly

// ── BURGER MENU ──

/** @param {HTMLElement} burger @param {HTMLElement} navMobile */
function openMenu(burger, navMobile) {
  burger.setAttribute('aria-expanded', 'true');
  navMobile.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** @param {HTMLElement} burger @param {HTMLElement} navMobile */
function closeMenu(burger, navMobile) {
  burger.setAttribute('aria-expanded', 'false');
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
}

/** Sets up hamburger toggle, nav-link clicks, outside-click and Escape to close. */
function initBurger() {
  const burger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (!burger || !navMobile) return;

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.getAttribute('aria-expanded') === 'true' ? closeMenu(burger, navMobile) : openMenu(burger, navMobile);
  });

  navMobile.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(burger, navMobile)));

  document.addEventListener('click', (e) => {
    if (navMobile.classList.contains('open') && !navMobile.contains(e.target) && !burger.contains(e.target)) {
      closeMenu(burger, navMobile);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu(burger, navMobile);
  });
}



// ── NAV HIGHLIGHT ──

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

/** @param {string} id - Section id currently in view */
function highlightActiveLink(id) {
  navLinks.forEach((link) => {
    link.style.color = link.getAttribute('href') === '#' + id ? 'var(--teal)' : '';
  });
}

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) highlightActiveLink(entry.target.id);
    }),
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));

/** Renders ticker items and duplicates them for a seamless loop. */
function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;

  const items = [
    t('ticker.1'),
    t('ticker.2'),
    t('ticker.3'),
    t('ticker.4'),
  ];

  const html = items.map(text => `
    <span class="ticker-item">
      <span class="ticker-dot"></span>${text}
    </span>`).join('');

  track.innerHTML = html.repeat(8);
  track.style.setProperty('--ticker-sets', '4');
}