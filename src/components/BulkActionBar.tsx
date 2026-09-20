import { useRef, useState } from "react";
import { FolderInput, Trash2 } from "lucide-react";
import type { Category } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";
import { ConfirmDialog } from "./ConfirmDialog";

interface BulkActionBarProps {
  count: number;
  categories: Category[];
  onMove: (categoryId: string) => void;
  onDelete: () => void;
}

export function BulkActionBar({ count, categories, onMove, onDelete }: BulkActionBarProps) {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  useClickOutside(pickerRef, () => setShowCategoryPicker(false));

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-pop-in">
      <div className="flex items-center gap-3 rounded-2xl bg-[#2c2c2e] text-white px-4 py-3 shadow-[var(--shadow-pop)] whitespace-nowrap">
        <span className="text-[13px] font-semibold pr-1">{count}개 선택됨</span>

        <div className="relative" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setShowCategoryPicker((s) => !s)}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[13px] font-medium active:scale-95 transition-transform"
          >
            <FolderInput size={14} />
            이동
          </button>

          {showCategoryPicker && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl p-1.5 shadow-[var(--shadow-pop)] border border-black/5 dark:border-white/10 animate-pop-in">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onMove(cat.id);
                    setShowCategoryPicker(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-black/80 dark:text-white/85 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[13px] font-medium text-[#ff6961] active:scale-95 transition-transform"
        >
          <Trash2 size={14} />
          삭제
        </button>
      </div>

      {confirming && (
        <ConfirmDialog
          title={`${count}개 항목을 삭제할까요?`}
          message="이 작업은 되돌릴 수 없어요."
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onDelete();
          }}
        />
      )}
    </div>
  );
}
