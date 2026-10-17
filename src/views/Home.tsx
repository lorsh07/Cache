import type { Entry } from "../../shared/types";
import { KINDS } from "../../shared/types";
import { Cover } from "../components/Cover";
import { Stars } from "../components/Stars";
import { Icon } from "../components/Icon";

export function Home({
  entries,
  onOpen,
  onAdd,
  onDiscover,
  onSample,
}: {
  entries: Entry[];
  onOpen: (e: Entry) => void;
  onAdd: () => void;
  onDiscover: () => void;
  onSample: () => void;
}) {
  const year = new Date().getFullYear().toString();
  const thisYear = entries.filter((e) => e.date.startsWith(year));
  const avg = entries.length ? entries.reduce((s, e) => s + e.rating, 0) / entries.length : 0;
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const byKind = KINDS.map((k) => ({ ...k, n: entries.filter((e) => e.kind === k.id).length }));
  const maxKind = Math.max(1, ...byKind.map((k) => k.n));

  if (!entries.length) {
    return (
      <section className="empty">
        <div className="empty-mark">
          <Icon name="sparkles" size={40} />
        </div>
        <h2>당신의 취향을 기록해 보세요</h2>
        <p className="secondary">
          본 영화, 읽은 책, 다녀온 공연을 남기면
          <br />
          AI가 다음에 즐길 작품을 골라드려요.
        </p>
        <button className="primary" onClick={onAdd}>첫 기록 남기기</button>
        <button className="text-button" onClick={onSample}>샘플 기록으로 둘러보기</button>
      </section>
    );
  }

  return (
    <>
      <div className="home-top">
      <section className="stats">
        <div className="stat">
          <span className="stat-value">{entries.length}</span>
          <span className="stat-label">전체 기록</span>
        </div>
        <div className="stat">
          <span className="stat-value">{thisYear.length}</span>
          <span className="stat-label">{year}년</span>
        </div>
        <div className="stat">
          <span className="stat-value">{avg.toFixed(1)}</span>
          <span className="stat-label">평균 별점</span>
        </div>
      </section>

      <button className="hero-card" onClick={onDiscover}>
        <div>
          <p className="eyebrow">For You</p>
          <h3>오늘의 추천 받기</h3>
          <p className="secondary small">기록 {entries.length}개를 바탕으로 다음 작품을 골라드려요</p>
        </div>
        <Icon name="chevron" size={20} />
      </button>
      </div>

      <div className="section-head">
        <h2>최근 기록</h2>
      </div>
      <div className="shelf">
        {recent.map((e) => (
          <button key={e.id} className="shelf-item" onClick={() => onOpen(e)}>
            <Cover title={e.title} kind={e.kind} creator={e.creator} size="md" />
            <span className="shelf-title">{e.title}</span>
            <Stars value={e.rating} size={11} />
          </button>
        ))}
      </div>

      <div className="section-head">
        <h2>나의 문화 지도</h2>
      </div>
      <div className="group pad">
        {byKind.map((k) => (
          <div key={k.id} className="bar-row">
            <span className="bar-label">{k.label}</span>
            <span className="bar-track">
              <span className="bar-fill" style={{ width: `${(k.n / maxKind) * 100}%` }} />
            </span>
            <span className="bar-n">{k.n}</span>
          </div>
        ))}
      </div>
    </>
  );
}
