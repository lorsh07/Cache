import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db } from "../lib/firebase";
import { DEFAULT_CATEGORIES } from "../data/defaultCategories";
import { SEED_ITEMS } from "../data/seed";
import type { Category, SavedItem } from "../types";

export interface AppStoreValue {
  items: SavedItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  clearError: () => void;
  addItem: (item: Omit<SavedItem, "id" | "createdAt">) => Promise<boolean>;
  updateItem: (id: string, patch: Partial<SavedItem>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  addCategory: (category: Omit<Category, "id">) => Promise<Category | null>;
  updateCategory: (id: string, patch: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

export const AppStoreContext = createContext<AppStoreValue | null>(null);

function friendlyFirestoreError(): string {
  return "동기화에 실패했어요. Firebase 콘솔에서 Firestore Database가 켜져 있는지, 보안 규칙이 올바른지 확인해주세요.";
}

export function AppStoreProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsCol = useMemo(() => collection(db!, "users", userId, "items"), [userId]);
  const categoriesCol = useMemo(() => collection(db!, "users", userId, "categories"), [userId]);

  useEffect(() => {
    const firestore = db;
    if (!firestore) return;
    let cancelled = false;
    let unsubItems = () => {};
    let unsubCategories = () => {};

    (async () => {
      try {
        const metaRef = doc(firestore, "users", userId, "meta", "init");
        const metaSnap = await getDoc(metaRef);
        if (!metaSnap.exists()) {
          const batch = writeBatch(firestore);
          DEFAULT_CATEGORIES.forEach((cat) => {
            const { id, ...rest } = cat;
            batch.set(doc(firestore, "users", userId, "categories", id), rest);
          });
          SEED_ITEMS.forEach((item) => {
            const { id, ...rest } = item;
            batch.set(doc(firestore, "users", userId, "items", id), rest);
          });
          batch.set(metaRef, { seededAt: Date.now() });
          await batch.commit();
        }
      } catch {
        if (!cancelled) setError(friendlyFirestoreError());
      }

      if (cancelled) return;

      unsubItems = onSnapshot(
        query(itemsCol, orderBy("createdAt", "desc")),
        (snap) => {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SavedItem));
          setLoading(false);
        },
        () => {
          setError(friendlyFirestoreError());
          setLoading(false);
        }
      );
      unsubCategories = onSnapshot(categoriesCol, (snap) => {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category));
      });
    })();

    return () => {
      cancelled = true;
      unsubItems();
      unsubCategories();
    };
  }, [userId, itemsCol, categoriesCol]);

  const value = useMemo<AppStoreValue>(
    () => ({
      items,
      categories,
      loading,
      error,
      clearError: () => setError(null),
      addItem: async (item) => {
        try {
          await addDoc(itemsCol, { ...item, createdAt: Date.now() });
          return true;
        } catch {
          setError(friendlyFirestoreError());
          return false;
        }
      },
      updateItem: async (id, patch) => {
        try {
          await updateDoc(doc(itemsCol, id), patch);
          return true;
        } catch {
          setError(friendlyFirestoreError());
          return false;
        }
      },
      deleteItem: async (id) => {
        try {
          await deleteDoc(doc(itemsCol, id));
          return true;
        } catch {
          setError(friendlyFirestoreError());
          return false;
        }
      },
      addCategory: async (category) => {
        try {
          const ref = await addDoc(categoriesCol, category);
          return { id: ref.id, ...category };
        } catch {
          setError(friendlyFirestoreError());
          return null;
        }
      },
      updateCategory: async (id, patch) => {
        try {
          await updateDoc(doc(categoriesCol, id), patch);
          return true;
        } catch {
          setError(friendlyFirestoreError());
          return false;
        }
      },
      deleteCategory: async (id) => {
        try {
          await deleteDoc(doc(categoriesCol, id));
          const fallback = categories.find((c) => c.id !== id)?.id ?? "";
          await Promise.all(
            items
              .filter((it) => it.categoryId === id)
              .map((it) => updateDoc(doc(itemsCol, it.id), { categoryId: fallback }))
          );
          return true;
        } catch {
          setError(friendlyFirestoreError());
          return false;
        }
      },
    }),
    [items, categories, loading, error, itemsCol, categoriesCol]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
