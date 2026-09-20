import { useRef, useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { useClickOutside } from "../hooks/useClickOutside";

interface ColorSwatchButtonProps {
  value: string;
  onChange: (color: string) => void;
  size?: number;
}

export function ColorSwatchButton({ value, onChange, size = 32 }: ColorSwatchButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapRef, () => setOpen(false));

  return (
    <div className="relative inline-block" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full ring-2 ring-white dark:ring-[#1c1c1e] shadow-sm transition-transform active:scale-90"
        style={{ backgroundColor: value, width: size, height: size }}
        aria-label="색상 변경"
      />
      {open && (
        <div className="absolute z-30 top-full left-0 mt-2">
          <ColorPicker
            value={value}
            onChange={(c) => {
              onChange(c);
            }}
          />
        </div>
      )}
    </div>
  );
}
