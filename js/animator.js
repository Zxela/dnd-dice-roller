/**
 * Animator Module
 * Orchestrates dice animations and updates the roll display area.
 * Connects the roller output to the visual UI.
 */

/**
 * Animation timing constants
 */
const BASE_ANIMATION_DURATION = 1500; // 1.5s base animation
const STAGGER_DELAY = 100; // 100ms between dice

/**
 * Creates a die element for display.
 * Uses textContent for XSS prevention.
 * @param {Object} roll - Roll object with die, value, kept, dropped properties
 * @param {number} index - Index for staggered animation delay
 * @param {boolean} animated - Whether to apply animation classes
 * @returns {HTMLElement} Die element
 */
function createDieElement(roll, index, animated = true) {
  const dieElement = document.createElement('div');
  dieElement.className = 'die';
  dieElement.setAttribute('role', 'img');
  dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value}`);

  // Store die type as data attribute for styling/identification
  dieElement.dataset.die = roll.die;
  dieElement.dataset.value = roll.value;

  if (animated) {
    // Show "?" during animation
    dieElement.textContent = '?';
    dieElement.classList.add('die-rolling');
    // Set staggered animation delay using CSS variable
    dieElement.style.setProperty('--animation-delay', `${index * STAGGER_DELAY / 1000}s`);
  } else {
    // Instant display - show value immediately
    dieElement.textContent = roll.value;
    applyResultClasses(dieElement, roll);
  }

  return dieElement;
}

/**
 * Applies result classes to a die element based on the roll.
 * @param {HTMLElement} dieElement - The die DOM element
 * @param {Object} roll - Roll object with die, value, kept, dropped properties
 */
function applyResultClasses(dieElement, roll) {
  dieElement.classList.add('die-result');

  // Apply dropped class if the die was dropped
  if (roll.dropped) {
    dieElement.classList.add('dropped');
    dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value} (dropped)`);
  }

  // Apply nat20/nat1 classes for d20 results
  if (roll.die === 'd20') {
    if (roll.value === 20) {
      dieElement.classList.add('nat20');
      dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value} - Critical Success!`);
    } else if (roll.value === 1) {
      dieElement.classList.add('nat1');
      dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value} - Critical Failure!`);
    }
  }
}

/**
 * Reveals the actual value of a die after animation completes.
 * @param {HTMLElement} dieElement - The die DOM element
 * @param {Object} roll - Roll object with die, value, kept, dropped properties
 */
function revealDie(dieElement, roll) {
  dieElement.classList.remove('die-rolling');
  dieElement.textContent = roll.value;
  applyResultClasses(dieElement, roll);
}

/**
 * Builds the breakdown string showing the calculation.
 * Example: "(5+3+4) + 2 = 14" or "5+3+4 = 12"
 * @param {Object} rollResult - The complete roll result object
 * @returns {string} Breakdown string
 */
function buildBreakdownString(rollResult) {
  const { rolls, modifier, total } = rollResult;

  // Get kept dice values
  const keptValues = rolls
    .filter(roll => roll.kept)
    .map(roll => roll.value);

  // Get dropped dice values for display
  const droppedValues = rolls
    .filter(roll => roll.dropped)
    .map(roll => roll.value);

  // Build the dice sum part
  let breakdown = '';

  if (keptValues.length > 0) {
    const diceSum = keptValues.join('+');
    breakdown = keptValues.length > 1 ? `(${diceSum})` : diceSum;
  } else {
    breakdown = '0';
  }

  // Add dropped dice info if any
  if (droppedValues.length > 0) {
    breakdown += ` [dropped: ${droppedValues.join(', ')}]`;
  }

  // Add modifier if present
  if (modifier !== 0) {
    breakdown += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
  }

  // Add equals and total
  breakdown += ` = ${total}`;

  return breakdown;
}

/**
 * Updates the total display with the final result.
 * Uses textContent for XSS prevention.
 * @param {number} total - The total roll value
 */
function updateTotalDisplay(total) {
  const totalElement = document.querySelector('.total-value');
  if (totalElement) {
    totalElement.textContent = total;
  }
}

/**
 * Updates the breakdown display showing the calculation.
 * Uses textContent for XSS prevention.
 * @param {Object} rollResult - The complete roll result object
 */
function updateBreakdownDisplay(rollResult) {
  const breakdownElement = document.querySelector('.roll-breakdown');
  if (breakdownElement) {
    breakdownElement.textContent = buildBreakdownString(rollResult);
  }
}

/**
 * Clears the dice container of all dice elements.
 * @param {HTMLElement} container - The dice container element
 */
function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Animates a dice roll with staggered animations.
 * Creates die elements, plays animations, then reveals results.
 * @param {Object} rollResult - The complete roll result object from roller.js
 * @param {HTMLElement} [container] - Optional container element (defaults to .dice-container)
 * @returns {Promise<void>} Promise that resolves when animation completes
 */
export function animateRoll(rollResult, container) {
  return new Promise((resolve) => {
    const diceContainer = container || document.querySelector('.dice-container');

    if (!diceContainer) {
      console.error('Dice container not found');
      resolve();
      return;
    }

    const { rolls } = rollResult;

    // Clear existing dice
    clearContainer(diceContainer);

    // Reset total display during animation
    const totalElement = document.querySelector('.total-value');
    if (totalElement) {
      totalElement.textContent = '...';
    }

    // Reset breakdown during animation
    const breakdownElement = document.querySelector('.roll-breakdown');
    if (breakdownElement) {
      breakdownElement.textContent = 'Rolling...';
    }

    // Create die elements with staggered animations
    const dieElements = rolls.map((roll, index) => {
      const dieElement = createDieElement(roll, index, true);
      diceContainer.appendChild(dieElement);
      return { element: dieElement, roll };
    });

    // Calculate total animation time
    // Base animation (1.5s) + stagger delay for all dice
    const totalAnimationTime = BASE_ANIMATION_DURATION + (rolls.length - 1) * STAGGER_DELAY;

    // Reveal dice after animations complete
    setTimeout(() => {
      dieElements.forEach(({ element, roll }) => {
        revealDie(element, roll);
      });

      // Update total and breakdown displays
      updateTotalDisplay(rollResult.total);
      updateBreakdownDisplay(rollResult);

      resolve();
    }, totalAnimationTime);
  });
}

/**
 * Displays a roll result instantly without animation.
 * Used for showing history items or when animations are disabled.
 * @param {Object} rollResult - The complete roll result object from roller.js
 * @param {HTMLElement} [container] - Optional container element (defaults to .dice-container)
 */
export function displayResult(rollResult, container) {
  const diceContainer = container || document.querySelector('.dice-container');

  if (!diceContainer) {
    console.error('Dice container not found');
    return;
  }

  const { rolls } = rollResult;

  // Clear existing dice
  clearContainer(diceContainer);

  // Create die elements without animation
  rolls.forEach((roll, index) => {
    const dieElement = createDieElement(roll, index, false);
    diceContainer.appendChild(dieElement);
  });

  // Update total and breakdown displays immediately
  updateTotalDisplay(rollResult.total);
  updateBreakdownDisplay(rollResult);
}
