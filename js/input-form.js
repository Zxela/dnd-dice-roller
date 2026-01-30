/**
 * Input Form Module
 * Handles the dice notation text input form.
 */

// DOM element references
let formElement = null;
let inputElement = null;
let submitButton = null;
let errorElement = null;

// Callback for roll action
let rollCallback = null;

/**
 * Creates and inserts the error message element after the form.
 * @returns {HTMLElement} The error element
 */
function createErrorElement() {
  const error = document.createElement('div');
  error.id = 'input-error';
  error.className = 'input-error';
  error.setAttribute('role', 'alert');
  error.setAttribute('aria-live', 'polite');
  error.style.display = 'none';

  // Insert after the form
  formElement.insertAdjacentElement('afterend', error);

  return error;
}

/**
 * Displays an error message below the input form.
 * @param {string} message - The error message to display
 */
export function showError(message) {
  if (!errorElement) return;

  errorElement.textContent = message;
  errorElement.style.display = 'block';
  inputElement?.classList.add('input-error-state');
}

/**
 * Clears any displayed error message.
 */
export function clearError() {
  if (!errorElement) return;

  errorElement.textContent = '';
  errorElement.style.display = 'none';
  inputElement?.classList.remove('input-error-state');
}

/**
 * Sets the disabled state of the form elements.
 * @param {boolean} disabled - Whether to disable the form
 */
export function setFormDisabled(disabled) {
  if (inputElement) {
    inputElement.disabled = disabled;
  }
  if (submitButton) {
    submitButton.disabled = disabled;
  }
}

/**
 * Handles form submission.
 * @param {Event} event - The submit event
 */
function handleSubmit(event) {
  event.preventDefault();

  clearError();

  const notation = inputElement?.value.trim();

  if (!notation) {
    showError('Please enter dice notation');
    return;
  }

  if (!rollCallback) {
    showError('Roll handler not configured');
    return;
  }

  try {
    rollCallback(notation);
    // Clear input after successful roll
    if (inputElement) {
      inputElement.value = '';
    }
  } catch (error) {
    showError(error.message || 'Invalid dice notation');
  }
}

/**
 * Initializes the input form with event listeners.
 * @param {Function} callback - Function to call with notation when form is submitted
 */
export function initInputForm(callback) {
  // Store the callback
  rollCallback = callback;

  // Get DOM references
  formElement = document.getElementById('dice-form');
  inputElement = document.getElementById('dice-input');
  submitButton = document.getElementById('roll-btn');

  if (!formElement) {
    console.error('Input form: dice-form element not found');
    return;
  }

  if (!inputElement) {
    console.error('Input form: dice-input element not found');
    return;
  }

  // Create error element if it doesn't exist
  errorElement = document.getElementById('input-error');
  if (!errorElement) {
    errorElement = createErrorElement();
  }

  // Form submit handler (handles both button click and Enter key)
  formElement.addEventListener('submit', handleSubmit);

  // Clear error when user starts typing
  inputElement.addEventListener('input', clearError);
}
