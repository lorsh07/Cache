import { useState } from "react";
import { kindLabel, type Recommendation } from "../../shared/types";
import { Cover } from "./Cover";
import { Icon } from "./Icon";

export function RecCard({
  rec,
  saved,
  onSave,
  onDismiss,
  onLog,
}: {
  rec: Recommendation;
  saved: boolean;
  onSave: () => void;
  onDismiss?: () => void;
  onLog: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const leave = (then: () => void) => {
    setLeaving(true);
    setTimeout(then, 260);
  };
  return (
    <article className={`rec-card ${leaving ? "leaving" : ""}`}>
      <Cover title={rec.title} kind={rec.kind} size="md" />
      <div className="rec-body">
        <div className="rec-meta">
          <span className="eyebrow">{kindLabel(rec.kind)}{rec.year && rec.year !== "—" ? ` · ${rec.year}` : ""}</span>
          <span className="match">{rec.match}% 일치</span>
        </div>
        <h3>{rec.title}</h3>
        <p className="secondary small">{rec.creator}</p>
        <p className="reason">{rec.reason}</p>
        <div className="rec-actions">
          <button className={`pill ${saved ? "on" : ""}`} onClick={onSave}>
            <span key={String(saved)} className={saved ? "icon-pop" : ""}><Icon name="bookmark" size={15} filled={saved} /></span>
            {saved ? "보관됨" : "보관"}
          </button>
          <button className="pill" onClick={onLog}>
            <Icon name="plus" size={15} /> 봤어요
          </button>
          {onDismiss && (
            <button className="pill ghost" onClick={() => leave(onDismiss)} aria-label="관심 없음">
              <Icon name="eyeOff" size={15} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
