'use client'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function GuestGate({ children }: Props) {
  const requireAuth = process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true'

  if (!requireAuth) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">💙</div>
        <h1 className="text-2xl font-bold text-text dark:text-white mb-4">
          소곤 SOGON
        </h1>
        <p className="text-text/60 dark:text-white/60 mb-6">
          로그인이 필요한 기능입니다
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
          >
            로그인 페이지로
          </button>
          <button
            onClick={() => window.location.href = '/welcome'}
            className="px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-text dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-600 transition-all"
          >
            게스트로 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}
