import { useRef, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  Pencil,
  Share2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { Category, SavedItem } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";
import { formatRelativeDate } from "../utils/format";
import { ConfirmDialog } from "./ConfirmDialog";

interface LightboxProps {
  item: SavedItem;
  category?: Category;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
}

export function Lightbox({ item, category, onClose, onDelete, onEdit, onTogglePin }: LightboxProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  useClickOutside(cardRef, onClose, !confirming);

  async function handleShare() {
    const shareData = {
      title: item.title,
      text: item.note,
      url: item.url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(item.url || item.title);
      setShareStatus("복사했어요");
    } catch {
      setShareStatus("공유에 실패했어요");
    }
    setTimeout(() => setShareStatus(null), 1500);
  }

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
            onClick={onTogglePin}
            className={`absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
              item.pinned ? "bg-[var(--color-yellow)] text-white" : "bg-black/50 text-white"
            }`}
            aria-label={item.pinned ? "고정 해제" : "고정하기"}
          >
            <Star size={15} fill={item.pinned ? "currentColor" : "none"} />
          </button>
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
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
            <div className="flex items-center gap-4">
              {shareStatus && (
                <span className="text-[12px] text-black/40 dark:text-white/40">{shareStatus}</span>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[13px] font-medium text-black/55 dark:text-white/60 active:scale-95 transition-transform"
              >
                <Share2 size={14} />
                공유
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1.5 text-[13px] font-medium text-black/55 dark:text-white/60 active:scale-95 transition-transform"
              >
                <Pencil size={14} />
                수정
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-red)] active:scale-95 transition-transform"
              >
                <Trash2 size={14} />
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="이 항목을 삭제할까요?"
          message={`"${item.title}"을(를) 삭제하면 되돌릴 수 없어요.`}
          onCancel={() => setConfirming(false)}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
}
