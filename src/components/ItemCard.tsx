import { useState } from "react";
import { Camera, Image as ImageIcon, Link as LinkIcon, Trash2 } from "lucide-react";
import type { Category, SavedItem } from "../types";
import { formatRelativeDate } from "../utils/format";
import { ConfirmDialog } from "./ConfirmDialog";

interface ItemCardProps {
  item: SavedItem;
  category?: Category;
  onOpen: () => void;
  onDelete: () => void;
}

export function ItemCard({ item, category, onOpen, onDelete }: ItemCardProps) {
  const hasImage = item.type !== "link" && item.imageDataUrl;
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#1c1c1e] shadow-[var(--shadow-card)] dark:shadow-[var(--shadow-card-dark)] ring-1 ring-black/[0.04] dark:ring-white/[0.06] transition-transform active:scale-[0.98] cursor-pointer"
      onClick={onOpen}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setConfirming(true);
        }}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="삭제"
      >
        <Trash2 size={14} />
      </button>

      {confirming && (
        <ConfirmDialog
          title="이 항목을 삭제할까요?"
          message={`"${item.title}"을(를) 삭제하면 되돌릴 수 없어요.`}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onDelete();
          }}
        />
      )}

      {hasImage ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-black/5">
          <img
            src={item.imageDataUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="aspect-[4/3] w-full flex items-center justify-center"
          style={{ backgroundColor: `${category?.color ?? "#8E8E93"}1a` }}
        >
          <LinkIcon size={28} style={{ color: category?.color ?? "#8E8E93" }} strokeWidth={1.75} />
        </div>
      )}

      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-black/40 dark:text-white/40">
          {item.type === "link" && <LinkIcon size={11} />}
          {item.type === "screenshot" && <Camera size={11} />}
          {item.type === "photo" && <ImageIcon size={11} />}
          <span className="truncate">{item.domain ?? (item.type === "screenshot" ? "스크린샷" : item.type === "photo" ? "사진" : "")}</span>
          <span className="ml-auto shrink-0">{formatRelativeDate(item.createdAt)}</span>
        </div>
        <p className="text-[14px] font-semibold leading-snug line-clamp-2 text-black/90 dark:text-white/90">
          {item.title}
        </p>
        {category && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="text-[11px] font-medium text-black/45 dark:text-white/45">
              {category.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
