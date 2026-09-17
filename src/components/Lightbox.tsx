import { useRef } from "react";
import { Camera, Image as ImageIcon, Trash2, X } from "lucide-react";
import type { Category, SavedItem } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";
import { formatRelativeDate } from "../utils/format";

interface LightboxProps {
  item: SavedItem;
  category?: Category;
  onClose: () => void;
  onDelete: () => void;
}

export function Lightbox({ item, category, onClose, onDelete }: LightboxProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useClickOutside(cardRef, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div
        ref={cardRef}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1c1c1e] shadow-[var(--shadow-pop)] animate-pop-in"
      >
        <div className="relative">
          {item.imageDataUrl && (
            <img src={item.imageDataUrl} alt={item.title} className="w-full max-h-[55vh] object-cover" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-2 text-[12px] font-medium text-black/40 dark:text-white/40">
            {item.type === "screenshot" && <Camera size={12} />}
            {item.type === "photo" && <ImageIcon size={12} />}
            <span>{formatRelativeDate(item.createdAt)}</span>
          </div>
          <h2 className="text-lg font-bold text-black/90 dark:text-white/90 mb-1.5">
            {item.title}
          </h2>
          {item.note && (
            <p className="text-[14px] text-black/60 dark:text-white/60 leading-relaxed mb-3">
              {item.note}
            </p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-medium text-[var(--color-accent)] break-all"
            >
              {item.url}
            </a>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-white" style={{ backgroundColor: category.color }}>
                {category.name}
              </span>
            )}
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-red)] active:scale-95 transition-transform"
            >
              <Trash2 size={14} />
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
