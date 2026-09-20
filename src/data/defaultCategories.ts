import type { Category } from "../types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-red", name: "중요", color: "#FF3B30", isDefault: true },
  { id: "cat-yellow", name: "아이디어", color: "#FFCC00", isDefault: true },
  { id: "cat-blue", name: "나중에", color: "#007AFF", isDefault: true },
];

export const COLOR_PRESETS: string[] = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00C7BE",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#8E8E93",
];
