# D&D Dice Roller

A modern, responsive web-based dice roller for Dungeons & Dragons and other tabletop RPGs. Roll dice using standard notation, save your favorite rolls as presets, and track your roll history.

## Features

- **Standard Dice Notation**: Support for all standard RPG dice (d4, d6, d8, d10, d12, d20, d100)
- **Quick Dice Buttons**: One-click rolling for common dice types
- **Text Input**: Enter any valid dice notation for custom rolls
- **Roll Modifiers**: Support for modifiers like keep highest, drop lowest, exploding dice, and rerolls
- **Presets**: Save frequently used rolls for quick access
- **Roll History**: Track your recent rolls with timestamps
- **Sound Effects**: Optional dice rolling sound
- **Animated Dice**: Visual rolling animation with critical hit/miss highlighting
- **Dark Theme**: Easy on the eyes with a deep navy and red accent color scheme
- **Mobile Responsive**: Fully functional on mobile devices with touch-friendly controls
- **Keyboard Accessible**: Full keyboard navigation support with visible focus states

## Dice Notation

### Basic Rolls

| Notation | Description |
|----------|-------------|
| `d20` | Roll a single d20 |
| `2d6` | Roll two d6 dice |
| `1d8+3` | Roll 1d8 and add 3 |
| `2d6-1` | Roll 2d6 and subtract 1 |
| `d%` or `d100` | Roll percentile dice |

### Keep/Drop Modifiers

| Notation | Description |
|----------|-------------|
| `4d6kh3` | Roll 4d6, keep highest 3 (ability score generation) |
| `4d6kl3` | Roll 4d6, keep lowest 3 |
| `2d20kh1` | Advantage: Roll 2d20, keep highest |
| `2d20kl1` | Disadvantage: Roll 2d20, keep lowest |
| `4d6dh1` | Roll 4d6, drop highest 1 |
| `4d6dl1` | Roll 4d6, drop lowest 1 |

### Special Modifiers

| Notation | Description |
|----------|-------------|
| `1d6!` | Exploding dice: roll again on max value |
| `1d20r1` | Reroll 1s |

### Combined Notation

| Notation | Description |
|----------|-------------|
| `2d6+1d4+5` | Roll 2d6, add 1d4, add 5 |
| `8d6` | Fireball damage |
| `4d6dl1` | Standard ability score roll |

## How to Use

### Quick Dice Buttons

Click any of the quick dice buttons (d4, d6, d8, d10, d12, d20, d100) to instantly roll that die.

### Text Input

1. Type your dice notation in the input field (e.g., `2d6+3`)
2. Press Enter or click the "Roll" button
3. View the result in the display area

### Presets

1. Click the "Add Preset" button in the Presets panel
2. Enter a name (e.g., "Fireball") and notation (e.g., `8d6`)
3. Click Save
4. Click any saved preset to roll it instantly
5. Delete presets by clicking the X button

### History

- View your recent rolls in the History panel
- Each entry shows the timestamp, notation, individual dice results, and total
- Click "Clear History" to remove all entries
- History persists across browser sessions

### Sound

Click the speaker icon in the header to toggle dice rolling sound effects on/off.

## Running Locally

1. Clone or download this repository
2. Open `index.html` in a modern web browser

No build process or server required - this is a static HTML/CSS/JS application.

```bash
# Using Python's built-in server (optional)
python -m http.server 8000
# Then open http://localhost:8000

# Using Node.js http-server (optional)
npx http-server
# Then open http://localhost:8080
```

## Deployment

This application can be deployed to any static hosting service:

- **GitHub Pages**: Push to a GitHub repository and enable Pages in settings
- **Netlify**: Drag and drop the folder or connect to Git
- **Vercel**: Import the project from Git
- **Any web server**: Simply copy all files to your web root

## Browser Support

Works in all modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   ├── styles.css      # Main styles
│   ├── theme.css       # CSS custom properties (colors, spacing)
│   └── animations.css  # Dice rolling animations
├── js/
│   ├── main.js         # Application entry point
│   ├── parser.js       # Dice notation parser
│   ├── roller.js       # Dice rolling logic
│   ├── animator.js     # Roll animation controller
│   ├── audio.js        # Sound effect management
│   ├── history.js      # Roll history management
│   ├── presets.js      # Preset management
│   ├── storage.js      # Local storage wrapper
│   ├── dice-buttons.js # Quick dice button handlers
│   └── input-form.js   # Text input form handlers
└── README.md           # This file
```

## License

MIT License - feel free to use, modify, and distribute.
