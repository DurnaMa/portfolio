/** Builds the overlay dialog once and appends it to the body. */
function buildOverlay() {
  if (document.getElementById('project-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'project-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Project details');

  overlay.innerHTML = `
    <div class="overlay-card">
      <button class="overlay-close" onclick="closeProjectOverlay()" aria-label="Close">✕</button>
      <div class="overlay-left">
        <p class="overlay-subtitle">What is this project about?</p>
        <h2 id="overlay-title"></h2>
        <p class="overlay-desc" id="overlay-desc"></p>
        <div class="overlay-tags" id="overlay-tags"></div>
        <div class="overlay-btns">
          <a id="overlay-github" href="#" target="_blank" rel="noopener" class="overlay-btn">
            GitHub <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
          <a id="overlay-live" href="#" target="_blank" rel="noopener" class="overlay-btn">
            Live Test <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>
      </div>
      <div class="overlay-right">
        <div class="overlay-mockup">
          <img id="overlay-img" src="" alt="" />
        </div>
      </div>
      <button class="overlay-next" onclick="nextCardR()">
        Next project <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>`;

  document.body.appendChild(overlay);
}