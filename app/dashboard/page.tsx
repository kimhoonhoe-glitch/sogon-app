'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import EmotionSummaryCard from '@/components/EmotionSummaryCard'
import EmotionLineChart from '@/components/EmotionLineChart'
import AIInsightCard from '@/components/AIInsightCard'
import EmotionCalendar from '@/components/EmotionCalendar'

interface DashboardData {
  summary: {
    totalConversations: number
    emotions: { [key: string]: number }
  }
  chartData: Array<{
    date: string
    emotions: { [key: string]: number }
  }>
  dailyEmotions: Array<{
    date: string
    emotion: string
    conversationCount: number
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session?.user?.id) {
      router.replace('/')
      return
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchEmotions()
    }
  }, [status, session, period, router])

  const fetchEmotions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/emotions?period=${period}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch emotions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text/60 dark:text-white/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user?.id) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text/60 dark:text-white/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  const hasData = data && data.summary.totalConversations > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            <button 
              onClick={() => router.push('/welcome')} 
              className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-2xl pointer-events-none">💙</span>
              <div className="pointer-events-none">
                <h1 className="text-lg sm:text-xl font-bold text-text dark:text-white leading-tight">
                  감정 트래커
                </h1>
                <p className="text-xs text-text/60 dark:text-white/60 leading-tight">
                  {session?.user?.name || session?.user?.email || '익명'}님의 감정 기록
                </p>
              </div>
            </button>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => router.push('/chat')}
                className="px-3 sm:px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1 shadow-md hover:shadow-lg"
              >
                <span>💬</span>
                <span className="hidden sm:inline">대화</span>
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1 shadow-md"
              >
                <span>👤</span>
                <span className="hidden sm:inline">프로필</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 justify-center mb-8 animate-fadeIn">
          <button
            onClick={() => setPeriod('week')}
            className={`px-6 py-3 rounded-xl transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📅 주간
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-6 py-3 rounded-xl transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📆 월간
          </button>
        </div>

        {hasData ? (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="animate-slideInLeft">
                <EmotionSummaryCard emotionData={data.summary.emotions} />
              </div>
              <div className="animate-slideInRight">
                <AIInsightCard period={period} emotionData={data.summary.emotions} />
              </div>
            </div>

            <div className="animate-slideInUp">
              <EmotionLineChart data={data.chartData} />
            </div>

            <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <EmotionCalendar dailyEmotions={data.dailyEmotions} />
            </div>

            <div className="text-center py-8">
              <button
                onClick={() => router.push('/chat')}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                💬 마음지기와 대화하기
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/20 dark:border-gray-700/50 animate-fadeIn">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-2xl font-bold text-text dark:text-white mb-4">
                아직 기록이 없어요
              </h2>
              <p className="text-text/60 dark:text-white/60 mb-8 text-lg leading-relaxed">
                마음지기와 첫 대화를 시작해볼까요?<br />
                당신의 감정을 먼저 들어드릴게요. 💙
              </p>
              <button
                onClick={() => router.push('/chat')}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                💬 대화 시작하기
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}
