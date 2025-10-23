'use client';

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function PremiumPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleSuccess = async () => {
      const sessionId = searchParams.get('session_id')
      if (searchParams.get('success') && sessionId && session?.user?.id) {
        try {
          const response = await fetch('/api/subscription/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          })
          
          if (response.ok) {
            setMessage('구독이 완료되었습니다! 이제 무제한으로 이용하실 수 있어요.')
          } else {
            setMessage('구독 활성화 중 오류가 발생했습니다.')
          }
        } catch (error) {
          setMessage('구독 활성화 중 오류가 발생했습니다.')
        }
      } else if (searchParams.get('canceled')) {
        setMessage('구독이 취소되었습니다.')
      }
    }
    
    handleSuccess()
  }, [searchParams, session])

  const handleUpgrade = async () => {
    if (status !== 'authenticated') {
      router.push('/')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/subscription', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
      setMessage('구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 pt-16">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-3 md:p-4">
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center gap-4">
          <button 
            onClick={() => router.push('/welcome')} 
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-2xl pointer-events-none">💙</span>
            <h1 className="text-lg sm:text-xl font-bold text-text dark:text-white pointer-events-none">프리미엄</h1>
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => router.push('/chat')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1"
            >
              <span>💬</span>
              <span className="hidden sm:inline">대화</span>
            </button>
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

      <main className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl ${
            message.includes('완료') 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
          }`}>
            {message}
          </div>
        )}

        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-text dark:text-white mb-4">
            소곤 SOGON 프리미엄
          </h2>
          <p className="text-text/70 dark:text-white/70 text-lg">
            무제한 대화와 더 깊은 감정 분석을 경험하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-text dark:text-white mb-2">무료</h3>
              <div className="text-4xl font-bold text-text/50 dark:text-white/50">₩0</div>
              <div className="text-sm text-text/60 dark:text-white/60">영원히 무료</div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span className="text-text/80 dark:text-white/80">하루 3회 대화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span className="text-text/80 dark:text-white/80">기본 감정 분석</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span className="text-text/80 dark:text-white/80">주간/월간 차트</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl shadow-soft p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-1 text-xs font-bold rounded-bl-xl">
              인기
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">프리미엄</h3>
              <div className="text-4xl font-bold">₩5,000</div>
              <div className="text-sm opacity-90">매월</div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span>무제한 대화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span>고급 감정 분석</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span>주간/월간 차트</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span>PDF 감정 리포트</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span>AI 패턴 인사이트</span>
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading || status !== 'authenticated'}
              className="w-full bg-white text-primary hover:bg-gray-100 disabled:bg-gray-300 font-bold py-4 rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : status !== 'authenticated' ? '로그인 필요' : '프리미엄 시작하기'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8">
          <h3 className="text-lg font-semibold mb-4 text-text dark:text-white">자주 묻는 질문</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-text dark:text-white mb-2">언제든 취소할 수 있나요?</h4>
              <p className="text-text/70 dark:text-white/70">네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 결제한 기간까지는 프리미엄 기능을 사용할 수 있어요.</p>
            </div>
            <div>
              <h4 className="font-semibold text-text dark:text-white mb-2">결제는 안전한가요?</h4>
              <p className="text-text/70 dark:text-white/70">Stripe를 통해 안전하게 결제가 처리됩니다. 카드 정보는 저장되지 않습니다.</p>
            </div>
            <div>
              <h4 className="font-semibold text-text dark:text-white mb-2">환불이 가능한가요?</h4>
              <p className="text-text/70 dark:text-white/70">서비스를 사용하지 않은 경우 7일 이내 전액 환불이 가능합니다.</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-text/50 dark:text-white/50 px-4">
          테스트 모드로 운영 중입니다. 실제 결제는 발생하지 않습니다.
        </p>
      </main>
    </div>
  )
}
