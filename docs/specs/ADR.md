# Architecture Decision Record: D&D Dice Roller

## ADR-001: Use Vanilla HTML/CSS/JS (No Framework)

### Status
Accepted

### Context
We need to build a static dice roller website. Options include:
- Vanilla HTML/CSS/JS
- React/Vue/Svelte with a build step
- Web Components

The project requirements emphasize:
- Static hosting (Netlify/Vercel)
- No build step complexity
- Personal use (not a team project)
- Modern UI with animations

### Options Considered

**Option A: Vanilla HTML/CSS/JS**
- Pros: No build step, instant reload during development, works anywhere, smallest bundle size, no framework lock-in
- Cons: More manual DOM manipulation, no component model out of the box

**Option B: React/Vite**
- Pros: Component model, JSX, large ecosystem
- Cons: Requires build step, larger bundle, overkill for single-page app

**Option C: Svelte**
- Pros: Compiles to vanilla JS, small bundle, nice DX
- Cons: Still requires build step, another tool to learn/maintain

### Decision
**Option A: Vanilla HTML/CSS/JS**

For a personal project with a single page and clear scope, vanilla JS provides:
- Zero configuration or build tools
- Can open HTML file directly in browser during development
- Deploy by copying files—no CI/CD complexity
- Modern JS (ES6+) and CSS (custom properties, animations, grid) handle all requirements natively

### Consequences
- **Positive**: Simpler development, faster iteration, easier debugging, smaller deployment
- **Negative**: Must manually structure code (will use ES6 modules for organization)

---

## ADR-002: Local Storage for Persistence

### Status
Accepted

### Context
Roll history and saved presets need to persist across browser sessions. Options:
- Local Storage
- IndexedDB
- No persistence (session only)

### Options Considered

**Option A: Local Storage**
- Pros: Simple API, synchronous, sufficient for small data, universal browser support
- Cons: 5MB limit, blocks main thread (negligible for small data)

**Option B: IndexedDB**
- Pros: Larger storage, async, structured data
- Cons: Complex API, overkill for simple key-value data

### Decision
**Option A: Local Storage**

Our data is simple (JSON arrays of rolls and presets) and small (unlikely to exceed a few KB even with extensive use). Local Storage's simple API (`getItem`/`setItem`) is perfect for this use case.

### Consequences
- **Positive**: Simple implementation, no async complexity
- **Negative**: Must serialize/deserialize JSON manually (trivial)

---

## ADR-003: CSS Animations for Dice Rolling

### Status
Accepted

### Context
Dice rolling should feel satisfying with 1-2 second animations. Options:
- CSS animations/transitions
- JavaScript canvas/WebGL
- GIF/video sprites
- CSS + minimal JS orchestration

### Options Considered

**Option A: Pure CSS Animations**
- Pros: GPU-accelerated, declarative, no library needed
- Cons: Limited randomness in animation

**Option B: Canvas/WebGL 3D Dice**
- Pros: Realistic 3D physics, highly dynamic
- Cons: Complex implementation, larger code, accessibility concerns

**Option C: CSS + JS Orchestration**
- Pros: CSS handles animation performance, JS controls timing and randomness
- Cons: Slightly more code than pure CSS

### Decision
**Option C: CSS + JS Orchestration**

CSS keyframe animations handle the visual tumbling (transforms, rotations) while JS:
- Triggers animations with random parameters
- Controls timing for reveal
- Coordinates multiple dice animations

This provides satisfying visual feedback without the complexity of 3D rendering.

### Consequences
- **Positive**: Smooth 60fps animations, accessible, works on all devices
- **Negative**: Animation is stylized rather than physically realistic (acceptable for this use case)

---

## ADR-004: Custom Dice Notation Parser

### Status
Accepted

### Context
Need to parse dice notation like `4d6dl1+5`. Options:
- Use existing library (dice-roller-parser, etc.)
- Write custom parser

### Options Considered

**Option A: Existing Library**
- Pros: Battle-tested, handles edge cases
- Cons: Adds dependency, may include features we don't need, bundle size

**Option B: Custom Parser**
- Pros: Tailored to our needs, no dependencies, learning opportunity
- Cons: Must handle edge cases ourselves

### Decision
**Option B: Custom Parser**

The dice notation grammar is well-defined and relatively simple. A custom recursive descent parser:
- Keeps the project dependency-free
- Parses exactly the notation we need
- Integrates cleanly with our roll display logic

### Consequences
- **Positive**: No dependencies, full control, smaller bundle
- **Negative**: Must write comprehensive tests for parser edge cases

---

## ADR-005: Web Audio API for Sound Effects

### Status
Accepted

### Context
Rolling dice should play satisfying sound effects. Options:
- HTML5 Audio elements
- Web Audio API
- No sound / optional sound

### Decision
**Web Audio API with HTML5 Audio fallback**

Web Audio API provides:
- Low latency playback
- Ability to layer/mix multiple sounds
- Volume control

Sound will be optional (mutable) to respect user preference and avoid annoying behavior.

### Consequences
- **Positive**: Rich audio experience, user control
- **Negative**: Must handle audio context initialization on user interaction (browser policy)
