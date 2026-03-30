<img src="public/banner.png" alt="Tripick Banner" width="100%" />

# Tripick 🌿
**테마 기반 국내 여행지 큐레이션 서비스**
> 힐링, 맛집, 야경 등 원하는 여행 테마를 선택하면 딱 맞는 여행지를 추천해드려요.
<br />

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / DB | Supabase (Auth, Database) |
| AI | Google Generative AI (Gemini) |
| Map | Kakao Maps API |
| Deploy | Vercel |

<br />

## 주요 기능

### 🗺 여행지 탐색
- 테마 카드(힐링, 액티비티, 감성 카페, 맛집, 야경 등)로 여행 스타일 선택
- 지역·태그·정렬 기준(평점순, 리뷰 많은 순)으로 여행지 필터링
- 여행지 상세 페이지에서 카카오맵 위치 확인 및 리뷰 조회

### ❤️ 위시리스트
- 마음에 드는 여행지를 즐겨찾기에 추가/제거
- 마이페이지에서 내 위시리스트 한눈에 확인

### 🗓 여행 플래너
- 나만의 플랜 생성·수정·삭제
- 플랜에 여행지 추가/제거
- 선택한 장소들을 카카오맵으로 한 번에 확인

### 🤖 AI 여행 추천 채팅
- 사이드바 플로팅 버튼으로 언제든 AI에게 질문
- 여행지·숙소·꿀팁 등 자유롭게 추천 요청
- 여행지 상세에서 장소에 맞는 맞춤 질문 자동 제안

### 👤 회원 기능
- 이메일/비밀번호 회원가입 및 로그인
- 닉네임 변경
- 비밀번호 재설정 메일 발송
- 회원 탈퇴

<br />

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/           # 로그인·회원가입 페이지
│   ├── auth/             # Supabase 콜백, 회원탈퇴 API
│   └── api/              # API 
│   └── main/
│       ├── page.tsx      # 홈 (테마 선택)
│       ├── subpage/      # 여행지 목록·필터
│       ├── detail/       # 여행지 상세 + 카카오맵
│       ├── favorites/    # 위시리스트
│       ├── planner/      # 여행 플래너
│       └── mypage/       # 마이페이지
├── components/
│   ├── auth/             # MainAuthGate, 로그인/회원가입 폼
│   ├── layout/           # Sidebar, Header
│   ├── ai/               # AI 채팅 모달
│   ├── home/             # 테마 카드 그리드
│   ├── subpage/          # 여행지 목록 컴포넌트
│   └── detail_review/    # 리뷰 컴포넌트
└── lib/
    ├── supabase/         # Supabase 클라이언트 (server/client 분리)
    └── api/              # API 라우트
```

<br />

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 값을 채워주세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인할 수 있어요.

```bash
# 빌드
npm run build
```

<br />

## 팀원

| 이름 | 역할 |
|------|------|
| 정연수 | 서브 페이지 (태그 검색 결과, 상세 페이지 이동) / 마이페이지 (내가 작성한 리뷰) / 데이터베이스 설계 (ERD) |
| 김락현 | 여행 플래너 (DB 연동, 회원별) / 상세 페이지 (장소 이미지 및 설명(Naver, Unsplash API)) |
| 김현승 | AI 추천 (Gemini API) / 상세 페이지 (지도, 리뷰 작성·삭제) (Kakao Map API) |
| 송민혁 | 메인 페이지 (태그 선택, 검색, 즐겨찾기) / 메인페이지 서브페이지 연동 / 전반적인 UI구현 |
| 정민혁 | 회원가입, 로그인, 로그아웃 (Supabase, Google, Kakao) / 마이페이지 UI 및 기능 구현 / Vercel 배포 |
