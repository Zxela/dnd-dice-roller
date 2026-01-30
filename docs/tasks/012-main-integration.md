---
id: "012"
title: "Create main.js to wire all components together"
status: pending
depends_on: ["007", "008", "009", "010", "011"]
test_file: null
no_test_reason: "integration wiring - verified by full app testing"
---

# 012: Create main.js to wire all components together

## Objective

Create the main entry point that imports all modules, initializes components, and wires up event handlers. This is the glue that makes the complete application work.

## Acceptance Criteria

- [ ] js/main.js created as ES6 module
- [ ] Imports all component modules
- [ ] Initializes audio manager on first interaction
- [ ] Loads history from storage on page load
- [ ] Loads presets from storage on page load
- [ ] Loads settings from storage on page load
- [ ] Wires quick dice button clicks
- [ ] Wires text input form submission
- [ ] Wires preset clicks
- [ ] Wires sound toggle button
- [ ] Wires clear history button
- [ ] Wires add/delete preset actions
- [ ] Central `roll(notation)` function coordinates flow
- [ ] Handles errors gracefully with user feedback
- [ ] index.html loads main.js as module

## Technical Notes

Central roll flow:
```javascript
async function roll(notation) {
  try {
    // 1. Parse notation
    const parsed = parse(notation);

    // 2. Execute roll
    const result = executeRoll(parsed);
    result.input = notation;

    // 3. Play sound
    audio.play();

    // 4. Animate and display
    await animateRoll(result, diceContainer);

    // 5. Add to history
    addToHistory(result);

  } catch (error) {
    showError(error.message);
  }
}
```

Module loading in index.html:
```html
<script type="module" src="js/main.js"></script>
```

## Verification

Complete end-to-end testing:
1. Open index.html in browser
2. Click d20 button - verify full flow works
3. Type "4d6dl1" - verify roll works
4. Verify sound plays
5. Verify history updates
6. Add a preset - verify it works
7. Use the preset - verify it rolls
8. Toggle sound - verify mute works
9. Refresh - verify all state persists
10. Check browser console for errors
