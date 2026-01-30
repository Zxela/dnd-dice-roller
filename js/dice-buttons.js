/**
 * Dice Buttons Module
 * Handles quick dice button interactions.
 * Wires button clicks to trigger roll callbacks.
 */

/**
 * Selector for quick dice buttons with data-roll attribute.
 */
const BUTTON_SELECTOR = '.quick-dice-btn[data-roll]';

/**
 * Reference to all quick dice buttons.
 * @type {NodeListOf<HTMLButtonElement>}
 */
let buttons = null;

/**
 * Sets the disabled state of all quick dice buttons.
 * @param {boolean} disabled - Whether buttons should be disabled
 */
export function setButtonsDisabled(disabled) {
  if (!buttons) {
    buttons = document.querySelectorAll(BUTTON_SELECTOR);
  }

  buttons.forEach(button => {
    button.disabled = disabled;
  });
}

/**
 * Initializes quick dice buttons with a roll callback.
 * Each button click will call the callback with its data-roll notation.
 * Buttons are disabled during roll and re-enabled after animation completes.
 *
 * @param {Function} rollCallback - Callback function that receives notation string
 *                                  and returns a Promise that resolves when animation completes
 */
export function initDiceButtons(rollCallback) {
  buttons = document.querySelectorAll(BUTTON_SELECTOR);

  if (buttons.length === 0) {
    console.warn('No quick dice buttons found with data-roll attribute');
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const notation = event.currentTarget.dataset.roll;

      if (!notation) {
        console.error('Button missing data-roll attribute');
        return;
      }

      // Disable buttons during roll
      setButtonsDisabled(true);

      try {
        // Call the roll callback and wait for animation to complete
        await rollCallback(notation);
      } catch (error) {
        console.error('Roll failed:', error);
      } finally {
        // Re-enable buttons after animation completes
        setButtonsDisabled(false);
      }
    });
  });
}
