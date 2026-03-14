// ── CONTACT FORM ──

const form = document.getElementById('contact-form');
const submitBtn = form?.querySelector('.btn-submit');

// Start disabled
if (submitBtn) submitBtn.disabled = true;

/** @returns {{ name: string, email: string, message: string, privacy: boolean }} */
function getFormValues() {
  return {
    name: form.querySelector('#name').value.trim(),
    email: form.querySelector('#email').value.trim(),
    message: form.querySelector('#message').value.trim(),
    privacy: form.querySelector('#privacy').checked,
  };
}

/** Checks if an email address format is valid. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Shows/removes a per-field error message. */
function setFieldError(fieldId, message) {
  const group = form.querySelector(`#${fieldId}`)?.closest('.form-group');
  if (!group) return;
  group.querySelector('.field-error')?.remove();
  if (message) {
    group.classList.add('error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    group.appendChild(err);
  } else {
    group.classList.remove('error');
  }
}

/** Validates a single field on blur. Returns true if valid. */
function validateField(fieldId) {
  const val = form.querySelector(`#${fieldId}`).value.trim();
  if (fieldId === 'name') {
    if (!val) { setFieldError('name', t('form.error.name')); return false; }
    setFieldError('name', ''); return true;
  }
  if (fieldId === 'email') {
    if (!val) { setFieldError('email', t('form.error.email.empty')); return false; }
    if (!isValidEmail(val)) { setFieldError('email', t('form.error.email.invalid')); return false; }
    setFieldError('email', ''); return true;
  }
  if (fieldId === 'message') {
    if (!val) { setFieldError('message', t('form.error.msg')); return false; }
    setFieldError('message', ''); return true;
  }
  return true;
}

/** Checks all fields and enables/disables the submit button. */
function checkFormReady() {
  const { name, email, message, privacy } = getFormValues();
  const ready = name && isValidEmail(email) && message && privacy;
  submitBtn.disabled = !ready;
}

/** Initializes blur validation and live enable/disable of submit. */
function initFormValidation() {
  if (!form) return;
  ['name', 'email', 'message'].forEach((id) => {
    const el = form.querySelector(`#${id}`);
    if (!el) return;
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', checkFormReady);
  });
  form.querySelector('#privacy')?.addEventListener('change', checkFormReady);
}

/** @returns {boolean} */
function validateForm(name, email, message, privacy) {
  let valid = true;
  if (!validateField('name')) valid = false;
  if (!validateField('email')) valid = false;
  if (!validateField('message')) valid = false;
  if (!privacy) {
    showFormFeedback(t('form.error.privacy'), 'error');
    valid = false;
  }
  return valid;
}

function handleFormSuccess() {
  showFormFeedback(t('form.success'), 'success');
  submitBtn.textContent = t('form.sent');
  submitBtn.style.borderColor = submitBtn.style.color = 'var(--teal)';
  form.reset();
  // Clear all field errors
  ['name', 'email', 'message'].forEach((id) => setFieldError(id, ''));
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.textContent = t('form.btnReset');
    submitBtn.style.borderColor = submitBtn.style.color = '';
  }, 4000);
}

/** @param {Error} error */
function handleFormError(error) {
  console.error('Mail error:', error);
  showFormFeedback(t('form.error.server'), 'error');
  submitBtn.textContent = t('form.btnReset');
  submitBtn.disabled = false;
}

/** @param {string} name @param {string} email @param {string} message */
async function sendMail(name, email, message) {
  const response = await fetch('mail.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  if (!response.ok) throw new Error('Server responded with status ' + response.status);
  return response;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { name, email, message, privacy } = getFormValues();
  if (!validateForm(name, email, message, privacy)) return;
  submitBtn.textContent = t('form.sending');
  submitBtn.disabled = true;
  try {
    await sendMail(name, email, message);
    handleFormSuccess();
  } catch (error) {
    handleFormError(error);
  }
});

/**
 * Shows a temporary feedback message below the form.
 * @param {string} text @param {'success'|'error'} type
 */
function showFormFeedback(text, type) {
  form.querySelector('.form-feedback')?.remove();
  const msg = Object.assign(document.createElement('p'), {
    className: 'form-feedback',
    textContent: text,
  });
  msg.style.cssText = `color:${type === 'success' ? 'var(--teal)' : '#ff6b6b'};font-family:'Space Mono',monospace;font-size:1rem;margin-top:-16px`;
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}
