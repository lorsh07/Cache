import { useRef, useState } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import type { User } from "firebase/auth";
import { useClickOutside } from "../hooks/useClickOutside";

interface ProfileMenuProps {
  user: User;
  onSignOut: () => void;
}

export function ProfileMenu({ user, onSignOut }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapRef, () => setOpen(false));

  const label = user.displayName || user.email || "사용자";

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 shrink-0 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center overflow-hidden active:scale-90 transition-transform"
        aria-label="프로필 메뉴"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={label} className="w-full h-full object-cover" />
        ) : (
          <UserIcon size={16} className="text-black/60 dark:text-white/70" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl p-2 shadow-[var(--shadow-pop)] border border-black/5 dark:border-white/10 animate-pop-in z-30">
          <p className="px-2.5 py-1.5 text-[13px] font-semibold text-black/80 dark:text-white/85 truncate">
            {label}
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13.5px] font-medium text-[var(--color-red)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <LogOut size={15} />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
