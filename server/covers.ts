import type { Kind } from "../shared/types.js";

// 제목으로 표지 이미지를 찾는다. 매체별로 여러 출처를 순서대로 시도하고, 결과는 메모리에 캐시한다.
type Query = { kind: Kind; title: string; creator: string };
type Provider = (q: Query) => Promise<string | null>;

const TMDB = process.env.TMDB_API_KEY ?? "";
const KAKAO = process.env.KAKAO_REST_API_KEY ?? "";
const GOOGLE_BOOKS = process.env.GOOGLE_BOOKS_API_KEY ?? "";

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Cache/1.0 (culture log app)", ...headers },
      signal: AbortSignal.timeout(6000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[\s\p{P}]+/gu, "");

// 제목이 정확히 같은 결과를 먼저, 없으면 첫 결과를 고른다
function pick<T>(items: T[], title: (t: T) => string | undefined, want: string): T | undefined {
  const w = norm(want);
  return items.find((i) => norm(title(i) ?? "") === w) ?? items[0];
}

const tmdb =
  (type: "movie" | "tv"): Provider =>
  async ({ title }) => {
    if (!TMDB) return null;
    // v4 읽기 토큰(eyJ...)이면 Bearer, 아니면 v3 api_key
    const bearer = TMDB.startsWith("eyJ");
    const params = new URLSearchParams({ query: title, language: "ko-KR", include_adult: "false" });
    if (!bearer) params.set("api_key", TMDB);
    const data = await getJson<{ results: { title?: string; name?: string; original_title?: string; original_name?: string; poster_path: string | null }[] }>(
      `https://api.themoviedb.org/3/search/${type}?${params}`,
      bearer ? { Authorization: `Bearer ${TMDB}` } : {},
    );
    const hits = (data?.results ?? []).filter((r) => r.poster_path);
    const hit = pick(hits, (r) => r.title ?? r.name, title);
    return hit ? `https://image.tmdb.org/t/p/w500${hit.poster_path}` : null;
  };

const itunes =
  (entity: "movie" | "tvSeason" | "album"): Provider =>
  async ({ title, creator }) => {
    const term = entity === "album" && creator ? `${title} ${creator}` : title;
    const params = new URLSearchParams({ term, entity, limit: "5", country: "KR" });
    const data = await getJson<{ results: { trackName?: string; collectionName?: string; artworkUrl100?: string }[] }>(
      `https://itunes.apple.com/search?${params}`,
    );
    const hits = (data?.results ?? []).filter((r) => r.artworkUrl100);
    const hit = pick(hits, (r) => r.trackName ?? r.collectionName, title);
    return hit?.artworkUrl100?.replace("100x100bb", "600x600bb") ?? null;
  };

type DeezerAlbum = { title: string; cover_xl?: string; cover_big?: string };
const deezerSearch = async (q: string) =>
  (await getJson<{ data: DeezerAlbum[] }>(`https://api.deezer.com/search/album?${new URLSearchParams({ q, limit: "10" })}`))?.data ?? [];

const deezer: Provider = async ({ title, creator }) => {
  // 아티스트 이름이 한글/영문으로 다를 수 있어(아이유/IU), 못 찾으면 제목만으로 다시 찾되 제목이 정확히 같은 것만 쓴다
  let hit = creator ? pick(await deezerSearch(`album:"${title}" artist:"${creator}"`), (r) => r.title, title) : undefined;
  if (!hit) hit = (await deezerSearch(`album:"${title}"`)).find((r) => norm(r.title) === norm(title));
  return hit?.cover_xl ?? hit?.cover_big ?? null;
};

const kakaoBook: Provider = async ({ title, creator }) => {
  if (!KAKAO) return null;
  const data = await getJson<{ documents: { title: string; authors: string[]; thumbnail: string }[] }>(
    `https://dapi.kakao.com/v3/search/book?${new URLSearchParams({ query: title, target: "title", size: "10" })}`,
    { Authorization: `KakaoAK ${KAKAO}` },
  );
  const docs = (data?.documents ?? []).filter((d) => d.thumbnail);
  const byAuthor = creator ? docs.filter((d) => d.authors.some((a) => norm(creator).includes(norm(a)) || norm(a).includes(norm(creator)))) : [];
  const hit = pick(byAuthor.length ? byAuthor : docs, (d) => d.title, title);
  // 카카오 썸네일은 작은 크기라 원본 이미지 주소가 있으면 그쪽을 쓴다
  if (!hit) return null;
  const original = new URL(hit.thumbnail).searchParams.get("fname");
  return original ? decodeURIComponent(original) : hit.thumbnail;
};

const googleBooks: Provider = async ({ title, creator }) => {
  const q = `intitle:${title}${creator ? ` inauthor:${creator}` : ""}`;
  const params = new URLSearchParams({ q, maxResults: "5" });
  if (GOOGLE_BOOKS) params.set("key", GOOGLE_BOOKS);
  const data = await getJson<{ items?: { volumeInfo: { title: string; imageLinks?: { thumbnail?: string } } }[] }>(
    `https://www.googleapis.com/books/v1/volumes?${params}`,
  );
  const hits = (data?.items ?? []).filter((i) => i.volumeInfo.imageLinks?.thumbnail);
  const hit = pick(hits, (i) => i.volumeInfo.title, title);
  return hit?.volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://").replace("&edge=curl", "").replace("zoom=1", "zoom=2") ?? null;
};

const openLibrary: Provider = async ({ title, creator }) => {
  const params = new URLSearchParams({ title, limit: "5", fields: "title,cover_i" });
  if (creator) params.set("author", creator);
  const data = await getJson<{ docs: { title: string; cover_i?: number }[] }>(`https://openlibrary.org/search.json?${params}`);
  const hit = pick((data?.docs ?? []).filter((d) => d.cover_i), (d) => d.title, title);
  return hit ? `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg` : null;
};

const PROVIDERS: Record<Kind, Provider[]> = {
  movie: [tmdb("movie"), itunes("movie")],
  series: [tmdb("tv"), itunes("tvSeason")],
  book: [kakaoBook, googleBooks, openLibrary],
  music: [deezer, itunes("album")],
  show: [],
  exhibit: [],
};

const cache = new Map<string, Promise<string | null>>();

export function findCover(q: Query): Promise<string | null> {
  const key = `${q.kind}|${norm(q.title)}|${norm(q.creator)}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = (async () => {
      for (const provider of PROVIDERS[q.kind]) {
        const url = await provider(q);
        if (url) return url;
      }
      return null;
    })();
    cache.set(key, hit);
    if (cache.size > 2000) cache.delete(cache.keys().next().value!);
  }
  return hit;
}
