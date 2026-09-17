import { Search, Tags, X } from "lucide-react";
import type { ViewMode } from "../App";

interface TopBarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  query: string;
  onQueryChange: (q: string) => void;
  onOpenCategoryManager: () => void;
}

export function TopBar({ view, onViewChange, query, onQueryChange, onOpenCategoryManager }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#f5f5f7]/80 dark:bg-black/70 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold tracking-tight text-black/90 dark:text-white/90">
            Cache
          </h1>
          <button
            type="button"
            onClick={onOpenCategoryManager}
            className="flex items-center gap-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-black/70 dark:text-white/75 active:scale-95 transition-transform"
          >
            <Tags size={15} />
            카테고리
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="검색"
            className="w-full rounded-xl bg-black/[0.06] dark:bg-white/[0.08] pl-10 pr-9 py-2.5 text-[15px] outline-none focus:bg-black/[0.08] dark:focus:bg-white/[0.1] placeholder:text-black/35 dark:placeholder:text-white/35 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35"
              aria-label="검색어 지우기"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex gap-1 bg-black/[0.06] dark:bg-white/[0.08] rounded-xl p-1 w-fit">
          {([
            { key: "all", label: "전체" },
            { key: "gallery", label: "갤러리" },
          ] as { key: ViewMode; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onViewChange(key)}
              className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                view === key
                  ? "bg-white dark:bg-[#3a3a3c] text-black dark:text-white shadow-sm"
                  : "text-black/45 dark:text-white/45"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
