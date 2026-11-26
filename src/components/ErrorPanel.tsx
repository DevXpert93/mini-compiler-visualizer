interface Props {
  message: string; // e.g. "Lexical Error: Unexpected character '@' (Line 2, Column 5)"
  stale: boolean;
  onGoTo: () => void;
}

export default function ErrorPanel({ message, stale, onGoTo }: Props) {
  return (
    <div
      role="alert"
      className="pop-in m-[18px] rounded-xl border border-err-line bg-err-bg px-5 py-[18px]"
    >
      <div className="flex items-start gap-2.5">
        <span className="flex size-6 flex-none items-center justify-center rounded-[7px] bg-err font-mono text-sm font-bold text-panel">
          !
        </span>
        <p className="m-0 font-mono text-[13px] leading-normal text-err">
          {message}
        </p>
      </div>
      {!stale && (
        <button
          type="button"
          onClick={onGoTo}
          className="mt-3 cursor-pointer rounded-md border border-err-line bg-transparent px-2.5 py-1 font-mono text-xs text-err hover:bg-err-line"
        >
          Go to error
        </button>
      )}
    </div>
  );
}
