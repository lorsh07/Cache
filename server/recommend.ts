import Anthropic from "@anthropic-ai/sdk";
import { CATALOG } from "./catalog.js";
import {
  KINDS,
  kindLabel,
  type Kind,
  type Recommendation,
  type RecommendRequest,
  type RecommendResponse,
} from "../shared/types.js";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

const SYSTEM = `당신은 'Cache'라는 문화 기록 앱의 큐레이터입니다.
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

const SCHEMA = {
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

function describe(req: RecommendRequest): string {
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

async function aiRecommend(req: RecommendRequest): Promise<RecommendResponse> {
  const response = await client!.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: SCHEMA },
    },
    system: SYSTEM,
    messages: [{ role: "user", content: describe(req) }],
  });

  if (response.stop_reason === "refusal") throw new Error("refusal");
  const text = response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("");
  const parsed = JSON.parse(text) as Omit<RecommendResponse, "source">;
  const wanted = req.kind;
  return {
    summary: parsed.summary,
    recommendations: parsed.recommendations
      .filter((r) => wanted === "all" || r.kind === wanted)
      .map((r) => ({ ...r, match: Math.max(0, Math.min(100, Math.round(r.match))) })),
    source: "ai",
  };
}

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

export async function recommend(req: RecommendRequest): Promise<RecommendResponse> {
  if (!client) return localRecommend(req);
  try {
    return await aiRecommend(req);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`[recommend] Claude API ${err.status}: ${err.message}`);
    } else {
      console.error("[recommend]", err);
    }
    return localRecommend(req);
  }
}
