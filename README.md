# Cache

웹서핑이나 인스타그램에서 저장해둔 링크·스크린샷·사진을 한곳에 모아 색상으로 분류하고, 빠르게 다시 찾을 수 있도록 도와주는 앱입니다. 애플 스타일의 미니멀한 디자인(반투명 블러 네비게이션, 라운드 카드, 시스템 다크 모드 대응)을 따릅니다.

## 주요 기능

- **한눈에 모아보기**: 저장한 링크/스크린샷/사진을 카드 그리드로 모아서 확인
- **색상 카테고리 분류**: 기본 카테고리(🔴 빨강 / 🟡 노랑 / 🔵 파랑) 제공, `+ 새 카테고리`로 이름과 색상을 직접 지정 가능한 컬러 피커 지원
- **스크린샷 갤러리**: 이미지 형태로 저장한 항목만 모아 매서너리(masonry) 그리드로 보여주는 갤러리 탭 (특히 스크린샷 정리에 최적화)
- **검색 & 필터**: 제목/메모/도메인 검색, 카테고리 칩으로 빠른 필터링
- **로컬 저장**: 브라우저 `localStorage`에 데이터를 저장해 새로고침해도 유지

## 기술 스택

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- lucide-react 아이콘

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

### 기타 스크립트

```bash
npm run build    # 타입체크 + 프로덕션 빌드
npm run lint     # oxlint 실행
npm run preview  # 빌드 결과 미리보기
```

## 폴더 구조

```
src/
  components/   화면 구성 요소 (카드, 갤러리, 모달, 컬러 피커 등)
  data/         기본 카테고리, 프리셋 색상, 데모 시드 데이터
  hooks/        localStorage 연동, 외부 클릭 감지 훅
  store/        전역 상태(Context) — 항목/카테고리 CRUD
  utils/        날짜 포맷, URL 도메인 추출 등 유틸
  types.ts      Item / Category 타입 정의
```
