---
id: "007"
title: "Implement quick dice buttons"
status: pending
depends_on: ["006"]
test_file: null
no_test_reason: "UI interaction - verified by manual click testing"
---

# 007: Implement quick dice buttons

## Objective

Add the quick dice buttons (d4, d6, d8, d10, d12, d20, d100) to the UI and wire them to trigger rolls. Clicking a button should immediately roll that die with animation.

## Acceptance Criteria

- [ ] Quick dice button HTML added to index.html
- [ ] Buttons for: d4, d6, d8, d10, d12, d20, d100
- [ ] Each button has data-roll attribute (e.g., "1d20")
- [ ] CSS styling matches WIREFRAMES.md (hover lift, active press)
- [ ] Click handler triggers parse → roll → animate flow
- [ ] d100 button spans full width (different layout)
- [ ] Buttons disabled during roll animation
- [ ] Re-enabled after animation completes

## Technical Notes

From TECHNICAL_DESIGN.md:
```html
<div class="quick-dice">
  <button class="die-btn" data-roll="1d4">d4</button>
  <button class="die-btn" data-roll="1d6">d6</button>
  <button class="die-btn" data-roll="1d8">d8</button>
  <button class="die-btn" data-roll="1d10">d10</button>
  <button class="die-btn" data-roll="1d12">d12</button>
  <button class="die-btn" data-roll="1d20">d20</button>
  <button class="die-btn" data-roll="1d100">d100</button>
</div>
```

Button states from WIREFRAMES.md:
- Normal: bg: #0f3460, text: white
- Hover: bg: #e94560, transform: translateY(-2px), shadow
- Active: bg: #c13a50, transform: translateY(0)
- Disabled: bg: #374151, text: #6b7280

## Verification

1. Open index.html in browser
2. Click each die button
3. Verify correct die is rolled (d20 shows 1-20, etc.)
4. Verify animation plays
5. Verify buttons can't be clicked during animation
6. Verify hover/active states work
