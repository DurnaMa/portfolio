function init() {
  includeHTML();
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

// ── CONTACT FORM → mail.php ──
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.btn-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();
  const privacy = form.querySelector('#privacy').checked;

  // Client-side validation
  if (!name || !email || !message) {
    showFormFeedback('Please fill in all fields.', 'error');
    return;
  }
  if (!privacy) {
    showFormFeedback('Please accept the privacy policy.', 'error');
    return;
  }

  // Disable button while sending
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    const response = await fetch('mail.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      showFormFeedback("Message sent! I'll get back to you soon.", 'success');
      submitBtn.textContent = 'Sent ✓';
      submitBtn.style.borderColor = 'var(--teal)';
      submitBtn.style.color = 'var(--teal)';
      form.reset();

      // Reset button after 4 seconds
      setTimeout(() => {
        submitBtn.textContent = 'Say Hello ;)';
        submitBtn.disabled = false;
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
      }, 4000);
    } else {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Mail error:', error);
    showFormFeedback('Something went wrong. Please try again or send an email directly.', 'error');
    submitBtn.textContent = 'Say Hello ;)';
    submitBtn.disabled = false;
  }
});

/**
 * Shows a small feedback message below the form.
 * @param {string} text - Message to display
 * @param {'success'|'error'} type - Visual style
 */
function showFormFeedback(text, type) {
  // Remove any existing feedback
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

  // Auto-remove after 5 seconds
  setTimeout(() => msg.remove(), 5000);
}

// ── SMOOTH NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--teal)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => observer.observe(s));
