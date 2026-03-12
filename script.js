// ── INIT ──
async function init() {
  await includeHTML();
  initBurger();
  await initProjectPreview();
  initLangToggle();
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
  // forEach weil wir jeden Button direkt als Variable haben wollen — kein Index nötig
  const buttons = document.querySelectorAll('.lang-toggle span');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActiveLangButton(btn, buttons);
    });
  });
}

function setActiveLangButton(activeBtn, buttons) {
  // forEach weil wir einfach bei jedem Button 'active' entfernen — kein Index nötig
  buttons.forEach(function (btn) {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');
}

// ── TESTIMONIALS CAROUSEL ──
// const weil sich das Array selbst nie ändert (nur currentIndex ändert sich)
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

// let weil currentIndex sich bei jedem Klick ändert
let currentIndex = 1;

// const weil diese DOM-Elemente immer dieselben bleiben
const centerCard = document.querySelector('.ref-card.center');
const centerText = centerCard.querySelector('p');
const centerAuthor = centerCard.querySelector('.ref-author');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

function updateCarousel() {
  centerText.textContent = testimonials[currentIndex].text;
  centerAuthor.textContent = testimonials[currentIndex].author;
  updateCarouselDots();
}

function updateCarouselDots() {
  // forEach mit Index i — forEach kann den Index auch liefern, genau wie eine for-Schleife
  dots.forEach(function (dot, i) {
    if (i === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
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

// forEach mit Index i weil wir i als neuen currentIndex brauchen
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
  // const weil burger und navMobile sich nicht neu zuweisen — wir verändern nur ihre Klassen
  const burger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (!burger || !navMobile) return;

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu(burger, navMobile);
    } else {
      openMenu(burger, navMobile);
    }
  });

  // forEach weil wir jeden Link direkt haben wollen — kein Index nötig
  const links = navMobile.querySelectorAll('a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu(burger, navMobile);
    });
  });

  document.addEventListener('click', function (e) {
    const isOpen = navMobile.classList.contains('open');
    const clickedOutside = !navMobile.contains(e.target) && !burger.contains(e.target);
    if (isOpen && clickedOutside) {
      closeMenu(burger, navMobile);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu(burger, navMobile);
    }
  });
}

// ── CONTACT FORM → mail.php ──
// const weil form und submitBtn immer dieselben Elemente bleiben
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.btn-submit');

function getFormValues() {
  // const weil diese Werte innerhalb der Funktion nicht neu zugewiesen werden
  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();
  const privacy = form.querySelector('#privacy').checked;
  return { name, email, message, privacy };
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
  if (!response.ok) {
    throw new Error('Server responded with status ' + response.status);
  }
  return response;
}

form.addEventListener('submit', async function (e) {
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
  if (existing) {
    existing.remove();
  }
  const msg = document.createElement('p');
  msg.className = 'form-feedback';
  msg.textContent = text;
  if (type === 'success') {
    msg.style.color = 'var(--teal)';
  } else {
    msg.style.color = '#ff6b6b';
  }
  msg.style.fontFamily = "'Space Mono', monospace";
  msg.style.fontSize = '13px';
  msg.style.marginTop = '-16px';
  form.appendChild(msg);
  setTimeout(function () {
    msg.remove();
  }, 5000);
}

// ── PROJECT HOVER PREVIEW ──
let projects = {};

async function loadProjects() {
  const response = await fetch('./projects.json');
  const data = await response.json();
  // for-Schleife weil wir await drin benutzen — forEach funktioniert nicht mit async/await
  for (let i = 0; i < data.length; i++) {
    const project = data[i];
    projects[project.id] = project;
  }
}

function clearPreview() {
  const items = document.querySelectorAll('.project-item');
  const img = document.querySelector('.preview-img');
  const frame = document.querySelector('.preview-frame');
  // forEach weil wir einfach bei jedem Item 'active' entfernen — kein Index nötig
  items.forEach(function (item) {
    item.classList.remove('active');
  });
  img.classList.remove('visible');
  frame.classList.remove('show-placeholder');
}

function loadPreview(project) {
  const img = document.querySelector('.preview-img');
  const frame = document.querySelector('.preview-frame');
  img.classList.remove('visible');
  img.src = project.img;
  img.alt = project.alt;
  // this zeigt hier auf das img-Element selbst (vermeidet Verwechslung mit der äußeren img-Variable)
  img.onload = function () {
    this.classList.add('visible');
  };
  img.onerror = function () {
    frame.classList.add('show-placeholder');
  };
}

async function initProjectPreview() {
  await loadProjects();
  const items = document.querySelectorAll('.project-item');
  const projectsList = document.querySelector('.projects-list');
  if (!items.length || !projectsList) return;

  projectsList.addEventListener('mouseleave', function () {
    clearPreview();
  });

  // forEach weil wir jedes item direkt als Variable haben wollen — kein Index nötig
  items.forEach(function (item) {
    const arrow = item.querySelector('.project-arrow');

    item.addEventListener('mouseenter', function () {
      items.forEach(function (i) {
        i.classList.remove('active');
      });
      item.classList.add('active');
      loadPreview(projects[item.dataset.id]);
    });

    if (arrow) {
      arrow.addEventListener('mouseenter', function () {
        items.forEach(function (i) {
          i.classList.remove('active');
        });
        item.classList.add('active');
        loadPreview(projects[item.dataset.id]);
      });
    }
  });
}

// ── NAV HIGHLIGHT ──
// const weil sections und navLinks immer dieselben Elemente bleiben
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightActiveLink(id) {
  // forEach weil wir jeden Link direkt haben wollen — kein Index nötig
  navLinks.forEach(function (link) {
    if (link.getAttribute('href') === '#' + id) {
      link.style.color = 'var(--teal)';
    } else {
      link.style.color = '';
    }
  });
}

const observer = new IntersectionObserver(
  function (entries) {
    // forEach weil wir jede Entry direkt haben wollen — kein Index nötig
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        highlightActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.4 }
);

// forEach weil wir jede Section direkt haben wollen — kein Index nötig
sections.forEach(function (section) {
  observer.observe(section);
});
