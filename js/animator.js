/**
 * Animator Module - 3D Polyhedra Dice
 * Creates proper geometric dice shapes with numbered faces that tumble and land on result.
 * d4=tetrahedron, d6=cube, d8=octahedron, d10=trapezohedron, d12=dodecahedron, d20=icosahedron
 */

const BASE_ANIMATION_DURATION = 1800;
const STAGGER_DELAY = 200;

/**
 * Face rotation mappings - maps each face value to the rotation needed to show it
 * These are calculated based on the CSS face positions
 */
const FACE_ROTATIONS = {
  d4: {
    1: { rx: -19.47, ry: 0, rz: 0 },
    2: { rx: -19.47, ry: -120, rz: 0 },
    3: { rx: -19.47, ry: -240, rz: 0 },
    4: { rx: -90, ry: 0, rz: 0 }
  },
  d6: {
    1: { rx: 0, ry: 0, rz: 0 },
    2: { rx: 90, ry: 0, rz: 0 },
    3: { rx: 0, ry: 90, rz: 0 },
    4: { rx: 0, ry: -90, rz: 0 },
    5: { rx: -90, ry: 0, rz: 0 },
    6: { rx: 0, ry: 180, rz: 0 }
  },
  d8: {
    1: { rx: -35.26, ry: 0, rz: 0 },
    2: { rx: -35.26, ry: -90, rz: 0 },
    3: { rx: -35.26, ry: -180, rz: 0 },
    4: { rx: -35.26, ry: -270, rz: 0 },
    5: { rx: -144.74, ry: -45, rz: 0 },
    6: { rx: -144.74, ry: -135, rz: 0 },
    7: { rx: -144.74, ry: -225, rz: 0 },
    8: { rx: -144.74, ry: -315, rz: 0 }
  },
  d10: {
    0: { rx: -40, ry: 0, rz: 0 },
    1: { rx: -40, ry: -72, rz: 0 },
    2: { rx: -40, ry: -144, rz: 0 },
    3: { rx: -40, ry: -216, rz: 0 },
    4: { rx: -40, ry: -288, rz: 0 },
    5: { rx: -140, ry: -36, rz: 0 },
    6: { rx: -140, ry: -108, rz: 0 },
    7: { rx: -140, ry: -180, rz: 0 },
    8: { rx: -140, ry: -252, rz: 0 },
    9: { rx: -140, ry: -324, rz: 0 }
  },
  d12: {
    1: { rx: -90, ry: 0, rz: 0 },
    2: { rx: -26.57, ry: 0, rz: 0 },
    3: { rx: -26.57, ry: -72, rz: 0 },
    4: { rx: -26.57, ry: -144, rz: 0 },
    5: { rx: -26.57, ry: -216, rz: 0 },
    6: { rx: -26.57, ry: -288, rz: 0 },
    7: { rx: -153.43, ry: -36, rz: 0 },
    8: { rx: -153.43, ry: -108, rz: 0 },
    9: { rx: -153.43, ry: -180, rz: 0 },
    10: { rx: -153.43, ry: -252, rz: 0 },
    11: { rx: -153.43, ry: -324, rz: 0 },
    12: { rx: 90, ry: 0, rz: 0 }
  },
  d20: {
    1: { rx: -20.9, ry: 0, rz: 0 },
    2: { rx: -20.9, ry: -72, rz: 0 },
    3: { rx: -20.9, ry: -144, rz: 0 },
    4: { rx: -20.9, ry: -216, rz: 0 },
    5: { rx: -20.9, ry: -288, rz: 0 },
    6: { rx: -58.28, ry: -36, rz: 0 },
    7: { rx: -58.28, ry: -108, rz: 0 },
    8: { rx: -58.28, ry: -180, rz: 0 },
    9: { rx: -58.28, ry: -252, rz: 0 },
    10: { rx: -58.28, ry: -324, rz: 0 },
    11: { rx: -121.72, ry: 0, rz: 0 },
    12: { rx: -121.72, ry: -72, rz: 0 },
    13: { rx: -121.72, ry: -144, rz: 0 },
    14: { rx: -121.72, ry: -216, rz: 0 },
    15: { rx: -121.72, ry: -288, rz: 0 },
    16: { rx: -159.1, ry: -36, rz: 0 },
    17: { rx: -159.1, ry: -108, rz: 0 },
    18: { rx: -159.1, ry: -180, rz: 0 },
    19: { rx: -159.1, ry: -252, rz: 0 },
    20: { rx: -159.1, ry: -324, rz: 0 }
  },
  d100: {
    0: { rx: -40, ry: 0, rz: 0 },
    10: { rx: -40, ry: -72, rz: 0 },
    20: { rx: -40, ry: -144, rz: 0 },
    30: { rx: -40, ry: -216, rz: 0 },
    40: { rx: -40, ry: -288, rz: 0 },
    50: { rx: -140, ry: -36, rz: 0 },
    60: { rx: -140, ry: -108, rz: 0 },
    70: { rx: -140, ry: -180, rz: 0 },
    80: { rx: -140, ry: -252, rz: 0 },
    90: { rx: -140, ry: -324, rz: 0 }
  }
};

/**
 * Creates a D4 tetrahedron with numbered faces
 * @returns {HTMLElement}
 */
function createD4Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  for (let i = 1; i <= 4; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    face.dataset.value = i;
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

  const pipCounts = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

  for (let faceNum = 1; faceNum <= 6; faceNum++) {
    const face = document.createElement('div');
    face.className = `face face-${faceNum}`;

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
 * Creates a D8 octahedron with numbered faces
 * @returns {HTMLElement}
 */
function createD8Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  for (let i = 1; i <= 8; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    face.dataset.value = i;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D10 with numbered faces (0-9)
 * @returns {HTMLElement}
 */
function createD10Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  for (let i = 0; i <= 9; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    face.dataset.value = i;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D12 dodecahedron with numbered faces
 * @returns {HTMLElement}
 */
function createD12Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  for (let i = 1; i <= 12; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    face.textContent = i;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D20 icosahedron with numbered faces
 * @returns {HTMLElement}
 */
function createD20Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  for (let i = 1; i <= 20; i++) {
    const face = document.createElement('div');
    face.className = `face face-${i}`;
    face.dataset.value = i;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Creates a D100 (percentile) with faces showing 00-90
 * @returns {HTMLElement}
 */
function createD100Shape() {
  const shape = document.createElement('div');
  shape.className = 'die-shape';

  const values = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'];

  for (const val of values) {
    const face = document.createElement('div');
    face.className = `face face-${val}`;
    face.dataset.value = val;
    shape.appendChild(face);
  }

  return shape;
}

/**
 * Gets the rotation to show a specific face value
 * @param {string} dieType - 'd4', 'd6', etc.
 * @param {number} value - The face value to show
 * @returns {Object} {rx, ry, rz} in degrees
 */
function getRotationForValue(dieType, value) {
  const rotations = FACE_ROTATIONS[dieType];

  if (!rotations) {
    // Fallback for unknown dice
    return { rx: 0, ry: 0, rz: 0 };
  }

  // Handle d10 showing 1-10 but faces are 0-9
  let lookupValue = value;
  if (dieType === 'd10') {
    lookupValue = value === 10 ? 0 : value;
  }

  // Handle d100 - value comes in as 1-100, need to map to tens
  if (dieType === 'd100') {
    // Get the tens digit (00, 10, 20, ... 90)
    lookupValue = Math.floor((value - 1) / 10) * 10;
    if (value === 100) lookupValue = 0;
  }

  const rotation = rotations[lookupValue];

  if (!rotation) {
    // Random fallback
    return {
      rx: Math.floor(Math.random() * 4) * 90,
      ry: Math.floor(Math.random() * 4) * 90,
      rz: 0
    };
  }

  // Add some full rotations for dramatic effect
  return {
    rx: rotation.rx + 720,
    ry: rotation.ry,
    rz: rotation.rz
  };
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

  // Get the rotation to show the result value
  const endRot = getRotationForValue(roll.die, roll.value);
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
  dieElement.classList.add('landed');

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
    dieElement.classList.add('landed');
    dieElement.style.animation = 'none';

    // Apply the final rotation immediately
    dieElement.style.transform = `rotateX(var(--end-rx)) rotateY(var(--end-ry)) rotateZ(var(--end-rz))`;

    if (roll.dropped) dieElement.classList.add('dropped');
    if (roll.die === 'd20' && roll.value === 20) dieElement.classList.add('nat20');
    if (roll.die === 'd20' && roll.value === 1) dieElement.classList.add('nat1');

    diceContainer.appendChild(dieElement);
  });

  updateTotalDisplay(rollResult.total);
  updateBreakdownDisplay(rollResult);
}
