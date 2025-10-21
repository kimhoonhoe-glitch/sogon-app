'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchSubscription()
    }
  }, [status])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      const data = await response.json()
      setSubscription(data)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/chat')} className="text-2xl">💙</button>
            <h1 className="text-xl font-bold text-text dark:text-white">프로필</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              💬 대화
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              📊 대시보드
            </button>
            <button
              onClick={() => router.push('/premium')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              ⭐ 프리미엄
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-3xl">
              {session?.user?.image ? (
                <img src={session.user.image} alt="프로필" className="w-full h-full rounded-full" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text dark:text-white">
                {session?.user?.name || '사용자'}
              </h2>
              <p className="text-text/60 dark:text-white/60">{session?.user?.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-text dark:text-white">구독 정보</h3>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-text/60 dark:text-white/60">현재 플랜</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {subscription?.plan === 'premium' ? '프리미엄' : '무료'}
                  </p>
                </div>
                {subscription?.plan === 'free' && (
                  <button
                    onClick={() => router.push('/premium')}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
                  >
                    업그레이드
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-text dark:text-white">계정 관리</h3>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8">
          <h3 className="text-lg font-semibold mb-4 text-text dark:text-white">빠른 이동</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 rounded-xl transition-all text-left"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-text dark:text-white">대화하기</div>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 rounded-xl transition-all text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-text dark:text-white">대시보드</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
