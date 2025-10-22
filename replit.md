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
3. **음성 입력 (STT)** - 마이크 버튼으로 음성을 텍스트로 변환
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
### 2025-10-22: 한국 시간대(KST) 적용 및 네비게이션 개선
- **시간대 버그 수정**: 서버가 UTC 시간을 사용하여 점심시간에 밤 인사가 나오던 문제 해결
  * lib/openai.ts: UTC+9 (한국 시간대) 변환 로직 추가
  * 아침 (6~12시): "오늘 하루 파이팅!", "오늘도 잘 해낼 거야"
  * 점심/오후 (12~18시): "오후도 힘내", "조금만 더 버텨", "퇴근까지 파이팅"
  * 저녁/밤 (18~6시): "오늘 하루 수고했어", "고생 많았어"
- **Welcome 페이지 리다이렉트**: 이미 welcome_completed인 사용자는 자동으로 /chat으로 이동
  * 채팅 화면에서 로고 클릭 시 무한 루프 방지
- **회원가입 안내 추가**: 로그인 화면에 "처음이신가요? 이메일과 비밀번호 입력 후 버튼을 누르면 자동으로 회원가입됩니다." 안내 문구 추가

### 2025-10-22: 시간대별 해/달 아이콘 추가
- ThemeToggle 컴포넌트 개선
- 오전 6시~오후 6시: ☀️ 해 이모지 (애니메이션 포함)
- 오후 6시~오전 6시: 🌙 달 이모지
- 매분마다 자동 업데이트로 실시간 반영

### 2025-10-22: 대규모 사용자 경험 업그레이드 (8가지 개선)
1. **게스트 모드 구현** (ErrorBoundary + GuestGate)
   - 로그인 강제 제거, 바로 사용 가능
   - 오류 발생 시 fallback UI 제공
2. **로컬 저장 신뢰 배지** (TrustBadge)
   - 헤더, 입력창, 결과 카드에 "기록은 내 기기에만 저장됩니다" 표시
3. **입출력 전처리** (sanitize.ts)
   - 반복 문구 자동 제거 ("오늘은오늘은" → "오늘은")
   - 중복 공백 정리
4. **금지어 필터** (moderate.ts)
   - 오프라인 만남/금전/신체접촉 제안 차단
   - AI 응답에서 부적절한 제안 방지
5. **STT/TTS 안정화**
   - 반이중 모드: TTS 재생 중 STT 시작 시 자동 중지
   - 확정 결과만 입력창 반영 (중복 방지)
   - 자동 재시작: 긴 발화 시 끊김 없이 계속 녹음
6. **AI 프롬프트 개선**
   - 공감 중심, 길이 제약 (2~3문장)
   - Few-shot 예시 추가
   - 금지사항 명시
7. **페르소나 수정**
   - "애인" → "다정한 톤"으로 변경
   - 모든 페르소나에 금지어 적용
8. **README 업데이트**
   - 게스트 모드, 로컬 저장, iOS 제약사항 안내

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

### TTS 기능 제거 (2024-10-21)
- Web Speech API 품질이 기계음으로 들려 사용자 경험 저하
- 자연스러운 음성(OpenAI TTS 등) 지원 시 재추가 예정
- Replit AI Integration은 TTS 엔드포인트 미지원
- lib/speech.ts 파일 삭제
- 채팅 화면의 🔊 음성 재생 버튼 제거

### 음성 입력 (STT) 추가 (2024-10-21) 🎤
- Web Speech API의 SpeechRecognition 사용
- 한국어 음성을 텍스트로 실시간 변환
- lib/speech-recognition.ts: 음성 인식 유틸리티
- 채팅 입력창 우측 상단에 마이크 버튼 추가
- 녹음 중일 때 빨간색 pulse 애니메이션 표시
- 브라우저 마이크 권한 필요 (Chrome, Edge 등 지원)
- 음성 인식 중 실시간으로 텍스트 입력창에 표시

### 호흡 가이드 강화 (2024-10-21) 🌬️
- **4-7-8 호흡법** 적용 (과학적으로 검증된 스트레스 완화법)
  * 들이쉬기: 4초 (코로 깊게)
  * 멈추기: 7초 (숨을 멈추고)
  * 내쉬기: 8초 (입으로 천천히)
- Welcome 페이지와 BreathingGuide 컴포넌트 모두 4-7-8 타이밍 통일
- 카운트다운 타이머 표시 (숫자로)
- 페이즈별 그라데이션 색상 변화
  * 들이쉬기: 파란색 (Blue-Cyan)
  * 멈추기: 보라색 (Purple-Pink)
  * 내쉬기: 초록색 (Green-Teal)
- 펄스 애니메이션 효과
- 효과 설명: 스트레스 완화, 마음 안정, 숙면, 집중력 향상

### 채팅 UI 개선 (2024-10-21)
- 히어로 문구 변경: "오늘은 어떤 일이 있었나요?"
- 직장 카테고리 버튼 완전 제거 (사용자 자유도 향상)
- 로고 클릭 시 홈으로 이동 (confirm 팝업)

### 환경 변수 업데이트
- AI_INTEGRATIONS_OPENAI_API_KEY: Replit AI 통합 (자동 설정)
- AI_INTEGRATIONS_OPENAI_BASE_URL: Replit AI 엔드포인트 (자동 설정)
