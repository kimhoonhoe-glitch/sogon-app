'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()
  const [showBreathing, setShowBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [phaseTime, setPhaseTime] = useState(3)
  const [cycleCount, setCycleCount] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!showBreathing) return

    const phases = [
      { phase: 'inhale', duration: 3, next: 'hold' },
      { phase: 'hold', duration: 4, next: 'exhale' },
      { phase: 'exhale', duration: 5, next: 'inhale' },
    ]

    const currentPhaseIndex = phases.findIndex(p => p.phase === breathingPhase)
    const currentPhase = phases[currentPhaseIndex]

    let elapsed = 0
    const interval = setInterval(() => {
      elapsed += 0.1
      setPhaseTime(Math.max(0, currentPhase.duration - elapsed))

      if (elapsed >= currentPhase.duration) {
        clearInterval(interval)
        
        if (breathingPhase === 'exhale') {
          setCycleCount(prev => prev + 1)
        }

        if (breathingPhase === 'exhale' && cycleCount >= 2) {
          setTimeout(() => {
            setFadeOut(true)
            setTimeout(() => {
              localStorage.setItem('welcome_completed', 'true')
              router.push('/chat')
            }, 1000)
          }, 500)
        } else {
          setBreathingPhase(currentPhase.next as 'inhale' | 'hold' | 'exhale')
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [showBreathing, breathingPhase, cycleCount, router])

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return '숨 들이쉬기'
      case 'hold':
        return '참기'
      case 'exhale':
        return '내쉬기'
    }
  }

  const getCircleScale = () => {
    const progress = 1 - phaseTime / (breathingPhase === 'inhale' ? 3 : breathingPhase === 'hold' ? 4 : 5)
    
    if (breathingPhase === 'inhale') {
      return 0.5 + progress * 0.5
    } else if (breathingPhase === 'exhale') {
      return 1 - progress * 0.5
    }
    return 1
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/10 dark:from-primary/20 dark:via-gray-800/50 dark:to-gray-900">
        {mounted && (
          <div className="particles-container absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${20 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {!showBreathing ? (
          <div className="text-center animate-fadeIn">
            <div className="mb-8 text-8xl animate-float">
              🌙
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-text dark:text-white mb-6 leading-tight">
              오늘 하루<br />
              수고 많으셨어요
            </h1>
            
            <p className="text-xl sm:text-2xl text-text/70 dark:text-white/70 mb-4">
              편안하게 시작할 준비되셨나요?
            </p>
            
            <div className="max-w-md mx-auto mb-12 px-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-3 text-left mb-4">
                  <span className="text-2xl mt-1">🫁</span>
                  <div>
                    <h3 className="font-semibold text-text dark:text-white mb-2">3-4-5 호흡법</h3>
                    <p className="text-sm text-text/70 dark:text-white/70 leading-relaxed mb-3">
                      3초 들이쉬고, 4초 참고, 5초 내쉬는 리듬으로
                      마음을 편안하게 만들어요.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-2">
                    <span className="text-sm">✨</span>
                    <p className="text-xs text-text/60 dark:text-white/60">
                      <strong>스트레스 완화:</strong> 긴장된 신경을 진정시켜요
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm">💭</span>
                    <p className="text-xs text-text/60 dark:text-white/60">
                      <strong>마음 안정:</strong> 복잡한 생각을 정리할 수 있어요
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm">🎯</span>
                    <p className="text-xs text-text/60 dark:text-white/60">
                      <strong>집중력 향상:</strong> 지금 이 순간에 집중하게 돼요
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowBreathing(true)}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🫁 호흡하고 시작하기
                </button>
                
                <button
                  onClick={() => {
                    localStorage.setItem('welcome_completed', 'true')
                    router.push('/chat?skipBreathing=true')
                  }}
                  className="px-8 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-text dark:text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  바로 시작하기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center animate-fadeIn">
            <div className="mb-12">
              <div className="relative w-64 h-64 mx-auto">
                <div
                  className="absolute inset-0 rounded-full border-8 border-primary/30 flex items-center justify-center transition-all duration-1000 ease-in-out"
                  style={{
                    transform: `scale(${getCircleScale()})`,
                    borderColor: breathingPhase === 'inhale' 
                      ? 'rgba(180, 167, 214, 0.5)' 
                      : breathingPhase === 'hold'
                      ? 'rgba(255, 193, 114, 0.5)'
                      : 'rgba(180, 167, 214, 0.3)',
                  }}
                >
                  <div className="text-6xl font-bold text-primary dark:text-primary/80">
                    {Math.ceil(phaseTime)}
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-white mb-3">
              {getPhaseText()}
            </h2>
            
            <p className="text-lg text-text/60 dark:text-white/60 mb-8">
              {breathingPhase === 'inhale' && '코로 천천히 들이마셔요'}
              {breathingPhase === 'hold' && '잠시 숨을 참아요'}
              {breathingPhase === 'exhale' && '입으로 천천히 내쉬어요'}
            </p>

            <div className="max-w-sm mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 mb-6">
              <p className="text-sm text-text/70 dark:text-white/70 leading-relaxed">
                ✨ 긴장된 신경을 진정시키고<br/>
                💭 복잡한 생각을 정리하며<br/>
                🎯 지금 이 순간에 집중하게 돼요
              </p>
            </div>

            <div className="mt-8 flex gap-2 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < cycleCount ? 'bg-primary scale-125' : 
                    i === cycleCount ? 'bg-primary/50 animate-pulse' : 
                    'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => {
                localStorage.setItem('welcome_completed', 'true')
                router.push('/chat?skipBreathing=true')
              }}
              className="mt-8 px-6 py-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm text-text dark:text-white rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              건너뛰기
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .particles-container {
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(180, 167, 214, 0.6), transparent);
          border-radius: 50%;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
