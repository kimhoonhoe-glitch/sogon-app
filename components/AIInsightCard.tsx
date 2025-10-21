'use client'

import { useEffect, useState } from 'react'

interface AIInsightCardProps {
  period: 'week' | 'month'
  emotionData: { [key: string]: number }
}

export default function AIInsightCard({ period, emotionData }: AIInsightCardProps) {
  const [insight, setInsight] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (Object.keys(emotionData).length > 0) {
      fetchInsight()
    }
  }, [period, emotionData])

  const fetchInsight = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, emotionData }),
      })

      if (response.ok) {
        const data = await response.json()
        setInsight(data.insight)
      } else if (response.status === 401) {
        setInsight('로그인이 필요한 기능이에요. 💙')
      } else {
        setInsight('인사이트를 가져오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요. 💙')
      }
    } catch (error) {
      console.error('Failed to fetch insight:', error)
      setInsight('데이터를 분석하는 중 문제가 발생했어요. 💙')
    } finally {
      setLoading(false)
    }
  }

  if (Object.keys(emotionData).length === 0) {
    return null
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 dark:from-primary/20 dark:via-accent/20 dark:to-secondary/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-xl animate-fadeIn">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl opacity-50"></div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-text dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          AI 인사이트
        </h2>
        <div className="h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 mb-6"></div>

        {loading ? (
          <div className="flex items-center gap-3 py-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-text/60 dark:text-white/60 ml-2">분석 중...</span>
          </div>
        ) : insight ? (
          <div className="space-y-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-text dark:text-white leading-relaxed whitespace-pre-line">
                {insight}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text/60 dark:text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>GPT-4o-mini가 {period === 'week' ? '이번 주' : '이번 달'} 패턴을 분석했어요</span>
            </div>
          </div>
        ) : (
          <p className="text-text/60 dark:text-white/60">
            데이터를 분석하고 있어요... 🤔
          </p>
        )}
      </div>

      <style jsx>{`
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
          animation: fadeIn 0.7s ease-out;
        }
      `}</style>
    </div>
  )
}
