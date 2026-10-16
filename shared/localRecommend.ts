import { CATALOG } from "./catalog.js";
import type { Kind, Recommendation, RecommendRequest, RecommendResponse } from "./types.js";

// API를 쓸 수 없을 때 내장 카탈로그에서 분위기·매체 선호로 고르는 추천
const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

export function localRecommend(req: RecommendRequest): RecommendResponse {
  const seen = new Set([...req.entries.map((e) => e.title), ...req.exclude].map(norm));

  // 분위기·매체 선호도: 별점 3을 기준으로 가중치를 준다
  const moodWeight = new Map<string, number>();
  const kindWeight = new Map<Kind, number>();
  for (const e of req.entries) {
    const w = e.rating - 3;
    for (const m of e.moods) moodWeight.set(m, (moodWeight.get(m) ?? 0) + w);
    kindWeight.set(e.kind, (kindWeight.get(e.kind) ?? 0) + Math.max(w, 0.3));
  }

  const scored = CATALOG.filter(
    (c) => !seen.has(norm(c.title)) && (req.kind === "all" || c.kind === req.kind),
  ).map((c) => {
    const hits = c.moods.filter((m) => (moodWeight.get(m) ?? 0) > 0);
    const score =
      c.moods.reduce((s, m) => s + (moodWeight.get(m) ?? 0), 0) +
      (kindWeight.get(c.kind) ?? 0) * 0.5;
    return { c, hits, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 6);
  const max = Math.max(1, ...top.map((t) => t.score));

  const topMoods = [...moodWeight.entries()]
    .filter(([, w]) => w > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([m]) => m);

  const recommendations: Recommendation[] = top.map(({ c, hits, score }) => ({
    title: c.title,
    kind: c.kind,
    creator: c.creator,
    year: c.year,
    reason: hits.length
      ? `${hits.map((h) => `'${h}'`).join(", ")} 분위기를 좋아하는 취향에 맞는 작품. ${c.blurb}.`
      : `${c.blurb}.`,
    match: Math.round(60 + 38 * Math.max(0, score) / max),
  }));

  return {
    summary: topMoods.length
      ? `${topMoods.join(", ")} 작품에 높은 점수를 주는 편이에요.`
      : "기록이 쌓일수록 취향 분석이 정확해져요.",
    recommendations,
    source: "local",
  };
}
