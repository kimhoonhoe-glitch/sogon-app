// Web Speech API를 사용한 TTS (Text-to-Speech)

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speakText(text: string, personaId?: string): void {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported')
    return
  }

  // 이미 재생 중이면 중지
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  
  // 페르소나별 음성 설정
  utterance.lang = 'ko-KR'
  utterance.rate = 0.9 // 약간 느리게
  utterance.volume = 1.0
  
  // 페르소나별 피치와 속도 조정
  switch (personaId) {
    case 'lover': // 애인 - 부드럽고 따뜻하게
      utterance.pitch = 1.1
      utterance.rate = 0.85
      break
    case 'friend': // 친구 - 밝고 활기차게
      utterance.pitch = 1.0
      utterance.rate = 1.0
      break
    case 'older_sibling': // 형/누나 - 안정적으로
      utterance.pitch = 0.9
      utterance.rate = 0.9
      break
    case 'younger_sibling': // 동생 - 밝고 귀엽게
      utterance.pitch = 1.2
      utterance.rate = 1.0
      break
    case 'parent': // 부모 - 차분하고 따뜻하게
      utterance.pitch = 0.8
      utterance.rate = 0.85
      break
    case 'senior': // 선배 - 전문적이고 차분하게
      utterance.pitch = 0.9
      utterance.rate = 0.9
      break
    case 'mentor': // 멘토 - 신중하고 천천히
      utterance.pitch = 0.85
      utterance.rate = 0.8
      break
    default:
      utterance.pitch = 1.0
      utterance.rate = 0.9
  }

  // 한국어 음성 찾기 (있으면)
  const voices = window.speechSynthesis.getVoices()
  const koreanVoice = voices.find(voice => voice.lang.startsWith('ko'))
  if (koreanVoice) {
    utterance.voice = koreanVoice
  }

  window.speechSynthesis.speak(utterance)
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
