import type { Token, TokenType } from "./tokens";

const KEYWORDS = new Set(["let", "print"]);

const SYMBOLS: Record<string, TokenType> = {
  "=": "ASSIGN",
  "+": "PLUS",
  "-": "MINUS",
  "*": "STAR",
  "/": "SLASH",
  "(": "LPAREN",
  ")": "RPAREN",
  ";": "SEMICOLON",
};

export class LexError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
  ) {
    super(message);
  }
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0,
    line = 1,
    col = 1;

  const isDigit = (c: string) => c >= "0" && c <= "9";
  const isAlpha = (c: string) => /[A-Za-z_]/.test(c);
  const isAlphaNum = (c: string) => isAlpha(c) || isDigit(c);

  while (i < source.length) {
    const c = source[i];

    if (c === "\n") {
      line++;
      col = 1;
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\r") {
      i++;
      col++;
      continue;
    }

    if (isDigit(c)) {
      const startCol = col,
        start = i;
      while (i < source.length && isDigit(source[i])) {
        i++;
        col++;
      }
      tokens.push({
        type: "NUMBER",
        lexeme: source.slice(start, i),
        line,
        column: startCol,
      });
      continue;
    }

    if (isAlpha(c)) {
      const startCol = col,
        start = i;
      while (i < source.length && isAlphaNum(source[i])) {
        i++;
        col++;
      }
      const word = source.slice(start, i);
      tokens.push({
        type: KEYWORDS.has(word) ? "KEYWORD" : "IDENTIFIER",
        lexeme: word,
        line,
        column: startCol,
      });
      continue;
    }

    if (SYMBOLS[c]) {
      tokens.push({ type: SYMBOLS[c], lexeme: c, line, column: col });
      i++;
      col++;
      continue;
    }

    throw new LexError(`Unexpected character '${c}'`, line, col);
  }

  tokens.push({ type: "EOF", lexeme: "", line, column: col });
  return tokens;
}
