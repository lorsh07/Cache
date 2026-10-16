export type Kind = "movie" | "book" | "series" | "show" | "exhibit" | "music";

export const KINDS: { id: Kind; label: string }[] = [
  { id: "movie", label: "영화" },
  { id: "book", label: "책" },
  { id: "series", label: "드라마" },
  { id: "show", label: "공연" },
  { id: "exhibit", label: "전시" },
  { id: "music", label: "음악" },
];

export const kindLabel = (k: Kind) => KINDS.find((x) => x.id === k)?.label ?? k;

export const MOODS = [
  "잔잔한", "여운이 긴", "몰입감", "유쾌한", "따뜻한", "어두운",
  "철학적인", "긴장감", "아름다운", "실험적인", "현실적인", "위로가 되는",
] as const;

export interface Entry {
  id: string;
  kind: Kind;
  title: string;
  creator: string;
  date: string; // YYYY-MM-DD, 감상한 날
  rating: number; // 0.5 ~ 5
  review: string;
  moods: string[];
  createdAt: number;
}

export interface Recommendation {
  title: string;
  kind: Kind;
  creator: string;
  year: string;
  reason: string;
  match: number; // 0 ~ 100
}

export interface RecommendRequest {
  entries: Pick<Entry, "kind" | "title" | "creator" | "rating" | "review" | "moods">[];
  kind: Kind | "all";
  exclude: string[];
}

export interface RecommendResponse {
  summary: string;
  recommendations: Recommendation[];
  source: "ai" | "local";
}
