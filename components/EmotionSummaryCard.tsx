'use client'

import { EMOTION_CATEGORIES } from '@/lib/openai'

interface EmotionData {
  [key: string]: number
}

interface EmotionSummaryCardProps {
  emotionData: EmotionData
}

export default function EmotionSummaryCard({ emotionData }: EmotionSummaryCardProps) {
  const total = Object.values(emotionData).reduce((sum, count) => sum + count, 0)

  if (total === 0) {
    return null
  }

  const emotionPercentages = Object.entries(emotionData).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: Math.round((count / total) * 100),
  }))

  emotionPercentages.sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-xl">
      <h2 className="text-xl font-bold text-text dark:text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        이번 주 감정
      </h2>
      <div className="h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 mb-6"></div>
      
      <div className="space-y-4">
        {emotionPercentages.map(({ emotion, count, percentage }, index) => {
          const emotionInfo = EMOTION_CATEGORIES[emotion as keyof typeof EMOTION_CATEGORIES]
          
          return (
            <div 
              key={emotion}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{emotionInfo?.emoji || '😐'}</span>
                  <span className="font-medium text-text dark:text-white">
                    {emotionInfo?.label || emotion}
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary dark:text-primary-light">
                  {percentage}%
                </span>
              </div>
              
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: emotionInfo?.color || '#B4A7D6',
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                </div>
              </div>
              
              <div className="mt-1 text-xs text-text/60 dark:text-white/60">
                {count}회
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
