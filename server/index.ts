import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { recommend } from "./recommend.js";
import { KINDS, type RecommendRequest } from "../shared/types.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

const kindIds = new Set<string>(KINDS.map((k) => k.id));

app.get("/api/status", (_req, res) => {
  res.json({ ai: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.post("/api/recommend", async (req, res) => {
  const body = req.body as Partial<RecommendRequest>;
  const entries = Array.isArray(body.entries) ? body.entries.slice(-80) : [];
  if (!entries.length) {
    res.status(400).json({ error: "감상 기록이 필요해요." });
    return;
  }
  const kind = body.kind && (body.kind === "all" || kindIds.has(body.kind)) ? body.kind : "all";
  const exclude = Array.isArray(body.exclude) ? body.exclude.slice(0, 100).map(String) : [];
  res.json(await recommend({ entries, kind, exclude }));
});

// 빌드 결과물이 있으면 함께 서빙 (npm run build 후 npm start)
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
if (fs.existsSync(path.join(dist, "index.html"))) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  console.log(`Cache server → http://localhost:${port} (AI ${process.env.ANTHROPIC_API_KEY ? "on" : "off"})`);
});
