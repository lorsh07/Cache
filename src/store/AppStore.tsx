import { createContext, useContext, useMemo, type ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_CATEGORIES } from "../data/defaultCategories";
import { SEED_ITEMS } from "../data/seed";
import type { Category, SavedItem } from "../types";

interface AppStoreValue {
  items: SavedItem[];
  categories: Category[];
  addItem: (item: Omit<SavedItem, "id" | "createdAt">) => void;
  updateItem: (id: string, patch: Partial<SavedItem>) => void;
  deleteItem: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<SavedItem[]>("cache.items", SEED_ITEMS);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "cache.categories",
    DEFAULT_CATEGORIES
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      items,
      categories,
      addItem: (item) => {
        const newItem: SavedItem = { ...item, id: uuid(), createdAt: Date.now() };
        setItems((prev) => [newItem, ...prev]);
      },
      updateItem: (id, patch) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
      },
      deleteItem: (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
      },
      addCategory: (category) => {
        const newCategory: Category = { ...category, id: uuid() };
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
      },
      updateCategory: (id, patch) => {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
      },
      deleteCategory: (id) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        const fallback = categories.find((c) => c.id !== id)?.id ?? "";
        setItems((prev) =>
          prev.map((it) => (it.categoryId === id ? { ...it, categoryId: fallback } : it))
        );
      },
    }),
    [items, categories, setItems, setCategories]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
