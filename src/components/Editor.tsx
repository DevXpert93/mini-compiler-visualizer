import { useRef, type KeyboardEvent, type RefObject } from "react";

interface Props {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  errorLine?: number;
  taRef: RefObject<HTMLTextAreaElement>;
}

export default function Editor({
  code,
  onChange,
  onRun,
  errorLine,
  taRef,
}: Props) {
  const gutter = useRef<HTMLDivElement>(null);
  const escaped = useRef(false); // Tab inserts spaces here, so Esc then Tab is how keyboard users move focus out.
  const lineCount = code.split("\n").length;

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
      return;
    }
    if (e.key === "Escape") {
      escaped.current = true;
      return;
    }
    if (
      e.key === "Tab" &&
      !e.shiftKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !escaped.current
    ) {
      e.preventDefault();
      const t = e.currentTarget;
      const s = t.selectionStart;
      onChange(code.slice(0, s) + "  " + code.slice(t.selectionEnd));
      requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
      return;
    }
    escaped.current = false;
  };

  return (
    <div className="flex h-[48vh] min-h-[260px] bg-panel md:h-[440px]">
      <div
        ref={gutter}
        aria-hidden
        className="w-[50px] flex-none select-none overflow-hidden border-r border-line bg-panel2 py-[18px] text-right font-mono text-[13px] leading-[23px] text-gutter"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className={
              "pr-3 " +
              (i + 1 === errorLine ? "bg-err-bg font-bold text-err" : "")
            }
          >
            {i + 1}
          </div>
        ))}
        <div className="h-4" />
      </div>
      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (gutter.current)
            gutter.current.scrollTop = e.currentTarget.scrollTop;
        }}
        onKeyDown={onKeyDown}
        spellCheck={false}
        wrap="off"
        aria-label="Source code"
        placeholder={
          "Write some code, e.g.\n\nlet x = 5;\nlet y = x + 10;\nprint(y);"
        }
        className="min-w-0 flex-1 resize-none overflow-auto whitespace-pre border-none bg-transparent py-[18px] pr-[18px] pl-4 font-mono text-[13px] leading-[23px] text-ink caret-accent outline-none [tab-size:2] focus-visible:shadow-[inset_0_0_0_2px_var(--accent)]"
      />
    </div>
  );
}
