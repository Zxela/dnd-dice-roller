---
id: "006"
title: "Implement animator and roll display"
status: pending
depends_on: ["004", "005"]
test_file: null
no_test_reason: "UI animation - verified by visual testing"
---

# 006: Implement animator and roll display

## Objective

Create the animator module that orchestrates dice animations and updates the roll display area. This connects the roller output to the visual UI, showing animated dice that reveal results.

## Acceptance Criteria

- [ ] js/animator.js created as ES6 module
- [ ] `animateRoll(rollResult, container)` function exported
- [ ] Creates die elements for each roll in the result
- [ ] Applies staggered animation delays (100ms between dice)
- [ ] Shows "?" or spinning state during animation
- [ ] Reveals actual values after animation completes
- [ ] Applies .dropped class to dropped dice
- [ ] Applies .nat20/.nat1 classes to d20 results of 20/1
- [ ] Updates total display with final result
- [ ] Updates breakdown display showing calculation
- [ ] Returns promise that resolves when animation completes
- [ ] `displayResult(rollResult)` for instant display (no animation)

## Technical Notes

From TECHNICAL_DESIGN.md:
```javascript
export async function animateRoll(rolls, container) {
  container.innerHTML = '';

  const dieElements = rolls.map(roll => createDieElement(roll));

  for (let i = 0; i < dieElements.length; i++) {
    const el = dieElements[i];
    el.style.animationDelay = `${i * 100}ms`;
    container.appendChild(el);
  }

  await delay(1500 + (rolls.length * 100));

  dieElements.forEach((el, i) => {
    el.classList.remove('die-rolling');
    el.classList.add('die-result');
    el.textContent = rolls[i].value;

    if (!rolls[i].kept) {
      el.classList.add('dropped');
    }
  });
}
```

DOM elements to update:
- `.dice-container` - Individual dice elements
- `.total-value` - Final total number
- `.roll-breakdown` - Calculation string like "(5+3+4) + 2 = 14"

## Verification

1. Import animator in browser console
2. Create mock rollResult object
3. Call animateRoll with dice-container element
4. Verify dice animate in sequence
5. Verify results reveal correctly
6. Verify total and breakdown update
