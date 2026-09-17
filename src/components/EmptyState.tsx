import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-16 h-16 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mb-4">
        <Icon size={28} className="text-black/30 dark:text-white/30" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-semibold text-black/70 dark:text-white/75 mb-1">{title}</p>
      <p className="text-[13px] text-black/40 dark:text-white/40 max-w-xs">{description}</p>
    </div>
  );
}
