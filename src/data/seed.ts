import type { SavedItem } from "../types";
import { placeholderImage } from "./placeholderImage";

const day = 24 * 60 * 60 * 1000;
const now = Date.now();

export const SEED_ITEMS: SavedItem[] = [
  {
    id: "seed-1",
    type: "link",
    title: "미니멀 인테리어 아이디어 모음",
    note: "거실 조명 참고용",
    url: "https://www.pinterest.com/ideas/minimal-interior",
    domain: "pinterest.com",
    categoryId: "cat-yellow",
    createdAt: now - 1 * day,
  },
  {
    id: "seed-2",
    type: "screenshot",
    title: "카페 위치 캡처",
    note: "주말에 가볼 곳",
    imageDataUrl: placeholderImage(2, "카페 지도"),
    categoryId: "cat-blue",
    createdAt: now - 2 * day,
  },
  {
    id: "seed-3",
    type: "link",
    title: "React 19 새 기능 정리",
    url: "https://react.dev/blog",
    domain: "react.dev",
    categoryId: "cat-red",
    createdAt: now - 3 * day,
  },
  {
    id: "seed-4",
    type: "photo",
    title: "인스타 감성 사진",
    note: "무드보드용",
    imageDataUrl: placeholderImage(4, "인스타 사진"),
    categoryId: "cat-yellow",
    createdAt: now - 4 * day,
  },
  {
    id: "seed-5",
    type: "screenshot",
    title: "쇼핑몰 세일 캡처",
    imageDataUrl: placeholderImage(5, "세일 정보"),
    categoryId: "cat-red",
    createdAt: now - 5 * day,
  },
  {
    id: "seed-6",
    type: "link",
    title: "여행 일정 짤 때 참고할 블로그",
    url: "https://blog.naver.com/travel-guide",
    domain: "blog.naver.com",
    categoryId: "cat-blue",
    createdAt: now - 6 * day,
  },
];
