export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "NUMBER"
  | "ASSIGN"
  | "PLUS"
  | "MINUS"
  | "STAR"
  | "SLASH"
  | "LPAREN"
  | "RPAREN"
  | "SEMICOLON"
  | "EOF";

export interface Token {
  type: TokenType;
  lexeme: string;
  line: number;
  column: number;
}
