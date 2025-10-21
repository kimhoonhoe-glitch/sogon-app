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
  onResult: (transcript: string) => void,
  onError?: (error: any) => void,
  onEnd?: () => void
) => {
  const SpeechRecognition = useSpeechRecognition()
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'ko-KR'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error)
    onError?.(event.error)
  }

  recognition.onend = () => {
    onEnd?.()
  }

  return recognition
}
