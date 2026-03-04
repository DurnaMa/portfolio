// ── LANGUAGE TOGGLE ──
document.querySelectorAll('.lang-toggle span').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-toggle span').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ── TESTIMONIALS CAROUSEL ──
const testimonials = [
    {
        text: "I was continuously impressed by Lukas's efficient way of working and his dedication to the project's success.",
        author: 'T.Schulz - Frontend Developer'
    },
    {
        text: "Lukas has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.",
        author: 'H.Janisch - Team Partner'
    },
    {
        text: "I had the good fortune of working with Lukas on a project at the Developer Akademie. He always stayed calm, cool, and collected to make sure our team was set up for success. He was knowledgeable, easy to work with. I would work with him again given the chance.",
        author: 'K.Meier - Developer'
    }
];

let currentIndex = 1;

const centerCard      = document.querySelector('.ref-card.center');
const centerText      = centerCard.querySelector('p');
const centerAuthor    = centerCard.querySelector('.ref-author');
const dots            = document.querySelectorAll('.carousel-dot');
const prevBtn         = document.querySelector('.carousel-btn.prev');
const nextBtn         = document.querySelector('.carousel-btn.next');

function updateCarousel() {
    centerText.textContent   = testimonials[currentIndex].text;
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

// ── CONTACT FORM ──
const form       = document.getElementById('contact-form');
const submitBtn  = form.querySelector('.btn-submit');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const privacy = form.querySelector('#privacy').checked;

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }
    if (!privacy) {
        alert('Please accept the privacy policy.');
        return;
    }

    // Replace this with your actual email service (e.g. EmailJS, Formspree)
    submitBtn.textContent = 'Sent ✓';
    submitBtn.disabled = true;
    submitBtn.style.borderColor = 'var(--teal)';
    submitBtn.style.color = 'var(--teal)';

    setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Say Hello ;)';
        submitBtn.disabled = false;
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
    }, 3000);
});

// ── SMOOTH NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${entry.target.id}`
                    ? 'var(--teal)'
                    : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));