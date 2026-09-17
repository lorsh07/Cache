import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useAppStore } from "../store/AppStore";
import { ColorSwatchButton } from "./ColorSwatchButton";
import { COLOR_PRESETS } from "../data/defaultCategories";

interface CategoryManagerSheetProps {
  onClose: () => void;
}

export function CategoryManagerSheet({ onClose }: CategoryManagerSheetProps) {
  const { categories, items, addCategory, updateCategory, deleteCategory } = useAppStore();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);

  function handleAdd() {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), color: newColor });
    setNewName("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#1c1c1e] shadow-[var(--shadow-pop)] animate-sheet-up sm:animate-pop-in">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-white dark:bg-[#1c1c1e] z-10">
          <h2 className="text-lg font-bold text-black/90 dark:text-white/90">카테고리 관리</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-2">
          {categories.map((cat) => {
            const count = items.filter((it) => it.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] px-3 py-2.5"
              >
                <ColorSwatchButton
                  value={cat.color}
                  onChange={(color) => updateCategory(cat.id, { color })}
                  size={28}
                />
                <input
                  value={cat.name}
                  onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
                  className="flex-1 bg-transparent text-[14px] font-medium outline-none"
                />
                <span className="text-[12px] text-black/35 dark:text-white/35 shrink-0">
                  {count}개
                </span>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  disabled={categories.length <= 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-black/35 dark:text-white/35 hover:text-[var(--color-red)] disabled:opacity-20 disabled:hover:text-black/35 transition-colors shrink-0"
                  aria-label="카테고리 삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}

          <div className="flex items-center gap-2 rounded-xl border border-dashed border-black/15 dark:border-white/20 px-3 py-2.5 mt-3">
            <ColorSwatchButton value={newColor} onChange={setNewColor} size={28} />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="새 카테고리 이름"
              className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/35 dark:placeholder:text-white/35"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center disabled:opacity-30 shrink-0"
              aria-label="카테고리 추가"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
