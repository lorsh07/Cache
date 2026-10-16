import { useCallback, useEffect, useState } from "react";
import type { Entry, Recommendation } from "../shared/types";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => load(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 저장 공간이 없거나 차단된 경우 메모리에서만 유지 */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export interface SavedItem extends Recommendation {
  savedAt: number;
}

export function useStore() {
  const [entries, setEntries] = usePersisted<Entry[]>("cache.entries", []);
  const [saved, setSaved] = usePersisted<SavedItem[]>("cache.saved", []);
  const [dismissed, setDismissed] = usePersisted<string[]>("cache.dismissed", []);

  const upsertEntry = useCallback(
    (e: Entry) =>
      setEntries((list) => {
        const i = list.findIndex((x) => x.id === e.id);
        if (i < 0) return [e, ...list];
        const next = list.slice();
        next[i] = e;
        return next;
      }),
    [setEntries],
  );
  const removeEntry = useCallback(
    (id: string) => setEntries((list) => list.filter((x) => x.id !== id)),
    [setEntries],
  );
  const toggleSaved = useCallback(
    (r: Recommendation) =>
      setSaved((list) =>
        list.some((x) => x.title === r.title)
          ? list.filter((x) => x.title !== r.title)
          : [{ ...r, savedAt: Date.now() }, ...list],
      ),
    [setSaved],
  );
  const dismiss = useCallback(
    (title: string) => setDismissed((list) => [...new Set([...list, title])].slice(-100)),
    [setDismissed],
  );

  return { entries, setEntries, upsertEntry, removeEntry, saved, setSaved, toggleSaved, dismissed, dismiss };
}

export type Store = ReturnType<typeof useStore>;

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const today = () => new Date().toISOString().slice(0, 10);

export const SAMPLE: Omit<Entry, "id" | "createdAt">[] = [
  { kind: "movie", title: "애프터썬", creator: "샬롯 웰스", date: "2026-09-28", rating: 5, review: "아무 일도 일어나지 않는 것 같은데 마지막 장면에서 무너졌다. 기억이 흐릿해지는 방식 그대로 찍은 영화.", moods: ["잔잔한", "여운이 긴"] },
  { kind: "book", title: "클라라와 태양", creator: "가즈오 이시구로", date: "2026-09-12", rating: 4.5, review: "AI 화자의 순진한 시선 덕분에 오히려 인간의 이기심이 더 선명하게 보였다.", moods: ["철학적인", "잔잔한"] },
  { kind: "series", title: "나의 아저씨", creator: "김원석 · 박해영", date: "2026-08-30", rating: 5, review: "대사 하나하나가 위로. 편안함에 이르렀나.", moods: ["위로가 되는", "현실적인"] },
  { kind: "movie", title: "탑건: 매버릭", creator: "조셉 코신스키", date: "2026-08-02", rating: 3, review: "비행 장면은 압도적인데 이야기는 너무 익숙했다.", moods: ["몰입감"] },
  { kind: "music", title: "Blonde", creator: "Frank Ocean", date: "2026-07-21", rating: 4.5, review: "밤 산책할 때 처음부터 끝까지. Self Control에서 매번 멈춘다.", moods: ["여운이 긴", "실험적인"] },
];
