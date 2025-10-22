# 소곤 SOGON - Replit 프로젝트

## Overview
"소곤 SOGON"은 직장인을 위한 AI 감정 코칭 앱입니다. "말해보세요. 당신 편이 조용히 듣고 있어요"라는 태그라인 아래, AI와의 대화를 통해 사용자 감정을 분석하고 위로와 조언을 제공합니다. 주요 기능으로는 AI 감정 대화, 7가지 페르소나 모드, 음성 입력(STT), 4-7-8 호흡법 가이드, 감정 자동 분류 및 트래킹, 위험 키워드 감지, 프리미엄 구독 기능 등이 있습니다. 이 프로젝트는 사용자에게 심리적 안정과 위로를 제공하여 정신 건강 증진에 기여하는 것을 목표로 합니다.

## User Preferences
- **Communication Style**: I prefer simple language and direct answers.
- **Workflow**: I want iterative development.
- **Interaction**: Ask before making major changes.
- **Codebase Changes**:
    - Do not make changes to the folder `Z`.
    - Do not make changes to the file `Y`.

## System Architecture
"소곤 SOGON"은 Next.js 14 App Router, TypeScript, Prisma, OpenAI GPT-4o-mini를 기반으로 하는 풀스택 애플리케이션입니다.

**UI/UX Decisions:**
- **Design System**: 라벤더 컬러 시스템 및 모바일 반응형 레이아웃을 채택하여 심미적이고 사용자 친화적인 경험을 제공합니다.
- **Dark Mode**: 완벽한 다크모드 지원으로 모든 UI 요소의 가시성을 확보합니다.
- **Emotional Visualization**: Dashboard는 EmotionSummaryCard (프로그레스 바), EmotionLineChart (Chart.js), EmotionCalendar 등을 통해 감정 데이터를 시각적으로 표현합니다.
- **Welcome Experience**: 첫 실행 시 환영 화면과 함께 4-7-8 호흡법 선택 기능을 제공하여 사용자의 초기 스트레스 완화를 돕습니다.
- **Animations**: 부드러운 입자 효과, 스크롤 애니메이션 (fadeIn, slideIn), 펄스 애니메이션 등을 활용하여 동적이고 인터랙티브한 UI를 구현합니다.
- **Navigation**: 모든 페이지에서 일관된 헤더 내비게이션 메뉴와 프로필 버튼을 제공하여 페이지 간 이동 편의성을 높입니다.
- **Time-based UI**: 한국 시간대(KST)를 기준으로 아침/점심/저녁 인사말 및 ThemeToggle 컴포넌트의 해/달 아이콘이 변경됩니다.

**Technical Implementations:**
- **AI Conversation**: OpenAI GPT-4o-mini를 활용한 AI 감정 대화는 스트리밍 방식으로 응답하며, 7가지 페르소나(애인, 친구, 형/누나, 동생, 엄마/아빠, 선배, 멘토)를 통해 다양한 위로 스타일을 제공합니다.
- **Speech-to-Text (STT)**: Web Speech API를 사용하여 음성을 텍스트로 변환하며, 반이중 모드 및 자동 재시작 기능을 통해 안정적인 음성 인식을 지원합니다.
- **Content Moderation**: AI 응답 및 사용자 입력을 대상으로 금지어 필터링(오프라인 만남, 금전, 신체 접촉 제안 차단) 및 메시지 Sanitization을 강화하여 안전하고 건전한 대화 환경을 조성합니다.
- **Authentication**: NextAuth.js를 통한 이메일 및 Google OAuth 로그인을 지원하며, 로그인 성능 최적화 및 이메일 저장 기능으로 사용자 편의성을 높였습니다.
- **Database**: Prisma ORM과 SQLite를 사용하여 데이터베이스를 관리하며, 사용자 세션, 감정 기록, 구독 정보 등을 저장합니다.
- **Guest Mode**: 로그인 없이 앱을 즉시 사용할 수 있는 게스트 모드를 구현하여 접근성을 높였습니다.
- **Localization**: 한국 시간대(KST)를 적용하여 시차로 인한 사용자 경험 문제를 해결합니다.

**Feature Specifications:**
- **Persona Mode**: 각 페르소나별 고유한 시스템 프롬프트, 말투, 이모지, 위로 방식을 정의하여 대화의 다양성을 제공합니다.
- **4-7-8 Breathing Technique**: 과학적으로 검증된 호흡법 가이드를 통해 사용자의 스트레스 완화를 지원합니다.
- **Emotion Tracking**: 대화 내용을 기반으로 감정을 자동 분류하고 트래킹하여 대시보드에서 시각적으로 인사이트를 제공합니다.
- **AI Prompt Engineering**: "깊이 있는 공감과 위로"를 중심으로 프롬프트를 재설계하여 따뜻하고 진정성 있는 AI 응답을 유도합니다.

## External Dependencies
- **OpenAI**: GPT-4o-mini 모델을 사용하여 AI 감정 대화 및 감정 분석 기능을 구현합니다.
- **Prisma ORM**: SQLite 데이터베이스와의 상호작용을 위한 ORM으로 사용됩니다.
- **NextAuth.js**: 이메일 및 Google OAuth를 통한 사용자 인증을 처리합니다.
- **Stripe**: 프리미엄 구독 서비스 결제 처리를 위해 사용됩니다 (테스트 모드).
- **Chart.js / react-chartjs-2**: 대시보드에서 감정 추이 라인 차트 등 데이터 시각화를 위해 사용됩니다.
- **Tailwind CSS**: 스타일링을 위한 유틸리티 우선 CSS 프레임워크입니다.
- **Pretendard Variable font**: 폰트 적용을 위해 사용됩니다.

## 최근 변경사항

### 2025-10-22: 프로덕션 완성도 최적화 및 경고 완전 제거
- **iOS Safari STT 호환성 강화 및 PWA 지원**:
  * lib/speech-recognition.ts: checkSTTSupport() 함수로 브라우저별 지원 여부 확인
  * iOS Safari / macOS Safari 감지 시 자동으로 텍스트 입력 권장 토스트 표시
  * 마이크 버튼 tooltip에 "iOS Safari에서는 텍스트로 입력해주세요" 안내
  * 크로스 브라우저 polyfill: SpeechRecognition = webkitSpeechRecognition
- **토스트 알림 시스템 구축** (components/Toast.tsx):
  * useToast hook으로 간편한 알림 표시
  * 4가지 타입: info, error, success, warning
  * 권한 거부 시: "마이크 권한을 허용해주세요. 브라우저 설정 > 사이트 권한 확인!"
  * 네트워크 오류 시: "네트워크 오류가 발생했습니다"
  * 인식 시작 시: "말해주세요. 끝나면 자동으로 멈춥니다"
- **PWA (Progressive Web App) 지원**:
  * public/manifest.json: 홈 화면 추가 가능
  * public/sw.js: Service Worker로 오프라인 캐시
  * components/PWARegister.tsx: 이벤트 리스너 메모리 누수 방지 및 console.log 제거
  * app/layout.tsx: PWA meta 태그 및 viewport 설정
  * app/icon.tsx & app/apple-icon.tsx: Next.js 동적 아이콘 생성으로 모든 크기 자동 지원
- **로그인 페이지 Hydration 에러 수정**:
  * components/ThemeToggle.tsx: 시간 기반 아이콘 로직 제거 (서버/클라이언트 불일치 원인)
  * 테마 기반(dark/light)으로만 아이콘 표시하여 SSR/CSR 일관성 확보
  * React Hydration mismatch 에러 완전 해결로 로그인/회원가입/구글 로그인/익명 체험 버튼 정상 작동
- **프로덕션 품질 최적화**:
  * **Form Accessibility**: autocomplete="email" 및 autocomplete="current-password" 속성 추가하여 브라우저 자동완성 및 보안 강화
  * **Cross-Origin 경고 제거**: next.config.js에 allowedDevOrigins 설정으로 Replit 도메인 전체 허용 (localhost, 127.0.0.1, *.replit.dev, *.worf.replit.dev)
  * **SEO 최적화**: app/robots.ts 및 app/sitemap.xml 생성으로 검색엔진 최적화 완료
  * **코드 품질**: PWARegister.tsx에서 이벤트 리스너 정리(cleanup) 로직 추가 및 불필요한 console.log 제거
  * **.next 빌드 캐시 초기화**: 완전한 재빌드로 모든 최적화 적용 확인
- **테스트 결과**:
  * ✅ Service Worker 등록 성공
  * ✅ iOS Safari에서 음성 버튼 비활성화 및 tooltip 표시
  * ✅ Chrome/Edge에서 음성 입력 정상 작동
  * ✅ PWA 동적 아이콘 생성으로 404 에러 해결
  * ✅ 로그인 페이지 모든 버튼 정상 작동 확인
  * ✅ robots.txt 및 sitemap.xml 정상 생성 (200 OK)
  * ✅ Cross-origin 경고 완전 제거 (서버 로그 깨끗)
  * ✅ HTML에 autocomplete 속성 제대로 적용됨 확인