'use client'

import { useEffect, useState } from 'react'

export default function BreathingGuide({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= 3) {
      setTimeout(() => onComplete(), 500)
      return
    }

    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('hold')
      } else if (phase === 'hold') {
        setPhase('exhale')
      } else {
        setPhase('inhale')
        setCount(count + 1)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [phase, count, onComplete])

  const messages = {
    inhale: '깊게 들이마시기',
    hold: '잠시 멈추기',
    exhale: '천천히 내쉬기',
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className={`
          w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent
          transition-all duration-[3000ms] ease-in-out
          ${phase === 'inhale' ? 'scale-150 opacity-100' : phase === 'hold' ? 'scale-150 opacity-100' : 'scale-100 opacity-50'}
        `} />
        <h2 className="text-2xl font-medium text-text dark:text-white mb-2">
          {messages[phase]}
        </h2>
        <p className="text-text/60 dark:text-white/60 mb-6">
          {count + 1} / 3
        </p>

        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <p className="text-sm text-text/70 dark:text-white/70 leading-relaxed">
            ✨ 긴장된 신경을 진정시키고<br/>
            💭 복잡한 생각을 정리하며<br/>
            🎯 지금 이 순간에 집중하게 돼요
          </p>
        </div>
        
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm text-text dark:text-white rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
