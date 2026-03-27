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
const extraLeftCard = document.querySelector('.ref-card.extra-left');
const extraRightCard = document.querySelector('.ref-card.extra-right');

const centerText = centerCard?.querySelector('p');
const centerAuthor = centerCard?.querySelector('.ref-author');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const quoteMark = document.querySelector('.quote-mark');

function getPrevIndex(i) {
  return (i - 1 + referencesData.length) % referencesData.length;
}
function getNextIndex(i) {
  return (i + 1) % referencesData.length;
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function setCardData(card, data) {
  if (!card || !data) return;
  const p = card.querySelector('p');
  const author = card.querySelector('.ref-author');
  if (p) p.textContent = data.text || '';
  if (author) author.textContent = data.author || '';
}

function updateAllCards() {
  const current = referencesData[currentIndex];
  const prev = referencesData[getPrevIndex(currentIndex)];
  const next = referencesData[getNextIndex(currentIndex)];
  const prevPrev = referencesData[getPrevIndex(getPrevIndex(currentIndex))];
  const nextNext = referencesData[getNextIndex(getNextIndex(currentIndex))];

  setCardData(centerCard, current);
  setCardData(leftCard, prev);
  setCardData(rightCard, next);
  setCardData(extraLeftCard, prevPrev);
  setCardData(extraRightCard, nextNext);

  updateDots();
}

// Alias für translations.js Aufruf
function updateSideCards() {
  updateAllCards();
}

function updateCarousel(direction) {
  if (isAnimating || !carouselTrack || !centerCard) return;

  // 1. Neuen Index berechnen
  if (direction === 'next') {
    currentIndex = getNextIndex(currentIndex);
  } else {
    currentIndex = getPrevIndex(currentIndex);
  }

  // 2. Inhalte ALLER Karten sofort aktualisieren (bevor wir sliden!)
  // Aber wir sliden den Track ENTGEGEN der Richtung, damit die gerade 
  // geänderte Center-Karte optisch stehen bleibt und die neue Karte 
  // korrekt von der Seite reinkommt.
  
  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 24;
  const cardWidth = centerCard.offsetWidth + gap;
  
  // Trick: Wir setzen den Track SOFORT auf die verschobene Position (ohne Transition)
  // und schalten dann die Transition ein, um ihn auf 0 zurückzuholen.
  // Das sorgt dafür, dass die neue Karte mit dem neuen Text reinfährt.
  
  const initialOffset = direction === 'next' ? cardWidth : -cardWidth;
  
  carouselTrack.style.transition = 'none';
  carouselTrack.style.transform = `translateX(${initialOffset}px)`;
  
  // Inhalte aktualisieren
  updateAllCards();

  // 3. Jetzt sanft auf 0 zurücksliden
  isAnimating = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      carouselTrack.style.transform = 'translateX(0)';
    });
  });

  const onEnd = () => {
    carouselTrack.removeEventListener('transitionend', onEnd);
    isAnimating = false;
  };
  carouselTrack.addEventListener('transitionend', onEnd);
}

function initCarouselControls() {
  nextBtn?.addEventListener('click', () => {
    updateCarousel('next');
  });

  prevBtn?.addEventListener('click', () => {
    updateCarousel('prev');
  });

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      if (i === currentIndex || isAnimating) return;
      const direction = i > currentIndex ? 'next' : 'prev';
      currentIndex = i;
      updateAllCards();
      positionQuoteMark();
    })
  );
}

// ── INITIALIZE ──
updateAllCards();
initCarouselControls();

// ── QUOTE MARK POSITION ──
function positionQuoteMark() {
  const wrapper = document.querySelector('.carousel-wrapper');
  if (!quoteMark || !centerCard || !wrapper) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const cardWidth = centerCard.offsetWidth;

  // Horizontal: visual center of the wrapper, accounting for original -35px offset
  const leftPos = (wrapperRect.width - cardWidth) / 2 - 35;
  quoteMark.style.left = leftPos + 'px';

  // Vertical: top of the card slot relative to wrapper, accounting for original -6px offset
  // We calculate the top while ignoring any scroll offsets by using the relative positions
  const cardRect = centerCard.getBoundingClientRect();
  quoteMark.style.top = (cardRect.top - wrapperRect.top) - 6 + 'px';
}

window.addEventListener('load', positionQuoteMark);
window.addEventListener('resize', positionQuoteMark);
// Initial call for immediate effect
setTimeout(positionQuoteMark, 50);
