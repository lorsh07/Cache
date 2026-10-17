import { useState } from "react";
import type { Entry } from "../../shared/types";
import { kindLabel } from "../../shared/types";
import { Cover } from "./Cover";
import { Stars } from "./Stars";
import { Icon } from "./Icon";

export function EntryDetail({ entry, onEdit, onDelete, onClose }: { entry: Entry; onEdit: () => void; onDelete: () => void; onClose: () => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <div className="detail">
      <div className="sheet-nav">
        <button className="text-button" onClick={onClose}>닫기</button>
        <span />
        <button className="text-button strong" onClick={onEdit}>편집</button>
      </div>
      <div className="detail-hero">
        <Cover title={entry.title} kind={entry.kind} creator={entry.creator} size="lg" />
        <div>
          <p className="eyebrow">{kindLabel(entry.kind)} · {entry.date.replaceAll("-", ". ")}</p>
          <h2>{entry.title}</h2>
          {entry.creator && <p className="secondary">{entry.creator}</p>}
          <Stars value={entry.rating} size={18} />
        </div>
      </div>
      {entry.review && <blockquote className="review">{entry.review}</blockquote>}
      {entry.moods.length > 0 && (
        <div className="chips static">
          {entry.moods.map((m) => <span key={m} className="chip">{m}</span>)}
        </div>
      )}
      <button className={`destructive ${armed ? "armed" : ""}`} onClick={() => (armed ? onDelete() : setArmed(true))} onBlur={() => setArmed(false)}>
        <Icon name="trash" size={18} /> {armed ? "한 번 더 누르면 삭제돼요" : "기록 삭제"}
      </button>
    </div>
  );
}
