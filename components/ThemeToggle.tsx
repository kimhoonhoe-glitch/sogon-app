'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 w-10 h-10"
        aria-label="Toggle theme"
        disabled
      />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-500 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <div className="w-6 h-6 flex items-center justify-center">
          <span className="text-2xl" role="img" aria-label="moon">🌙</span>
        </div>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center">
          <span className="text-2xl" role="img" aria-label="sun">☀️</span>
        </div>
      )}
    </button>
  )
}
