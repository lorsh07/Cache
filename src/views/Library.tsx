import { useMemo, useState } from "react";
import { KINDS, kindLabel, type Entry, type Kind } from "../../shared/types";
import { Cover } from "../components/Cover";
import { Stars } from "../components/Stars";
import { Icon } from "../components/Icon";
import { Segmented } from "../components/Segmented";

const FILTERS: { id: Kind | "all"; label: string }[] = [{ id: "all" as const, label: "전체" }, ...KINDS];

type Sort = "date" | "rating";

export function Library({ entries, onOpen }: { entries: Entry[]; onOpen: (e: Entry) => void }) {
  const [filter, setFilter] = useState<Kind | "all">("all");
  const [sort, setSort] = useState<Sort>("date");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries
      .filter((e) => filter === "all" || e.kind === filter)
      .filter((e) => !needle || `${e.title} ${e.creator} ${e.review}`.toLowerCase().includes(needle))
      .sort((a, b) => (sort === "date" ? b.date.localeCompare(a.date) : b.rating - a.rating));
  }, [entries, filter, sort, q]);

  return (
    <>
      <label className="search">
        <Icon name="search" size={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="제목, 창작자, 후기 검색" />
      </label>

      <Segmented label="분류" options={FILTERS} value={filter} onChange={setFilter} />

      <div className="list-head">
        <span className="secondary small">{list.length}개</span>
        <button className="text-button small" onClick={() => setSort(sort === "date" ? "rating" : "date")}>
          {sort === "date" ? "최신순" : "별점순"}
        </button>
      </div>

      {list.length === 0 ? (
        <p className="secondary center pad-y">기록이 없어요.</p>
      ) : (
        <div className="group">
          {list.map((e) => (
            <button key={e.id} className="row entry-row" onClick={() => onOpen(e)}>
              <Cover title={e.title} kind={e.kind} size="sm" />
              <span className="entry-text">
                <span className="entry-title">{e.title}</span>
                <span className="secondary small">
                  {kindLabel(e.kind)}{e.creator ? ` · ${e.creator}` : ""}
                </span>
                {e.review && <span className="entry-review">{e.review}</span>}
              </span>
              <span className="entry-side">
                <Stars value={e.rating} size={11} />
                <span className="tertiary small">{e.date.slice(5).replace("-", ".")}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
