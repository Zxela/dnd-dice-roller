/**
 * Animator Module - 3D Dice Version
 * Creates real 3D CSS dice that tumble and land showing the result.
 */

/**
 * Animation timing constants
 */
const BASE_ANIMATION_DURATION = 1500; // 1.5s base animation
const STAGGER_DELAY = 150; // 150ms between dice for 3D effect

/**
 * Creates pip elements for a d6 face
 * @param {number} count - Number of pips (1-6)
 * @returns {string} HTML string for pips
 */
function createPips(count) {
  return Array(count).fill('<span class="pip"></span>').join('');
}

/**
 * Creates a 3D d6 cube with pip faces
 * @returns {HTMLElement} The cube element with all 6 pip faces
 */
function createD6Cube() {
  const cube = document.createElement('div');
  cube.className = 'die-cube';

  // Create 6 faces with correct pip counts
  // Opposite faces sum to 7: 1-6, 2-5, 3-4
  const faceConfigs = [
    { face: 1, pips: 1 },  // Front
    { face: 2, pips: 6 },  // Back (opposite of 1)
    { face: 3, pips: 2 },  // Right
    { face: 4, pips: 5 },  // Left (opposite of 2... wait, let me recalculate)
    { face: 5, pips: 3 },  // Top
    { face: 6, pips: 4 },  // Bottom (opposite of 3)
  ];

  // Standard d6: 1 opposite 6, 2 opposite 5, 3 opposite 4
  const pipCounts = [1, 6, 2, 5, 3, 4]; // faces 1-6 as positioned

  for (let i = 0; i < 6; i++) {
    const face = document.createElement('div');
    face.className = `die-face die-face-${i + 1}`;
    face.innerHTML = createPips(pipCounts[i]);
    face.dataset.value = pipCounts[i];
    cube.appendChild(face);
  }

  return cube;
}

/**
 * Creates a generic numbered die cube
 * @param {number} sides - Number of sides
 * @param {number} value - The result value to show
 * @returns {HTMLElement} The cube element
 */
function createNumberedCube(sides, value) {
  const cube = document.createElement('div');
  cube.className = 'die-cube';

  // Create 6 faces with numbers spread around
  // Face 1 (front) will show the result
  const numbers = generateFaceNumbers(sides, value);

  for (let i = 0; i < 6; i++) {
    const face = document.createElement('div');
    face.className = `die-face die-face-${i + 1}`;
    face.textContent = numbers[i];
    face.dataset.value = numbers[i];
    cube.appendChild(face);
  }

  return cube;
}

/**
 * Generates numbers for cube faces with result on front face
 * @param {number} sides - Number of sides on the die
 * @param {number} value - The result value (will be on front face)
 * @returns {number[]} Array of 6 numbers for each face
 */
function generateFaceNumbers(sides, value) {
  // Put result on face 1 (front, which will face up after rotation)
  const numbers = [value];

  // Fill other faces with random other numbers from the die
  const otherNumbers = [];
  for (let i = 1; i <= sides; i++) {
    if (i !== value) otherNumbers.push(i);
  }

  // Shuffle and take 5 for the other faces
  for (let i = otherNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherNumbers[i], otherNumbers[j]] = [otherNumbers[j], otherNumbers[i]];
  }

  // Add 5 more numbers (cycling if needed)
  for (let i = 0; i < 5; i++) {
    numbers.push(otherNumbers[i % otherNumbers.length] || (i + 1));
  }

  return numbers;
}

/**
 * Gets the final rotation to show a specific d6 face
 * @param {number} value - The value to show (1-6)
 * @returns {Object} Rotation values {x, y, z}
 */
function getD6Rotation(value) {
  // Map d6 values to rotations that show that face on top
  // Based on our cube face positions
  const rotations = {
    1: { x: -90, y: 0, z: 0 },     // Front face up
    2: { x: 0, y: -90, z: 0 },     // Right face up
    3: { x: 0, y: 0, z: 0 },       // Top face up
    4: { x: 180, y: 0, z: 0 },     // Bottom face up
    5: { x: 0, y: 90, z: 0 },      // Left face up
    6: { x: 90, y: 0, z: 0 },      // Back face up
  };
  return rotations[value] || { x: 0, y: 0, z: 0 };
}

/**
 * Gets a rotation that shows the front face (where result is)
 * @param {number} value - Used to add some visual variety
 * @returns {Object} Rotation values {x, y, z}
 */
function getGenericRotation(value) {
  // Front face (with result) needs to face the viewer
  // Add some variety based on value
  const baseRotations = [
    { x: -90, y: 0, z: 0 },
    { x: -90, y: 15, z: 0 },
    { x: -90, y: -15, z: 0 },
    { x: -90, y: 0, z: 15 },
    { x: -90, y: 0, z: -15 },
  ];
  return baseRotations[value % baseRotations.length];
}

/**
 * Creates a complete 3D die element
 * @param {Object} roll - Roll object with die, value, kept, dropped properties
 * @param {number} index - Index for staggered animation delay
 * @returns {HTMLElement} Complete 3D die element
 */
function create3DDie(roll, index) {
  const wrapper = document.createElement('div');
  const sides = parseInt(roll.die.replace('d', ''));

  wrapper.className = `die-3d die-${roll.die}`;
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', `${roll.die} rolling...`);
  wrapper.dataset.die = roll.die;
  wrapper.dataset.value = roll.value;

  // Set animation delay
  wrapper.style.setProperty('--animation-delay', `${index * STAGGER_DELAY / 1000}s`);

  // Create the cube
  let cube;
  if (sides === 6) {
    cube = createD6Cube();
    wrapper.classList.add('die-d6');
    const rot = getD6Rotation(roll.value);
    wrapper.style.setProperty('--final-x', `${rot.x}deg`);
    wrapper.style.setProperty('--final-y', `${rot.y}deg`);
    wrapper.style.setProperty('--final-z', `${rot.z}deg`);
  } else {
    cube = createNumberedCube(sides, roll.value);
    // Add die-specific class for styling
    if (sides === 4) wrapper.classList.add('die-d4');
    else if (sides === 8) wrapper.classList.add('die-d8');
    else if (sides === 10) wrapper.classList.add('die-d10');
    else if (sides === 12) wrapper.classList.add('die-d12');
    else if (sides === 20) wrapper.classList.add('die-d20');
    else if (sides === 100) wrapper.classList.add('die-d100');

    const rot = getGenericRotation(roll.value);
    wrapper.style.setProperty('--final-x', `${rot.x}deg`);
    wrapper.style.setProperty('--final-y', `${rot.y}deg`);
    wrapper.style.setProperty('--final-z', `${rot.z}deg`);
  }

  wrapper.appendChild(cube);

  // Add result overlay for non-d6 dice (shows after animation)
  if (sides !== 6) {
    const resultOverlay = document.createElement('div');
    resultOverlay.className = 'result-value';
    resultOverlay.textContent = roll.value;
    wrapper.appendChild(resultOverlay);
  }

  // Start rolling animation
  wrapper.classList.add('rolling');

  return wrapper;
}

/**
 * Applies result state to a 3D die after animation
 * @param {HTMLElement} dieElement - The 3D die element
 * @param {Object} roll - Roll object
 */
function apply3DResultState(dieElement, roll) {
  dieElement.classList.remove('rolling');
  dieElement.classList.add('result');
  dieElement.classList.add('show-result');

  // Update aria-label with result
  dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value}`);

  // Apply state classes
  if (roll.dropped) {
    dieElement.classList.add('dropped');
    dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value} (dropped)`);
  }

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
 * Builds the breakdown string showing the calculation.
 * @param {Object} rollResult - The complete roll result object
 * @returns {string} Breakdown string
 */
function buildBreakdownString(rollResult) {
  const { rolls, modifier, total } = rollResult;

  const keptValues = rolls
    .filter(roll => roll.kept)
    .map(roll => roll.value);

  const droppedValues = rolls
    .filter(roll => roll.dropped)
    .map(roll => roll.value);

  let breakdown = '';

  if (keptValues.length > 0) {
    const diceSum = keptValues.join('+');
    breakdown = keptValues.length > 1 ? `(${diceSum})` : diceSum;
  } else {
    breakdown = '0';
  }

  if (droppedValues.length > 0) {
    breakdown += ` [dropped: ${droppedValues.join(', ')}]`;
  }

  if (modifier !== 0) {
    breakdown += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
  }

  breakdown += ` = ${total}`;

  return breakdown;
}

/**
 * Updates the total display with the final result.
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
 * @param {Object} rollResult - The complete roll result object
 */
function updateBreakdownDisplay(rollResult) {
  const breakdownElement = document.querySelector('.roll-breakdown');
  if (breakdownElement) {
    breakdownElement.textContent = buildBreakdownString(rollResult);
  }
}

/**
 * Clears the dice container
 * @param {HTMLElement} container - The dice container element
 */
function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Animates a dice roll with 3D tumbling dice.
 * @param {Object} rollResult - The complete roll result object from roller.js
 * @param {HTMLElement} [container] - Optional container element
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

    // Create 3D dice with staggered animations
    const dieElements = rolls.map((roll, index) => {
      const dieElement = create3DDie(roll, index);
      diceContainer.appendChild(dieElement);
      return { element: dieElement, roll };
    });

    // Calculate total animation time
    const totalAnimationTime = BASE_ANIMATION_DURATION + (rolls.length - 1) * STAGGER_DELAY + 100;

    // Apply result states after animations complete
    setTimeout(() => {
      dieElements.forEach(({ element, roll }) => {
        apply3DResultState(element, roll);
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
 * @param {Object} rollResult - The complete roll result object from roller.js
 * @param {HTMLElement} [container] - Optional container element
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

  // Create dice without animation
  rolls.forEach((roll, index) => {
    const dieElement = create3DDie(roll, index);
    dieElement.classList.remove('rolling');
    dieElement.classList.add('result', 'show-result');

    // Set final rotation immediately
    dieElement.style.animation = 'none';

    if (roll.dropped) {
      dieElement.classList.add('dropped');
    }
    if (roll.die === 'd20' && roll.value === 20) {
      dieElement.classList.add('nat20');
    }
    if (roll.die === 'd20' && roll.value === 1) {
      dieElement.classList.add('nat1');
    }

    diceContainer.appendChild(dieElement);
  });

  // Update displays immediately
  updateTotalDisplay(rollResult.total);
  updateBreakdownDisplay(rollResult);
}
