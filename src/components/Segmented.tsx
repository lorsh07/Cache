import { useLayoutEffect, useRef, useState } from "react";

// 선택 표시가 미끄러지듯 따라가는 세그먼트 컨트롤
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const btn = root.querySelector<HTMLButtonElement>(`[data-id="${CSS.escape(value)}"]`);
      if (btn) setThumb({ x: btn.offsetLeft, w: btn.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [value, options.length]);

  const select = (id: T, el: HTMLButtonElement) => {
    onChange(id);
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };

  return (
    <div className="segmented scroll" role="tablist" aria-label={label} ref={ref}>
      {thumb && <span className="seg-thumb" style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }} />}
      {options.map((o) => (
        <button
          key={o.id}
          data-id={o.id}
          role="tab"
          aria-selected={value === o.id}
          className={value === o.id ? "on" : ""}
          onClick={(e) => select(o.id, e.currentTarget)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
