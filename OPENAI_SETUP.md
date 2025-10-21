# OpenAI API 완벽 연결 가이드 ✅

## 🎯 구현된 기능

### 1. System 프롬프트 (AI 성격 설정) ✅
```
당신은 '마음지기' AI 상담사입니다.

역할:
- 직장 생활 10년 차 따뜻한 선배
- 영업/사무직 스트레스를 깊이 이해
- 공감하고 경청하는 태도
- 현실적이고 실천 가능한 조언

말투:
- 반말 사용 (친근하게)
- 2~4문장으로 간결하게
- 이모지 적절히 사용 💙
```

### 2. 대화 컨텍스트 유지 ✅
- 최근 5개 메시지 히스토리 자동 전송
- "아까 말한 그 상사..." 같은 이어지는 대화 가능

### 3. 에러 처리 ✅
- API 키 없음 → "OpenAI API 키가 설정되지 않았습니다."
- 타임아웃 (30초) → "응답 시간이 초과되었어요."
- 네트워크 오류 → "잠시 후 다시 시도해주세요."

### 4. 스트리밍 응답 ✅
- 실시간 타이핑 효과
- "듣고 있어요..." 로딩 애니메이션

### 5. 위기 상황 감지 ✅
- 키워드: "죽고 싶어", "자살" 등
- 자동 응답: 자살예방상담 1393 안내

### 6. 감정 분류 ✅
- joy, sadness, anger, anxiety, stress
- 자동 분류 및 대시보드 시각화

---

## 🚀 사용 방법

### 1. API 키 설정
```bash
# .env.local 파일에 추가
OPENAI_API_KEY="sk-proj-..."
```

### 2. 서버 실행
```bash
npm run dev
```

### 3. 테스트

#### 방법 A: 브라우저에서 테스트
1. http://localhost:5000 접속
2. "익명으로 체험하기" 클릭
3. 채팅 시작

**테스트 메시지:**
```
오늘 상사한테 혼났어요. 너무 화가 나요.
```

**예상 응답:**
```
정말 힘들었겠다. 상사한테 혼나면 기분이 안 좋지. 💙
오늘은 그냥 일찍 퇴근해서 좋아하는 거 하는 게 어때?
내일은 더 나은 날이 될 거야.
```

#### 방법 B: 커맨드라인 테스트
```bash
node tests/quick-test.js
```

#### 방법 C: 전체 테스트 스위트
```bash
npx ts-node tests/chat-api.test.ts
```

---

## 📋 API 엔드포인트

### POST /api/chat

**Request:**
```json
{
  "message": "오늘 상사한테 혼났어요",
  "category": "boss",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
- Headers:
  - `X-Emotion`: joy|sadness|anger|anxiety|stress
  - `X-Crisis`: true|false
- Body: Streaming text (Server-Sent Events)

**Error Responses:**
```json
{
  "error": "API key missing",
  "message": "OpenAI API 키가 설정되지 않았습니다."
}
```

---

## 🧪 테스트 케이스

### 1. 기본 대화
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '오늘 너무 힘들었어요',
    category: 'workload',
  }),
})
```

### 2. 대화 맥락 유지
```javascript
// 첫 번째 메시지
const msg1 = await sendMessage('오늘 중요한 프레젠테이션이 있어요')

// 두 번째 메시지 (이전 대화 참조)
const msg2 = await sendMessage('아까 말한 그 프레젠테이션, 망했어요', {
  conversationHistory: [
    { role: 'user', content: '오늘 중요한 프레젠테이션이 있어요' },
    { role: 'assistant', content: msg1 }
  ]
})
// AI가 "프레젠테이션"을 기억하고 응답함
```

### 3. 위기 상황 감지
```javascript
const response = await sendMessage('죽고 싶어요')
// Response에 "1393" 포함됨
const hasCrisis = response.headers.get('X-Crisis') === 'true'
```

---

## ✅ 체크리스트

완료된 요구사항:

- [x] /api/chat 엔드포인트 생성
- [x] POST 요청으로 사용자 메시지 받기
- [x] OpenAI에 전송 및 streaming 응답
- [x] System 프롬프트 정확히 구현
  - [x] 직장 생활 10년 차 선배 역할
  - [x] 반말 사용
  - [x] 2~4문장 간결함
  - [x] 이모지 사용 💙
  - [x] 현실적인 조언
- [x] 금지사항 준수
  - [x] '회사 그만둬' 같은 극단적 조언 금지
  - [x] 의료 진단 금지
  - [x] 5문장 이상 긴 답변 금지
- [x] 위기 상황 특별 규칙
  - [x] 자살 키워드 감지
  - [x] 1393 상담 번호 제공
- [x] 에러 처리
  - [x] API 키 체크
  - [x] 타임아웃 30초
  - [x] 친절한 에러 메시지
- [x] 대화 컨텍스트 유지 (5개 메시지)
- [x] 클라이언트 연결
  - [x] Streaming 응답 실시간 표시
  - [x] "듣고 있어요..." 로딩 애니메이션
- [x] 테스트 코드 작성

---

## 🎨 응답 품질 가이드

### ✅ 좋은 응답 예시
```
정말 힘들었겠다. 그럴 수 있어. 💙
오늘은 일찍 퇴근해서 좋아하는 거 하는 게 어때?
내일은 더 나은 날이 될 거야.
```

### ❌ 나쁜 응답 예시
```
귀하의 상황을 이해합니다. 상사와의 갈등은...
다음과 같은 대처 방법을 추천드립니다:
1. 심호흡을 하세요
2. 상사의 입장에서...
(너무 길고 형식적)
```

---

## 🔧 문제 해결

### OpenAI API 키 에러
```
Error: OPENAI_API_KEY가 설정되지 않았습니다.
```
**해결:** `.env.local` 파일에 `OPENAI_API_KEY="sk-..."` 추가

### 타임아웃 에러
```
Error: 응답 시간이 초과되었어요.
```
**해결:** 네트워크 연결 확인 또는 잠시 후 재시도

### 스트리밍이 안 됨
**확인:**
1. Response headers에 `Content-Type: text/event-stream` 있는지
2. 브라우저 콘솔에서 `ReadableStream` 사용 중인지
3. `response.body.getReader()` 제대로 호출되는지

---

## 📊 성능 메트릭

- **첫 토큰 응답:** ~1-2초
- **전체 응답 완료:** ~3-5초
- **타임아웃:** 30초
- **컨텍스트 길이:** 최근 5개 메시지
- **최대 토큰:** 300

---

## 🎉 완성!

OpenAI API가 모든 요구사항에 맞춰 **완벽하게 연결**되었습니다!

바로 테스트해보세요:
```bash
npm run dev
```

그리고 http://localhost:5000 에서 채팅을 시작하세요! 💙
