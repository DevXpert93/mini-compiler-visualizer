import type { Token, TokenType } from "../lexer/tokens";

const CATEGORY: Record<TokenType, string> = {
  KEYWORD: "--t-keyword",
  IDENTIFIER: "--t-id",
  NUMBER: "--t-num",
  ASSIGN: "--t-op",
  PLUS: "--t-op",
  MINUS: "--t-op",
  STAR: "--t-op",
  SLASH: "--t-op",
  LPAREN: "--t-punc",
  RPAREN: "--t-punc",
  SEMICOLON: "--t-punc",
  EOF: "--t-eof",
};

const th =
  "border-b border-line py-2.5 text-[10px] font-semibold uppercase tracking-widest text-faint";

export default function TokenTable({ tokens }: { tokens: Token[] }) {
  return (
    <table className="w-full border-collapse font-mono">
      <thead>
        <tr className="sticky top-0 z-[1] bg-panel2">
          <th className={`${th} w-[42px] pr-2.5 pl-[18px] text-right`}>#</th>
          <th className={`${th} px-3 text-left`}>Lexeme</th>
          <th className={`${th} px-3 text-left`}>Token type</th>
          <th className={`${th} w-14 px-2.5 text-right`}>Line</th>
          <th className={`${th} w-12 pr-[18px] pl-2.5 text-right`}>Col</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t, i) => {
          const color = `var(${CATEGORY[t.type]})`;
          return (
            <tr key={i} className="row-in border-b border-line hover:bg-panel2">
              <td className="py-[9px] pr-2.5 pl-[18px] text-right text-xs text-faint">
                {i + 1}
              </td>
              <td
                className="px-3 py-[9px] text-[13px] font-medium"
                title={t.type === "EOF" ? "End of file" : undefined}
              >
                {t.type === "EOF" ? "⎐" : t.lexeme}
              </td>
              <td className="px-3 py-[9px]">
                <span
                  className="inline-flex items-center gap-[7px] rounded-md py-[3px] pr-[9px] pl-2 text-[11px] font-semibold tracking-wide"
                  style={{
                    color,
                    background: `color-mix(in srgb, ${color} 15%, transparent)`,
                  }}
                >
                  <i
                    className="size-1.5 rounded-full"
                    style={{ background: color }}
                  />
                  {t.type}
                </span>
              </td>
              <td className="px-2.5 py-[9px] text-right text-xs text-soft">
                {t.line}
              </td>
              <td className="py-[9px] pr-[18px] pl-2.5 text-right text-xs text-soft">
                {t.column}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
