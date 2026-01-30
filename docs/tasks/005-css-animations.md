---
id: "005"
title: "Create CSS animations for dice rolling"
status: pending
depends_on: ["001"]
test_file: null
no_test_reason: "CSS animations - verified by visual inspection"
---

# 005: Create CSS animations for dice rolling

## Objective

Create the CSS keyframe animations that make dice tumble satisfyingly before revealing results. This includes the main tumble animation, result reveal transitions, and special states for dropped dice and critical rolls.

## Acceptance Criteria

- [ ] css/animations.css created
- [ ] `@keyframes dice-tumble` - 1.5s tumbling animation
- [ ] `.die-rolling` class triggers tumble animation
- [ ] `.die-result` class for revealed dice with transition
- [ ] `.die-result.dropped` class for dropped dice (grayed, struck)
- [ ] `.die-result.highlight` class for kept dice (scaled, glowing)
- [ ] `.die-result.nat20` class for natural 20 (green glow)
- [ ] `.die-result.nat1` class for natural 1 (red glow)
- [ ] Staggered animation delay support via CSS variable
- [ ] Smooth 60fps animations (transform/opacity only)
- [ ] animations.css linked in index.html

## Technical Notes

From TECHNICAL_DESIGN.md:
```css
@keyframes dice-tumble {
  0% {
    transform: translateY(-20px) rotateX(0deg) rotateY(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotateX(720deg) rotateY(540deg);
    opacity: 1;
  }
}
```

From WIREFRAMES.md color states:
- Normal: bg: #16213e, border: 2px solid #0f3460
- Kept: border: 2px solid #e94560
- Dropped: bg: #1f2937, text: #6b7280, text-decoration: line-through
- Nat 20: border: 2px solid #4ade80, glow green
- Nat 1: border: 2px solid #f87171, glow red

Animation timing from WIREFRAMES.md:
- Dice Tumble: 1.5s ease-out
- Result Reveal: 0.3s ease-out

## Verification

1. Add test dice elements to index.html
2. Apply animation classes manually via DevTools
3. Verify animations are smooth and timing feels satisfying
4. Verify dropped dice appear grayed/struck
5. Verify nat20/nat1 have appropriate glow effects
