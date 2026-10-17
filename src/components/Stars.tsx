import { useState } from "react";

const STAR = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z";

function Star({ fill, size }: { fill: 0 | 0.5 | 1; size: number }) {
  const id = `half-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="var(--fill-strong)" />
        </linearGradient>
      </defs>
      <path d={STAR} fill={fill === 1 ? "currentColor" : fill === 0.5 ? `url(#${id})` : "var(--fill-strong)"} />
    </svg>
  );
}

const fillFor = (value: number, i: number): 0 | 0.5 | 1 =>
  value >= i + 1 ? 1 : value >= i + 0.5 ? 0.5 : 0;

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`별점 ${value}점`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={fillFor(value, i)} size={size} />
      ))}
    </span>
  );
}

// 별 왼쪽 절반을 누르면 0.5점, 오른쪽을 누르면 1점
export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  // 누를 때마다 n을 올려 해당 별의 튀어오르는 애니메이션을 다시 재생한다
  const [pop, setPop] = useState({ upTo: -1, n: 0 });
  const pick = (v: number) => {
    onChange(v);
    setPop((p) => ({ upTo: Math.ceil(v) - 1, n: p.n + 1 }));
  };
  return (
    <div className="star-input" role="radiogroup" aria-label="별점">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="star-slot">
          <span
            key={i <= pop.upTo ? pop.n : 0}
            className={i <= pop.upTo ? "star-pop" : ""}
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <Star fill={fillFor(value, i)} size={36} />
          </span>
          <button type="button" className="half left" aria-label={`${i + 0.5}점`} onClick={() => pick(i + 0.5)} />
          <button type="button" className="half right" aria-label={`${i + 1}점`} onClick={() => pick(i + 1)} />
        </span>
      ))}
      <span key={value} className="star-value">{value ? value.toFixed(1) : "–"}</span>
    </div>
  );
}
