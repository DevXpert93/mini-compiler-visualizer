import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import AnalyseButton from "./components/AnalyseButton";
import ExampleButton from "./components/ExampleButton";
import TokenTable from "./components/TokenTable";
import ErrorPanel from "./components/ErrorPanel";
import { btn } from "./components/styles";
import { LexError, tokenize } from "./lexer/lexer";
import type { Token } from "./lexer/tokens";
import { DEFAULT_SAMPLE, EXAMPLES } from "./samples";

export default function App() {
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorAt, setErrorAt] = useState<{
    line: number;
    column: number;
  } | null>(null);
  const [analysed, setAnalysed] = useState<string | null>(null); // the code when Analyse was last clicked; null = never clicked
  const [undo, setUndo] = useState<string | null>(null);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("mcv-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // some browsers block storage, so just use the device theme instead
    }
    return matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("mcv-theme", theme);
    } catch {
      // if saving fails, nothing breaks. The theme just won't be remembered
    }
  }, [theme]);

  const stale = analysed !== null && analysed !== code;
  const isBlank = analysed !== null && !error && tokens.length === 0;

  function handleAnalyse() {
    setAnalysed(code);
    setErrorAt(null);
    if (!code.trim()) {
      setTokens([]);
      setError(null);
      return;
    }
    try {
      const tokens = tokenize(code);
      setTokens(tokens);
      setError(null);
    } catch (err) {
      if (err instanceof LexError) {
        setError(
          `Lexical Error: ${err.message} (Line ${err.line}, Column ${err.column})`,
        );
        setErrorAt({ line: err.line, column: err.column });
        setTokens([]);
      } else {
        throw err;
      }
    }
  }

  function clearResults() {
    setTokens([]);
    setError(null);
    setErrorAt(null);
    setAnalysed(null);
  }

  // Used by the example, reset and clear buttons. Saves the old code so undo works.
  function loadCode(next: string) {
    setUndo(code !== next && code.trim() ? code : null);
    setCode(next);
    clearResults();
    taRef.current?.focus();
  }

  function handleUndo() {
    if (undo === null) return;
    setCode(undo);
    clearResults();
    setUndo(null);
  }

  function goToError() {
    const ta = taRef.current;
    if (!errorAt || !ta) return;
    const lines = code.split("\n");
    let offset = 0;
    for (let i = 0; i < errorAt.line - 1; i++) offset += lines[i].length + 1;
    offset += errorAt.column - 1;
    ta.focus();
    ta.setSelectionRange(offset, offset + 1);
  }

  async function copyTokens() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    setTimeout(() => setCopied("idle"), 1500);
  }

  const countLabel = error
    ? "lexing failed"
    : tokens.length > 0
      ? `${tokens.length} token${tokens.length === 1 ? "" : "s"} found`
      : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        tokenCount={tokens.length}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />

      <main className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-start gap-[22px] p-4 md:grid-cols-2 md:p-[26px]">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line bg-panel2 px-4 py-3">
            <span className="font-mono text-xs font-medium text-soft">
              main.mini
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <ExampleButton
                label="basic"
                onClick={() => loadCode(EXAMPLES.basic)}
              />
              <ExampleButton
                label="arithmetic"
                onClick={() => loadCode(EXAMPLES.arithmetic)}
              />
              <ExampleButton
                label="error"
                onClick={() => loadCode(EXAMPLES.error)}
              />
              <button
                type="button"
                className={btn}
                onClick={() => loadCode(DEFAULT_SAMPLE)}
                disabled={code === DEFAULT_SAMPLE}
              >
                reset
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => loadCode("")}
                disabled={code === "" && analysed === null}
              >
                clear
              </button>
              {undo !== null && (
                <button
                  type="button"
                  className={btn + " !border-accent !text-ink"}
                  onClick={handleUndo}
                >
                  undo
                </button>
              )}
            </div>
          </div>

          <Editor
            code={code}
            onChange={setCode}
            onRun={handleAnalyse}
            errorLine={error && errorAt && !stale ? errorAt.line : undefined}
            taRef={taRef}
          />

          <div className="flex items-center justify-between gap-3 border-t border-line bg-panel2 px-4 py-3.5">
            <span
              className="font-mono text-[11px] text-faint"
              title="Press Esc, then Tab, to move focus out of the editor"
            >
              Ctrl / Cmd + Enter to run
            </span>
            <AnalyseButton onClick={handleAnalyse} />
          </div>
        </section>

        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
          <div className="flex items-center justify-between gap-2.5 border-b border-line bg-panel2 px-[18px] py-[13px]">
            <span className="text-[13px] font-semibold tracking-tight">
              Token Stream
            </span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] text-soft">
                {countLabel}
              </span>
              {tokens.length > 0 && (
                <button type="button" className={btn} onClick={copyTokens}>
                  {copied === "ok"
                    ? "copied"
                    : copied === "fail"
                      ? "copy failed"
                      : "copy json"}
                </button>
              )}
            </div>
          </div>

          {stale && (
            <div
              className="border-b border-line bg-panel2 px-[18px] py-2 font-mono text-[11px] text-soft"
              role="status"
            >
              Code changed since the last run. Click Analyse to refresh.
            </div>
          )}

          <div className="h-[50vh] min-h-[260px] overflow-auto md:h-[482px]">
            {error && (
              <ErrorPanel message={error} stale={stale} onGoTo={goToError} />
            )}

            {!error && tokens.length === 0 && (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3.5 p-[30px] text-center">
                <div className="flex size-[54px] items-center justify-center rounded-[14px] border-[1.5px] border-dashed border-strong font-mono text-[22px] text-faint">
                  {"{ }"}
                </div>
                <p className="m-0 max-w-[240px] text-sm leading-normal text-soft">
                  {isBlank
                    ? "The editor is empty. Type some code, then click Analyse."
                    : "Write some code and click Analyse."}
                </p>
              </div>
            )}

            {tokens.length > 0 && <TokenTable tokens={tokens} />}
          </div>
        </section>
      </main>
    </div>
  );
}
