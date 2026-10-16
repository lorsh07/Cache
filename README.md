# Cache

영화·책·드라마·공연·전시·음악을 기록하고 후기를 남기면, AI가 다음에 즐길 작품을 추천해 주는 앱.
애플 스타일의 무채색 디자인(라이트/다크 모드 자동 전환)으로 만들었습니다.

## 기능

- **오늘**: 기록 통계, 최근 기록 선반, 매체별 문화 지도
- **기록**: 검색 · 매체 필터 · 최신순/별점순 정렬, 기록 상세/편집/삭제
- **발견**: 별점·후기·분위기 태그를 바탕으로 Claude가 6개 작품을 추천하고 취향을 요약
  - 보관 / 봤어요(바로 기록 작성) / 관심 없음(다음 추천에서 제외)
- **보관함**: 보관한 추천 모아보기

기록은 브라우저(localStorage)에 저장됩니다.

## 실행

```bash
npm install --include=dev
cp .env.example .env   # ANTHROPIC_API_KEY 입력 (선택)
export $(cat .env | xargs)
npm run dev            # http://localhost:5173
```

배포용: `npm run build && npm start` (서버가 `dist`를 함께 서빙)

`ANTHROPIC_API_KEY`가 없거나 API 호출이 실패하면 내장 카탈로그(`server/catalog.ts`) 기반 추천으로 자동 전환되고,
화면에 "오프라인"으로 표시됩니다.

## claude.ai 아티팩트로 열기

`npm run build:artifact`는 앱을 단일 파일 `dist/artifact.html`로 묶습니다.
아티팩트에서는 서버 없이 동작합니다: 추천은 보는 사람의 Claude 계정으로(`sample`),
기록은 계정별 저장소(`db`)에 보관됩니다.

## 구조

```
server/      Express API (/api/recommend) · Claude API 호출
shared/      공용 타입 · 추천 프롬프트 · 내장 카탈로그와 오프라인 추천
scripts/     아티팩트용 단일 파일 빌드
src/         React 앱 (views/, components/, styles.css)
```
