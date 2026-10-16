import { kindLabel, type Kind } from "../../shared/types";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

// 제목에서 뽑아낸 무채색 포스터
export function Cover({ title, kind, size = "md" }: { title: string; kind: Kind; size?: "sm" | "md" | "lg" }) {
  const h = hash(title);
  const light = 14 + (h % 22); // 14% ~ 35%
  const angle = h % 360;
  const variant = (h >> 8) % 3;
  return (
    <div
      className={`cover cover-${size} cover-v${variant}`}
      style={{
        background: `linear-gradient(${angle}deg, hsl(0 0% ${light}%), hsl(0 0% ${light + 22}%))`,
      }}
    >
      <span className="cover-kind">{kindLabel(kind)}</span>
      <span className="cover-title">{title}</span>
    </div>
  );
}
