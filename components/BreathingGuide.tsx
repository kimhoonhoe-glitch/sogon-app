'use client'

import { useEffect, useState } from 'react'

export default function BreathingGuide({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [count, setCount] = useState(0)
  const [timer, setTimer] = useState(4)

  // 4-7-8 호흡법 타이밍
  const phaseDurations = {
    inhale: 4000,  // 4초
    hold: 7000,    // 7초
    exhale: 8000,  // 8초
  }

  const phaseTimers = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  }

  useEffect(() => {
    if (count >= 3) {
      setTimeout(() => onComplete(), 500)
      return
    }

    const duration = phaseDurations[phase]
    const totalSeconds = phaseTimers[phase]
    
    // 카운트다운 타이머
    const countdownInterval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          return phaseTimers[phase]
        }
        return prev - 1
      })
    }, 1000)

    // 페이즈 전환 타이머
    const phaseTimer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('hold')
        setTimer(7)
      } else if (phase === 'hold') {
        setPhase('exhale')
        setTimer(8)
      } else {
        setPhase('inhale')
        setTimer(4)
        setCount(count + 1)
      }
    }, duration)

    return () => {
      clearTimeout(phaseTimer)
      clearInterval(countdownInterval)
    }
  }, [phase, count, onComplete])

  const messages = {
    inhale: '코로 깊게 들이마시기',
    hold: '숨을 멈추고 있기',
    exhale: '입으로 천천히 내쉬기',
  }

  const phaseColors = {
    inhale: 'from-blue-400 to-cyan-400',
    hold: 'from-purple-400 to-pink-400',
    exhale: 'from-green-400 to-teal-400',
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lavender-100 via-beige-100 to-lavender-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 애니메이션 원 */}
        <div className="relative w-48 h-48 mx-auto mb-12">
          <div className={`
            absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[phase]}
            transition-all ease-in-out
            ${phase === 'inhale' ? 'scale-100' : phase === 'hold' ? 'scale-100' : 'scale-75'}
          `} 
          style={{
            transitionDuration: `${phaseDurations[phase]}ms`
          }}
          />
          
          {/* 중앙 카운트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white drop-shadow-lg">
              {timer}
            </span>
          </div>
          
          {/* 펄스 효과 */}
          <div className={`
            absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[phase]}
            animate-ping opacity-20
          `} />
        </div>

        <h2 className="text-3xl font-bold text-text dark:text-white mb-2">
          {messages[phase]}
        </h2>
        <p className="text-text/60 dark:text-white/60 mb-8 text-lg">
          {count + 1} / 3 라운드
        </p>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-text dark:text-white mb-3">
            4-7-8 호흡법
          </h3>
          <p className="text-sm text-text/70 dark:text-white/70 leading-relaxed">
            ✨ 스트레스와 긴장 완화<br/>
            💭 마음의 평화와 안정<br/>
            😴 숙면에 도움<br/>
            🎯 집중력 향상
          </p>
        </div>
        
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-text dark:text-white rounded-full hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 font-medium"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
