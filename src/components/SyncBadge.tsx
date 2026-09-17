import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

export function SyncBadge() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapRef, () => setOpen(false));

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 shrink-0 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center text-[var(--color-accent)] active:scale-90 transition-transform"
        aria-label="기기 간 동기화 안내"
      >
        <RefreshCw size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl p-3.5 shadow-[var(--shadow-pop)] border border-black/5 dark:border-white/10 animate-pop-in z-30">
          <p className="text-[13px] font-semibold text-black/80 dark:text-white/85 mb-1">
            기기 간 자동 동기화
          </p>
          <p className="text-[12.5px] text-black/55 dark:text-white/55 leading-relaxed">
            같은 계정으로 로그인하면 폰, PC 어디서든 저장한 항목이 자동으로 동기화돼요. 따로 연동
            버튼을 누를 필요 없어요.
          </p>
        </div>
      )}
    </div>
  );
}
