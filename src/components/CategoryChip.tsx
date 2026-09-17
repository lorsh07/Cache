import type { Category } from "../types";

interface CategoryChipProps {
  category: Category;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ category, active, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all active:scale-95 ${
        active
          ? "text-white shadow-sm"
          : "bg-black/[0.05] dark:bg-white/[0.08] text-black/70 dark:text-white/75 hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
      }`}
      style={active ? { backgroundColor: category.color } : undefined}
    >
      {!active && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
      )}
      {category.name}
    </button>
  );
}
