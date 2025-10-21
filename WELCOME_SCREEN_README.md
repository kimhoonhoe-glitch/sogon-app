# 🌙 환영 화면 (Welcome Screen)

## 개요
앱 첫 실행 시 사용자를 맞이하는 환영 화면입니다. 3-4-5 호흡법 가이드를 통해 사용자가 편안한 상태에서 앱을 시작할 수 있도록 도와줍니다.

## ✨ 주요 기능

### 1. 첫 화면
- **배경**: 라벤더 → 베이지 그라데이션
- **입자 효과**: 20개의 부드럽게 떠다니는 입자 애니메이션
- **메시지**:
  ```
  🌙
  
  오늘 하루
  수고 많으셨어요
  
  숨 고르고 시작할까요?
  
  [시작하기]
  ```

### 2. 호흡 가이드 (3-4-5 호흡법)

#### 단계별 애니메이션
1. **숨 들이쉬기** (3초)
   - 원이 작은 크기(50%)에서 큰 크기(100%)로 확대
   - 색상: 라벤더 (#B4A7D6)
   - 안내: "코로 천천히 들이마셔요"

2. **참기** (4초)
   - 원이 큰 크기(100%)를 유지
   - 색상: 주황 (#FFC172)
   - 안내: "잠시 숨을 참아요"

3. **내쉬기** (5초)
   - 원이 큰 크기(100%)에서 작은 크기(50%)로 축소
   - 색상: 라벤더 (옅음)
   - 안내: "입으로 천천히 내쉬어요"

#### 진행 상태
- 총 3사이클 진행
- 하단에 점으로 현재 사이클 표시
  - 완료: 큰 라벤더 점
  - 진행 중: 중간 크기 + pulse 애니메이션
  - 대기: 작은 회색 점

### 3. 완료 후 동작
- 3사이클 완료 후 자동으로 fade out (1초)
- localStorage에 `welcome_completed: true` 저장
- `/chat` 페이지로 자동 이동

## 🎨 디자인 특징

### 배경 그라데이션
```css
background: linear-gradient(
  to bottom right,
  rgba(180, 167, 214, 0.3),  /* 라벤더 */
  rgba(255, 193, 114, 0.2),   /* 베이지 */
  rgba(255, 193, 114, 0.1)
)
```

### 입자 효과
- 20개의 작은 점들이 화면 하단에서 상단으로 천천히 이동
- 각 입자마다 다른 애니메이션 지연 시간 (0~20초)
- 각 입자마다 다른 애니메이션 지속 시간 (20~30초)
- 반투명 라벤더 색상

### 호흡 원 애니메이션
```typescript
// 크기 변화
inhale:  50% → 100% (3초)
hold:    100%        (4초)
exhale:  100% → 50%  (5초)

// 색상 변화
inhale:  rgba(180, 167, 214, 0.5)  // 라벤더
hold:    rgba(255, 193, 114, 0.5)  // 주황
exhale:  rgba(180, 167, 214, 0.3)  // 라벤더 (옅음)
```

## 🔧 구현 상세

### 파일 구조
```
app/
├── welcome/
│   └── page.tsx          # 환영 화면 페이지
└── page.tsx              # 메인 페이지 (첫 실행 체크)
```

### 첫 실행 감지 로직
```typescript
// app/page.tsx
useEffect(() => {
  const welcomeCompleted = localStorage.getItem('welcome_completed')
  if (!welcomeCompleted) {
    router.push('/welcome')
  }
}, [router])
```

### 호흡 타이머 로직
```typescript
const phases = [
  { phase: 'inhale', duration: 3, next: 'hold' },
  { phase: 'hold', duration: 4, next: 'exhale' },
  { phase: 'exhale', duration: 5, next: 'inhale' },
]

// 0.1초마다 업데이트
setInterval(() => {
  elapsed += 0.1
  setPhaseTime(currentPhase.duration - elapsed)
  
  if (elapsed >= currentPhase.duration) {
    // 다음 단계로 이동
    setBreathingPhase(currentPhase.next)
    
    // 3사이클 완료 시
    if (breathingPhase === 'exhale' && cycleCount >= 2) {
      // fade out → /chat 이동
    }
  }
}, 100)
```

### 원 크기 계산
```typescript
const getCircleScale = () => {
  const progress = 1 - phaseTime / phaseDuration
  
  if (breathingPhase === 'inhale') {
    return 0.5 + progress * 0.5  // 50% → 100%
  } else if (breathingPhase === 'exhale') {
    return 1 - progress * 0.5     // 100% → 50%
  }
  return 1                         // hold: 100%
}
```

## 📱 반응형 디자인
- 모바일: 작은 텍스트, 작은 원
- 태블릿/데스크톱: 큰 텍스트, 큰 원
- 모든 디바이스에서 중앙 정렬

## 🚀 사용 방법

### 테스트하기
1. localStorage 초기화:
   ```javascript
   localStorage.removeItem('welcome_completed')
   ```

2. 메인 페이지(`/`)로 이동
   - 자동으로 `/welcome`으로 리다이렉트

3. "시작하기" 버튼 클릭
   - 호흡 가이드 시작

4. 호흡 3사이클 완료
   - 자동으로 `/chat`으로 이동

### 다시 보기
localStorage에서 `welcome_completed` 항목을 삭제하면 다시 볼 수 있습니다:
```javascript
localStorage.removeItem('welcome_completed')
```

## 🎯 사용자 경험 흐름

```
첫 방문
  ↓
/ (메인 페이지)
  ↓
localStorage 체크
  ↓
welcome_completed 없음
  ↓
/welcome 리다이렉트
  ↓
환영 메시지 표시
  ↓
[시작하기] 클릭
  ↓
호흡 가이드 (3-4-5 × 3회)
  ↓
Fade out
  ↓
localStorage.setItem('welcome_completed', 'true')
  ↓
/chat 이동
  ↓
다음 방문부터는 바로 로그인 화면
```

## 💡 기술적 하이라이트

### Hydration 이슈 해결
랜덤 위치의 입자 효과가 SSR과 CSR 간 불일치를 일으킬 수 있어, `mounted` state로 클라이언트에서만 렌더링:

```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

// JSX
{mounted && (
  <div className="particles-container">
    {/* 입자 효과 */}
  </div>
)}
```

### 부드러운 전환
- Fade in/out 애니메이션 (0.8초~1초)
- 원 크기 변화 transition (1초, ease-in-out)
- 페이지 전환 전 0.5초 대기 (자연스러움)

## 🎉 완성!

사용자가 앱을 처음 실행할 때:
1. 🌙 따뜻한 환영 메시지로 맞이
2. 😌 3-4-5 호흡법으로 마음 안정
3. 💙 편안한 상태로 대화 시작

첫인상이 중요한 만큼, 사용자에게 안정감과 신뢰를 주는 환영 화면입니다!
