/**
 * Dice Roller Engine
 * Executes parsed dice notation AST and returns detailed results.
 */

/**
 * Generates a cryptographically secure random integer between min and max (inclusive).
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer
 */
function randomInt(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

/**
 * Generates a UUID v4 for roll identification.
 * @returns {string} UUID string
 */
function generateId() {
  return crypto.randomUUID();
}

/**
 * Rolls a single die with the specified number of sides.
 * @param {number} sides - Number of sides on the die
 * @returns {number} Roll result (1 to sides)
 */
function rollDie(sides) {
  return randomInt(1, sides);
}

/**
 * Rolls dice for a single dice group from the AST.
 * Handles exploding and reroll modifiers during the rolling phase.
 * @param {Object} diceGroup - Dice group from the AST
 * @returns {Array<Object>} Array of roll results
 */
function rollDiceGroup(diceGroup) {
  const { count, sides, exploding, reroll } = diceGroup;
  const rolls = [];
  const maxExplosions = 100; // Safety limit to prevent infinite loops
  let explosionCount = 0;

  // Roll initial dice
  for (let i = 0; i < count; i++) {
    let value = rollDie(sides);
    let rerolled = false;
    let originalValue = null;

    // Handle reroll - rerolls specified value once
    if (reroll !== null && value === reroll) {
      originalValue = value;
      value = rollDie(sides);
      rerolled = true;
    }

    const roll = {
      die: `d${sides}`,
      value,
      kept: true
    };

    if (rerolled) {
      roll.rerolled = true;
      roll.originalValue = originalValue;
    }

    rolls.push(roll);

    // Handle exploding dice - add extra rolls when max value is rolled
    if (exploding && value === sides && explosionCount < maxExplosions) {
      let explosionValue = value;
      while (explosionValue === sides && explosionCount < maxExplosions) {
        explosionValue = rollDie(sides);
        explosionCount++;

        const explosionRoll = {
          die: `d${sides}`,
          value: explosionValue,
          kept: true,
          exploded: true
        };

        rolls.push(explosionRoll);

        if (explosionValue !== sides) {
          break;
        }
      }
    }
  }

  return rolls;
}

/**
 * Applies keep modifier to rolls.
 * Marks dice that should not be kept based on keep highest/lowest.
 * @param {Array<Object>} rolls - Array of roll results
 * @param {Object} keep - Keep modifier object { type: 'highest'|'lowest', count: number }
 */
function applyKeep(rolls, keep) {
  if (!keep) return;

  const { type, count } = keep;

  // Get indices of kept rolls sorted by value
  const keptIndices = rolls
    .map((roll, index) => ({ value: roll.value, index }))
    .filter((_, idx) => rolls[idx].kept)
    .sort((a, b) => type === 'highest' ? b.value - a.value : a.value - b.value);

  // Mark all as not kept first
  rolls.forEach(roll => {
    if (roll.kept) {
      roll.kept = false;
    }
  });

  // Keep only the specified count
  const toKeep = keptIndices.slice(0, count);
  toKeep.forEach(({ index }) => {
    rolls[index].kept = true;
  });
}

/**
 * Applies drop modifier to rolls.
 * Marks dice that should be dropped based on drop highest/lowest.
 * @param {Array<Object>} rolls - Array of roll results
 * @param {Object} drop - Drop modifier object { type: 'highest'|'lowest', count: number }
 */
function applyDrop(rolls, drop) {
  if (!drop) return;

  const { type, count } = drop;

  // Get indices of kept rolls sorted by value
  const keptIndices = rolls
    .map((roll, index) => ({ value: roll.value, index }))
    .filter((_, idx) => rolls[idx].kept)
    .sort((a, b) => type === 'highest' ? b.value - a.value : a.value - b.value);

  // Drop the first 'count' based on type (highest first or lowest first)
  const toDrop = keptIndices.slice(0, count);
  toDrop.forEach(({ index }) => {
    rolls[index].kept = false;
    rolls[index].dropped = true;
  });
}

/**
 * Calculates the subtotal from kept dice.
 * @param {Array<Object>} rolls - Array of roll results
 * @returns {number} Sum of kept dice values
 */
function calculateSubtotal(rolls) {
  return rolls
    .filter(roll => roll.kept)
    .reduce((sum, roll) => sum + roll.value, 0);
}

/**
 * Executes a parsed dice roll and returns detailed results.
 * @param {Object} parsed - Parsed AST from the parser
 * @param {string} [input=''] - Original input string for reference
 * @returns {Object} RollResult object with all roll details
 */
export function executeRoll(parsed, input = '') {
  const allRolls = [];

  // Process each dice group
  for (const diceGroup of parsed.dice) {
    // Roll the dice
    const rolls = rollDiceGroup(diceGroup);

    // Apply drop modifier first (if both drop and keep are present)
    if (diceGroup.drop) {
      applyDrop(rolls, diceGroup.drop);
    }

    // Apply keep modifier
    if (diceGroup.keep) {
      applyKeep(rolls, diceGroup.keep);
    }

    allRolls.push(...rolls);
  }

  // Calculate subtotal from kept dice
  const subtotal = calculateSubtotal(allRolls);

  // Calculate final total with modifier
  const total = subtotal + parsed.modifier;

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    input,
    parsed,
    rolls: allRolls,
    subtotal,
    modifier: parsed.modifier,
    total
  };
}
