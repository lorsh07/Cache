import { KINDS, type Kind, type RecommendResponse, type Recommendation } from "../../shared/types";
import { RecCard } from "../components/RecCard";
import { Icon } from "../components/Icon";
import { Segmented } from "../components/Segmented";

const FILTERS: { id: Kind | "all"; label: string }[] = [{ id: "all" as const, label: "전체" }, ...KINDS];

export interface DiscoverState {
  kind: Kind | "all";
  loading: boolean;
  error: string;
  result: RecommendResponse | null;
}

export function Discover({
  state,
  hasEntries,
  isSaved,
  onKind,
  onRun,
  onSave,
  onDismiss,
  onLog,
}: {
  state: DiscoverState;
  hasEntries: boolean;
  isSaved: (title: string) => boolean;
  onKind: (k: Kind | "all") => void;
  onRun: () => void;
  onSave: (r: Recommendation) => void;
  onDismiss: (r: Recommendation) => void;
  onLog: (r: Recommendation) => void;
}) {
  const { kind, loading, error, result } = state;

  if (!hasEntries) {
    return <p className="secondary center pad-y">기록을 하나 이상 남기면 추천을 받을 수 있어요.</p>;
  }

  return (
    <>
      <Segmented label="분류" options={FILTERS} value={kind} onChange={onKind} />

      {result && !loading && (
        <div className="insight">
          <p className="eyebrow">취향 분석{result.source === "local" ? " · 오프라인" : ""}</p>
          <p>{result.summary}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <span className="spinner" />
          <p className="secondary">기록을 읽고 작품을 고르는 중… (최대 1분 정도 걸려요)</p>
          <div className="skeletons">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton" />)}
          </div>
        </div>
      ) : result ? (
        <>
          <div className="rec-list">
            {result.recommendations.map((r) => (
              <RecCard
                key={r.title}
                rec={r}
                saved={isSaved(r.title)}
                onSave={() => onSave(r)}
                onDismiss={() => onDismiss(r)}
                onLog={() => onLog(r)}
              />
            ))}
          </div>
          {result.recommendations.length === 0 && (
            <p className="secondary center pad-y">추천할 작품을 찾지 못했어요. 다른 분류를 골라보세요.</p>
          )}
          <button className="secondary-button" onClick={onRun}>
            <Icon name="refresh" size={17} /> 다른 추천 보기
          </button>
        </>
      ) : (
        <div className="empty compact">
          <div className="empty-mark"><Icon name="sparkles" size={34} /></div>
          <p className="secondary">별점과 후기를 바탕으로 다음 작품을 골라드려요.</p>
          <button className="primary" onClick={onRun}>추천 받기</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </>
  );
}
