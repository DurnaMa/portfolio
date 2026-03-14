// ── PROJECT PREVIEW + OVERLAY ──

let projectList = [];
let overlayIndex = 0;

/** Fetches project data from projects.json. */
async function loadProjects() {
  const response = await fetch(getBasePath() + 'projects.json');
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
  const dialog = document.getElementById('project-overlay');
  if (dialog.tagName === 'DIALOG' && !dialog.open) {
    dialog.showModal();
  }
  dialog.classList.add('project-preview');
  document.body.style.overflow = 'hidden';
}

function closeProjectOverlay() {
  const dialog = document.getElementById('project-overlay');
  if (!dialog) return;
  dialog.classList.remove('project-preview');
  if (dialog.tagName === 'DIALOG' && dialog.open) {
    dialog.close();
  }
  document.body.style.overflow = '';
}

/** Advances to the next project inside the open overlay. */
function nextCardR() {
  overlayIndex = (overlayIndex + 1) % projectList.length;
  renderOverlay(overlayIndex);
}

/** Closes overlay on backdrop click, Escape key, or dialog cancel. */
function initOverlay() {
  const overlay = document.getElementById('project-overlay');
  if (!overlay) return;
  // Close on click outside card (for <dialog>, click on ::backdrop)
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
  if (typeof buildOverlay === 'function') buildOverlay();

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
