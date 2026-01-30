/**
 * Roll History Module
 * Manages the display and persistence of dice roll history.
 */

import * as storage from './storage.js';

/** Storage key for history data (will be prefixed by storage.js) */
const STORAGE_KEY = 'history';

/** Maximum number of rolls to store */
const MAX_HISTORY_LENGTH = 50;

/** DOM element reference for the history panel */
let historyPanel = null;

/**
 * Formats an ISO timestamp to a human-readable string.
 * @param {string} isoTimestamp - ISO 8601 timestamp
 * @returns {string} Formatted time string (e.g., "2:30:45 PM")
 */
function formatTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Creates the DOM elements for a single history entry.
 * Uses textContent for XSS prevention.
 * @param {Object} rollResult - The roll result object from roller.js
 * @returns {HTMLElement} The history entry element
 */
function createHistoryEntry(rollResult) {
  const entry = document.createElement('div');
  entry.className = 'history-entry';
  entry.dataset.id = rollResult.id;

  // Header row: timestamp and notation
  const header = document.createElement('div');
  header.className = 'history-entry-header';

  const timestamp = document.createElement('span');
  timestamp.className = 'history-timestamp';
  timestamp.textContent = formatTimestamp(rollResult.timestamp);

  const notation = document.createElement('span');
  notation.className = 'history-notation';
  notation.textContent = rollResult.input || rollResult.parsed?.originalNotation || 'Unknown';

  header.appendChild(timestamp);
  header.appendChild(notation);

  // Dice values row
  const diceRow = document.createElement('div');
  diceRow.className = 'history-dice';

  // Display individual dice values
  rollResult.rolls.forEach(roll => {
    const dieSpan = document.createElement('span');
    dieSpan.className = 'history-die-value';

    if (!roll.kept || roll.dropped) {
      dieSpan.className += ' history-die-dropped';
    }

    if (roll.exploded) {
      dieSpan.className += ' history-die-exploded';
    }

    dieSpan.textContent = roll.value;
    diceRow.appendChild(dieSpan);
  });

  // Add modifier if present
  if (rollResult.modifier !== 0) {
    const modSpan = document.createElement('span');
    modSpan.className = 'history-modifier';
    modSpan.textContent = rollResult.modifier > 0 ? `+${rollResult.modifier}` : rollResult.modifier;
    diceRow.appendChild(modSpan);
  }

  // Total row
  const totalRow = document.createElement('div');
  totalRow.className = 'history-total';
  totalRow.textContent = `Total: ${rollResult.total}`;

  entry.appendChild(header);
  entry.appendChild(diceRow);
  entry.appendChild(totalRow);

  return entry;
}

/**
 * Creates the Clear History button element.
 * @returns {HTMLElement} The clear button element
 */
function createClearButton() {
  const button = document.createElement('button');
  button.className = 'clear-history-btn';
  button.textContent = 'Clear History';
  button.addEventListener('click', () => {
    clearHistory();
  });
  return button;
}

/**
 * Renders the complete history list from storage data.
 */
function renderHistory() {
  if (!historyPanel) return;

  const history = getHistory();

  // Clear current content
  historyPanel.innerHTML = '';

  if (history.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No rolls yet.';
    historyPanel.appendChild(emptyMessage);
    return;
  }

  // Create container for entries
  const entriesContainer = document.createElement('div');
  entriesContainer.className = 'history-entries';

  // Render each entry (newest first - already sorted)
  history.forEach(rollResult => {
    const entry = createHistoryEntry(rollResult);
    entriesContainer.appendChild(entry);
  });

  historyPanel.appendChild(entriesContainer);

  // Add clear button at the bottom
  historyPanel.appendChild(createClearButton());
}

/**
 * Initializes the history panel.
 * Loads saved history and renders it to the DOM.
 */
export function initHistory() {
  historyPanel = document.getElementById('history-panel');
  if (!historyPanel) {
    console.warn('History panel element not found');
    return;
  }

  renderHistory();
}

/**
 * Adds a new roll to history.
 * Stores in localStorage and updates the DOM.
 * @param {Object} rollResult - The roll result object from roller.js
 */
export function addRoll(rollResult) {
  if (!rollResult) return;

  const history = getHistory();

  // Add new roll at the beginning (newest first)
  history.unshift(rollResult);

  // Trim to max length
  if (history.length > MAX_HISTORY_LENGTH) {
    history.splice(MAX_HISTORY_LENGTH);
  }

  // Save to storage
  storage.set(STORAGE_KEY, history);

  // Re-render the history panel
  renderHistory();
}

/**
 * Retrieves the roll history array.
 * @returns {Array<Object>} Array of roll result objects (newest first)
 */
export function getHistory() {
  return storage.get(STORAGE_KEY) || [];
}

/**
 * Clears all roll history.
 * Removes from storage and updates the DOM.
 */
export function clearHistory() {
  storage.remove(STORAGE_KEY);
  renderHistory();
}

/**
 * Gets the configurable history limit.
 * @returns {number} Maximum number of rolls stored
 */
export function getHistoryLimit() {
  return MAX_HISTORY_LENGTH;
}
