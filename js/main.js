/**
 * Main Entry Point
 * Wires all components together and initializes the D&D Dice Roller application.
 */

// Import all component modules
import { parse } from './parser.js';
import { executeRoll } from './roller.js';
import { animateRoll } from './animator.js';
import { audio } from './audio.js';
import { initDiceButtons, setButtonsDisabled } from './dice-buttons.js';
import { initInputForm, showError, setFormDisabled } from './input-form.js';
import { initHistory, addRoll } from './history.js';
import { initPresets } from './presets.js';

// DOM element references
let diceContainer = null;
let soundToggleBtn = null;

// Rolling state to prevent overlapping rolls
let isRolling = false;

/**
 * Updates the sound toggle button appearance based on audio state.
 */
function updateSoundToggleButton() {
  if (!soundToggleBtn) return;

  const enabled = audio.isEnabled();
  soundToggleBtn.setAttribute('aria-label', enabled ? 'Mute sound' : 'Unmute sound');
  // Use speaker icon (with waves for on, without for off)
  soundToggleBtn.innerHTML = `<span aria-hidden="true">${enabled ? '\u{1F50A}' : '\u{1F507}'}</span>`;
}

/**
 * Handles sound toggle button click.
 */
function handleSoundToggle() {
  // Initialize audio on first interaction if not already done
  audio.init();
  audio.toggle();
  updateSoundToggleButton();
}

/**
 * Sets the disabled state for all interactive elements during a roll.
 * @param {boolean} disabled - Whether to disable elements
 */
function setRollingState(disabled) {
  isRolling = disabled;
  setButtonsDisabled(disabled);
  setFormDisabled(disabled);
}

/**
 * Central roll function that coordinates the entire roll flow.
 * Parses notation, executes the roll, plays sound, animates, and saves to history.
 * @param {string} notation - The dice notation to roll (e.g., "2d6+3")
 * @returns {Promise<Object>} The roll result object
 */
async function roll(notation) {
  // Prevent overlapping rolls
  if (isRolling) {
    return null;
  }

  try {
    // Disable UI during roll
    setRollingState(true);

    // 1. Parse notation
    const parsed = parse(notation);

    // 2. Execute roll
    const result = executeRoll(parsed);
    result.input = notation;

    // 3. Initialize audio on first interaction and play sound
    audio.init();
    audio.play();

    // 4. Animate and display
    await animateRoll(result, diceContainer);

    // 5. Add to history
    addRoll(result);

    return result;
  } catch (error) {
    // Show error to user
    showError(error.message || 'Invalid dice notation');
    throw error;
  } finally {
    // Re-enable UI after roll completes or fails
    setRollingState(false);
  }
}

/**
 * Initializes the sound toggle button in the header.
 */
function initSoundToggle() {
  soundToggleBtn = document.getElementById('sound-toggle');
  if (!soundToggleBtn) {
    console.warn('Sound toggle button not found');
    return;
  }

  // Set initial state
  updateSoundToggleButton();

  // Add click handler
  soundToggleBtn.addEventListener('click', handleSoundToggle);
}

/**
 * Initializes the application when the DOM is ready.
 */
function init() {
  // Get dice container reference
  diceContainer = document.getElementById('dice-container');
  if (!diceContainer) {
    console.error('Dice container not found');
  }

  // Initialize all components
  initHistory();       // Load history from storage
  initPresets(roll);   // Load presets from storage, wire preset clicks
  initDiceButtons(roll);  // Wire quick dice button clicks
  initInputForm(roll);    // Wire text input form submission
  initSoundToggle();      // Wire sound toggle button
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded
  init();
}
