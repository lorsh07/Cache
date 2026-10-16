import type { Entry } from "../../shared/types";
import { kindLabel } from "../../shared/types";
import { Cover } from "./Cover";
import { Stars } from "./Stars";
import { Icon } from "./Icon";

export function EntryDetail({ entry, onEdit, onDelete, onClose }: { entry: Entry; onEdit: () => void; onDelete: () => void; onClose: () => void }) {
  return (
    <div className="detail">
      <div className="sheet-nav">
        <button className="text-button" onClick={onClose}>닫기</button>
        <span />
        <button className="text-button strong" onClick={onEdit}>편집</button>
      </div>
      <div className="detail-hero">
        <Cover title={entry.title} kind={entry.kind} size="lg" />
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
      <button
        className="destructive"
        onClick={() => {
          if (confirm("이 기록을 삭제할까요?")) onDelete();
        }}
      >
        <Icon name="trash" size={18} /> 기록 삭제
      </button>
    </div>
  );
}
