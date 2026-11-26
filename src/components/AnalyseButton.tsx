export default function AnalyseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 rounded-[10px] border-none bg-accent px-[22px] py-[11px] text-sm font-semibold text-accent-ink shadow-[0_4px_14px_-5px_var(--accent)] hover:brightness-110 active:translate-y-px"
    >
      <span className="text-[11px]" aria-hidden>
        ▶
      </span>{" "}
      Analyse
    </button>
  );
}
