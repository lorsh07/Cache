import type { Category } from "../types";
import { CategoryChip } from "./CategoryChip";

interface CategoryFilterBarProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilterBar({ categories, selectedId, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all active:scale-95 ${
          selectedId === null
            ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
            : "bg-black/[0.05] dark:bg-white/[0.08] text-black/70 dark:text-white/75 hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <CategoryChip
          key={cat.id}
          category={cat}
          active={selectedId === cat.id}
          onClick={() => onSelect(cat.id)}
        />
      ))}
    </div>
  );
}
