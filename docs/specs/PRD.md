# Product Requirements Document: D&D Dice Roller

## Problem Statement

During Dungeons & Dragons sessions, players need to roll various dice quickly and accurately. Physical dice can be lost, hard to read, or slow to calculate when rolling multiple dice with modifiers. Existing online dice rollers are often cluttered with ads, require accounts, or lack the full dice notation support that experienced players need.

This project creates a personal, static website dice roller that provides fast, satisfying dice rolling with full D&D notation support, persistent history, and saved presets—all without requiring any backend or account.

## Goals

1. **Comprehensive Dice Support**: Support full dice notation including modifiers, advantage/disadvantage, drop/keep mechanics (e.g., `4d6dl1`, `2d20kh1`, `1d8+5`)
2. **Dual Input Methods**: Provide both quick-click buttons for common rolls and a text input for complex notation
3. **Persistent History**: Maintain detailed roll history with timestamps, totals, and individual dice results, saved to local storage
4. **Satisfying UX**: Modern, sleek interface with smooth 1-2 second dice tumbling animations and sound effects
5. **Saved Presets**: Allow saving frequently-used rolls (e.g., "Fireball 8d6") for quick access
6. **Zero Dependencies**: Static HTML/CSS/JS with no build step, hostable anywhere

## Non-Goals

- **Multiplayer/Sharing**: No real-time sharing or multiplayer features
- **Character Sheets**: No character management or stat tracking
- **Campaign Management**: No session notes, initiative tracking, or encounter management
- **User Accounts**: No login, cloud sync, or server-side storage
- **Mobile App**: Web-only (though should be mobile-responsive)

## User Stories

### Core Rolling

1. **As a player**, I want to click a d20 button and see an animated roll with the result, so I can quickly make attack rolls and saving throws.

2. **As a player**, I want to type `4d6dl1` and see four dice rolled with the lowest dropped and the total calculated, so I can roll ability scores correctly.

3. **As a player**, I want to type `2d20kh1+5` for advantage with a modifier and see both d20 results with the higher one highlighted plus my modifier, so I understand exactly what happened.

### History

4. **As a player**, I want to see my last several rolls with timestamps and full details, so I can reference recent results during play.

5. **As a player**, I want my roll history to persist when I close and reopen my browser, so I don't lose context between sessions.

6. **As a player**, I want to clear my roll history when starting a new session, so I have a fresh start.

### Presets

7. **As a player**, I want to save a roll like "Sneak Attack 4d6" as a preset, so I can execute it with one click during combat.

8. **As a player**, I want to edit and delete my saved presets, so I can update them as my character changes.

9. **As a player**, I want my presets to persist across browser sessions, so I don't have to recreate them.

### Experience

10. **As a player**, I want to see dice tumble with animation before revealing the result, so rolling feels satisfying and dramatic.

11. **As a player**, I want to hear dice rolling sounds when I roll, so the experience feels tactile.

12. **As a player**, I want a clean, modern dark interface, so it looks good and is easy on the eyes during long sessions.

## Success Metrics

- Rolls execute and display results in under 2 seconds (including animation)
- All standard D&D dice notation parses correctly
- Page loads in under 1 second on typical connections
- Works offline after initial load (fully static)
- Mobile-responsive layout works on phone screens

## Dice Notation Reference

The roller must support this notation:

| Notation | Meaning | Example |
|----------|---------|---------|
| `NdX` | Roll N dice with X sides | `2d6` = roll 2 six-sided dice |
| `+M` / `-M` | Add/subtract modifier | `1d20+5` |
| `kh N` / `kl N` | Keep highest/lowest N | `2d20kh1` = advantage |
| `dh N` / `dl N` | Drop highest/lowest N | `4d6dl1` = ability score |
| `!` | Exploding dice (reroll max) | `1d6!` |
| `r` | Reroll (reroll specific values) | `2d6r1` = reroll 1s |

Standard D&D dice: d4, d6, d8, d10, d12, d20, d100
