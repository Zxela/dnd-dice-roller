---
id: "009"
title: "Implement audio manager for dice sounds"
status: pending
depends_on: ["006"]
test_file: null
no_test_reason: "audio playback - verified by listening"
---

# 009: Implement audio manager for dice sounds

## Objective

Create the audio manager that plays dice rolling sounds when rolls occur. Uses Web Audio API for low-latency playback with fallback to HTML5 Audio. Includes mute toggle.

## Acceptance Criteria

- [ ] js/audio.js created as ES6 module
- [ ] AudioManager class with init(), play(), toggle() methods
- [ ] Initializes Web Audio context on first user interaction
- [ ] Loads dice-roll.mp3 sound file
- [ ] play() triggers sound with low latency
- [ ] toggle() enables/disables sound
- [ ] Mute state persisted to storage
- [ ] Sound toggle button in header updates icon
- [ ] Handles browsers that block autoplay gracefully
- [ ] audio/dice-roll.mp3 file added (or generated)

## Technical Notes

From TECHNICAL_DESIGN.md:
```javascript
class AudioManager {
  constructor() {
    this.context = null;
    this.buffer = null;
    this.enabled = true;
  }

  async init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('audio/dice-roll.mp3');
    const arrayBuffer = await response.arrayBuffer();
    this.buffer = await this.context.decodeAudioData(arrayBuffer);
  }

  play() {
    if (!this.enabled || !this.buffer) return;
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.start();
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
```

For the audio file:
- Can use a royalty-free dice sound
- Or generate a simple sound programmatically
- Keep file small (< 50KB)

## Verification

1. Open index.html in browser
2. Click any die button to trigger roll
3. Verify dice rolling sound plays
4. Click sound toggle button
5. Roll again - verify sound is muted
6. Toggle back on - verify sound plays
7. Refresh page - verify mute state persisted
