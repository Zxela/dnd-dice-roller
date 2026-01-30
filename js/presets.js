/**
 * Presets Panel Module
 * Manages saved dice roll presets with local storage persistence.
 */

import * as storage from './storage.js';
import { parse } from './parser.js';

const STORAGE_KEY = 'presets';

/** @type {Function|null} */
let rollCallback = null;

/** @type {HTMLElement|null} */
let presetsContainer = null;

/** @type {HTMLElement|null} */
let modalElement = null;

/**
 * Generates a unique ID for a preset.
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/**
 * Retrieves all saved presets from storage.
 * @returns {Array<{id: string, name: string, notation: string}>} Array of presets
 */
export function getPresets() {
  return storage.get(STORAGE_KEY) || [];
}

/**
 * Saves a preset to storage.
 * @param {Array} presets - Array of presets to save
 */
function savePresets(presets) {
  storage.set(STORAGE_KEY, presets);
}

/**
 * Validates dice notation using the parser.
 * @param {string} notation - Dice notation to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
function validateNotation(notation) {
  try {
    parse(notation);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Adds a new preset.
 * @param {string} name - Name for the preset
 * @param {string} notation - Dice notation
 * @returns {{success: boolean, error?: string, preset?: Object}} Result
 */
export function addPreset(name, notation) {
  const trimmedName = name.trim();
  const trimmedNotation = notation.trim();

  if (!trimmedName) {
    return { success: false, error: 'Name is required' };
  }

  if (!trimmedNotation) {
    return { success: false, error: 'Notation is required' };
  }

  const validation = validateNotation(trimmedNotation);
  if (!validation.valid) {
    return { success: false, error: `Invalid notation: ${validation.error}` };
  }

  const preset = {
    id: generateId(),
    name: trimmedName,
    notation: trimmedNotation
  };

  const presets = getPresets();
  presets.push(preset);
  savePresets(presets);

  renderPresets();
  return { success: true, preset };
}

/**
 * Deletes a preset by ID.
 * @param {string} id - Preset ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deletePreset(id) {
  const presets = getPresets();
  const index = presets.findIndex(p => p.id === id);

  if (index === -1) {
    return false;
  }

  presets.splice(index, 1);
  savePresets(presets);
  renderPresets();
  return true;
}

/**
 * Creates the modal HTML and appends it to the document body.
 */
function createModal() {
  if (modalElement) {
    return;
  }

  modalElement = document.createElement('div');
  modalElement.className = 'preset-modal-overlay';
  modalElement.innerHTML = `
    <div class="preset-modal">
      <div class="preset-modal-header">
        <h3 class="preset-modal-title">Add Preset</h3>
        <button type="button" class="preset-modal-close" aria-label="Close modal">&times;</button>
      </div>
      <form class="preset-modal-form" id="preset-form">
        <div class="preset-form-group">
          <label for="preset-name" class="preset-form-label">Name</label>
          <input type="text" id="preset-name" class="preset-form-input" placeholder="e.g., Fireball Damage" required>
        </div>
        <div class="preset-form-group">
          <label for="preset-notation" class="preset-form-label">Dice Notation</label>
          <input type="text" id="preset-notation" class="preset-form-input" placeholder="e.g., 8d6" required>
        </div>
        <div class="preset-form-error" id="preset-error"></div>
        <div class="preset-modal-actions">
          <button type="button" class="preset-btn preset-btn-cancel">Cancel</button>
          <button type="submit" class="preset-btn preset-btn-save">Save</button>
        </div>
      </form>
    </div>
  `;

  // Add styles for the modal
  const style = document.createElement('style');
  style.textContent = `
    .preset-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition-fast), visibility var(--transition-fast);
    }

    .preset-modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .preset-modal {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      width: 90%;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
      transform: scale(0.9);
      transition: transform var(--transition-fast);
    }

    .preset-modal-overlay.active .preset-modal {
      transform: scale(1);
    }

    .preset-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .preset-modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .preset-modal-close {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: var(--spacing-xs);
      line-height: 1;
      transition: color var(--transition-fast);
    }

    .preset-modal-close:hover {
      color: var(--color-text-primary);
    }

    .preset-form-group {
      margin-bottom: var(--spacing-md);
    }

    .preset-form-label {
      display: block;
      margin-bottom: var(--spacing-xs);
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .preset-form-input {
      width: 100%;
      background: var(--color-background);
      border: 2px solid var(--color-secondary);
      border-radius: var(--radius-md);
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-text-primary);
      font-size: 1rem;
      transition: border-color var(--transition-fast);
    }

    .preset-form-input::placeholder {
      color: var(--color-text-secondary);
    }

    .preset-form-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .preset-form-input.error {
      border-color: var(--color-danger);
    }

    .preset-form-error {
      color: var(--color-danger);
      font-size: 0.875rem;
      margin-bottom: var(--spacing-md);
      min-height: 1.25rem;
    }

    .preset-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
    }

    .preset-btn {
      border: none;
      border-radius: var(--radius-md);
      padding: var(--spacing-sm) var(--spacing-lg);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .preset-btn-cancel {
      background: var(--color-secondary);
      color: var(--color-text-primary);
    }

    .preset-btn-cancel:hover {
      background: #1a4a7a;
    }

    .preset-btn-save {
      background: var(--color-primary);
      color: var(--color-text-primary);
    }

    .preset-btn-save:hover {
      background: #d63d56;
    }

    .preset-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-background);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .preset-item:hover {
      background: var(--color-secondary);
    }

    .preset-info {
      flex: 1;
      min-width: 0;
    }

    .preset-name {
      color: var(--color-text-primary);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .preset-notation {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .preset-delete {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 1.25rem;
      cursor: pointer;
      padding: var(--spacing-xs);
      line-height: 1;
      transition: color var(--transition-fast);
      flex-shrink: 0;
    }

    .preset-delete:hover {
      color: var(--color-danger);
    }

    .add-preset-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-secondary);
      border: 2px dashed var(--color-text-secondary);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: border-color var(--transition-fast), color var(--transition-fast);
    }

    .add-preset-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-text-primary);
    }

    .presets-empty {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      text-align: center;
      padding: var(--spacing-md);
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(modalElement);

  // Event listeners
  const closeBtn = modalElement.querySelector('.preset-modal-close');
  const cancelBtn = modalElement.querySelector('.preset-btn-cancel');
  const form = modalElement.querySelector('#preset-form');

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeModal();
    }
  });

  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Opens the add preset modal.
 */
function openModal() {
  createModal();
  modalElement.classList.add('active');
  const nameInput = modalElement.querySelector('#preset-name');
  nameInput.focus();
}

/**
 * Closes the add preset modal.
 */
function closeModal() {
  if (!modalElement) return;

  modalElement.classList.remove('active');

  // Reset form
  const form = modalElement.querySelector('#preset-form');
  const errorDiv = modalElement.querySelector('#preset-error');
  const notationInput = modalElement.querySelector('#preset-notation');

  form.reset();
  errorDiv.textContent = '';
  notationInput.classList.remove('error');
}

/**
 * Handles the preset form submission.
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput = modalElement.querySelector('#preset-name');
  const notationInput = modalElement.querySelector('#preset-notation');
  const errorDiv = modalElement.querySelector('#preset-error');

  const name = nameInput.value;
  const notation = notationInput.value;

  const result = addPreset(name, notation);

  if (result.success) {
    closeModal();
  } else {
    errorDiv.textContent = result.error;
    notationInput.classList.add('error');
  }
}

/**
 * Renders the presets list.
 */
function renderPresets() {
  if (!presetsContainer) return;

  const presets = getPresets();

  if (presets.length === 0) {
    presetsContainer.innerHTML = '';

    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'presets-empty';
    emptyMsg.textContent = 'No presets saved yet.';

    const addBtn = createAddButton();

    presetsContainer.appendChild(emptyMsg);
    presetsContainer.appendChild(addBtn);
    return;
  }

  presetsContainer.innerHTML = '';

  presets.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const info = document.createElement('div');
    info.className = 'preset-info';

    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;

    const notation = document.createElement('div');
    notation.className = 'preset-notation';
    notation.textContent = preset.notation;

    info.appendChild(name);
    info.appendChild(notation);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'preset-delete';
    deleteBtn.setAttribute('aria-label', `Delete ${preset.name}`);
    deleteBtn.textContent = '\u00D7';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete preset "${preset.name}"?`)) {
        deletePreset(preset.id);
      }
    });

    // Click to roll
    const handleRoll = () => {
      if (rollCallback) {
        rollCallback(preset.notation);
      }
    };

    item.addEventListener('click', handleRoll);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleRoll();
      }
    });

    item.appendChild(info);
    item.appendChild(deleteBtn);
    presetsContainer.appendChild(item);
  });

  // Add button at the end
  const addBtn = createAddButton();
  presetsContainer.appendChild(addBtn);
}

/**
 * Creates the "Add Preset" button.
 * @returns {HTMLElement} The button element
 */
function createAddButton() {
  const btn = document.createElement('button');
  btn.className = 'add-preset-btn';
  btn.type = 'button';
  btn.innerHTML = '<span>+</span> Add Preset';
  btn.addEventListener('click', openModal);
  return btn;
}

/**
 * Initializes the presets panel.
 * @param {Function} callback - Function to call when a preset is clicked
 */
export function initPresets(callback) {
  rollCallback = callback;
  presetsContainer = document.getElementById('presets-panel');

  if (!presetsContainer) {
    console.error('Presets panel container not found');
    return;
  }

  renderPresets();
}
