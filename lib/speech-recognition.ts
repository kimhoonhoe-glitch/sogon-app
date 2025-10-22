// 브라우저 감지 유틸리티
export const detectBrowser = () => {
  if (typeof window === 'undefined') return { isSafari: false, isiOS: false, isChrome: false }
  
  const ua = navigator.userAgent
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua)
  const isiOS = /iPhone|iPad|iPod/.test(ua)
  const isChrome = /Chrome/.test(ua)
  
  return { isSafari, isiOS, isChrome }
}

// STT 지원 여부 확인
export const checkSTTSupport = (): { supported: boolean; message?: string } => {
  if (typeof window === 'undefined') {
    return { supported: false, message: '서버 환경에서는 음성 인식을 사용할 수 없습니다.' }
  }

  const { isSafari, isiOS } = detectBrowser()

  // iOS Safari는 Web Speech API를 지원하지 않음
  if (isiOS && isSafari) {
    return { 
      supported: false, 
      message: 'iOS Safari에서는 음성 입력이 지원되지 않아요. 텍스트로 입력해주세요!' 
    }
  }

  // 일반 Safari (macOS)도 제한적 지원
  if (isSafari && !isiOS) {
    return {
      supported: false,
      message: 'Safari에서는 음성 입력이 제한됩니다. Chrome 브라우저를 사용해주세요!'
    }
  }

  // SpeechRecognition API 지원 확인
  const SpeechRecognition = 
    (window as any).SpeechRecognition || 
    (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    return {
      supported: false,
      message: '이 브라우저는 음성 입력을 지원하지 않아요. Chrome 브라우저를 추천합니다!'
    }
  }

  return { supported: true }
}

export const useSpeechRecognition = () => {
  if (typeof window === 'undefined') return null

  // Polyfill: SpeechRecognition이 없으면 webkitSpeechRecognition 사용
  if (!(window as any).SpeechRecognition && (window as any).webkitSpeechRecognition) {
    (window as any).SpeechRecognition = (window as any).webkitSpeechRecognition
  }

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
  options?: { autoRestart?: boolean; onStart?: () => void }
) => {
  const SpeechRecognition = useSpeechRecognition()
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'ko-KR'
  recognition.continuous = true // 길게 말할 때 끊김 방지
  recognition.interimResults = false // 확정 결과만 사용 (중복 방지)
  recognition.maxAlternatives = 1

  let shouldRestart = options?.autoRestart ?? false
  let restartTimeout: NodeJS.Timeout | null = null
  let transcript = ''

  recognition.onstart = () => {
    console.log('🎤 STT 시작')
    options?.onStart?.()
  }

  recognition.onresult = (event: any) => {
    // 마지막 확정 결과만 가져오기
    const lastResult = event.results[event.results.length - 1]
    if (lastResult && lastResult.isFinal) {
      const finalTranscript = lastResult[0].transcript.trim()
      if (finalTranscript) {
        transcript += finalTranscript + ' '
        onResult(finalTranscript, true)
        console.log('✅ 인식:', finalTranscript)
      }
    }
  }

  recognition.onerror = (event: any) => {
    console.error('❌ STT 오류:', event.error)
    
    // 권한 거부
    if (event.error === 'not-allowed') {
      onError?.('not-allowed')
      return
    }
    
    // 네트워크 오류
    if (event.error === 'network') {
      onError?.('network')
      return
    }
    
    // no-speech는 자동 재시작 가능
    if (event.error === 'no-speech' && shouldRestart) {
      if (restartTimeout) clearTimeout(restartTimeout)
      restartTimeout = setTimeout(() => {
        try {
          recognition.start()
        } catch (e) {
          // 이미 시작된 경우 무시
        }
      }, 500)
    } else if (event.error !== 'no-speech') {
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
