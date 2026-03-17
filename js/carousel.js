// ── TESTIMONIALS CAROUSEL ──

let testimonials = [];

function updateTestimonialsData() {
  testimonials = [
    { text: t('ref.1.text'), author: t('ref.1.author') },
    { text: t('ref.2.text'), author: t('ref.2.author') },
    { text: t('ref.3.text'), author: t('ref.3.author') },
  ];
}

let currentIndex = 1;
let isAnimating = false;

const carouselTrack = document.querySelector('.carousel-track');
const centerCard = document.querySelector('.ref-card.center');
const leftCard = document.querySelector('.ref-card.left-side');
const rightCard = document.querySelector('.ref-card.right-side');
const centerText = centerCard?.querySelector('p');
const centerAuthor = centerCard?.querySelector('.ref-author');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

/** Helper to get previous/next indices. */
function getPrevIndex(i) {
  return (i - 1 + testimonials.length) % testimonials.length;
}
function getNextIndex(i) {
  return (i + 1) % testimonials.length;
}

/** Updates side card content. */
function updateSideCards() {
  if (testimonials.length === 0) return;
  const prev = testimonials[getPrevIndex(currentIndex)];
  const next = testimonials[getNextIndex(currentIndex)];

  if (leftCard && prev) {
    leftCard.querySelector('p').textContent = prev.text;
    leftCard.querySelector('.ref-author').textContent = prev.author;
  }
  if (rightCard && next) {
    rightCard.querySelector('p').textContent = next.text;
    rightCard.querySelector('.ref-author').textContent = next.author;
  }
}

/** Renders the current testimonial with a slide animation. */
function updateCarousel(direction) {
  if (isAnimating || !carouselTrack) return;
  isAnimating = true;

  const slideOut = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
  const slideIn = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

  carouselTrack.classList.add(slideOut);

  setTimeout(() => {
    const current = testimonials[currentIndex];
    if (!current) {
      isAnimating = false;
      return;
    }
    centerText.textContent = current.text;
    centerAuthor.textContent = current.author;
    updateSideCards();
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));

    carouselTrack.classList.remove(slideOut);
    carouselTrack.classList.add(slideIn);

    setTimeout(() => {
      carouselTrack.classList.remove(slideIn);
      isAnimating = false;
    }, 350);
  }, 300);
}

/** Binds click events to carousel prev/next buttons and dot navigation. */
function initCarouselControls() {
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = getNextIndex(currentIndex);
      updateCarousel('next');
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = getPrevIndex(currentIndex);
      updateCarousel('prev');
    });
  }
  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      if (i === currentIndex) return;
      const direction = i > currentIndex ? 'next' : 'prev';
      currentIndex = i;
      updateCarousel(direction);
    })
  );
}

initCarouselControls();

/** Positions the quote-mark above the center card (outside the track, so it doesn't animate). */
const quoteMark = document.querySelector('.quote-mark');
const carouselContainer = document.querySelector('.carousel');

function positionQuoteMark() {
  const wrapper = document.querySelector('.carousel-wrapper');
  if (!quoteMark || !centerCard || !carouselContainer || !wrapper) return;
  const wrapperRect = wrapper.getBoundingClientRect();
  const cardRect = centerCard.getBoundingClientRect();

  // Anführungszeichen links neben und leicht über der Karte – wie Bild 2
  quoteMark.style.left = cardRect.left - wrapperRect.left - quoteMark.offsetWidth * 0.50 + 'px';
  quoteMark.style.top  = cardRect.top  - wrapperRect.top  - quoteMark.offsetHeight * 0.2 + 'px';
}

window.addEventListener('load', positionQuoteMark);
window.addEventListener('resize', positionQuoteMark);
