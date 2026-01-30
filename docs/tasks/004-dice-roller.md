---
id: "004"
title: "Implement dice roller with keep/drop logic"
status: pending
depends_on: ["003"]
test_file: "js/roller.test.html"
---

# 004: Implement dice roller with keep/drop logic

## Objective

Create the dice rolling engine that takes a parsed AST and executes the roll, applying all modifiers (keep, drop, exploding, reroll) and returning detailed results with individual die values.

## Acceptance Criteria

- [ ] js/roller.js created as ES6 module
- [ ] `executeRoll(parsed)` function exported
- [ ] Uses crypto.getRandomValues() for fair randomness
- [ ] Rolls correct number of dice with correct sides
- [ ] Applies keep highest (kh) - marks others as not kept
- [ ] Applies keep lowest (kl) - marks others as not kept
- [ ] Applies drop highest (dh) - marks dropped dice
- [ ] Applies drop lowest (dl) - marks dropped dice
- [ ] Applies exploding dice (!) - adds extra rolls on max
- [ ] Applies reroll (r) - rerolls specified values once
- [ ] Calculates subtotal from kept dice
- [ ] Adds/subtracts modifier for final total
- [ ] Returns RollResult object matching data model

## Technical Notes

From TECHNICAL_DESIGN.md:
```javascript
function randomInt(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}
```

Output RollResult structure:
```javascript
{
  id: "uuid",
  timestamp: "ISO-string",
  input: "4d6dl1+2",
  parsed: { /* AST */ },
  rolls: [
    { die: "d6", value: 5, kept: true },
    { die: "d6", value: 3, kept: true },
    { die: "d6", value: 4, kept: true },
    { die: "d6", value: 1, kept: false, dropped: true }
  ],
  subtotal: 12,
  modifier: 2,
  total: 14
}
```

## Test Cases

Create js/roller.test.html with inline tests:
- Basic roll: `1d20` produces value 1-20
- Multiple dice: `3d6` produces 3 rolls, each 1-6
- Keep highest: `2d20kh1` keeps only the higher value
- Drop lowest: `4d6dl1` drops only the lowest value
- Modifier: `1d20+5` adds 5 to total
- Combined: `4d6dl1+2` drops lowest, adds 2

## Verification

Open js/roller.test.html in browser and verify all tests pass.
Run multiple times to verify randomness works.
