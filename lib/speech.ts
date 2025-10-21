// OpenAI TTS를 사용한 고품질 음성 합성

let currentAudio: HTMLAudioElement | null = null

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined'
}

export async function speakText(text: string, personaId?: string): Promise<void> {
  if (!isSpeechSupported()) {
    console.warn('Audio not supported')
    return
  }

  try {
    // 이미 재생 중이면 중지
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }

    // OpenAI TTS API 호출
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, personaId }),
    })

    if (!response.ok) {
      throw new Error('TTS API failed')
    }

    // 오디오 블롭 생성
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    // 오디오 재생
    currentAudio = new Audio(audioUrl)
    
    // 재생 완료 후 URL 해제
    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl)
      currentAudio = null
    }

    await currentAudio.play()
  } catch (error) {
    console.error('Speech error:', error)
    throw error
  }
}

export function stopSpeech(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused
}

