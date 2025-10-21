// Web Speech API - 최적화된 자연스러운 음성

let currentUtterance: SpeechSynthesisUtterance | null = null

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// 최고 품질 음성 선택 (Google 한국어 우선)
function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  
  // 1순위: Google 한국어
  const googleKo = voices.find(v => 
    v.lang.includes('ko') && v.name.toLowerCase().includes('google')
  )
  if (googleKo) return googleKo
  
  // 2순위: 네이티브 한국어 (로컬)
  const nativeKo = voices.find(v => 
    v.lang.startsWith('ko') && v.localService
  )
  if (nativeKo) return nativeKo
  
  // 3순위: 모든 한국어
  return voices.find(v => v.lang.startsWith('ko')) || null
}

export function speakText(text: string, personaId?: string): void {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported')
    return
  }

  // 이미 재생 중이면 중지
  stopSpeech()

  const utterance = new SpeechSynthesisUtterance(text)
  currentUtterance = utterance
  
  // 기본 설정 - 더 자연스럽게
  utterance.lang = 'ko-KR'
  utterance.volume = 1.0
  utterance.pitch = 1.0  // 기본 피치
  utterance.rate = 0.92  // 약간 느리게 (자연스러움)
  
  // 최고 품질 음성 선택
  const bestVoice = getBestVoice()
  if (bestVoice) {
    utterance.voice = bestVoice
  }

  // 재생 완료 이벤트
  utterance.onend = () => {
    currentUtterance = null
  }
  
  utterance.onerror = (event) => {
    console.error('Speech error:', event)
    currentUtterance = null
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel()
    currentUtterance = null
  }
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking
}

// 음성 목록 로딩 보장
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      // 음성 목록 로딩됨
    })
  }
}

