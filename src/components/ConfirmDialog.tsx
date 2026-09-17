import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in"
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        className="w-full max-w-[300px] rounded-2xl bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-xl shadow-[var(--shadow-pop)] overflow-hidden animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4 text-center">
          <p className="text-[15px] font-semibold text-black/90 dark:text-white/90 mb-1">
            {title}
          </p>
          {message && (
            <p className="text-[13px] text-black/55 dark:text-white/55 leading-relaxed">
              {message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 border-t border-black/10 dark:border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 text-[15px] font-medium text-black/70 dark:text-white/75 border-r border-black/10 dark:border-white/10 active:bg-black/[0.04] dark:active:bg-white/[0.06] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`py-3 text-[15px] font-semibold active:bg-black/[0.04] dark:active:bg-white/[0.06] transition-colors ${
              destructive ? "text-[var(--color-red)]" : "text-[var(--color-accent)]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
