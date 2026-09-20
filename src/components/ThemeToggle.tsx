import { Monitor, Moon, Sun } from "lucide-react";
import type { ThemeMode } from "../hooks/useTheme";

interface ThemeToggleProps {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

const ORDER: ThemeMode[] = ["light", "dark", "system"];
const ICON = { light: Sun, dark: Moon, system: Monitor };
const LABEL = { light: "라이트 모드", dark: "다크 모드", system: "시스템 설정 따름" };

export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  const Icon = ICON[mode];

  return (
    <button
      type="button"
      onClick={() => onChange(ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length])}
      className="w-9 h-9 shrink-0 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center text-black/70 dark:text-white/75 active:scale-90 transition-transform"
      aria-label={`화면 모드: ${LABEL[mode]} (탭하여 변경)`}
      title={LABEL[mode]}
    >
      <Icon size={16} />
    </button>
  );
}
