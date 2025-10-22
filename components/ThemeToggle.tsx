'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDaytime, setIsDaytime] = useState<boolean | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      setIsDaytime(hour >= 6 && hour < 18)
    }
    
    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted || isDaytime === null) {
    return (
      <button className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50">
        <div className="w-6 h-6" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-500 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {isDaytime ? (
        <div className="w-6 h-6 flex items-center justify-center animate-pulse">
          <span className="text-2xl" role="img" aria-label="sun">☀️</span>
        </div>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center">
          <span className="text-2xl" role="img" aria-label="moon">🌙</span>
        </div>
      )}
    </button>
  )
}
