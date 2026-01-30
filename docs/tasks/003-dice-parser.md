---
id: "003"
title: "Implement dice notation parser"
status: pending
depends_on: ["001"]
test_file: "js/parser.test.html"
---

# 003: Implement dice notation parser

## Objective

Create a recursive descent parser that tokenizes and parses dice notation strings into an AST structure that the roller can execute. This is the core logic for interpreting user input.

## Acceptance Criteria

- [ ] js/parser.js created as ES6 module
- [ ] `parse(input)` function exported
- [ ] Tokenizer handles: numbers, 'd', '+', '-', 'kh', 'kl', 'dh', 'dl', '!', 'r'
- [ ] Parser handles basic notation: `1d20`, `2d6`, `1d100`
- [ ] Parser handles modifiers: `1d20+5`, `2d6-2`
- [ ] Parser handles keep highest/lowest: `2d20kh1`, `2d20kl1`
- [ ] Parser handles drop highest/lowest: `4d6dl1`, `4d6dh1`
- [ ] Parser handles exploding dice: `1d6!`
- [ ] Parser handles reroll: `2d6r1`
- [ ] Parser handles combined: `4d6dl1+2`, `2d20kh1+5`
- [ ] Returns structured AST for roller consumption
- [ ] Throws descriptive error for invalid notation

## Technical Notes

From TECHNICAL_DESIGN.md grammar:
```ebnf
expression  = term (('+' | '-') term)*
term        = dice | number
dice        = count? 'd' sides modifier*
count       = number
sides       = number | '%'
modifier    = keep | drop | explode | reroll
keep        = ('kh' | 'kl') number?
drop        = ('dh' | 'dl') number?
explode     = '!'
reroll      = 'r' number
```

Output AST structure:
```javascript
{
  dice: [
    {
      count: 4,
      sides: 6,
      keep: { type: 'lowest', count: 1 },  // or null
      drop: { type: 'lowest', count: 1 },  // or null
      exploding: false,
      reroll: null  // or number to reroll
    }
  ],
  modifier: 2  // or 0
}
```

## Test Cases

Create js/parser.test.html with inline tests:
- `parse('1d20')` → { dice: [{ count: 1, sides: 20 }], modifier: 0 }
- `parse('2d6+3')` → { dice: [{ count: 2, sides: 6 }], modifier: 3 }
- `parse('4d6dl1')` → { dice: [{ count: 4, sides: 6, drop: { type: 'lowest', count: 1 } }], modifier: 0 }
- `parse('2d20kh1+5')` → { dice: [{ count: 2, sides: 20, keep: { type: 'highest', count: 1 } }], modifier: 5 }
- `parse('invalid')` → throws Error

## Verification

Open js/parser.test.html in browser and verify all tests pass.
