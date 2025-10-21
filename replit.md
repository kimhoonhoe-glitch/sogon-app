# 소곤 SOGON - Replit 프로젝트

## 프로젝트 개요
직장인을 위한 AI 감정 코칭 앱 "소곤 SOGON". 
태그라인: "말해보세요. 당신 편이 조용히 듣고 있어요"
Next.js 14 App Router, TypeScript, Prisma, OpenAI GPT-4o-mini를 사용한 풀스택 애플리케이션.

## 기술 스택
- Frontend: Next.js 14 (App Router), React 19, TypeScript
- Styling: Tailwind CSS, Pretendard Variable font
- Database: Prisma ORM + SQLite
- Auth: NextAuth.js (Email, Google OAuth)
- AI: OpenAI GPT-4o-mini
- Payment: Stripe (Test mode)
- Charts: Chart.js, react-chartjs-2

## 주요 기능
1. AI 감정 대화 (스트리밍 응답)
2. 감정 자동 분류 및 트래킹
3. 직장인 특화 카테고리
4. 위험 키워드 감지
5. 프리미엄 구독 (Stripe)
6. 다크모드 지원

## 환경 변수 필요
- NEXTAUTH_SECRET: 이미 설정됨 (SESSION_SECRET 사용)
- NEXTAUTH_URL: http://localhost:5000
- OPENAI_API_KEY: 필요 (사용자가 제공해야 함)
- GOOGLE_CLIENT_ID: 선택 사항
- GOOGLE_CLIENT_SECRET: 선택 사항
- STRIPE_SECRET_KEY: 선택 사항

## 실행 방법
\`\`\`bash
npm run dev
\`\`\`

## 데이터베이스
SQLite 파일: \`prisma/dev.db\`
Prisma schema: \`prisma/schema.prisma\`

## 최근 변경사항
- 2024-10-21: 앱 이름 "소곤 SOGON"으로 리브랜딩
- 태그라인: "말해보세요. 당신 편이 조용히 듣고 있어요"
- 초기 프로젝트 생성 및 모든 핵심 기능 구현
- 라벤더 컬러 시스템 디자인 적용
- 모바일 반응형 레이아웃 구현
- 중요 보안 수정:
  * Password 필드 추가 및 bcrypt 해싱 구현
  * Stripe 세션 재사용 방지 (stripeSessionId unique constraint)
  * 서버 사이드 익명 모드 결정 (클라이언트 조작 불가)
  * Subscription 레코드 자동 생성 (rate limit 우회 방지)
  * 웹훅 핸들러 upsert 로직 구현

### Dashboard 리디자인 (2024-10-21)
- EmotionSummaryCard: 프로그레스 바로 감정 비율 시각화
- EmotionLineChart: Chart.js로 30일 감정 추이 라인 차트
- AIInsightCard: OpenAI로 주간 패턴 분석 및 인사이트 제공
- EmotionCalendar: 날짜별 감정 이모지 달력
- 반투명 카드 디자인 (backdrop-blur)
- 스크롤 애니메이션 (fadeIn, slideInLeft, slideInRight, slideInUp)
- 감정 색상 통일 (lib/emotions.ts로 분리)
- OPENAI_API_KEY 없을 때 에러 방지 (dummy-key fallback)

### Welcome 화면 추가 (2024-10-21)
- 첫 실행 시 환영 화면 (/welcome)
- 라벤더 → 베이지 그라데이션 배경
- 부드러운 입자 효과 애니메이션
- 3-4-5 호흡법 가이드 (숨 들이쉬기 3초, 참기 4초, 내쉬기 5초)
- 호흡 완료 후 자동으로 /chat 페이지 이동
- localStorage로 첫 실행 여부 추적
