export type ItemType = "link" | "screenshot" | "photo";

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

export interface SavedItem {
  id: string;
  type: ItemType;
  title: string;
  note?: string;
  url?: string;
  domain?: string;
  imageDataUrl?: string;
  categoryId: string;
  createdAt: number;
  pinned?: boolean;
}
