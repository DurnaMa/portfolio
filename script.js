async function init() {
  await includeHTML();
  initBurger();
  initProjectPreview();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

// ── LANGUAGE TOGGLE ──
document.querySelectorAll('.lang-toggle span').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-toggle span').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── TESTIMONIALS CAROUSEL ──
const testimonials = [
  {
    text: "I was continuously impressed by Lukas's efficient way of working and his dedication to the project's success.",
    author: 'T.Schulz - Frontend Developer',
  },
  {
    text: 'Lukas has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
    author: 'H.Janisch - Team Partner',
  },
  {
    text: 'I had the good fortune of working with Lukas on a project at the Developer Akademie. He always stayed calm, cool, and collected to make sure our team was set up for success. He was knowledgeable, easy to work with. I would work with him again given the chance.',
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

function updateCarousel() {
  centerText.textContent = testimonials[currentIndex].text;
  centerAuthor.textContent = testimonials[currentIndex].author;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  updateCarousel();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
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

function addBurgerClickListener(burger, navMobile) {
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu(burger, navMobile) : openMenu(burger, navMobile);
  });
}

function addLinkListeners(burger, navMobile) {
  navMobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu(burger, navMobile));
  });
}

function addOutsideClickListener(burger, navMobile) {
  document.addEventListener('click', (e) => {
    const isOpen = navMobile.classList.contains('open');
    const clickedOutside = !navMobile.contains(e.target) && !burger.contains(e.target);
    if (isOpen && clickedOutside) closeMenu(burger, navMobile);
  });
}

function addEscapeListener(burger, navMobile) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu(burger, navMobile);
  });
}

function initBurger() {
  const burger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (!burger || !navMobile) return;
  addBurgerClickListener(burger, navMobile);
  addLinkListeners(burger, navMobile);
  addOutsideClickListener(burger, navMobile);
  addEscapeListener(burger, navMobile);
}

// ── CONTACT FORM → mail.php ──
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.btn-submit');

function getFormValues() {
  return {
    name: form.querySelector('#name').value.trim(),
    email: form.querySelector('#email').value.trim(),
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
  setTimeout(() => {
    submitBtn.textContent = 'Say Hello ;)';
    submitBtn.disabled = false;
    submitBtn.style.borderColor = '';
    submitBtn.style.color = '';
  }, 4000);
}

function handleFormSuccess() {
  showFormFeedback("Message sent! I'll get back to you soon.", 'success');
  submitBtn.textContent = 'Sent ✓';
  submitBtn.style.borderColor = 'var(--teal)';
  submitBtn.style.color = 'var(--teal)';
  form.reset();
  resetSubmitBtn();
}

function handleFormError(error) {
  console.error('Mail error:', error);
  showFormFeedback('Something went wrong. Please try again or send an email directly.', 'error');
  submitBtn.textContent = 'Say Hello ;)';
  submitBtn.disabled = false;
}

async function sendMail(name, email, message) {
  const response = await fetch('mail.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
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

function showFormFeedback(text, type) {
  const existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();
  const msg = document.createElement('p');
  msg.className = 'form-feedback';
  msg.textContent = text;
  msg.style.cssText = `
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    margin-top: -16px;
    color: ${type === 'success' ? 'var(--teal)' : '#ff6b6b'};
  `;
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}

// ── PROJECT HOVER PREVIEW ──
async function loadProjects() {
  const data = await fetch('./projects.json').then(r => r.json());
  return Object.fromEntries(data.map(p => [p.id, p]));
}

function clearPreview(items, img, frame) {
  items.forEach(i => i.classList.remove('active'));
  img.classList.remove('visible');
  frame.classList.remove('show-placeholder');
  setTimeout(() => { img.src = ''; }, 350);
}

function loadPreview(img, frame, project) {
  if (img.src.endsWith(project.img)) return;
  img.classList.remove('visible');
  setTimeout(() => {
    Object.assign(img, { src: project.img, alt: project.alt });
    img.onload  = () => img.classList.add('visible');
    img.onerror = () => frame.classList.add('show-placeholder');
  }, 180);
}

async function initProjectPreview() {
  const projects = await loadProjects();
  const items    = [...document.querySelectorAll('.project-item')];
  const img      = document.querySelector('.preview-img');
  const frame    = document.querySelector('.preview-frame');
  if (!items.length || !img || !frame) return;

  document.querySelector('.projects-list')
    .addEventListener('mouseleave', () => clearPreview(items, img, frame));

  items.forEach(item => {
    [item, item.querySelector('.project-arrow')].forEach(el =>
      el?.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        loadPreview(img, frame, projects[item.dataset.id]);
      })
    );
  });
}

// ── SMOOTH NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightActiveLink(id) {
  navLinks.forEach((link) => {
    link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--teal)' : '';
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) highlightActiveLink(entry.target.id);
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => observer.observe(s));