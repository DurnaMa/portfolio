// ── referencesData CAROUSEL ──

let referencesData = [];

function updateReferencesData() {
  referencesData = [
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

function getPrevIndex(i) {
  return (i - 1 + referencesData.length) % referencesData.length;
}
function getNextIndex(i) {
  return (i + 1) % referencesData.length;
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function updateAllCards() {
  const current = referencesData[currentIndex];
  const prev = referencesData[getPrevIndex(currentIndex)];
  const next = referencesData[getNextIndex(currentIndex)];

  if (centerText) centerText.textContent = current?.text ?? '';
  if (centerAuthor) centerAuthor.textContent = current?.author ?? '';

  if (leftCard) {
    leftCard.querySelector('p').textContent = prev?.text ?? '';
    leftCard.querySelector('.ref-author').textContent = prev?.author ?? '';
  }
  if (rightCard) {
    rightCard.querySelector('p').textContent = next?.text ?? '';
    rightCard.querySelector('.ref-author').textContent = next?.author ?? '';
  }

  updateDots();
}

// Alias für translations.js Aufruf
function updateSideCards() {
  updateAllCards();
}

function updateCarousel(direction) {
  if (isAnimating || !carouselTrack || !centerCard) return;
  isAnimating = true;

  // Karten-Breite + Gap berechnen
  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 24;
  const cardWidth = centerCard.offsetWidth + gap;
  const moveX = direction === 'next' ? -cardWidth : cardWidth;

  // 1. Track sanft verschieben
  carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  carouselTrack.style.transform = `translateX(${moveX}px)`;

  setTimeout(() => {
    // 2. Transition deaktivieren → sofort zurücksetzen (kein Blitzen)
    carouselTrack.style.transition = 'none';
    carouselTrack.style.transform = 'translateX(0)';

    // 3. Inhalte aller Karten aktualisieren
    updateAllCards();

    // 4. Transition wieder freigeben
    requestAnimationFrame(() => {
      carouselTrack.style.transition = '';
      isAnimating = false;
    });
  }, 500);
}

function initCarouselControls() {
  nextBtn?.addEventListener('click', () => {
    currentIndex = getNextIndex(currentIndex);
    updateCarousel('next');
  });

  prevBtn?.addEventListener('click', () => {
    currentIndex = getPrevIndex(currentIndex);
    updateCarousel('prev');
  });

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      if (i === currentIndex || isAnimating) return;
      const direction = i > currentIndex ? 'next' : 'prev';
      currentIndex = i;
      updateCarousel(direction);
    })
  );
}

initCarouselControls();

// ── QUOTE MARK POSITION ──
// const quoteMark = document.querySelector('.quote-mark');
// const carouselContainer = document.querySelector('.carousel');
//
// function positionQuoteMark() {
//   const wrapper = document.querySelector('.carousel-wrapper');
//   if (!quoteMark || !centerCard || !wrapper) return;
//   const wrapperRect = wrapper.getBoundingClientRect();
//   const cardRect = centerCard.getBoundingClientRect();
//   quoteMark.style.left = cardRect.left - wrapperRect.left - quoteMark.offsetWidth * 0.35 + 'px';
//   quoteMark.style.top = cardRect.top - wrapperRect.top - quoteMark.offsetHeight * 0.2 + 'px';
// }
//
// window.addEventListener('load', positionQuoteMark);
// window.addEventListener('resize', positionQuoteMark);
