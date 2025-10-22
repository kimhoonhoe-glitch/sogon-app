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
  recognition.continuous = true
  recognition.interimResults = false // interim 무시 - 중복 방지
  recognition.maxAlternatives = 1
  
  // 60초 타임아웃 설정
  if ('maxSpeechTimeout' in recognition) {
    (recognition as any).maxSpeechTimeout = 60000
  }

  let shouldRestart = options?.autoRestart ?? false
  let restartTimeout: NodeJS.Timeout | null = null
  let transcript = ''

  recognition.onstart = () => {
    console.log('🎤 STT 시작')
    options?.onStart?.()
  }

  recognition.onresult = (event: any) => {
    // 모든 확정 결과 수집 (interim 무시)
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const finalText = event.results[i][0].transcript.trim()
        if (finalText) {
          transcript += finalText + ' '
          onResult(transcript.trim(), true)
        }
      }
    }
  }

  recognition.onerror = (event: any) => {
    console.error('❌ STT 오류:', event.error)
    
    // 권한 거부 - 명확한 가이드
    if (event.error === 'not-allowed') {
      onError?.('마이크 권한을 허용해주세요. 브라우저 설정 > 사이트 권한 > 소곤 허용!')
      return
    }
    
    // 네트워크 오류
    if (event.error === 'network') {
      onError?.('인터넷 연결을 확인해주세요.')
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
      }, 1000)
    } else if (event.error !== 'no-speech') {
      onError?.('인식 오류예요. 조용한 곳에서 다시 시도해보세요. [재시작] 버튼 클릭!')
    }
  }

  recognition.onend = () => {
    // 자동 재시작 - 끊김 방지
    if (shouldRestart) {
      if (restartTimeout) clearTimeout(restartTimeout)
      restartTimeout = setTimeout(() => {
        if (shouldRestart) {
          try {
            recognition.start()
          } catch (e) {
            // 이미 시작된 경우 무시
          }
        }
      }, 1000)
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
  
  // 이전 음성 완전히 중지
  synth.cancel()
  
  // 약간의 지연 후 재생 (cancel 완료 보장)
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.95
    utterance.pitch = 1.05
    
    synth.speak(utterance)
  }, 50)
}

export const stopSpeaking = (): void => {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
}
