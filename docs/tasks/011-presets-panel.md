---
id: "011"
title: "Implement saved presets panel"
status: pending
depends_on: ["002", "006"]
test_file: null
no_test_reason: "UI feature - verified by manual testing with refresh"
---

# 011: Implement saved presets panel

## Objective

Create the presets panel that allows users to save, use, and delete frequently-used dice rolls. Presets persist to local storage.

## Acceptance Criteria

- [ ] js/presets.js created as ES6 module
- [ ] Presets panel HTML in index.html
- [ ] `addPreset(name, notation)` saves new preset
- [ ] `getPresets()` returns array of presets
- [ ] `deletePreset(id)` removes a preset
- [ ] "Add Preset" button opens modal/form
- [ ] Modal has name and notation input fields
- [ ] Save validates notation before saving
- [ ] Each preset shows name and notation
- [ ] Click preset executes the roll
- [ ] Delete button (×) on each preset
- [ ] Delete confirms before removing
- [ ] Presets persist via storage.js
- [ ] Loads presets on page load

## Technical Notes

From TECHNICAL_DESIGN.md data model:
```javascript
{
  id: "uuid-string",
  name: "Fireball",
  notation: "8d6",
  createdAt: "2026-01-30T14:00:00Z"
}
```

From WIREFRAMES.md:
```
┌─────────────────────────────────────┐
│  PRESETS                      [+]   │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ Fireball              8d6   │ ✕  │
│  └─────────────────────────────┘    │
```

Add Preset Modal:
```
┌─────────────────────────────────────────────┐
│  Add New Preset                         [×] │
├─────────────────────────────────────────────┤
│  Name: [_______________]                    │
│  Dice Notation: [_______________]           │
│           [Cancel]        [Save]            │
└─────────────────────────────────────────────┘
```

Storage key: `dnd-dice-presets`

## Verification

1. Open index.html in browser
2. Click "Add Preset" button
3. Enter name "Fireball" and notation "8d6"
4. Click Save - verify preset appears
5. Click the preset - verify 8d6 rolls
6. Refresh page - verify preset persists
7. Click × on preset
8. Confirm deletion
9. Verify preset removed
