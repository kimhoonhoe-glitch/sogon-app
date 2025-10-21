'use client'

import { useState } from 'react'
import { EMOTION_CATEGORIES } from '@/lib/openai'

interface DailyEmotion {
  date: string
  emotion: string
  conversationCount: number
}

interface EmotionCalendarProps {
  dailyEmotions: DailyEmotion[]
}

export default function EmotionCalendar({ dailyEmotions }: EmotionCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getEmotionForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dailyEmotions.find(e => e.date === dateStr)
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  })

  if (dailyEmotions.length === 0) {
    return null
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-xl animate-fadeIn">
      <h2 className="text-xl font-bold text-text dark:text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📅</span>
        감정 캘린더
      </h2>
      <div className="h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 mb-6"></div>

      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-text dark:text-white">{monthName}</h3>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-text/60 dark:text-white/60 py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>
          }

          const emotionData = getEmotionForDate(day)
          const isToday = day === today.getDate()
          const emotionInfo = emotionData 
            ? EMOTION_CATEGORIES[emotionData.emotion as keyof typeof EMOTION_CATEGORIES]
            : null

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(emotionData?.date || null)}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center
                transition-all duration-300 hover:scale-110
                ${isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800' : ''}
                ${emotionData 
                  ? 'bg-white dark:bg-gray-700 shadow-md hover:shadow-lg' 
                  : 'border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
                }
                ${selectedDate === emotionData?.date ? 'scale-110 shadow-lg' : ''}
              `}
              style={{
                backgroundColor: emotionData && emotionInfo ? `${emotionInfo.color}20` : undefined,
              }}
            >
              <div className="text-xs font-medium text-text dark:text-white mb-1">
                {day}
              </div>
              {emotionInfo && (
                <div className="text-lg" title={emotionInfo.label}>
                  {emotionInfo.emoji}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl animate-fadeIn">
          {(() => {
            const data = dailyEmotions.find(e => e.date === selectedDate)
            if (!data) return null
            const emotionInfo = EMOTION_CATEGORIES[data.emotion as keyof typeof EMOTION_CATEGORIES]
            const date = new Date(selectedDate)
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{emotionInfo?.emoji}</span>
                  <div>
                    <div className="font-semibold text-text dark:text-white">
                      {date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-text/60 dark:text-white/60">
                      {emotionInfo?.label} • {data.conversationCount}회 대화
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })()}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(EMOTION_CATEGORIES).map(([key, { emoji, label }]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span className="text-lg">{emoji}</span>
              <span className="text-text/60 dark:text-white/60">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
