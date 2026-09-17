import { Images } from "lucide-react";
import type { Category, SavedItem } from "../types";
import { EmptyState } from "./EmptyState";

interface GalleryViewProps {
  items: SavedItem[];
  categoriesById: Map<string, Category>;
  onOpenItem: (item: SavedItem) => void;
}

export function GalleryView({ items, categoriesById, onOpenItem }: GalleryViewProps) {
  const imageItems = items.filter((item) => item.imageDataUrl);

  if (imageItems.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="갤러리가 비어있어요"
        description="스크린샷이나 사진을 저장하면 여기 갤러리에 모아서 볼 수 있어요."
      />
    );
  }

  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 px-4 sm:px-6 pb-28 [column-fill:_balance]">
      {imageItems.map((item) => {
        const category = categoriesById.get(item.categoryId);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenItem(item)}
            className="relative block w-full mb-3 sm:mb-4 rounded-2xl overflow-hidden break-inside-avoid shadow-[var(--shadow-card)] dark:shadow-[var(--shadow-card-dark)] ring-1 ring-black/[0.04] dark:ring-white/[0.06] transition-transform active:scale-[0.97]"
          >
            <img src={item.imageDataUrl} alt={item.title} className="w-full h-auto object-cover" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-2.5 pt-6">
              <p className="text-white text-[12.5px] font-semibold text-left line-clamp-1">
                {item.title}
              </p>
              {category && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-white/80 text-[10.5px] font-medium">{category.name}</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
