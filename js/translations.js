// ── TRANSLATIONS ──

let translations = {};

/** Returns '../' on sub-pages, './' on the main page. */
function getBasePath() {
  const path = window.location.pathname;
  return (path.includes('/datenschutz/') || path.includes('/impressum/')) ? '../' : './';
}

/** Fetches translations.json once and stores it in memory. */
async function loadTranslations() {
  try {
    const resp = await fetch(getBasePath() + 'translations.json');
    translations = await resp.json();

    // Load page-specific translations on sub-pages and merge them
    if (getBasePath() === '../') {
      try {
        const localResp = await fetch('./translations.json');
        if (localResp.ok) {
          const localData = await localResp.json();
          if (localData.EN) Object.assign(translations.EN, localData.EN);
          if (localData.DE) Object.assign(translations.DE, localData.DE);
        }
      } catch (err) {
        console.warn('No local translations.json found for this subpage.');
      }
    }
  } catch (e) {
    console.error('Could not load global translations.json', e);
  }
}

/** Returns localized string from active translation dictionary. */
function t(key) {
  const lang = localStorage.getItem('lang') || 'EN';
  return translations[lang]?.[key] || key;
}

/**
 * Applies all translations for the given language code to every
 * element that carries a [data-i18n] attribute.
 * @param {'EN'|'DE'} lang
 */
function applyLang(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value === undefined) return;

    // Inputs / textareas use placeholder, everything else uses innerHTML
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = value;
    } else {
      el.innerHTML = value;
    }
  });

  // Dynamically update JS-rendered text content if functions exist:
  if (typeof updateReferencesData === 'function') updateReferencesData();
  if (typeof updateSideCards === 'function') updateSideCards();
  if (typeof initTicker === 'function') initTicker();
  
  // Update center card directly without animation
  const centerCard = document.querySelector('.ref-card.center');
  if (centerCard && typeof testimonials !== 'undefined' && testimonials[currentIndex]) {
    const data = testimonials[currentIndex];
    centerCard.querySelector('p').textContent = data.text;
    centerCard.querySelector('.ref-author').textContent = data.author;
  }
}

// ── LANGUAGE TOGGLE ──

/** Activates the clicked language button, applies translations, and saves to localStorage. */
function initLangToggle() {
  const buttons = document.querySelectorAll('.lang-toggle span');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const lang = btn.textContent.trim();
      buttons.forEach((b) => b.classList.remove('active'));
      // Sync all toggle buttons (header desktop + mobile)
      document.querySelectorAll('.lang-toggle span').forEach((b) => {
        b.classList.toggle('active', b.textContent.trim() === lang);
      });

      localStorage.setItem('lang', lang);
      applyLang(lang);

      // Close mobile menu if open
      const burger = document.querySelector('.hamburger');
      const navMobile = document.querySelector('.nav-mobile');
      if (burger && navMobile && navMobile.classList.contains('open')) {
        closeMenu(burger, navMobile);
      }
    })
  );
}

/** Restores language from localStorage on page load. */
function restoreSavedLanguage() {
  const saved = localStorage.getItem('lang') || 'EN';
  document.querySelectorAll('.lang-toggle span').forEach((b) => {
    b.classList.toggle('active', b.textContent.trim() === saved);
  });
  applyLang(saved);
}
