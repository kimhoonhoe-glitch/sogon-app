'use client'

import { Component, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">💙</div>
            <h1 className="text-2xl font-bold text-text dark:text-white mb-4">
              잠시 오류가 발생했어요
            </h1>
            <p className="text-text/60 dark:text-white/60 mb-6">
              새로고침해보시겠어요?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
              >
                새로고침
              </button>
              <button
                onClick={() => window.location.href = '/welcome'}
                className="px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-text dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-600 transition-all"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
