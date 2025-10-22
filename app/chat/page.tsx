'use client'

import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import BreathingGuide from '@/components/BreathingGuide'
import LoadingMessage from '@/components/LoadingMessage'
import CrisisAlert from '@/components/CrisisAlert'
import ThemeToggle from '@/components/ThemeToggle'
import PersonaSelector from '@/components/PersonaSelector'
import { EMOTION_CATEGORIES } from '@/lib/emotions'
import { Persona } from '@/lib/personas'
import { createRecognition, useSpeechRecognition, stopSpeaking } from '@/lib/speech-recognition'
import TrustBadge from '@/components/TrustBadge'
import { sanitizeInput } from '@/lib/sanitize'

interface Message {
  role: 'user' | 'assistant'
  content: string
  emotion?: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isAnonymous = searchParams.get('anonymous') === 'true'
  const skipBreathing = searchParams.get('skipBreathing') === 'true'
  
  const [showBreathing, setShowBreathing] = useState(!skipBreathing)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [recognitionSupported, setRecognitionSupported] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const shouldRestartRef = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const SpeechRecognition = useSpeechRecognition()
    if (!SpeechRecognition) {
      setRecognitionSupported(false)
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          category,
          conversationHistory,
          personaId: selectedPersona?.id || 'lover',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (response.status === 429) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: error.message || '오늘의 무료 대화 횟수를 모두 사용했어요.',
          }])
          setIsLoading(false)
          return
        }
        if (response.status === 400 && error.error === 'Content filtered') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: error.message || '메시지 내용이 안전 정책에 의해 차단되었어요. 다른 표현으로 말씀해주시겠어요? 💙',
          }])
          setIsLoading(false)
          return
        }
        throw new Error('Failed to send message')
      }

      const emotion = response.headers.get('X-Emotion')
      const hasCrisis = response.headers.get('X-Crisis') === 'true'
      
      if (hasCrisis) {
        setShowCrisis(true)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '', emotion: emotion || undefined }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
            emotion: emotion || undefined,
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송해요, 일시적인 오류가 발생했어요. 네트워크 연결을 확인하고 다시 시도해주세요. 💙',
      }])
      
      setTimeout(() => {
        if (!isLoading) {
          console.log('재시도 준비 완료')
        }
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startRecording = () => {
    // 반이중: TTS 재생 중이면 중지
    stopSpeaking()
    
    const recognition = createRecognition(
      (transcript, isFinal) => {
        // 확정 결과만 입력창에 추가
        if (isFinal) {
          const cleaned = sanitizeInput(transcript)
          setInput(prev => {
            const combined = prev + ' ' + cleaned
            return sanitizeInput(combined)
          })
        }
      },
      (error) => {
        console.error('Speech recognition error:', error)
        
        if (error === 'not-allowed') {
          // 복구 불가능한 에러: 완전 중지
          shouldRestartRef.current = false
          setIsListening(false)
          alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.')
        } else {
          // 기타 에러: 자동 재시작이 처리함
          console.warn('음성 인식 오류:', error)
        }
      },
      () => {
        // onEnd는 자동 재시작이 처리함
        if (!shouldRestartRef.current) {
          setIsListening(false)
        }
      },
      { autoRestart: true } // 자동 재시작 활성화
    )

    if (recognition) {
      recognitionRef.current = recognition
      try {
        recognition.start()
        setIsListening(true)
        shouldRestartRef.current = true
      } catch (error) {
        console.error('Failed to start recognition:', error)
        shouldRestartRef.current = false
        alert('음성 인식을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }

  const stopRecording = () => {
    shouldRestartRef.current = false
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const toggleVoiceInput = () => {
    if (!recognitionSupported) {
      alert('음성 인식이 지원되지 않는 브라우저입니다. Chrome, Edge 등을 사용해주세요.')
      return
    }

    if (isListening) {
      stopRecording()
    } else {
      startRecording()
    }
  }


  if (showBreathing) {
    return <BreathingGuide onComplete={() => setShowBreathing(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex flex-col">
      <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          <button 
            onClick={() => router.push('/welcome')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 cursor-pointer"
          >
            <span className="text-2xl pointer-events-none">💙</span>
            <div className="pointer-events-none">
              <h1 className="text-lg sm:text-xl font-bold text-text dark:text-white leading-tight">소곤 SOGON</h1>
              <p className="text-xs text-text/60 dark:text-white/60 leading-tight">
                {isAnonymous ? '익명 체험' : session?.user?.name || '게스트'}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <TrustBadge variant="badge" className="hidden sm:inline-block" />
            <PersonaSelector 
              onSelect={setSelectedPersona}
              initialPersona={selectedPersona?.id}
            />
            <button
              onClick={() => router.push('/dashboard')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1"
            >
              <span>📊</span>
              <span className="hidden sm:inline">대시보드</span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1"
            >
              <span>👤</span>
              <span className="hidden sm:inline">프로필</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-text dark:text-white mb-4">
                오늘은 어떤 일이 있었나요?
              </h2>
              <p className="text-text/60 dark:text-white/60 text-sm">
                편하게 이야기해주세요. 제가 들어줄게요 💙
              </p>
            </div>
          )}

          {showCrisis && <CrisisAlert />}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-text dark:text-white'
                }`}
              >
                {message.role === 'assistant' && message.emotion && (
                  <div className="flex items-center gap-2 mb-2 text-sm opacity-70">
                    <span>{EMOTION_CATEGORIES[message.emotion as keyof typeof EMOTION_CATEGORIES]?.emoji}</span>
                    <span>{EMOTION_CATEGORIES[message.emotion as keyof typeof EMOTION_CATEGORIES]?.label}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && <LoadingMessage />}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-text/60 dark:text-white/60 mb-3">
            기록은 내 기기에만 저장됩니다. 분석 시에만 AI로 전송돼요.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="무슨 일이 있었는지 편하게 얘기해주세요..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                rows={2}
                disabled={isLoading}
              />
              {recognitionSupported && (
                <button
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isListening ? '녹음 중지' : '음성 입력'}
                >
                  {isListening ? '⏸️' : '🎤'}
                </button>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-500 hover:shadow-soft disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
