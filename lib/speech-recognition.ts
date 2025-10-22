export const useSpeechRecognition = () => {
  if (typeof window === 'undefined') return null

  const SpeechRecognition = 
    (window as any).SpeechRecognition || 
    (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported')
    return null
  }

  return SpeechRecognition
}

export const createRecognition = (
  onResult: (transcript: string, isFinal: boolean) => void,
  onError?: (error: any) => void,
  onEnd?: () => void,
  options?: { autoRestart?: boolean }
) => {
  const SpeechRecognition = useSpeechRecognition()
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'ko-KR'
  recognition.continuous = true // 길게 말할 때 끊김 방지
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  let shouldRestart = options?.autoRestart ?? false
  let restartTimeout: NodeJS.Timeout | null = null

  recognition.onresult = (event: any) => {
    // 확정 결과만 누적, interim 결과는 표시용으로만
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      const transcript = result[0].transcript
      const isFinal = result.isFinal
      
      // 확정 결과만 콜백 호출
      if (isFinal) {
        onResult(transcript, true)
      }
    }
  }

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error)
    
    // no-speech는 자동 재시작 가능
    if (event.error === 'no-speech' && shouldRestart) {
      // 즉시 재시작하지 않고 짧은 딜레이 후 재시작
      if (restartTimeout) clearTimeout(restartTimeout)
      restartTimeout = setTimeout(() => {
        try {
          recognition.start()
        } catch (e) {
          // 이미 시작된 경우 무시
        }
      }, 500)
    } else {
      onError?.(event.error)
    }
  }

  recognition.onend = () => {
    // 자동 재시작이 활성화되어 있으면 재시작
    if (shouldRestart) {
      if (restartTimeout) clearTimeout(restartTimeout)
      restartTimeout = setTimeout(() => {
        try {
          recognition.start()
        } catch (e) {
          // 이미 시작된 경우 무시
        }
      }, 500)
    }
    onEnd?.()
  }

  // cleanup 함수 추가
  ;(recognition as any).cleanup = () => {
    shouldRestart = false
    if (restartTimeout) {
      clearTimeout(restartTimeout)
      restartTimeout = null
    }
    try {
      recognition.stop()
    } catch (e) {
      // 이미 중지된 경우 무시
    }
  }

  return recognition
}

// TTS 기능
export const speak = (text: string): void => {
  if (typeof window === 'undefined') return
  
  const synth = window.speechSynthesis
  
  // 이전 음성 중지
  synth.cancel()
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ko-KR'
  utterance.rate = 0.95
  utterance.pitch = 1.05
  
  synth.speak(utterance)
}

export const stopSpeaking = (): void => {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
}
