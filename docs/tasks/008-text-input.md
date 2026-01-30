---
id: "008"
title: "Implement text input for dice notation"
status: pending
depends_on: ["006"]
test_file: null
no_test_reason: "UI interaction - verified by manual input testing"
---

# 008: Implement text input for dice notation

## Objective

Add the text input form that allows users to type complex dice notation. The form should parse the input, execute the roll, and display animated results.

## Acceptance Criteria

- [ ] Text input form HTML in index.html
- [ ] Input field with helpful placeholder text
- [ ] Roll button to submit
- [ ] Form submit triggers parse → roll → animate flow
- [ ] Enter key submits the form
- [ ] Invalid notation shows error message (non-blocking)
- [ ] Input cleared after successful roll (optional, user preference)
- [ ] Input focused for easy re-typing
- [ ] Disabled during roll animation

## Technical Notes

From TECHNICAL_DESIGN.md:
```html
<form class="roll-input">
  <input type="text"
         id="dice-notation"
         placeholder="e.g., 2d6+3, 4d6dl1, 2d20kh1"
         autocomplete="off">
  <button type="submit">Roll</button>
</form>
```

Input states from WIREFRAMES.md:
- Normal: border: 1px solid #374151
- Focus: border: 2px solid #e94560, glow
- Error: border: 2px solid #f87171

Error handling:
- Parse errors should display briefly near the input
- Use textContent for error display (XSS prevention)
- Clear error on next input change

## Verification

1. Open index.html in browser
2. Type "2d6+3" and press Enter
3. Verify 2 dice roll with +3 modifier
4. Type "4d6dl1" and click Roll button
5. Verify 4 dice roll with lowest dropped
6. Type "invalid" and submit
7. Verify error message appears
8. Verify input is usable after error
