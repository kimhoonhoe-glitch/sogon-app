'use client'

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

export default function DashboardTestPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmotions()
  }, [period])

  const fetchEmotions = async () => {
    try {
      setLoading(true)
      
      const sampleData: DashboardData = {
        summary: {
          totalConversations: 83,
          emotions: {
            joy: 15,
            sadness: 18,
            anger: 12,
            anxiety: 20,
            stress: 18,
          }
        },
        chartData: generateChartData(period === 'week' ? 7 : 30),
        dailyEmotions: generateDailyEmotions(period === 'week' ? 7 : 30),
      }
      
      setData(sampleData)
    } catch (error) {
      console.error('Failed to fetch emotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (days: number) => {
    const data = []
    const emotions = ['joy', 'sadness', 'anger', 'anxiety', 'stress']
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      
      const emotionData: { [key: string]: number } = {}
      emotions.forEach(emotion => {
        emotionData[emotion] = Math.floor(Math.random() * 3)
      })
      
      data.push({
        date: dateStr,
        emotions: emotionData,
      })
    }
    
    return data
  }

  const generateDailyEmotions = (days: number) => {
    const data = []
    const emotions = ['joy', 'sadness', 'anger', 'anxiety', 'stress']
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      
      if (Math.random() > 0.3) {
        data.push({
          date: dateStr,
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          conversationCount: Math.floor(Math.random() * 3) + 1,
        })
      }
    }
    
    return data
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/chat')} 
                className="text-3xl hover:scale-110 transition-transform duration-300"
              >
                💙
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-white">
                  감정 트래커
                </h1>
                <p className="text-xs sm:text-sm text-text/60 dark:text-white/60">
                  테스트 사용자님의 감정 기록
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/chat')}
                className="px-3 sm:px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all text-sm font-medium shadow-md hover:shadow-lg"
              >
                💬 대화
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
