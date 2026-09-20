import { Inbox } from "lucide-react";
import type { Category, SavedItem } from "../types";
import { ItemCard } from "./ItemCard";
import { EmptyState } from "./EmptyState";

interface ItemGridProps {
  items: SavedItem[];
  categoriesById: Map<string, Category>;
  onOpenItem: (item: SavedItem) => void;
  onDeleteItem: (id: string) => void;
  onTogglePin: (item: SavedItem) => void;
  selectionMode: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

export function ItemGrid({
  items,
  categoriesById,
  onOpenItem,
  onDeleteItem,
  onTogglePin,
  selectionMode,
  selectedIds,
  onToggleSelect,
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="저장된 항목이 없어요"
        description="오른쪽 아래 + 버튼을 눌러 링크나 스크린샷을 저장해보세요."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 pb-28">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          category={categoriesById.get(item.categoryId)}
          onOpen={() => onOpenItem(item)}
          onDelete={() => onDeleteItem(item.id)}
          onTogglePin={() => onTogglePin(item)}
          selectionMode={selectionMode}
          selected={selectedIds.has(item.id)}
          onToggleSelect={() => onToggleSelect(item.id)}
        />
      ))}
    </div>
  );
}
