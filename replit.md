# 마음지기 (MindKeeper) - Replit 프로젝트

## 프로젝트 개요
직장인을 위한 AI 감정 코칭 앱. Next.js 14 App Router, TypeScript, Prisma, OpenAI GPT-4o-mini를 사용한 풀스택 애플리케이션.

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
- 2024-10-21: 초기 프로젝트 생성
- 모든 핵심 기능 구현 완료
- 라벤더 컬러 시스템 디자인 적용
- 모바일 반응형 레이아웃 구현
