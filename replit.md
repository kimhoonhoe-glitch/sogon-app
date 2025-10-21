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
2. **페르소나 모드 (7가지)** - 킬러 기능!
   - 애인, 친구, 형/누나, 동생, 엄마/아빠, 선배, 멘토
   - 각 페르소나별 고유 말투와 위로 방식
3. **TTS 음성 재생** - AI 응답을 음성으로 듣기
4. **4-7-8 호흡법** - 과학적으로 검증된 스트레스 완화
5. 감정 자동 분류 및 트래킹
6. 위험 키워드 감지
7. 프리미엄 구독 (Stripe)
8. 다크모드 지원

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

### Welcome 화면 개선 (2024-10-21)
- 첫 실행 시 환영 화면 (/welcome)
- 라벤더 → 베이지 그라데이션 배경
- 부드러운 입자 효과 애니메이션 (20개)
- 4-7-8 호흡법 **선택 기능**:
  * "호흡하고 시작하기" - 4-7-8 호흡법 3회 진행
  * "바로 시작하기" - 호흡 건너뛰고 바로 대화 시작
  * 호흡법 효과 설명 추가 (스트레스 완화, 마음 안정, 집중력 향상, 숙면)
  * 호흡 중 "건너뛰기" 버튼 추가
  * 카운트다운 타이머와 페이즈별 색상 변화
- localStorage로 첫 실행 여부 추적

### AI 프롬프트 대폭 개선 (2024-10-21)
- 기존 "짧고 간결한 답변" → "깊이 있는 공감과 위로" 중심으로 전환
- 진짜 친구/연인이 위로해주는 느낌의 대화 톤
- 감정 인정 → 위로 → 조언 순서로 구조화
- Temperature 1.0, Max tokens 600으로 증가 (더 풍부한 응답)
- Azure OpenAI 콘텐츠 필터 호환 프롬프트
- Replit AI Integrations 연결 (API 키 불필요)

### AI 프롬프트 재설계 (2024-10-21 추가 개선)
- **따뜻하고 진정성 있는 위로** 중심으로 완전 재설계
- 역할 정의: 연인/친구/부모/형제자매처럼 다양한 방식으로 위로
- 깊은 공감 + 무조건적 지지 + 따뜻한 위로 + 진정성 있는 격려
- 구체적인 공감 표현 ("그랬구나", "힘들었겠다", "속상했을 것 같아")
- 판단하지 않고 있는 그대로 받아들이는 태도
- 진부하지 않은 구체적 격려 ("오늘도 버텨낸 거 자체가 대단해")

### 메시지 Sanitization 강화 (2024-10-21)
- Azure OpenAI 콘텐츠 필터 대응 강화
- 극단적 표현을 완전히 제거하고 안전한 표현으로 재구성
- 감정 분석을 로컬 키워드 매칭으로 변경 (API 호출 제거)
- 비속어와 강한 표현을 중립적으로 변환하되 감정의 의미는 보존

### UI/UX 개선 (2024-10-21)
- 다크모드 텍스트 가시성 수정 완료
  * 채팅 메시지, 버튼, 입력창 등 모든 요소에 dark:text-white 적용
  * placeholder 텍스트 색상도 다크모드 대응
- 네비게이션 메뉴 추가
  * Premium 페이지: 대화, 대시보드, 프로필 버튼 추가
  * Profile 페이지: 대화, 대시보드, 프리미엄 버튼 추가
  * 모든 페이지에서 일관된 이동 경험 제공

### 페르소나 모드 추가 (2024-10-21) 🎭
- **7가지 대화 스타일**: 애인, 친구, 형/누나, 동생, 엄마/아빠, 선배, 멘토
- lib/personas.ts: 각 페르소나별 고유 시스템 프롬프트
  * 애인: 사랑스럽고 따뜻한 반말
  * 친구: 편안하고 공감하는 반말
  * 형/누나: 다정하고 든든한 반말
  * 동생: 귀엽고 애교 가득한 반말
  * 엄마/아빠: 무조건적 사랑과 지지의 존댓말
  * 선배: 전문적이고 조언하는 존댓말
  * 멘토: 신중하고 성찰을 돕는 존댓말
- components/PersonaSelector.tsx: 드롭다운 선택 UI
- localStorage로 페르소나 선택 저장
- API 라우트와 OpenAI 함수에 personaId 전달
- 페르소나별 말투, 이모지, 위로 방식 차별화

### TTS 음성 재생 추가 (2024-10-21) 🔊
- lib/speech.ts: Web Speech API 사용
- 페르소나별 음성 설정 (pitch, rate 조절)
  * 애인: 부드럽고 따뜻하게 (pitch 1.1, rate 0.85)
  * 친구: 밝고 활기차게 (pitch 1.0, rate 1.0)
  * 형/누나: 안정적으로 (pitch 0.9, rate 0.9)
  * 동생: 밝고 귀엽게 (pitch 1.2, rate 1.0)
  * 엄마/아빠: 차분하고 따뜻하게 (pitch 0.8, rate 0.85)
  * 선배: 전문적이고 차분하게 (pitch 0.9, rate 0.9)
  * 멘토: 신중하고 천천히 (pitch 0.85, rate 0.8)
- AI 응답 옆에 🔊 버튼 추가
- 재생 중에는 ⏸️로 변경

### 호흡 가이드 강화 (2024-10-21) 🌬️
- **4-7-8 호흡법**으로 업그레이드 (과학적 근거)
  * 들이쉬기: 4초 (코로)
  * 멈추기: 7초
  * 내쉬기: 8초 (입으로)
- 카운트다운 타이머 표시 (숫자로)
- 페이즈별 그라데이션 색상 변화
  * 들이쉬기: 파란색
  * 멈추기: 보라색
  * 내쉬기: 초록색
- 펄스 애니메이션 효과
- 효과 설명 업데이트 (스트레스 완화, 마음 안정, 숙면, 집중력)

### 채팅 UI 개선 (2024-10-21)
- 히어로 문구 변경: "오늘은 어떤 일이 있었나요?"
- 직장 카테고리 버튼 완전 제거 (사용자 자유도 향상)
- 로고 클릭 시 홈으로 이동 (confirm 팝업)

### 환경 변수 업데이트
- AI_INTEGRATIONS_OPENAI_API_KEY: Replit AI 통합 (자동 설정)
- AI_INTEGRATIONS_OPENAI_BASE_URL: Replit AI 엔드포인트 (자동 설정)
