// ── INIT ──
async function init() {
  await includeHTML();
  initBurger();
  await initProjectPreview(); // lädt projects.json und baut Overlay + Liste auf
  initLangToggle();
  initOverlay();              // Backdrop-Klick & ESC
}

// for-Schleife weil wir await drin benutzen — forEach funktioniert nicht mit async/await
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    let element = includeElements[i];
    let file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

// ── LANGUAGE TOGGLE ──
function initLangToggle() {
  const buttons = document.querySelectorAll('.lang-toggle span');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActiveLangButton(btn, buttons);
    });
  });
}

function setActiveLangButton(activeBtn, buttons) {
  buttons.forEach(function (btn) {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');
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

const centerCard   = document.querySelector('.ref-card.center');
const centerText   = centerCard.querySelector('p');
const centerAuthor = centerCard.querySelector('.ref-author');
const dots         = document.querySelectorAll('.carousel-dot');
const prevBtn      = document.querySelector('.carousel-btn.prev');
const nextBtn      = document.querySelector('.carousel-btn.next');

function updateCarousel() {
  centerText.textContent   = testimonials[currentIndex].text;
  centerAuthor.textContent = testimonials[currentIndex].author;
  updateCarouselDots();
}

function updateCarouselDots() {
  dots.forEach(function (dot, i) {
    dot.classList.toggle('active', i === currentIndex);
  });
}

nextBtn.addEventListener('click', function () {
  currentIndex = (currentIndex + 1) % testimonials.length;
  updateCarousel();
});
prevBtn.addEventListener('click', function () {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  updateCarousel();
});
dots.forEach(function (dot, i) {
  dot.addEventListener('click', function () {
    currentIndex = i;
    updateCarousel();
  });
});

// ── BURGER MENU ──
function openMenu(burger, navMobile) {
  burger.setAttribute('aria-expanded', 'true');
  navMobile.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('menu-open');
}

function closeMenu(burger, navMobile) {
  burger.setAttribute('aria-expanded', 'false');
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
  document.body.classList.remove('menu-open');
}

function initBurger() {
  const burger    = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (!burger || !navMobile) return;

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu(burger, navMobile) : openMenu(burger, navMobile);
  });

  navMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu(burger, navMobile);
    });
  });

  document.addEventListener('click', function (e) {
    const isOpen        = navMobile.classList.contains('open');
    const clickedOutside = !navMobile.contains(e.target) && !burger.contains(e.target);
    if (isOpen && clickedOutside) closeMenu(burger, navMobile);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu(burger, navMobile);
  });
}

// ── CONTACT FORM ──
const form      = document.getElementById('contact-form');
const submitBtn = form.querySelector('.btn-submit');

function getFormValues() {
  return {
    name:    form.querySelector('#name').value.trim(),
    email:   form.querySelector('#email').value.trim(),
    message: form.querySelector('#message').value.trim(),
    privacy: form.querySelector('#privacy').checked,
  };
}

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

function resetSubmitBtn() {
  setTimeout(function () {
    submitBtn.textContent        = 'Say Hello ;)';
    submitBtn.disabled           = false;
    submitBtn.style.borderColor  = '';
    submitBtn.style.color        = '';
  }, 4000);
}

function handleFormSuccess() {
  showFormFeedback("Message sent! I'll get back to you soon.", 'success');
  submitBtn.textContent       = 'Sent ✓';
  submitBtn.style.borderColor = 'var(--teal)';
  submitBtn.style.color       = 'var(--teal)';
  form.reset();
  resetSubmitBtn();
}

function handleFormError(error) {
  console.error('Mail error:', error);
  showFormFeedback('Something went wrong. Please try again or send an email directly.', 'error');
  submitBtn.textContent = 'Say Hello ;)';
  submitBtn.disabled    = false;
}

async function sendMail(name, email, message) {
  const response = await fetch('mail.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  if (!response.ok) throw new Error('Server responded with status ' + response.status);
  return response;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const { name, email, message, privacy } = getFormValues();
  if (!validateForm(name, email, message, privacy)) return;
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;
  try {
    await sendMail(name, email, message);
    handleFormSuccess();
  } catch (error) {
    handleFormError(error);
  }
});

function showFormFeedback(text, type) {
  const existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();
  const msg = document.createElement('p');
  msg.className   = 'form-feedback';
  msg.textContent = text;
  msg.style.color       = type === 'success' ? 'var(--teal)' : '#ff6b6b';
  msg.style.fontFamily  = "'Space Mono', monospace";
  msg.style.fontSize    = '13px';
  msg.style.marginTop   = '-16px';
  form.appendChild(msg);
  setTimeout(function () { msg.remove(); }, 5000);
}

// ══════════════════════════════════════════
// ── PROJECT PREVIEW (hover) + OVERLAY ──
// ══════════════════════════════════════════

// Geladene Projekte als Array (Reihenfolge bleibt erhalten)
let projectList  = [];
// Aktuell geöffnetes Projekt (Index in projectList)
let overlayIndex = 0;

// ── Projekte laden ──
async function loadProjects() {
  const response = await fetch('./projects.json');
  projectList    = await response.json();
}

// ── Overlay bauen (einmalig beim Start) ──
function buildOverlay() {
  // Falls schon vorhanden, nicht doppelt erstellen
  if (document.getElementById('project-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id    = 'project-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Project details');

  overlay.innerHTML = `
    <div class="overlay-card">
      <button class="overlay-close" onclick="closeProjectOverlay()" aria-label="Close">✕</button>

      <!-- Linke Spalte -->
      <div class="overlay-left">
        <p class="overlay-subtitle">What is this project about?</p>
        <h2 id="overlay-title"></h2>
        <p class="overlay-desc" id="overlay-desc"></p>
        <div class="overlay-tags" id="overlay-tags"></div>
        <div class="overlay-btns">
          <a id="overlay-github" href="#" target="_blank" rel="noopener" class="overlay-btn">
            GitHub
            <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
          <a id="overlay-live" href="#" target="_blank" rel="noopener" class="overlay-btn">
            Live Test
            <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>
      </div>

      <!-- Rechte Spalte -->
      <div class="overlay-right">
        <div class="overlay-mockup">
          <img id="overlay-img" src="" alt="" />
        </div>
      </div>

      <!-- Next project -->
      <button class="overlay-next" onclick="nextCardR()">
        Next project
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
}

// ── Overlay mit Projektdaten füllen ──
function renderOverlay(index) {
  const p = projectList[index];
  if (!p) return;

  document.getElementById('overlay-title').textContent = p.name;
  document.getElementById('overlay-desc').textContent  = p.description;
  document.getElementById('overlay-github').href       = p.github  || '#';
  document.getElementById('overlay-live').href         = p.liveTest || '#';

  const img = document.getElementById('overlay-img');
  img.src = p.img;
  img.alt = p.alt;

  const tagsEl = document.getElementById('overlay-tags');
  tagsEl.innerHTML = '';
  (p.tags || []).forEach(function (tag) {
    const span = document.createElement('span');
    span.className   = 'overlay-tag';
    span.textContent = tag;
    tagsEl.appendChild(span);
  });
}

// ── Overlay öffnen ──
function showProjectOverlay(index) {
  overlayIndex = index;
  renderOverlay(overlayIndex);
  document.getElementById('project-overlay').classList.add('project-preview');
  document.body.style.overflow = 'hidden';
}

// ── Overlay schließen (showMenu / closeMenu kompatibel) ──
function showMenu() {
  // Kann direkt mit Index 0 geöffnet werden, falls von außen aufgerufen
  showProjectOverlay(0);
}
function closeMenu() {
  closeProjectOverlay();
}
function closeProjectOverlay() {
  const overlay = document.getElementById('project-overlay');
  if (overlay) overlay.classList.remove('project-preview');
  document.body.style.overflow = '';
}

// ── Nächstes Projekt ──
function nextCardR() {
  overlayIndex = (overlayIndex + 1) % projectList.length;
  renderOverlay(overlayIndex);
}

// ── Backdrop-Klick & ESC ──
function initOverlay() {
  const overlay = document.getElementById('project-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeProjectOverlay();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProjectOverlay();
  });
}

// ── PROJECT HOVER PREVIEW (rechte Spalte in der Liste) ──
function clearPreview() {
  document.querySelectorAll('.project-item').forEach(function (item) {
    item.classList.remove('active');
  });
  const img   = document.querySelector('.preview-img');
  const frame = document.querySelector('.preview-frame');
  if (img)   img.classList.remove('visible');
  if (frame) frame.classList.remove('show-placeholder');
}

function loadPreview(project) {
  const img   = document.querySelector('.preview-img');
  const frame = document.querySelector('.preview-frame');
  if (!img || !frame) return;
  img.classList.remove('visible');
  img.src = project.img;
  img.alt = project.alt;
  img.onload  = function () { this.classList.add('visible'); };
  img.onerror = function () { frame.classList.add('show-placeholder'); };
}

// ── Alles zusammen initialisieren ──
async function initProjectPreview() {
  await loadProjects();  // JSON laden
  buildOverlay();        // Overlay-HTML einmalig erzeugen

  const items       = document.querySelectorAll('.project-item');
  const projectsList = document.querySelector('.projects-list');
  if (!items.length || !projectsList) return;

  // Hover → Preview-Bild rechts
  projectsList.addEventListener('mouseleave', clearPreview);

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      items.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      // Projektdaten anhand der ID aus projectList suchen
      const project = projectList.find(function (p) { return p.id === item.dataset.id; });
      if (project) loadPreview(project);
    });
  });

  // Klick → Overlay öffnen
  items.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      // Index in projectList anhand der ID ermitteln
      const index = projectList.findIndex(function (p) { return p.id === item.dataset.id; });
      showProjectOverlay(index >= 0 ? index : 0);
    });
  });
}

// ── NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightActiveLink(id) {
  navLinks.forEach(function (link) {
    link.style.color = link.getAttribute('href') === '#' + id ? 'var(--teal)' : '';
  });
}

const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) highlightActiveLink(entry.target.id);
      });
    },
    { threshold: 0.4 }
);

sections.forEach(function (section) {
  observer.observe(section);
});