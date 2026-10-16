import { useState } from "react";
import { KINDS, MOODS, type Entry, type Kind } from "../../shared/types";
import { StarInput } from "./Stars";
import { today, uid } from "../store";

export interface Draft {
  kind: Kind;
  title: string;
  creator: string;
}

export function EntryEditor({
  initial,
  draft,
  onSave,
  onCancel,
}: {
  initial?: Entry;
  draft?: Draft;
  onSave: (e: Entry) => void;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState<Kind>(initial?.kind ?? draft?.kind ?? "movie");
  const [title, setTitle] = useState(initial?.title ?? draft?.title ?? "");
  const [creator, setCreator] = useState(initial?.creator ?? draft?.creator ?? "");
  const [date, setDate] = useState(initial?.date ?? today());
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [review, setReview] = useState(initial?.review ?? "");
  const [moods, setMoods] = useState<string[]>(initial?.moods ?? []);

  const valid = title.trim() && rating > 0;
  const toggleMood = (m: string) =>
    setMoods((list) => (list.includes(m) ? list.filter((x) => x !== m) : [...list, m]));

  const submit = () => {
    if (!valid) return;
    onSave({
      id: initial?.id ?? uid(),
      createdAt: initial?.createdAt ?? Date.now(),
      kind,
      title: title.trim(),
      creator: creator.trim(),
      date,
      rating,
      review: review.trim(),
      moods,
    });
  };

  return (
    <div className="editor">
      <div className="sheet-nav">
        <button className="text-button" onClick={onCancel}>취소</button>
        <strong>{initial ? "기록 편집" : "새 기록"}</strong>
        <button className="text-button strong" disabled={!valid} onClick={submit}>저장</button>
      </div>

      <div className="segmented scroll" role="tablist">
        {KINDS.map((k) => (
          <button key={k.id} role="tab" aria-selected={kind === k.id} className={kind === k.id ? "on" : ""} onClick={() => setKind(k.id)}>
            {k.label}
          </button>
        ))}
      </div>

      <div className="group">
        <label className="row">
          <span className="row-label">제목</span>
          <input autoFocus={!initial} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="작품 제목" />
        </label>
        <label className="row">
          <span className="row-label">{kind === "book" ? "저자" : kind === "music" ? "아티스트" : "창작자"}</span>
          <input value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="선택" />
        </label>
        <label className="row">
          <span className="row-label">감상일</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <p className="group-title">별점</p>
      <div className="group pad center">
        <StarInput value={rating} onChange={setRating} />
      </div>

      <p className="group-title">후기</p>
      <div className="group">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          placeholder="무엇이 좋았나요? 아쉬운 점도 적어두면 추천이 더 정확해져요."
        />
      </div>

      <p className="group-title">분위기</p>
      <div className="chips">
        {MOODS.map((m) => (
          <button key={m} className={`chip ${moods.includes(m) ? "on" : ""}`} onClick={() => toggleMood(m)}>
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
