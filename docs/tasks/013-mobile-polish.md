---
id: "013"
title: "Add mobile responsiveness and final polish"
status: pending
depends_on: ["012"]
test_file: null
no_test_reason: "CSS/visual polish - verified by visual inspection on mobile"
---

# 013: Add mobile responsiveness and final polish

## Objective

Add responsive CSS for mobile devices, polish visual details, and ensure the app works well on phone screens. This is the final task before the app is complete.

## Acceptance Criteria

- [ ] Mobile breakpoint at 768px
- [ ] Dice buttons reorganize for mobile (2x3 + d100)
- [ ] Presets and History panels collapse on mobile
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Text input fills available width on mobile
- [ ] Roll display scales appropriately
- [ ] No horizontal scroll on mobile
- [ ] Collapsible panel headers for Presets/History
- [ ] Smooth panel open/close animation
- [ ] Focus states visible for accessibility
- [ ] App works offline after initial load
- [ ] README.md with usage instructions

## Technical Notes

From WIREFRAMES.md mobile layout:
```
┌───────────────────────────┐
│ ⚔️ D&D Dice       [🔊][⚙️]│
├───────────────────────────┤
│      [Roll Display]       │
├───────────────────────────┤
│ [________________] [Roll] │
├───────────────────────────┤
│ ┌────┐┌────┐┌────┐┌────┐ │
│ │ d4 ││ d6 ││ d8 ││d10 │ │
│ └────┘└────┘└────┘└────┘ │
│ ┌────┐┌────┐┌──────────┐ │
│ │d12 ││d20 ││   d100   │ │
│ └────┘└────┘└──────────┘ │
├───────────────────────────┤
│ [Presets ▼]  [History ▼] │
└───────────────────────────┘
```

CSS media query:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

Panel collapse pattern:
```html
<details class="panel">
  <summary>Presets</summary>
  <div class="panel-content">...</div>
</details>
```

## Verification

1. Open Chrome DevTools
2. Toggle device toolbar (mobile view)
3. Test iPhone SE, iPhone 12, Pixel 5 sizes
4. Verify layout works on each
5. Verify tap targets are large enough
6. Verify panels collapse/expand
7. Test on actual phone if available
8. Verify offline: load page, go offline, refresh
