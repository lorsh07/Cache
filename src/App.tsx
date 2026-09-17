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
import { SplashScreen } from "./screens/SplashScreen";
import type { SavedItem } from "./types";

export type ViewMode = "all" | "gallery";

function App({ user }: { user: User }) {
  const { items, categories, deleteItem, loading, error, clearError } = useAppStore();
  const { signOutUser } = useAuth();
  const [themeMode, setThemeMode] = useTheme();
  const [view, setView] = useState<ViewMode>("all");
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [openItem, setOpenItem] = useState<SavedItem | null>(null);

  const categoriesById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.domain?.toLowerCase().includes(q)
      );
    });
  }, [items, selectedCategoryId, query]);

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
          />
        ) : (
          <GalleryView items={filteredItems} categoriesById={categoriesById} onOpenItem={setOpenItem} />
        )}
      </main>

      <button
        type="button"
        onClick={() => setShowAddSheet(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[var(--color-accent)] text-white shadow-[var(--shadow-pop)] flex items-center justify-center active:scale-90 transition-transform"
        aria-label="새로 저장하기"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {showAddSheet && (
        <AddItemSheet categories={categories} onClose={() => setShowAddSheet(false)} />
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
        />
      )}
    </div>
  );
}

export default App;
