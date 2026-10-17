import { useEffect, useState } from "react";
import type { Kind } from "../shared/types";

// 서버의 /api/cover로 표지를 찾는다. 결과(없음 포함)는 메모리와 브라우저에 캐시한다.
// claude.ai 아티팩트에서는 외부 이미지를 띄울 수 없으므로 찾지 않는다.
const STORE = "cache.covers.v1";
const isArtifact = typeof window !== "undefined" && Boolean(window.claude);

const known = new Map<string, string | null>(
  (() => {
    try {
      return Object.entries(JSON.parse(localStorage.getItem(STORE) ?? "{}") as Record<string, string | null>);
    } catch {
      return [];
    }
  })(),
);
const pending = new Map<string, Promise<string | null>>();

function persist() {
  try {
    const entries = [...known.entries()].slice(-500);
    localStorage.setItem(STORE, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* 저장 실패는 무시: 다음에 다시 찾는다 */
  }
}

function lookup(key: string, kind: Kind, title: string, creator: string): Promise<string | null> {
  let p = pending.get(key);
  if (!p) {
    const qs = new URLSearchParams({ kind, title, creator });
    p = fetch(`/api/cover?${qs}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ url: string | null }>) : { url: null }))
      .then(({ url }) => {
        known.set(key, url);
        persist();
        return url;
      })
      .catch(() => null) // 네트워크 오류는 캐시하지 않는다
      .finally(() => pending.delete(key));
    pending.set(key, p);
  }
  return p;
}

export function useCover(kind: Kind, title: string, creator = ""): string | null {
  const key = `${kind}|${title.trim()}|${creator.trim()}`;
  const supported = !isArtifact && kind !== "show" && kind !== "exhibit" && title.trim() !== "";
  const [url, setUrl] = useState<string | null>(() => (supported ? known.get(key) ?? null : null));

  useEffect(() => {
    if (!supported) {
      setUrl(null);
      return;
    }
    if (known.has(key)) {
      setUrl(known.get(key) ?? null);
      return;
    }
    let alive = true;
    lookup(key, kind, title.trim(), creator.trim()).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [key, supported, kind, title, creator]);

  return url;
}
