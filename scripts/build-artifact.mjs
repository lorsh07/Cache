// dist/index.html을 claude.ai 아티팩트로 올릴 수 있는 단일 파일(dist/artifact.html)로 묶는다.
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const read = (href) => fs.readFileSync(path.join(dist, href.replace(/^\//, "")), "utf8");

const css = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+)"[^>]*>/g)].map((m) => read(m[1]));
const js = [...html.matchAll(/<script type="module"[^>]*src="(\/assets\/[^"]+)"[^>]*><\/script>/g)].map((m) => read(m[1]));

const head = html.match(/<head>([\s\S]*)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/, "")
  .replace(/<meta name="viewport"[^>]*>\s*/, "")
  .replace(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]+"[^>]*>\s*/g, "")
  .replace(/<script type="module"[^>]*><\/script>\s*/g, "");
const titleMatch = head.match(/<title>.*?<\/title>/);
const rest = head.replace(titleMatch[0], "").trim();

const out = [
  titleMatch[0],
  rest,
  `<style>${css.join("\n")}</style>`,
  `<div id="root"></div>`,
  ...js.map((code) => `<script type="module">${code.replace(/<\/script/gi, "<\\/script")}</script>`),
].join("\n");

fs.writeFileSync(path.join(dist, "artifact.html"), out + "\n");
console.log(`dist/artifact.html ${(out.length / 1024).toFixed(1)} KiB`);
