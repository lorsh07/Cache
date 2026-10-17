import { useState } from "react";
import { kindLabel, type Kind } from "../../shared/types";
import { useCover } from "../useCover";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

// 실제 표지를 찾으면 그 이미지를, 못 찾으면 제목에서 뽑아낸 무채색 포스터를 보여준다
export function Cover({ title, kind, creator = "", size = "md" }: { title: string; kind: Kind; creator?: string; size?: "sm" | "md" | "lg" }) {
  const url = useCover(kind, title, creator);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const showImage = url && failed !== url;
  const ready = showImage && loaded === url;

  const h = hash(title);
  const light = 14 + (h % 22); // 14% ~ 35%
  const angle = h % 360;
  const variant = (h >> 8) % 3;
  return (
    <div
      className={`cover cover-${size} cover-v${variant} ${ready ? "has-image" : ""} ${kind === "music" ? "square" : ""}`}
      style={{
        background: `linear-gradient(${angle}deg, hsl(0 0% ${light}%), hsl(0 0% ${light + 22}%))`,
      }}
    >
      <span className="cover-kind">{kindLabel(kind)}</span>
      <span className="cover-title">{title}</span>
      {showImage && (
        <img
          className="cover-img"
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(url)}
          onError={() => setFailed(url)}
        />
      )}
    </div>
  );
}
