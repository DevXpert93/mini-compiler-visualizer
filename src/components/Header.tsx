interface Props {
  tokenCount: number;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({ tokenCount, theme, onToggleTheme }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-panel px-6 py-4">
      <div className="flex items-center gap-3.5">
        <div className="flex size-10 flex-none items-center justify-center rounded-[11px] bg-accent shadow-[0_4px_14px_-4px_var(--accent)]">
          <span className="font-mono text-lg font-bold tracking-tighter text-accent-ink">
            &lt;/&gt;
          </span>
        </div>
        <div className="flex flex-col gap-px">
          <h1 className="m-0 text-lg font-semibold tracking-tight">
            Mini Compiler Visualizer
          </h1>
          <span className="font-mono text-[11px] tracking-wide text-soft">
            lexer · source → tokens
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-2 rounded-[9px] border border-strong bg-panel2 px-3 py-1.5 font-mono text-xs"
          aria-live="polite"
        >
          <span className="size-[7px] rounded-full bg-accent" />
          <span className="font-semibold">{tokenCount}</span>
          <span className="text-soft">tokens</span>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-pressed={theme === "dark"}
          className="flex cursor-pointer items-center gap-2 rounded-[9px] border border-strong bg-panel2 px-3.5 py-2 font-mono text-xs font-medium text-ink hover:border-accent"
        >
          <span aria-hidden>{theme === "light" ? "◑" : "◐"}</span>
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}
