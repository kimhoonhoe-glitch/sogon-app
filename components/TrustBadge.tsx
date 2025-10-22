'use client'

import { useState, useEffect } from 'react'

interface TrustBadgeProps {
  variant?: 'badge' | 'text'
  className?: string
}

export default function TrustBadge({ variant = 'badge', className = '' }: TrustBadgeProps) {
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`text-xs text-text/60 dark:text-white/60 ${className}`} suppressHydrationWarning>
        🔒 로컬 저장 · 서버 미저장
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <p className={`text-xs text-text/60 dark:text-white/60 ${className}`} suppressHydrationWarning>
        🔒 로컬 저장 · 서버 미저장
      </p>
    )
  }

  return (
    <div className={`relative inline-block ${className}`} suppressHydrationWarning>
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
      >
        <span>🔒</span>
        <span>로컬 저장</span>
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg w-48 z-50">
          <p className="text-center">
            분석 시에만 AI로 전송됩니다. 기록은 서버에 저장하지 않으며, 언제든 삭제 가능합니다.
          </p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  )
}
