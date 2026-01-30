/**
 * Dice Notation Parser
 * Recursive descent parser for D&D dice notation.
 *
 * Grammar (EBNF):
 * expression  = term (('+' | '-') term)*
 * term        = dice | number
 * dice        = count? 'd' sides modifier*
 * count       = number
 * sides       = number | '%'
 * modifier    = keep | drop | explode | reroll
 * keep        = ('kh' | 'kl') number?
 * drop        = ('dh' | 'dl') number?
 * explode     = '!'
 * reroll      = 'r' number
 */

// Token types
const TokenType = {
  NUMBER: 'NUMBER',
  D: 'D',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  KEEP_HIGH: 'KEEP_HIGH',
  KEEP_LOW: 'KEEP_LOW',
  DROP_HIGH: 'DROP_HIGH',
  DROP_LOW: 'DROP_LOW',
  EXPLODE: 'EXPLODE',
  REROLL: 'REROLL',
  PERCENT: 'PERCENT',
  EOF: 'EOF'
};

/**
 * Tokenizes a dice notation string into an array of tokens.
 * @param {string} input - The dice notation string
 * @returns {Array<{type: string, value: string|number}>} Array of tokens
 */
function tokenize(input) {
  const tokens = [];
  let pos = 0;
  const normalized = input.toLowerCase().replace(/\s+/g, '');

  while (pos < normalized.length) {
    const char = normalized[pos];

    // Numbers
    if (/[0-9]/.test(char)) {
      let numStr = '';
      while (pos < normalized.length && /[0-9]/.test(normalized[pos])) {
        numStr += normalized[pos];
        pos++;
      }
      tokens.push({ type: TokenType.NUMBER, value: parseInt(numStr, 10) });
      continue;
    }

    // Two-character tokens (kh, kl, dh, dl)
    if (pos + 1 < normalized.length) {
      const twoChar = normalized.slice(pos, pos + 2);
      if (twoChar === 'kh') {
        tokens.push({ type: TokenType.KEEP_HIGH, value: 'kh' });
        pos += 2;
        continue;
      }
      if (twoChar === 'kl') {
        tokens.push({ type: TokenType.KEEP_LOW, value: 'kl' });
        pos += 2;
        continue;
      }
      if (twoChar === 'dh') {
        tokens.push({ type: TokenType.DROP_HIGH, value: 'dh' });
        pos += 2;
        continue;
      }
      if (twoChar === 'dl') {
        tokens.push({ type: TokenType.DROP_LOW, value: 'dl' });
        pos += 2;
        continue;
      }
    }

    // Single character tokens
    switch (char) {
      case 'd':
        tokens.push({ type: TokenType.D, value: 'd' });
        pos++;
        break;
      case '+':
        tokens.push({ type: TokenType.PLUS, value: '+' });
        pos++;
        break;
      case '-':
        tokens.push({ type: TokenType.MINUS, value: '-' });
        pos++;
        break;
      case '!':
        tokens.push({ type: TokenType.EXPLODE, value: '!' });
        pos++;
        break;
      case 'r':
        tokens.push({ type: TokenType.REROLL, value: 'r' });
        pos++;
        break;
      case '%':
        tokens.push({ type: TokenType.PERCENT, value: '%' });
        pos++;
        break;
      default:
        throw new Error(`Unexpected character '${char}' at position ${pos}`);
    }
  }

  tokens.push({ type: TokenType.EOF, value: null });
  return tokens;
}

/**
 * Parser class for recursive descent parsing of dice notation.
 */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  /**
   * Returns the current token without consuming it.
   * @returns {Object} Current token
   */
  peek() {
    return this.tokens[this.pos];
  }

  /**
   * Consumes and returns the current token.
   * @returns {Object} Consumed token
   */
  consume() {
    return this.tokens[this.pos++];
  }

  /**
   * Checks if current token matches the expected type.
   * @param {string} type - Expected token type
   * @returns {boolean} True if matches
   */
  check(type) {
    return this.peek().type === type;
  }

  /**
   * Consumes token if it matches expected type, otherwise throws.
   * @param {string} type - Expected token type
   * @returns {Object} Consumed token
   */
  expect(type) {
    if (!this.check(type)) {
      throw new Error(`Expected ${type} but got ${this.peek().type}`);
    }
    return this.consume();
  }

  /**
   * Parses the expression (top-level rule).
   * expression = term (('+' | '-') term)*
   * @returns {Object} AST node
   */
  parseExpression() {
    const result = {
      dice: [],
      modifier: 0
    };

    const firstTerm = this.parseTerm();
    if (firstTerm.type === 'dice') {
      result.dice.push(firstTerm.value);
    } else {
      result.modifier += firstTerm.value;
    }

    while (this.check(TokenType.PLUS) || this.check(TokenType.MINUS)) {
      const op = this.consume();
      const sign = op.type === TokenType.PLUS ? 1 : -1;
      const term = this.parseTerm();

      if (term.type === 'dice') {
        result.dice.push(term.value);
      } else {
        result.modifier += sign * term.value;
      }
    }

    if (!this.check(TokenType.EOF)) {
      throw new Error(`Unexpected token ${this.peek().type} at end of expression`);
    }

    return result;
  }

  /**
   * Parses a term (dice or number).
   * term = dice | number
   * @returns {Object} Term result with type and value
   */
  parseTerm() {
    // Look ahead to determine if this is dice notation or just a number
    if (this.check(TokenType.D)) {
      // Dice without count (e.g., d20)
      return { type: 'dice', value: this.parseDice(1) };
    }

    if (this.check(TokenType.NUMBER)) {
      const num = this.consume().value;

      // Check if followed by 'd' (dice notation)
      if (this.check(TokenType.D)) {
        return { type: 'dice', value: this.parseDice(num) };
      }

      // Just a number modifier
      return { type: 'number', value: num };
    }

    throw new Error(`Unexpected token ${this.peek().type}, expected number or 'd'`);
  }

  /**
   * Parses dice notation.
   * dice = count? 'd' sides modifier*
   * @param {number} count - Number of dice
   * @returns {Object} Dice AST node
   */
  parseDice(count) {
    this.expect(TokenType.D);

    let sides;
    if (this.check(TokenType.PERCENT)) {
      this.consume();
      sides = 100;
    } else if (this.check(TokenType.NUMBER)) {
      sides = this.consume().value;
    } else {
      throw new Error('Expected number or % after d');
    }

    const dice = {
      count,
      sides,
      keep: null,
      drop: null,
      exploding: false,
      reroll: null
    };

    // Parse modifiers
    this.parseModifiers(dice);

    return dice;
  }

  /**
   * Parses dice modifiers.
   * modifier = keep | drop | explode | reroll
   * @param {Object} dice - Dice object to modify
   */
  parseModifiers(dice) {
    while (true) {
      if (this.check(TokenType.KEEP_HIGH)) {
        this.consume();
        const count = this.check(TokenType.NUMBER) ? this.consume().value : 1;
        dice.keep = { type: 'highest', count };
      } else if (this.check(TokenType.KEEP_LOW)) {
        this.consume();
        const count = this.check(TokenType.NUMBER) ? this.consume().value : 1;
        dice.keep = { type: 'lowest', count };
      } else if (this.check(TokenType.DROP_HIGH)) {
        this.consume();
        const count = this.check(TokenType.NUMBER) ? this.consume().value : 1;
        dice.drop = { type: 'highest', count };
      } else if (this.check(TokenType.DROP_LOW)) {
        this.consume();
        const count = this.check(TokenType.NUMBER) ? this.consume().value : 1;
        dice.drop = { type: 'lowest', count };
      } else if (this.check(TokenType.EXPLODE)) {
        this.consume();
        dice.exploding = true;
      } else if (this.check(TokenType.REROLL)) {
        this.consume();
        if (!this.check(TokenType.NUMBER)) {
          throw new Error('Expected number after r (reroll)');
        }
        dice.reroll = this.consume().value;
      } else {
        break;
      }
    }
  }
}

/**
 * Parses a dice notation string into an AST.
 * @param {string} input - The dice notation string (e.g., "2d6+3", "4d6dl1")
 * @returns {Object} AST with dice array and modifier
 * @throws {Error} If the notation is invalid
 */
export function parse(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new Error('Input must be a non-empty string');
  }

  const tokens = tokenize(trimmed);
  const parser = new Parser(tokens);
  return parser.parseExpression();
}
