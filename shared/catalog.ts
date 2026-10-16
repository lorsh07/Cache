import type { Kind } from "./types.js";

// API 키가 없을 때 쓰는 내장 추천 카탈로그
export interface CatalogItem {
  title: string;
  kind: Kind;
  creator: string;
  year: string;
  moods: string[];
  blurb: string;
}

export const CATALOG: CatalogItem[] = [
  { kind: "movie", title: "애프터썬", creator: "샬롯 웰스", year: "2022", moods: ["잔잔한", "여운이 긴", "아름다운"], blurb: "흐릿한 홈비디오 속 아버지와의 여름을 되짚는 기억의 영화" },
  { kind: "movie", title: "패터슨", creator: "짐 자무쉬", year: "2016", moods: ["잔잔한", "따뜻한", "위로가 되는"], blurb: "버스 운전사이자 시인의 반복되는 일주일, 일상의 시학" },
  { kind: "movie", title: "기생충", creator: "봉준호", year: "2019", moods: ["긴장감", "어두운", "몰입감"], blurb: "두 가족의 계급 우화가 장르를 넘나들며 폭발한다" },
  { kind: "movie", title: "퍼펙트 데이즈", creator: "빔 벤더스", year: "2023", moods: ["잔잔한", "위로가 되는", "아름다운"], blurb: "도쿄 공중화장실 청소부의 단정하고 충만한 하루하루" },
  { kind: "movie", title: "에브리씽 에브리웨어 올 앳 원스", creator: "다니엘스", year: "2022", moods: ["실험적인", "유쾌한", "따뜻한"], blurb: "멀티버스를 가로지르는 혼돈 끝에 도착하는 가족의 이야기" },
  { kind: "movie", title: "헤어질 결심", creator: "박찬욱", year: "2022", moods: ["여운이 긴", "아름다운", "긴장감"], blurb: "형사와 피의자 사이, 붕괴되는 마음에 관한 정교한 멜로" },
  { kind: "movie", title: "인터스텔라", creator: "크리스토퍼 놀란", year: "2014", moods: ["몰입감", "철학적인", "여운이 긴"], blurb: "시간과 중력, 그리고 사랑이 우주를 건너는 방식" },
  { kind: "movie", title: "리틀 포레스트", creator: "임순례", year: "2018", moods: ["따뜻한", "잔잔한", "위로가 되는"], blurb: "고향으로 돌아와 사계절을 요리하며 보내는 쉼표 같은 시간" },
  { kind: "book", title: "소년이 온다", creator: "한강", year: "2014", moods: ["어두운", "여운이 긴", "현실적인"], blurb: "1980년 5월 광주, 살아남은 이들과 죽은 이들의 목소리" },
  { kind: "book", title: "아무튼, 메모", creator: "정혜윤", year: "2020", moods: ["잔잔한", "따뜻한"], blurb: "적는 일이 삶을 어떻게 붙잡아 주는지에 관한 산문" },
  { kind: "book", title: "클라라와 태양", creator: "가즈오 이시구로", year: "2021", moods: ["잔잔한", "철학적인", "여운이 긴"], blurb: "인공지능 친구의 눈으로 본 사랑과 헌신의 의미" },
  { kind: "book", title: "프로젝트 헤일메리", creator: "앤디 위어", year: "2021", moods: ["몰입감", "유쾌한", "긴장감"], blurb: "기억을 잃고 우주선에서 깨어난 과학 교사의 생존기" },
  { kind: "book", title: "불편한 편의점", creator: "김호연", year: "2021", moods: ["따뜻한", "위로가 되는", "유쾌한"], blurb: "서울역 노숙인이 편의점 야간 알바가 되며 생기는 일들" },
  { kind: "book", title: "사피엔스", creator: "유발 하라리", year: "2011", moods: ["철학적인", "몰입감"], blurb: "인류는 어떻게 지구의 지배자가 되었는가에 대한 거시사" },
  { kind: "book", title: "스토너", creator: "존 윌리엄스", year: "1965", moods: ["잔잔한", "여운이 긴", "현실적인"], blurb: "평범한 영문학 교수의 생애가 남기는 조용한 울림" },
  { kind: "book", title: "작별하지 않는다", creator: "한강", year: "2021", moods: ["어두운", "아름다운", "여운이 긴"], blurb: "제주 4·3을 눈과 꿈의 언어로 통과하는 소설" },
  { kind: "series", title: "나의 아저씨", creator: "김원석 · 박해영", year: "2018", moods: ["위로가 되는", "현실적인", "여운이 긴"], blurb: "삶의 무게를 견디는 사람들이 서로를 알아보는 이야기" },
  { kind: "series", title: "세브란스: 단절", creator: "댄 에릭슨", year: "2022", moods: ["긴장감", "실험적인", "몰입감"], blurb: "회사 안과 밖의 기억을 분리당한 직원들의 미스터리" },
  { kind: "series", title: "더 베어", creator: "크리스토퍼 스토러", year: "2022", moods: ["긴장감", "현실적인", "몰입감"], blurb: "형의 샌드위치 가게를 물려받은 셰프의 숨 가쁜 주방" },
  { kind: "series", title: "우리들의 블루스", creator: "노희경", year: "2022", moods: ["따뜻한", "현실적인", "위로가 되는"], blurb: "제주 바닷가 사람들의 옴니버스 인생 이야기" },
  { kind: "series", title: "플리백", creator: "피비 월러브리지", year: "2016", moods: ["유쾌한", "여운이 긴", "실험적인"], blurb: "카메라를 향해 말을 거는 여자의 웃기고 아픈 고백" },
  { kind: "show", title: "레미제라블", creator: "클로드미셸 쇤베르크", year: "1985", moods: ["몰입감", "아름다운", "여운이 긴"], blurb: "장발장의 생애를 장대한 넘버로 그리는 뮤지컬" },
  { kind: "show", title: "어쩌면 해피엔딩", creator: "윌 애런슨 · 박천휴", year: "2016", moods: ["따뜻한", "잔잔한", "여운이 긴"], blurb: "버려진 헬퍼봇 둘이 사랑을 배워가는 창작 뮤지컬" },
  { kind: "show", title: "햄릿", creator: "윌리엄 셰익스피어", year: "1600", moods: ["철학적인", "어두운", "긴장감"], blurb: "복수와 망설임, 존재에 관한 가장 유명한 질문" },
  { kind: "show", title: "지킬 앤 하이드", creator: "프랭크 와일드혼", year: "1997", moods: ["긴장감", "어두운", "몰입감"], blurb: "선과 악으로 갈라진 한 인간의 비극" },
  { kind: "exhibit", title: "마크 로스코 회고전", creator: "마크 로스코", year: "—", moods: ["잔잔한", "철학적인", "아름다운"], blurb: "색면 앞에 오래 머무르게 만드는 명상의 회화" },
  { kind: "exhibit", title: "제임스 터렐 상설전 (뮤지엄 산)", creator: "제임스 터렐", year: "—", moods: ["실험적인", "아름다운", "잔잔한"], blurb: "빛 자체를 재료로 공간을 체험하게 하는 작업" },
  { kind: "exhibit", title: "데이비드 호크니 전", creator: "데이비드 호크니", year: "—", moods: ["유쾌한", "아름다운", "따뜻한"], blurb: "수영장과 풍경, 밝고 대담한 색의 세계" },
  { kind: "exhibit", title: "이우환 전", creator: "이우환", year: "—", moods: ["잔잔한", "철학적인"], blurb: "점과 선, 돌과 철판 사이의 여백과 관계" },
  { kind: "music", title: "Blonde", creator: "Frank Ocean", year: "2016", moods: ["잔잔한", "여운이 긴", "실험적인"], blurb: "몽롱하고 내밀한 감정의 R&B 앨범" },
  { kind: "music", title: "Kind of Blue", creator: "Miles Davis", year: "1959", moods: ["잔잔한", "아름다운"], blurb: "모달 재즈의 교과서, 밤에 듣기 좋은 고전" },
  { kind: "music", title: "Punisher", creator: "Phoebe Bridgers", year: "2020", moods: ["어두운", "여운이 긴", "위로가 되는"], blurb: "속삭이듯 담담하게 상처를 노래하는 인디 포크" },
  { kind: "music", title: "In Rainbows", creator: "Radiohead", year: "2007", moods: ["몰입감", "아름다운", "실험적인"], blurb: "따뜻함과 불안이 공존하는 라디오헤드의 정점" },
  { kind: "music", title: "Love poem", creator: "아이유", year: "2019", moods: ["따뜻한", "위로가 되는"], blurb: "누군가의 하루를 응원하는 다정한 노래들" },
];
