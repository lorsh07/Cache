import { useEffect, useRef, useState, type ReactNode } from "react";

const LEAVE_MS = 280;

// iOS 스타일 바텀 시트 (데스크톱에서는 가운데 모달). 닫힐 때도 내려가는 애니메이션을 보여준다.
export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const last = useRef(children);
  if (open) last.current = children;

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const t = setTimeout(() => setMounted(false), LEAVE_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return (
    <div className={`sheet-backdrop ${open ? "" : "leaving"}`} onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" />
        {open ? children : last.current}
      </div>
    </div>
  );
}
