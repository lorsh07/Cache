import type { RecommendRequest, RecommendResponse } from "../shared/types";
import { localRecommend } from "../shared/localRecommend";
import { SCHEMA, SYSTEM, describe, normalize } from "../shared/prompt";

// claude.ai 아티팩트로 열렸을 때 쓰는 런타임 (없으면 null)
type Sample = {
  json: <T>(input: string, opts?: { modelTier?: "quick" | "default" | "complex"; cache?: boolean }) => Promise<T>;
};
type DocSnap = { exists: boolean; data(): Record<string, unknown> | undefined };
type DocRef = { get(): Promise<DocSnap>; set(data: Record<string, unknown>): Promise<void> };
type DB = { doc(path: string): DocRef };
type User = { id(): Promise<string | null> };
declare global {
  interface Window {
    claude?: { use(name: string): Promise<unknown> };
  }
}

const use = <T>(name: string): Promise<T | null> =>
  window.claude ? (window.claude.use(name) as Promise<T | null>).catch(() => null) : Promise.resolve(null);

// ───────── 추천: Claude(sample) → 서버 API → 내장 카탈로그 ─────────
export async function recommend(req: RecommendRequest): Promise<RecommendResponse> {
  const sample = await use<Sample>("sample");
  if (sample) {
    try {
      const prompt = `${SYSTEM}\n\n${describe(req)}\n\n다른 말 없이 아래 JSON 스키마를 따르는 JSON 객체 하나만 답하세요.\n${JSON.stringify(SCHEMA)}`;
      const parsed = await sample.json<unknown>(prompt, { modelTier: "default", cache: false });
      const out = normalize(parsed, req);
      if (out.recommendations.length) return { ...out, source: "ai" };
    } catch (e) {
      console.warn("[sample]", (e as { code?: string })?.code ?? e);
    }
    return localRecommend(req);
  }

  try {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (res.ok) return (await res.json()) as RecommendResponse;
  } catch {
    /* 서버 없이 정적으로 열린 경우 */
  }
  return localRecommend(req);
}

// ───────── 저장: 계정별 db 문서 (아티팩트에서만) ─────────
export async function cloudDoc(): Promise<DocRef | null> {
  const [db, user] = await Promise.all([use<DB>("db"), use<User>("user")]);
  if (!db || !user) return null;
  const id = await user.id().catch(() => null);
  return id ? db.doc(`data/users/${id}/state/main`) : null;
}
