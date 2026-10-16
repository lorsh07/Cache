import { KINDS, kindLabel, type Recommendation, type RecommendRequest } from "./types.js";

// 서버(Claude API)와 아티팩트(sample) 양쪽에서 쓰는 추천 프롬프트
export const SYSTEM = `당신은 'Cache'라는 문화 기록 앱의 큐레이터입니다.
사용자가 남긴 영화·책·드라마·공연·전시·음악 감상 기록(별점, 후기, 분위기 태그)을 읽고, 다음에 즐길 작품을 추천합니다.

원칙:
- 실제로 존재하는 작품만 추천하세요. 제목·창작자·연도는 정확해야 합니다. 확신이 없으면 다른 작품을 고르세요.
- 사용자가 이미 기록한 작품이나 제외 목록에 있는 작품은 추천하지 마세요.
- 별점이 높은 작품과 후기에서 드러난 취향(좋아한 이유, 아쉬웠던 점)을 근거로 삼으세요. 별점이 낮은 작품의 특징은 피하세요.
- 같은 장르만 반복하지 말고, 매체를 넘나드는 추천(예: 좋아한 영화와 결이 닮은 책)도 섞어 주세요.
- 공연·전시는 상시 볼 수 있는 대표작이나 상설 작품 위주로, 특정 기간 일정은 단정하지 마세요.
- reason은 사용자의 기록을 구체적으로 언급하며 한국어 1~2문장, 존댓말 없이 담백한 문체로 쓰세요.
- summary는 사용자의 취향을 한두 문장으로 요약하세요.
- match는 취향 적합도(0~100)입니다.`;

export const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "recommendations"],
  properties: {
    summary: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "kind", "creator", "year", "reason", "match"],
        properties: {
          title: { type: "string" },
          kind: { type: "string", enum: KINDS.map((k) => k.id) },
          creator: { type: "string" },
          year: { type: "string" },
          reason: { type: "string" },
          match: { type: "integer" },
        },
      },
    },
  },
} as const;

export function describe(req: RecommendRequest): string {
  const lines = req.entries.map((e, i) => {
    const moods = e.moods.length ? ` / 분위기: ${e.moods.join(", ")}` : "";
    const review = e.review.trim() ? `\n   후기: ${e.review.trim().slice(0, 600)}` : "";
    return `${i + 1}. [${kindLabel(e.kind)}] ${e.title}${e.creator ? ` — ${e.creator}` : ""} · ★${e.rating}${moods}${review}`;
  });
  const target =
    req.kind === "all" ? "매체 제한 없이 다양하게" : `${kindLabel(req.kind)}만`;
  return [
    `내 감상 기록:\n${lines.join("\n")}`,
    req.exclude.length ? `제외할 작품: ${req.exclude.join(", ")}` : "",
    `${target} 6개를 추천해 줘.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

// 모델 응답을 화면에 쓸 형태로 정리
export function normalize(parsed: unknown, req: RecommendRequest): { summary: string; recommendations: Recommendation[] } {
  const p = parsed as { summary?: unknown; recommendations?: unknown };
  const kinds = new Set<string>(KINDS.map((k) => k.id));
  const list = Array.isArray(p?.recommendations) ? (p.recommendations as Partial<Recommendation>[]) : [];
  return {
    summary: typeof p?.summary === "string" ? p.summary : "",
    recommendations: list
      .filter((r): r is Recommendation => typeof r?.title === "string" && typeof r.kind === "string" && kinds.has(r.kind))
      .filter((r) => req.kind === "all" || r.kind === req.kind)
      .map((r) => ({
        title: r.title,
        kind: r.kind,
        creator: String(r.creator ?? ""),
        year: String(r.year ?? ""),
        reason: String(r.reason ?? ""),
        match: Math.max(0, Math.min(100, Math.round(Number(r.match) || 0))),
      })),
  };
}
