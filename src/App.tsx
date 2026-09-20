import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { User } from "firebase/auth";
import { useAppStore } from "./store/AppStore";
import { useAuth } from "./store/AuthContext";
import { useTheme } from "./hooks/useTheme";
import { TopBar } from "./components/TopBar";
import { CategoryFilterBar } from "./components/CategoryFilterBar";
import { ItemGrid } from "./components/ItemGrid";
import { GalleryView } from "./components/GalleryView";
import { AddItemSheet } from "./components/AddItemSheet";
import { CategoryManagerSheet } from "./components/CategoryManagerSheet";
import { Lightbox } from "./components/Lightbox";
import { ErrorBanner } from "./components/ErrorBanner";
import { BulkActionBar } from "./components/BulkActionBar";
import { SplashScreen } from "./screens/SplashScreen";
import type { SavedItem } from "./types";

export type ViewMode = "all" | "gallery";
export type SortMode = "latest" | "title" | "category";

function App({ user }: { user: User }) {
  const { items, categories, deleteItem, updateItem, loading, error, clearError } = useAppStore();
  const { signOutUser } = useAuth();
  const [themeMode, setThemeMode] = useTheme();
  const [view, setView] = useState<ViewMode>("all");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [openItem, setOpenItem] = useState<SavedItem | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const categoriesById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const categoryOrder = useMemo(() => new Map(categories.map((c, i) => [c.id, i])), [categories]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.domain?.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortMode) {
        case "title":
          return a.title.localeCompare(b.title, "ko");
        case "category": {
          const diff = (categoryOrder.get(a.categoryId) ?? 0) - (categoryOrder.get(b.categoryId) ?? 0);
          return diff !== 0 ? diff : b.createdAt - a.createdAt;
        }
        case "latest":
        default:
          return b.createdAt - a.createdAt;
      }
    });

    sorted.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
    return sorted;
  }, [items, selectedCategoryId, query, sortMode, categoryOrder]);

  function toggleSelectionMode() {
    setSelectionMode((s) => !s);
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    await Promise.all([...selectedIds].map((id) => deleteItem(id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
  }

  async function handleBulkMove(categoryId: string) {
    await Promise.all([...selectedIds].map((id) => updateItem(id, { categoryId })));
    setSelectedIds(new Set());
    setSelectionMode(false);
  }

  if (loading) return <SplashScreen />;

  return (
    <div className="min-h-screen pb-10">
      {error && <ErrorBanner message={error} onDismiss={clearError} />}
      <TopBar
        view={view}
        onViewChange={setView}
        query={query}
        onQueryChange={setQuery}
        onOpenCategoryManager={() => setShowCategoryManager(true)}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
        user={user}
        onSignOut={signOutUser}
        sortMode={sortMode}
        onSortChange={setSortMode}
        selectionMode={selectionMode}
        onToggleSelectionMode={toggleSelectionMode}
      />

      <main className="max-w-5xl mx-auto pt-4 space-y-4">
        <CategoryFilterBar
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        {view === "all" ? (
          <ItemGrid
            items={filteredItems}
            categoriesById={categoriesById}
            onOpenItem={setOpenItem}
            onDeleteItem={deleteItem}
            onTogglePin={(item) => updateItem(item.id, { pinned: !item.pinned })}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        ) : (
          <GalleryView items={filteredItems} categoriesById={categoriesById} onOpenItem={setOpenItem} />
        )}
      </main>

      {!selectionMode && (
        <button
          type="button"
          onClick={() => setShowAddSheet(true)}
          className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[var(--color-accent)] text-white shadow-[var(--shadow-pop)] flex items-center justify-center active:scale-90 transition-transform"
          aria-label="새로 저장하기"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      {selectionMode && (
        <BulkActionBar
          count={selectedIds.size}
          categories={categories}
          onMove={handleBulkMove}
          onDelete={handleBulkDelete}
        />
      )}

      {(showAddSheet || editingItem) && (
        <AddItemSheet
          categories={categories}
          editingItem={editingItem ?? undefined}
          onClose={() => {
            setShowAddSheet(false);
            setEditingItem(null);
          }}
        />
      )}
      {showCategoryManager && (
        <CategoryManagerSheet onClose={() => setShowCategoryManager(false)} />
      )}
      {openItem && (
        <Lightbox
          item={openItem}
          category={categoriesById.get(openItem.categoryId)}
          onClose={() => setOpenItem(null)}
          onDelete={() => {
            deleteItem(openItem.id);
            setOpenItem(null);
          }}
          onEdit={() => {
            setEditingItem(openItem);
            setOpenItem(null);
          }}
          onTogglePin={() => {
            updateItem(openItem.id, { pinned: !openItem.pinned });
            setOpenItem({ ...openItem, pinned: !openItem.pinned });
          }}
        />
      )}
    </div>
  );
}

export default App;
