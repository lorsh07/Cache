import Anthropic from "@anthropic-ai/sdk";
import { localRecommend } from "../shared/localRecommend.js";
import { SCHEMA, SYSTEM, describe, normalize } from "../shared/prompt.js";
import type { RecommendRequest, RecommendResponse } from "../shared/types.js";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

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
  return { ...normalize(JSON.parse(text), req), source: "ai" };
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
