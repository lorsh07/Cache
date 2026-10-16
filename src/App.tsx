import { useCallback, useEffect, useState } from "react";
import type { Entry, Recommendation, RecommendResponse } from "../shared/types";
import { SAMPLE, uid, useStore } from "./store";
import { Sheet } from "./components/Sheet";
import { EntryEditor, type Draft } from "./components/EntryEditor";
import { EntryDetail } from "./components/EntryDetail";
import { Icon } from "./components/Icon";
import { Home } from "./views/Home";
import { Library } from "./views/Library";
import { Discover, type DiscoverState } from "./views/Discover";
import { Saved } from "./views/Saved";

type Tab = "home" | "library" | "discover" | "saved";

const TABS: { id: Tab; label: string; icon: string; title: string }[] = [
  { id: "home", label: "오늘", icon: "home", title: "오늘" },
  { id: "library", label: "기록", icon: "list", title: "기록" },
  { id: "discover", label: "발견", icon: "sparkles", title: "발견" },
  { id: "saved", label: "보관함", icon: "bookmark", title: "보관함" },
];

type SheetState =
  | { type: "none" }
  | { type: "new"; draft?: Draft; fromSaved?: string }
  | { type: "edit"; entry: Entry }
  | { type: "detail"; entry: Entry };

export default function App() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>("home");
  const [sheet, setSheet] = useState<SheetState>({ type: "none" });
  const [scrolled, setScrolled] = useState(false);
  const [discover, setDiscover] = useState<DiscoverState>({ kind: "all", loading: false, error: "", result: null });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  const close = useCallback(() => setSheet({ type: "none" }), []);

  const runDiscover = useCallback(
    async (kind = discover.kind) => {
      const shown = discover.result?.recommendations.map((r) => r.title) ?? [];
      setDiscover((s) => ({ ...s, kind, loading: true, error: "" }));
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entries: store.entries.map(({ kind, title, creator, rating, review, moods }) => ({ kind, title, creator, rating, review, moods })),
            kind,
            exclude: [...store.dismissed, ...store.saved.map((s) => s.title), ...shown],
          }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "추천을 불러오지 못했어요.");
        const result = (await res.json()) as RecommendResponse;
        setDiscover({ kind, loading: false, error: "", result });
      } catch (err) {
        setDiscover((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : "네트워크 오류가 발생했어요." }));
      }
    },
    [discover.kind, discover.result, store.entries, store.dismissed, store.saved],
  );

  const logRec = (r: Recommendation) =>
    setSheet({ type: "new", draft: { kind: r.kind, title: r.title, creator: r.creator }, fromSaved: r.title });

  const saveEntry = (e: Entry) => {
    store.upsertEntry(e);
    if (sheet.type === "new" && sheet.fromSaved) {
      const t = sheet.fromSaved;
      store.setSaved((list) => list.filter((x) => x.title !== t));
      setDiscover((s) =>
        s.result ? { ...s, result: { ...s.result, recommendations: s.result.recommendations.filter((r) => r.title !== t) } } : s,
      );
    }
    setSheet(sheet.type === "edit" ? { type: "detail", entry: e } : { type: "none" });
  };

  const loadSample = () =>
    store.setEntries(SAMPLE.map((s, i) => ({ ...s, id: uid(), createdAt: Date.now() - i })));

  const current = TABS.find((t) => t.id === tab)!;
  const dateLabel = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  return (
    <div className="app">
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <span className="nav-inline-title">{current.title}</span>
        <button className="nav-add" onClick={() => setSheet({ type: "new" })} aria-label="새 기록">
          <Icon name="plus" size={20} />
        </button>
      </header>

      <main className="content">
        <div className="large-title">
          {tab === "home" && <p className="eyebrow">{dateLabel}</p>}
          <h1>{current.title}</h1>
        </div>

        {tab === "home" && (
          <Home
            entries={store.entries}
            onOpen={(entry) => setSheet({ type: "detail", entry })}
            onAdd={() => setSheet({ type: "new" })}
            onDiscover={() => {
              go("discover");
              if (!discover.result && !discover.loading) runDiscover();
            }}
            onSample={loadSample}
          />
        )}
        {tab === "library" && <Library entries={store.entries} onOpen={(entry) => setSheet({ type: "detail", entry })} />}
        {tab === "discover" && (
          <Discover
            state={discover}
            hasEntries={store.entries.length > 0}
            isSaved={(t) => store.saved.some((s) => s.title === t)}
            onKind={(k) => runDiscover(k)}
            onRun={() => runDiscover()}
            onSave={store.toggleSaved}
            onDismiss={(r) => {
              store.dismiss(r.title);
              setDiscover((s) =>
                s.result ? { ...s, result: { ...s.result, recommendations: s.result.recommendations.filter((x) => x.title !== r.title) } } : s,
              );
            }}
            onLog={logRec}
          />
        )}
        {tab === "saved" && <Saved saved={store.saved} onToggle={store.toggleSaved} onLog={logRec} />}
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => go(t.id)} aria-current={tab === t.id}>
            <Icon name={t.icon} size={23} filled={tab === t.id && t.icon !== "list"} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <Sheet open={sheet.type !== "none"} onClose={close}>
        {sheet.type === "new" && <EntryEditor key={`new-${sheet.draft?.title ?? ""}`} draft={sheet.draft} onSave={saveEntry} onCancel={close} />}
        {sheet.type === "edit" && <EntryEditor key={sheet.entry.id} initial={sheet.entry} onSave={saveEntry} onCancel={() => setSheet({ type: "detail", entry: sheet.entry })} />}
        {sheet.type === "detail" && (
          <EntryDetail
            entry={sheet.entry}
            onClose={close}
            onEdit={() => setSheet({ type: "edit", entry: sheet.entry })}
            onDelete={() => {
              store.removeEntry(sheet.entry.id);
              close();
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

