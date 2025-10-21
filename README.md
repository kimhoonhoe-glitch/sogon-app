# 마음지기 (MindKeeper) 💙

직장인을 위한 AI 감정 코칭 앱

> "영업으로 상처받았던 제가 만든 앱입니다.  
> 당신도 혼자 힘들어하지 마세요.  
> AI가 먼저 들어드릴게요."

## 주요 기능

### 🤖 AI 감정 대화
- OpenAI GPT-4o-mini 기반 공감형 AI 상담
- 실시간 스트리밍 응답
- 감정 자동 분류 (기쁨/슬픔/화/불안/스트레스)
- 위험 키워드 감지 및 자살예방 상담 안내

### 👔 직장인 특화
- 상사 스트레스, 업무 압박, 영업 거절 등 카테고리별 대화
- 직장 맥락을 이해하는 AI 프롬프트
- "오늘 직장에서 어떤 일이 있었나요?" 질문으로 시작

### 📊 감정 트래커
- Chart.js 기반 주간/월간 감정 차트
- 감정별 색상 시각화
- AI 패턴 인사이트 제공

### 🔐 사용자 인증
- NextAuth.js 기반 인증
- 이메일 + 구글 로그인
- 익명 체험 모드

### 💎 프리미엄 구독
- Stripe 결제 (테스트 모드)
- 무료: 하루 3회 대화
- 프리미엄 (월 5,000원): 무제한 대화 + PDF 리포트

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma + SQLite
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4o-mini
- **Payment**: Stripe
- **Charts**: Chart.js, react-chartjs-2
- **Fonts**: Pretendard Variable (한글), Inter (영문)

## 디자인 시스템

### 컬러 팔레트
- Primary: `#B4A7D6` (부드러운 라벤더)
- Secondary: `#F5E6D3` (따뜻한 베이지)
- Accent: `#A8E6CF` (민트 그린)
- Background: `#FFFEF7` (크림 화이트)
- Text: `#2D3436` (부드러운 검정)

### 특징
- 둥근 모서리 (rounded-2xl)
- 부드러운 그림자 효과
- 부드러운 애니메이션 (transition-all duration-500)
- 모바일 우선 반응형 디자인
- 다크모드 지원

## 설치 및 실행

### 1. 패키지 설치
\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정
\`.env.example\` 파일을 참고하여 다음 환경 변수를 설정하세요:

**필수:**
- \`NEXTAUTH_SECRET\`: NextAuth 암호화 키
- \`NEXTAUTH_URL\`: 앱 URL (개발: http://localhost:5000)
- \`OPENAI_API_KEY\`: OpenAI API 키

**선택 (기능 제한):**
- \`GOOGLE_CLIENT_ID\`: 구글 OAuth 클라이언트 ID
- \`GOOGLE_CLIENT_SECRET\`: 구글 OAuth 클라이언트 시크릿
- \`STRIPE_SECRET_KEY\`: Stripe 시크릿 키 (테스트 모드)

### 3. 데이터베이스 초기화
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

앱이 http://localhost:5000 에서 실행됩니다.

## API 키 발급 가이드

### OpenAI API 키
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. API Keys 메뉴에서 새 키 생성
3. 생성된 키를 \`OPENAI_API_KEY\`에 설정

### Google OAuth (선택)
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 및 OAuth 동의 화면 설정
3. 사용자 인증 정보 > OAuth 2.0 클라이언트 ID 생성
4. 승인된 리디렉션 URI: \`http://localhost:5000/api/auth/callback/google\`
5. 클라이언트 ID와 시크릿을 환경 변수에 설정

### Stripe (선택)
1. [Stripe Dashboard](https://dashboard.stripe.com/) 접속
2. 개발자 > API 키에서 테스트 모드 시크릿 키 복사
3. \`STRIPE_SECRET_KEY\`에 설정

## 배포 (Vercel)

### 1. Vercel에 배포
\`\`\`bash
npm run build
\`\`\`

### 2. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- \`NEXTAUTH_SECRET\`
- \`NEXTAUTH_URL\` (배포된 URL로 변경)
- \`OPENAI_API_KEY\`
- 기타 선택 사항

### 3. 데이터베이스
프로덕션 환경에서는 SQLite 대신 PostgreSQL 사용 권장:
\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

## 프로젝트 구조

\`\`\`
mindkeeper/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth API
│   │   ├── chat/                 # AI 대화 API
│   │   ├── emotions/             # 감정 데이터 API
│   │   └── subscription/         # 구독 관리 API
│   ├── chat/                     # 대화 페이지
│   ├── dashboard/                # 감정 대시보드
│   ├── premium/                  # 프리미엄 구독
│   ├── profile/                  # 사용자 프로필
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 랜딩 페이지
│   └── globals.css               # 글로벌 스타일
├── components/
│   ├── BreathingGuide.tsx        # 호흡 가이드 애니메이션
│   ├── CrisisAlert.tsx           # 위기 상황 알림
│   ├── LoadingMessage.tsx        # 로딩 메시지
│   ├── ThemeToggle.tsx           # 다크모드 토글
│   └── SessionProvider.tsx       # 세션 프로바이더
├── lib/
│   ├── auth.ts                   # NextAuth 설정
│   ├── openai.ts                 # OpenAI 유틸리티
│   ├── prisma.ts                 # Prisma 클라이언트
│   └── stripe.ts                 # Stripe 설정
├── prisma/
│   └── schema.prisma             # 데이터베이스 스키마
└── public/                       # 정적 파일
\`\`\`

## 데이터베이스 스키마

- **User**: 사용자 정보
- **Account**: OAuth 계정 정보
- **Session**: 세션 관리
- **Conversation**: 대화 내역
- **EmotionLog**: 감정 로그
- **Subscription**: 구독 정보

## 보안 기능

### 인증 보안
- bcrypt 기반 패스워드 해싱
- NextAuth.js JWT 세션 관리
- OAuth 2.0 통합 (Google)

### 결제 보안
- Stripe Checkout 세션 검증 (payment_status, status, metadata)
- 세션 ID 재사용 방지 (unique constraint)
- 웹훅 서명 검증 (HMAC SHA-256)
- 서버 사이드 구독 상태 확인

### API 보안
- 서버 측 익명 모드 결정 (클라이언트 조작 불가)
- 자동 구독 레코드 생성 (rate limit 우회 방지)
- 인증된 사용자 요청 검증

## 특별 기능

### 3초 호흡 가이드
첫 진입 시 3초간 호흡 가이드 애니메이션 제공

### 타이핑 효과
AI 응답이 실시간으로 스트리밍되어 자연스러운 대화 경험 제공

### 위험 키워드 감지
"죽고 싶어", "자살" 등의 키워드 감지 시 자동으로 자살예방 상담 번호 표시

### 다크모드
시스템 설정 감지 및 수동 토글 지원

## 면책 조항

⚠️ **중요**: 마음지기는 의료 서비스가 아닙니다.

- 이 앱은 감정적 지원을 제공하지만 전문적인 의료 상담을 대체할 수 없습니다.
- 심각한 정신 건강 문제가 있는 경우 반드시 전문가와 상담하세요.
- 응급 상황 시: 자살예방 상담전화 ☎️ 1393 또는 정신건강 위기상담 ☎️ 1577-0199

## 라이선스

MIT License

## 개발자

직장인의 마음을 이해하는 개발자가 만들었습니다.

---

**당신의 감정을 먼저 들어드릴게요 💙**
