/**
 * Animator Module - 3D Polyhedra Dice
 * Creates proper geometric dice shapes that tumble and reveal results on landing.
 * d4=tetrahedron, d6=cube, d8=octahedron, d10=trapezohedron, d12=dodecahedron, d20=icosahedron
 */

const BASE_ANIMATION_DURATION = 1800; // 1.8s for more dramatic tumble
const STAGGER_DELAY = 200; // 200ms between dice

/**
 * Creates a D4 tetrahedron shape
 * @returns {HTMLElement}
 */
function createD4Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // 4 triangular faces
  for (let i = 1; i <= 4; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D6 cube with pip faces
 * @returns {HTMLElement}
 */
function createD6Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // Standard d6: opposite faces sum to 7
  // Face positions: 1-front, 6-back, 3-right, 4-left, 2-top, 5-bottom
  const pipCounts = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

  for (let faceNum = 1; faceNum <= 6; faceNum++) {
    const face = document.createElement('div');
    face.className = `face face-${faceNum}`;

    // Add pips
    const numPips = pipCounts[faceNum];
    for (let p = 0; p < numPips; p++) {
      const pip = document.createElement('span');
      pip.className = 'pip';
      face.appendChild(pip);
    }

    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D8 octahedron shape
 * @returns {HTMLElement}
 */
function createD8Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // 8 triangular faces
  for (let i = 1; i <= 8; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D10 shape (pentagonal trapezohedron)
 * @returns {HTMLElement}
 */
function createD10Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // 10 kite-shaped faces
  for (let i = 1; i <= 10; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D12 dodecahedron shape
 * @returns {HTMLElement}
 */
function createD12Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // 12 pentagonal faces
  for (let i = 1; i <= 12; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D20 icosahedron shape
 * @returns {HTMLElement}
 */
function createD20Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // 20 triangular faces
  for (let i = 1; i <= 20; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D100 shape (similar to d10)
 * @returns {HTMLElement}
 */
function createD100Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  // 10 faces like d10
  for (let i = 1; i <= 10; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Gets random end rotation for the tumble animation
 * @returns {Object} {rx, ry, rz} in degrees
 */
function getRandomEndRotation() {
  // End with a stable-looking rotation
  const rotations = [
    { rx: 0, ry: 0, rz: 0 },
    { rx: 0, ry: 90, rz: 0 },
    { rx: 0, ry: 180, rz: 0 },
    { rx: 0, ry: 270, rz: 0 },
    { rx: 90, ry: 0, rz: 0 },
    { rx: -90, ry: 0, rz: 0 },
    { rx: 45, ry: 45, rz: 0 },
    { rx: -45, ry: 45, rz: 0 },
  ];
  return rotations[Math.floor(Math.random() * rotations.length)];
}

/**
 * Creates a complete 3D die element
 * @param {Object} roll - Roll object with die, value, kept, dropped properties
 * @param {number} index - Index for staggered animation delay
 * @returns {HTMLElement}
 */
function create3DDie(roll, index) {
  const sides = parseInt(roll.die.replace('d', ''));
  const wrapper = document.createElement('div');

  wrapper.className = `die-3d die-${roll.die}`;
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', `${roll.die} rolling...`);
  wrapper.dataset.die = roll.die;
  wrapper.dataset.value = roll.value;

  // Set staggered animation delay
  wrapper.style.setProperty('--animation-delay', `${index * STAGGER_DELAY / 1000}s`);

  // Set random end rotation for visual variety
  const endRot = getRandomEndRotation();
  wrapper.style.setProperty('--end-rx', `${endRot.rx}deg`);
  wrapper.style.setProperty('--end-ry', `${endRot.ry}deg`);
  wrapper.style.setProperty('--end-rz', `${endRot.rz}deg`);

  // Create the appropriate shape
  let shape;
  switch (sides) {
    case 4:
      shape = createD4Shape();
      break;
    case 6:
      shape = createD6Shape();
      break;
    case 8:
      shape = createD8Shape();
      break;
    case 10:
      shape = createD10Shape();
      break;
    case 12:
      shape = createD12Shape();
      break;
    case 20:
      shape = createD20Shape();
      break;
    case 100:
      shape = createD100Shape();
      break;
    default:
      // Fallback to d6-style cube for unknown dice
      shape = createD6Shape();
  }

  wrapper.appendChild(shape);

  // Add result overlay (hidden until animation completes)
  // For d6, we don't need an overlay since pips show the value
  if (sides !== 6) {
    const resultOverlay = document.createElement('div');
    resultOverlay.className = 'result-overlay';
    resultOverlay.textContent = roll.value;
    wrapper.appendChild(resultOverlay);
  }

  // Start rolling
  wrapper.classList.add('rolling');

  return wrapper;
}

/**
 * Applies result state to die after animation
 * @param {HTMLElement} dieElement
 * @param {Object} roll
 */
function applyResultState(dieElement, roll) {
  dieElement.classList.remove('rolling');
  dieElement.classList.add('landed', 'show-result');

  dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value}`);

  if (roll.dropped) {
    dieElement.classList.add('dropped');
    dieElement.setAttribute('aria-label', `${roll.die} rolled ${roll.value} (dropped)`);
  }

  if (roll.die === 'd20') {
    if (roll.value === 20) {
      dieElement.classList.add('nat20');
      dieElement.setAttribute('aria-label', `Natural 20! Critical Success!`);
    } else if (roll.value === 1) {
      dieElement.classList.add('nat1');
      dieElement.setAttribute('aria-label', `Natural 1! Critical Failure!`);
    }
  }
}

/**
 * Builds breakdown string showing calculation
 * @param {Object} rollResult
 * @returns {string}
 */
function buildBreakdownString(rollResult) {
  const { rolls, modifier, total } = rollResult;

  const keptValues = rolls.filter(r => r.kept).map(r => r.value);
  const droppedValues = rolls.filter(r => r.dropped).map(r => r.value);

  let breakdown = '';

  if (keptValues.length > 0) {
    const sum = keptValues.join('+');
    breakdown = keptValues.length > 1 ? `(${sum})` : sum;
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
 * Updates total display
 * @param {number} total
 */
function updateTotalDisplay(total) {
  const el = document.querySelector('.total-value');
  if (el) el.textContent = total;
}

/**
 * Updates breakdown display
 * @param {Object} rollResult
 */
function updateBreakdownDisplay(rollResult) {
  const el = document.querySelector('.roll-breakdown');
  if (el) el.textContent = buildBreakdownString(rollResult);
}

/**
 * Clears container
 * @param {HTMLElement} container
 */
function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Animates dice roll with 3D tumbling polyhedra
 * @param {Object} rollResult - Complete roll result from roller.js
 * @param {HTMLElement} [container] - Optional container element
 * @returns {Promise<void>}
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

    clearContainer(diceContainer);

    // Show loading state
    const totalEl = document.querySelector('.total-value');
    if (totalEl) totalEl.textContent = '...';

    const breakdownEl = document.querySelector('.roll-breakdown');
    if (breakdownEl) breakdownEl.textContent = 'Rolling...';

    // Create 3D dice
    const dieElements = rolls.map((roll, index) => {
      const dieElement = create3DDie(roll, index);
      diceContainer.appendChild(dieElement);
      return { element: dieElement, roll };
    });

    // Calculate total animation time
    const totalTime = BASE_ANIMATION_DURATION + (rolls.length - 1) * STAGGER_DELAY + 100;

    // Reveal results after animation
    setTimeout(() => {
      dieElements.forEach(({ element, roll }) => {
        applyResultState(element, roll);
      });

      updateTotalDisplay(rollResult.total);
      updateBreakdownDisplay(rollResult);

      resolve();
    }, totalTime);
  });
}

/**
 * Displays roll result instantly without animation
 * @param {Object} rollResult
 * @param {HTMLElement} [container]
 */
export function displayResult(rollResult, container) {
  const diceContainer = container || document.querySelector('.dice-container');

  if (!diceContainer) {
    console.error('Dice container not found');
    return;
  }

  clearContainer(diceContainer);

  rollResult.rolls.forEach((roll, index) => {
    const dieElement = create3DDie(roll, index);
    dieElement.classList.remove('rolling');
    dieElement.classList.add('show-result');
    dieElement.style.animation = 'none';

    if (roll.dropped) dieElement.classList.add('dropped');
    if (roll.die === 'd20' && roll.value === 20) dieElement.classList.add('nat20');
    if (roll.die === 'd20' && roll.value === 1) dieElement.classList.add('nat1');

    diceContainer.appendChild(dieElement);
  });

  updateTotalDisplay(rollResult.total);
  updateBreakdownDisplay(rollResult);
}
