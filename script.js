// ── INIT ──

/** Bootstraps the app on page load. */
async function init() {
  await includeHTML();
  await loadTranslations();   // ← lädt translations.json
  initBurger();
  await initProjectPreview();
  initLangToggle();
  initOverlay();
  initTicker();
}

/** Fetches and injects HTML partials via [w3-include-html] attributes. */
async function includeHTML() {
  const elements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const resp = await fetch(el.getAttribute('w3-include-html'));
    el.innerHTML = resp.ok ? await resp.text() : 'Page not found';
  }
}

// ── TRANSLATIONS ──

let translations = {};

/** Fetches translations.json once and stores it in memory. */
async function loadTranslations() {
  try {
    const resp = await fetch('./translations.json');
    translations = await resp.json();
  } catch (e) {
    console.error('Could not load translations.json', e);
  }
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
}

// ── LANGUAGE TOGGLE ──

/** Activates the clicked language button and applies the matching translations. */
function initLangToggle() {
  const buttons = document.querySelectorAll('.lang-toggle span');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyLang(btn.textContent.trim()); // 'EN' or 'DE'
    })
  );
}

// ── TESTIMONIALS CAROUSEL ──

const testimonials = [
  {
    text: "I was continuously impressed by Mahir's efficient way of working and his dedication to the project's success.",
    author: 'T.Schulz - Frontend Developer',
  },
  {
    text: 'Mahir has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
    author: 'H.Janisch - Team Partner',
  },
  {
    text: 'I had the good fortune of working with Mahir on a project at the Developer Akademie. He always stayed calm, cool, and collected to make sure our team was set up for success.',
    author: 'K.Meier - Developer',
  },
];

let currentIndex = 1;

const centerCard = document.querySelector('.ref-card.center');
const centerText = centerCard.querySelector('p');
const centerAuthor = centerCard.querySelector('.ref-author');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

/** Renders the current testimonial and syncs the dot indicators. */
function updateCarousel() {
  centerText.textContent = testimonials[currentIndex].text;
  centerAuthor.textContent = testimonials[currentIndex].author;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  updateCarousel();
});
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  updateCarousel();
});
dots.forEach((dot, i) =>
  dot.addEventListener('click', () => {
    currentIndex = i;
    updateCarousel();
  })
);

// ── BURGER MENU ──

/** @param {HTMLElement} burger @param {HTMLElement} navMobile */
function openMenu(burger, navMobile) {
  burger.setAttribute('aria-expanded', 'true');
  navMobile.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('menu-open');
}

/** @param {HTMLElement} burger @param {HTMLElement} navMobile */
function closeMenu(burger, navMobile) {
  burger.setAttribute('aria-expanded', 'false');
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
  document.body.classList.remove('menu-open');
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

// ── CONTACT FORM ──

const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.btn-submit');

/** @returns {{ name: string, email: string, message: string, privacy: boolean }} */
function getFormValues() {
  return {
    name: form.querySelector('#name').value.trim(),
    email: form.querySelector('#email').value.trim(),
    message: form.querySelector('#message').value.trim(),
    privacy: form.querySelector('#privacy').checked,
  };
}

/** @returns {boolean} */
function validateForm(name, email, message, privacy) {
  if (!name || !email || !message) {
    showFormFeedback('Please fill in all fields.', 'error');
    return false;
  }
  if (!privacy) {
    showFormFeedback('Please accept the privacy policy.', 'error');
    return false;
  }
  return true;
}

function handleFormSuccess() {
  showFormFeedback("Message sent! I'll get back to you soon.", 'success');
  submitBtn.textContent = 'Sent ✓';
  submitBtn.style.borderColor = submitBtn.style.color = 'var(--teal)';
  form.reset();
  setTimeout(() => {
    submitBtn.textContent = 'Say Hello ;)';
    submitBtn.disabled = false;
    submitBtn.style.borderColor = submitBtn.style.color = '';
  }, 4000);
}

/** @param {Error} error */
function handleFormError(error) {
  console.error('Mail error:', error);
  showFormFeedback('Something went wrong. Please try again or send an email directly.', 'error');
  submitBtn.textContent = 'Say Hello ;)';
  submitBtn.disabled = false;
}

/** @param {string} name @param {string} email @param {string} message */
async function sendMail(name, email, message) {
  const response = await fetch('mail.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  if (!response.ok) throw new Error('Server responded with status ' + response.status);
  return response;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { name, email, message, privacy } = getFormValues();
  if (!validateForm(name, email, message, privacy)) return;
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  try {
    await sendMail(name, email, message);
    handleFormSuccess();
  } catch (error) {
    handleFormError(error);
  }
});

/**
 * Shows a temporary feedback message below the form.
 * @param {string} text @param {'success'|'error'} type
 */
function showFormFeedback(text, type) {
  form.querySelector('.form-feedback')?.remove();
  const msg = Object.assign(document.createElement('p'), {
    className: 'form-feedback',
    textContent: text,
  });
  msg.style.cssText = `color:${type === 'success' ? 'var(--teal)' : '#ff6b6b'};font-family:'Space Mono',monospace;font-size:13px;margin-top:-16px`;
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}

// ── PROJECT PREVIEW + OVERLAY ──

let projectList = [];
let overlayIndex = 0;

/** Fetches project data from projects.json. */
async function loadProjects() {
  const response = await fetch('./projects.json');
  projectList = await response.json();
}



/** @param {number} index - Index in projectList */
function renderOverlay(index) {
  const p = projectList[index];
  if (!p) return;

  document.getElementById('overlay-title').textContent = p.name;
  document.getElementById('overlay-desc').textContent = p.description;
  document.getElementById('overlay-github').href = p.github || '#';
  document.getElementById('overlay-live').href = p.liveTest || '#';

  const img = document.getElementById('overlay-img');
  img.src = p.img;
  img.alt = p.alt;

  const tagsEl = document.getElementById('overlay-tags');
  tagsEl.innerHTML = '';
  (p.tags || []).forEach((tag) => {
    const span = Object.assign(document.createElement('span'), { className: 'overlay-tag', textContent: tag });
    tagsEl.appendChild(span);
  });
}

/** @param {number} index */
function showProjectOverlay(index) {
  overlayIndex = index;
  renderOverlay(overlayIndex);
  document.getElementById('project-overlay').classList.add('project-preview');
  document.body.style.overflow = 'hidden';
}

function closeProjectOverlay() {
  document.getElementById('project-overlay')?.classList.remove('project-preview');
  document.body.style.overflow = '';
}

/** Advances to the next project inside the open overlay. */
function nextCardR() {
  overlayIndex = (overlayIndex + 1) % projectList.length;
  renderOverlay(overlayIndex);
}

/** Closes overlay on backdrop click or Escape key. */
function initOverlay() {
  const overlay = document.getElementById('project-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeProjectOverlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectOverlay();
  });
}

/** Resets the hover preview panel. */
function clearPreview() {
  document.querySelectorAll('.project-item').forEach((item) => item.classList.remove('active'));
  document.querySelector('.preview-img')?.classList.remove('visible');
  document.querySelector('.preview-frame')?.classList.remove('show-placeholder');
}

/** @param {{ img: string, alt: string }} project */
function loadPreview(project) {
  const img = document.querySelector('.preview-img');
  const frame = document.querySelector('.preview-frame');
  if (!img || !frame) return;
  img.classList.remove('visible');
  img.src = project.img;
  img.alt = project.alt;
  img.onload = function () {
    this.classList.add('visible');
  };
  img.onerror = function () {
    frame.classList.add('show-placeholder');
  };
}

/** Loads projects, builds overlay, wires hover previews and click-to-open. */
async function initProjectPreview() {
  await loadProjects();
  buildOverlay();

  const items = document.querySelectorAll('.project-item');
  const projectsList = document.querySelector('.projects-list');
  if (!items.length || !projectsList) return;

  projectsList.addEventListener('mouseleave', clearPreview);

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      items.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      const project = projectList.find((p) => p.id === item.dataset.id);
      if (project) loadPreview(project);
    });

    item.addEventListener('click', () => {
      const index = projectList.findIndex((p) => p.id === item.dataset.id);
      showProjectOverlay(index >= 0 ? index : 0);
    });
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
    'Available for remote work',
    'Frontend Developer',
    'Molbergen',
    'Open to opportunities',
  ];

  const html = items.map(text => `
    <span class="ticker-item">
      <span class="ticker-dot"></span>${text}
    </span>`).join('');

  track.innerHTML = html.repeat(4);
  track.style.setProperty('--ticker-sets', '4');
}