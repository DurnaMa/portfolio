// ─── REFERENCES CAROUSEL LOGIC ───

let referencesData = [];

/**
 * Aktualisiert das globale Array referencesData mit übersetzten Texten.
 */
function updateReferencesData() {
  referencesData = [
    { text: t('ref.1.text'), author: t('ref.1.author') },
    { text: t('ref.2.text'), author: t('ref.2.author') },
    { text: t('ref.3.text'), author: t('ref.3.author') },
  ];
}

let currentIndex = 1;
let isAnimating = false;

// DOM Elemente
const carouselTrack = document.querySelector('.carousel-track');
const centerCard = document.querySelector('.ref-card.center');
const leftCard = document.querySelector('.ref-card.left-side');
const rightCard = document.querySelector('.ref-card.right-side');
const extraLeftCard = document.querySelector('.ref-card.extra-left');
const extraRightCard = document.querySelector('.ref-card.extra-right');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const quoteMark = document.querySelector('.quote-mark');

/** Hilfsfunktionen für den Index (Infinite Loop) */
function getPrevIndex(i) {
  return (i - 1 + referencesData.length) % referencesData.length;
}
function getNextIndex(i) {
  return (i + 1) % referencesData.length;
}

/** Aktualisiert die aktiven Punkte der Steuerung */
function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

/** Hilfsfunktion zum Setzen der Texte in eine Karte */
function setCardData(card, data) {
  if (!card || !data) return;
  const p = card.querySelector('p');
  const author = card.querySelector('.ref-author');
  if (p) p.textContent = data.text || '';
  if (author) author.textContent = data.author || '';
}

/**
 * Verteilt die Daten aus referencesData auf alle 5 sichtbaren Karten im Track.
 * Wir haben 5 Karten (extraLeft, left, center, right, extraRight), um lückenlose
 * Animationen zu ermöglichen.
 */
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

// Alias für Aufrufe aus translations.js
function updateSideCards() {
  updateAllCards();
}

/**
 * Kernfunktion der Carousel-Animation.
 * @param {'next' | 'prev'} direction - Die Richtung, in die geschoben wird.
 */
function updateCarousel(direction) {
  if (isAnimating || !carouselTrack || !centerCard) return;

  // 1. Index sofort anpassen
  if (direction === 'next') {
    currentIndex = getNextIndex(currentIndex);
  } else {
    currentIndex = getPrevIndex(currentIndex);
  }

  // 2. Vorbereitung der flüssigen Bewegung:
  // Wir berechnen die Breite einer Karte inkl. Abstand (Gap).
  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 24;
  const cardWidth = centerCard.offsetWidth + gap;
  
  // TRICK für flüssigen Textwechsel:
  // Wir springen SOFORT auf die verschobene Position (ohne Animation).
  // Da wir gleichzeitig updateAllCards() aufrufen, sieht es für den User so aus,
  // als wäre nichts passiert, aber die Karten-Inhalte wurden bereits getauscht.
  const initialOffset = direction === 'next' ? cardWidth : -cardWidth;
  
  carouselTrack.style.transition = 'none';
  carouselTrack.style.transform = `translateX(${initialOffset}px)`;
  
  updateAllCards();

  // 3. Jetzt sanft zurück auf Position 0 gleiten
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
    // Quote-Mark smooth anpassen, falls die neue Karte eine andere Höhe hat
    positionQuoteMark(true);
  };
  carouselTrack.addEventListener('transitionend', onEnd);
}

/** Initialisiert die Event Listener für Buttons und Punkte */
function initCarouselControls() {
  nextBtn?.addEventListener('click', () => updateCarousel('next'));
  prevBtn?.addEventListener('click', () => updateCarousel('prev'));

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      if (i === currentIndex || isAnimating) return;
      currentIndex = i;
      updateAllCards();
      // Bei direktem Klick auf Punkte springen wir ohne Slide-Animation
      positionQuoteMark(false);
    })
  );
}

// Initialisierung beim Laden
updateAllCards();
initCarouselControls();

/**
 * Positioniert den Quote-Mark absolut über dem Carousel-Wrapper,
 * damit er unabhängig von der horizontalen Track-Animation stabil bleibt.
 * @param {boolean} smooth - Ob die Position sanft (CSS Transition) oder hart geändert werden soll.
 */
function positionQuoteMark(smooth = false) {
  const wrapper = document.querySelector('.carousel-wrapper');
  if (!quoteMark || !centerCard || !wrapper) return;

  // 'smooth' Klasse fügt Transition hinzu oder entfernt sie
  if (smooth) {
    quoteMark.classList.add('smooth');
  } else {
    quoteMark.classList.remove('smooth');
  }

  const wrapperRect = wrapper.getBoundingClientRect();
  const cardRect = centerCard.getBoundingClientRect();
  const cardWidth = centerCard.offsetWidth;

  // Dynamische Berechnung des Offsets basierend auf der aktuellen Icon-Größe
  const factorX = window.innerWidth < 480 ? 0.45 : 0.55;
  const offsetLeft = quoteMark.offsetWidth * factorX;
  const offsetTop = quoteMark.offsetHeight * 0.15;

  // Horizontal: Icon bleibt in der Mitte des Wrappers minus halbe Kartenbreite und Offset
  const leftPos = (wrapperRect.width - cardWidth) / 2 - offsetLeft;
  
  // Sicherstellen, dass es auf extrem kleinen Screens (320px) nicht links aus dem Bild ragt
  const minLeft = 4; 
  quoteMark.style.left = Math.max(minLeft, leftPos) + 'px';

  // Vertikal: Top-Position der Karte relativ zum Wrapper
  quoteMark.style.top = (cardRect.top - wrapperRect.top) - offsetTop + 'px';
}

// Event Listener für Größenänderungen und Initialisierung
window.addEventListener('load', () => positionQuoteMark(false));
window.addEventListener('resize', () => positionQuoteMark(false));

// Fallback für späte Renderings
setTimeout(() => positionQuoteMark(false), 0);
