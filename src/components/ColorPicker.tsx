import { Check } from "lucide-react";
import { COLOR_PRESETS } from "../data/defaultCategories";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const isCustom = !COLOR_PRESETS.some((c) => c.toLowerCase() === value.toLowerCase());

  return (
    <div className="w-64 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl p-4 shadow-[var(--shadow-pop)] border border-black/5 dark:border-white/10 animate-pop-in">
      <p className="text-xs font-semibold text-black/40 dark:text-white/40 mb-3 tracking-wide uppercase">
        색상 선택
      </p>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            onClick={() => onChange(color)}
            className="relative aspect-square rounded-full ring-1 ring-black/5 dark:ring-white/10 transition-transform active:scale-90"
            style={{ backgroundColor: color }}
          >
            {value.toLowerCase() === color.toLowerCase() && (
              <Check
                size={16}
                strokeWidth={3}
                className="absolute inset-0 m-auto text-white drop-shadow"
              />
            )}
          </button>
        ))}
      </div>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/15 px-3 py-2.5 cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition-colors">
        <span className="text-sm font-medium text-black/70 dark:text-white/80">
          직접 선택
        </span>
        <span className="flex items-center gap-2">
          {isCustom && (
            <Check size={14} strokeWidth={3} className="text-black/40 dark:text-white/50" />
          )}
          <span
            className="w-7 h-7 rounded-full ring-1 ring-black/10 dark:ring-white/15 overflow-hidden relative"
            style={{ backgroundColor: value }}
          >
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </span>
        </span>
      </label>
    </div>
  );
}
