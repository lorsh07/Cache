import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-1.5rem)] max-w-md animate-pop-in">
      <div className="flex items-start gap-2.5 rounded-2xl bg-[#2c2c2e] text-white px-4 py-3 shadow-[var(--shadow-pop)]">
        <AlertTriangle size={16} className="text-[var(--color-yellow)] shrink-0 mt-0.5" />
        <p className="text-[13px] leading-relaxed flex-1">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-white/60"
          aria-label="닫기"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
