// Web Speech API를 사용한 TTS (Text-to-Speech)

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// 최고 품질의 한국어 음성 선택
function getBestKoreanVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  
  // 우선순위: Google 한국어 > 네이티브 한국어 > 기타 한국어
  const preferredVoices = [
    'Google 한국의', 
    'Google 한국어',
    'Ko-KR',
    'Korean'
  ]
  
  // 우선순위에 따라 음성 검색
  for (const preferred of preferredVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferred) || 
      v.lang.includes('ko-KR') && v.name.includes('Google')
    )
    if (voice) return voice
  }
  
  // 없으면 한국어 음성 중 아무거나
  const koreanVoice = voices.find(v => 
    v.lang.startsWith('ko') || 
    v.name.toLowerCase().includes('korea')
  )
  
  return koreanVoice || null
}

export function speakText(text: string, personaId?: string): void {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported')
    return
  }

  // 이미 재생 중이면 중지
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  
  // 기본 설정
  utterance.lang = 'ko-KR'
  utterance.volume = 1.0
  
  // 페르소나별 피치와 속도 조정 (더 자연스럽게)
  switch (personaId) {
    case 'lover': // 애인 - 부드럽고 따뜻하게
      utterance.pitch = 1.05
      utterance.rate = 0.95
      break
    case 'friend': // 친구 - 밝고 활기차게
      utterance.pitch = 1.0
      utterance.rate = 1.0
      break
    case 'older_sibling': // 형/누나 - 안정적으로
      utterance.pitch = 0.95
      utterance.rate = 0.95
      break
    case 'younger_sibling': // 동생 - 밝고 귀엽게
      utterance.pitch = 1.1
      utterance.rate = 1.05
      break
    case 'parent': // 부모 - 차분하고 따뜻하게
      utterance.pitch = 0.9
      utterance.rate = 0.9
      break
    case 'senior': // 선배 - 전문적이고 차분하게
      utterance.pitch = 0.95
      utterance.rate = 0.95
      break
    case 'mentor': // 멘토 - 신중하고 천천히
      utterance.pitch = 0.9
      utterance.rate = 0.85
      break
    default:
      utterance.pitch = 1.0
      utterance.rate = 0.95
  }

  // 최고 품질 한국어 음성 선택
  const bestVoice = getBestKoreanVoice()
  if (bestVoice) {
    utterance.voice = bestVoice
  }

  window.speechSynthesis.speak(utterance)
}

// 음성 목록 로딩 보장
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // 음성 목록이 로딩될 때까지 대기
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      // 음성 목록 로딩 완료
    })
  }
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking
}
