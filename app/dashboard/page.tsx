'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import ThemeToggle from '@/components/ThemeToggle'
import { EMOTION_CATEGORIES } from '@/lib/openai'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchEmotions()
    }
  }, [status, period])

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text/60 dark:text-white/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  const emotionData = data?.summary?.emotions || {}
  const emotionLabels = Object.keys(emotionData)
  const emotionValues = Object.values(emotionData) as number[]
  const emotionColors = emotionLabels.map(
    (emotion) => EMOTION_CATEGORIES[emotion as keyof typeof EMOTION_CATEGORIES]?.color || '#ccc'
  )

  const doughnutData = {
    labels: emotionLabels.map(
      (emotion) => EMOTION_CATEGORIES[emotion as keyof typeof EMOTION_CATEGORIES]?.label || emotion
    ),
    datasets: [
      {
        data: emotionValues,
        backgroundColor: emotionColors,
        borderWidth: 0,
      },
    ],
  }

  const barData = {
    labels: emotionLabels.map(
      (emotion) => EMOTION_CATEGORIES[emotion as keyof typeof EMOTION_CATEGORIES]?.label || emotion
    ),
    datasets: [
      {
        label: '감정 횟수',
        data: emotionValues,
        backgroundColor: emotionColors,
      },
    ],
  }

  const getMostFrequentEmotion = () => {
    if (emotionLabels.length === 0) return null
    const maxIndex = emotionValues.indexOf(Math.max(...emotionValues))
    return emotionLabels[maxIndex]
  }

  const mostFrequent = getMostFrequentEmotion()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/chat')} className="text-2xl">💙</button>
            <h1 className="text-xl font-bold text-text dark:text-white">감정 트래커</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              프로필
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setPeriod('week')}
            className={`px-6 py-3 rounded-xl transition-all font-semibold ${
              period === 'week'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-6 py-3 rounded-xl transition-all font-semibold ${
              period === 'month'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            월간
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
            <h3 className="text-sm text-text/60 dark:text-white/60 mb-2">총 대화</h3>
            <p className="text-3xl font-bold text-primary">{data?.summary?.totalConversations || 0}회</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
            <h3 className="text-sm text-text/60 dark:text-white/60 mb-2">가장 많은 감정</h3>
            <p className="text-3xl font-bold text-text dark:text-white">
              {mostFrequent ? (
                <>
                  {EMOTION_CATEGORIES[mostFrequent as keyof typeof EMOTION_CATEGORIES]?.emoji}{' '}
                  {EMOTION_CATEGORIES[mostFrequent as keyof typeof EMOTION_CATEGORIES]?.label}
                </>
              ) : (
                '-'
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
            <h3 className="text-sm text-text/60 dark:text-white/60 mb-2">감정 종류</h3>
            <p className="text-3xl font-bold text-accent">{emotionLabels.length}가지</p>
          </div>
        </div>

        {emotionLabels.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold mb-4 text-text dark:text-white">감정 분포</h3>
              <div className="max-w-xs mx-auto">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold mb-4 text-text dark:text-white">감정 빈도</h3>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 },
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-12 text-center">
            <p className="text-text/60 dark:text-white/60 text-lg">
              아직 대화 기록이 없어요.<br />
              마음지기와 대화를 시작해보세요!
            </p>
            <button
              onClick={() => router.push('/chat')}
              className="mt-6 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
            >
              대화 시작하기
            </button>
          </div>
        )}

        {mostFrequent && (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold mb-3 text-text dark:text-white">AI 인사이트</h3>
            <p className="text-text/80 dark:text-white/80 leading-relaxed">
              {period === 'week' ? '이번 주' : '이번 달'}에는{' '}
              <strong>{EMOTION_CATEGORIES[mostFrequent as keyof typeof EMOTION_CATEGORIES]?.label}</strong>{' '}
              감정을 가장 많이 느끼셨네요. {' '}
              {mostFrequent === 'stress' && '충분한 휴식을 취하고 스스로를 돌보는 시간을 가져보세요.'}
              {mostFrequent === 'anxiety' && '불안한 마음이 들 때는 깊은 호흡과 함께 현재에 집중해보세요.'}
              {mostFrequent === 'anger' && '화가 날 때는 잠시 멈추고 자신의 감정을 인정하는 것이 중요해요.'}
              {mostFrequent === 'sadness' && '슬픔은 자연스러운 감정이에요. 자신에게 충분히 위로를 해주세요.'}
              {mostFrequent === 'joy' && '긍정적인 감정을 많이 느끼셨네요! 이 기분을 오래 간직하세요.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
