# Technical Design: D&D Dice Roller

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Quick Dice  │  │  Text Input │  │    Presets Panel    │ │
│  │  Buttons    │  │   + Parse   │  │                     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│         └────────────────┼─────────────────────┘            │
│                          ▼                                  │
│               ┌─────────────────────┐                       │
│               │   Dice Engine (JS)  │                       │
│               │  - Parser           │                       │
│               │  - Roller           │                       │
│               │  - Animator         │                       │
│               └──────────┬──────────┘                       │
│                          │                                  │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼                 │
│  ┌────────────┐  ┌─────────────┐  ┌────────────┐           │
│  │ Roll       │  │  Animation  │  │   Audio    │           │
│  │ Display    │  │  Layer      │  │   Manager  │           │
│  └────────────┘  └─────────────┘  └────────────┘           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Roll History Panel                      │   │
│  │         (persisted to Local Storage)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
/
├── index.html          # Single HTML file with structure
├── css/
│   ├── styles.css      # Main styles
│   ├── animations.css  # Dice roll animations
│   └── theme.css       # Colors, variables
├── js/
│   ├── main.js         # Entry point, event binding
│   ├── parser.js       # Dice notation parser
│   ├── roller.js       # Random number generation, roll logic
│   ├── animator.js     # Animation orchestration
│   ├── audio.js        # Sound effect management
│   ├── history.js      # Roll history management
│   ├── presets.js      # Saved presets management
│   └── storage.js      # Local storage wrapper
├── audio/
│   └── dice-roll.mp3   # Dice rolling sound effect
└── README.md           # Usage instructions
```

## Data Models

### Roll Result

```javascript
{
  id: "uuid-string",
  timestamp: "2026-01-30T14:30:00Z",
  input: "4d6dl1+2",           // Original input string
  parsed: {
    dice: [
      { count: 4, sides: 6, keep: 3, drop: "lowest" }
    ],
    modifier: 2
  },
  rolls: [
    { die: "d6", value: 5, kept: true },
    { die: "d6", value: 3, kept: true },
    { die: "d6", value: 4, kept: true },
    { die: "d6", value: 1, kept: false, dropped: true }
  ],
  subtotal: 12,                // Sum of kept dice
  modifier: 2,
  total: 14                    // Final result
}
```

### Preset

```javascript
{
  id: "uuid-string",
  name: "Fireball",
  notation: "8d6",
  createdAt: "2026-01-30T14:00:00Z"
}
```

### Local Storage Schema

```javascript
// Key: "dnd-dice-history"
[RollResult, RollResult, ...]  // Array of last 50 rolls

// Key: "dnd-dice-presets"
[Preset, Preset, ...]          // Array of saved presets

// Key: "dnd-dice-settings"
{
  soundEnabled: true,
  animationEnabled: true,
  historyLimit: 50
}
```

## Dice Notation Parser

### Grammar (EBNF)

```ebnf
expression  = term (('+' | '-') term)*
term        = dice | number
dice        = count? 'd' sides modifier*
count       = number
sides       = number | '%'           (* % = 100 *)
modifier    = keep | drop | explode | reroll
keep        = ('kh' | 'kl') number?  (* keep highest/lowest, default 1 *)
drop        = ('dh' | 'dl') number?  (* drop highest/lowest, default 1 *)
explode     = '!'                    (* exploding dice *)
reroll      = 'r' number             (* reroll specific value *)
number      = digit+
```

### Parser Implementation

```javascript
// parser.js - Recursive descent parser
export function parse(input) {
  const tokens = tokenize(input);
  return parseExpression(tokens);
}

function tokenize(input) {
  // Returns array of tokens: { type, value }
  // Types: NUMBER, D, PLUS, MINUS, KH, KL, DH, DL, BANG, R
}

function parseExpression(tokens) {
  // Returns AST node representing the full expression
}
```

## Roll Execution

```javascript
// roller.js
export function executeRoll(parsed) {
  const results = [];

  for (const diceGroup of parsed.dice) {
    const groupRolls = [];

    // Roll all dice
    for (let i = 0; i < diceGroup.count; i++) {
      let value = randomInt(1, diceGroup.sides);
      groupRolls.push({ die: `d${diceGroup.sides}`, value, kept: true });

      // Handle exploding dice
      if (diceGroup.exploding && value === diceGroup.sides) {
        // Continue rolling...
      }
    }

    // Apply keep/drop modifiers
    if (diceGroup.keep) {
      applyKeep(groupRolls, diceGroup.keep);
    }
    if (diceGroup.drop) {
      applyDrop(groupRolls, diceGroup.drop);
    }

    results.push(...groupRolls);
  }

  return results;
}

function randomInt(min, max) {
  // Crypto-strength randomness for fairness
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}
```

## Animation System

### CSS Keyframes

```css
/* animations.css */
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

.die-rolling {
  animation: dice-tumble 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.die-result {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.die-result.highlight {
  transform: scale(1.1);
  box-shadow: 0 0 20px var(--accent-color);
}
```

### Animation Orchestration

```javascript
// animator.js
export async function animateRoll(rolls, container) {
  // Clear previous
  container.innerHTML = '';

  // Create die elements
  const dieElements = rolls.map(roll => createDieElement(roll));

  // Stagger animations
  for (let i = 0; i < dieElements.length; i++) {
    const el = dieElements[i];
    el.style.animationDelay = `${i * 100}ms`;
    container.appendChild(el);
  }

  // Wait for animations to complete
  await delay(1500 + (rolls.length * 100));

  // Reveal results
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

## Audio System

```javascript
// audio.js
class AudioManager {
  constructor() {
    this.context = null;
    this.buffer = null;
    this.enabled = true;
  }

  async init() {
    // Initialize on first user interaction
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

export const audio = new AudioManager();
```

## UI Components

### Quick Dice Buttons

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

### Text Input

```html
<form class="roll-input">
  <input type="text"
         id="dice-notation"
         placeholder="e.g., 2d6+3, 4d6dl1, 2d20kh1"
         autocomplete="off">
  <button type="submit">Roll</button>
</form>
```

### Roll Display Area

```html
<div class="roll-display">
  <div class="dice-container">
    <!-- Animated dice appear here -->
  </div>
  <div class="roll-total">
    <span class="total-value">--</span>
  </div>
  <div class="roll-breakdown">
    <!-- Individual die results and modifiers -->
  </div>
</div>
```

## Security Considerations

1. **XSS Prevention**: All user input (notation, preset names) is sanitized before DOM insertion using `textContent` instead of `innerHTML`

2. **No External Requests**: Fully static, no API calls, no analytics, no tracking

3. **Fair Randomness**: Uses `crypto.getRandomValues()` for unbiased dice rolls

4. **Local Storage Only**: All data stays in the browser, never transmitted

## Testing Strategy

### Unit Tests (if desired)
- Parser: Test each notation variant
- Roller: Test keep/drop/explode logic
- Storage: Test persistence

### Manual Testing Checklist
- [ ] All dice buttons produce valid rolls
- [ ] Complex notation parses correctly
- [ ] Animations complete without glitches
- [ ] History persists after page refresh
- [ ] Presets save and load correctly
- [ ] Sound plays and can be muted
- [ ] Mobile layout works on phone
- [ ] Works offline after initial load

## Performance Considerations

- **Bundle Size**: Target < 50KB total (excluding audio)
- **First Paint**: < 500ms
- **Animation**: Maintain 60fps during dice tumble
- **Storage**: Limit history to 50 entries to prevent storage bloat
