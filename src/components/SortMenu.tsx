import { useRef, useState } from "react";
import { Check, ChevronDown, ArrowDownWideNarrow } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";
import type { SortMode } from "../App";

interface SortMenuProps {
  mode: SortMode;
  onChange: (mode: SortMode) => void;
}

const OPTIONS: { key: SortMode; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "title", label: "제목순" },
  { key: "category", label: "카테고리순" },
];

export function SortMenu({ mode, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapRef, () => setOpen(false));

  const currentLabel = OPTIONS.find((o) => o.key === mode)?.label ?? "정렬";

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-black/55 dark:text-white/60 bg-black/[0.05] dark:bg-white/[0.08] active:scale-95 transition-transform"
      >
        <ArrowDownWideNarrow size={13} />
        {currentLabel}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl p-1.5 shadow-[var(--shadow-pop)] border border-black/5 dark:border-white/10 animate-pop-in z-30">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-medium text-black/75 dark:text-white/80 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              {opt.label}
              {mode === opt.key && <Check size={14} className="text-[var(--color-accent)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
