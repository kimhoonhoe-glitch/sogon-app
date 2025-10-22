'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'info' | 'error' | 'success' | 'warning'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    info: 'bg-blue-500 dark:bg-blue-600',
    error: 'bg-red-500 dark:bg-red-600',
    success: 'bg-green-500 dark:bg-green-600',
    warning: 'bg-yellow-500 dark:bg-yellow-600'
  }[type]

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg text-white ${bgColor} transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } max-w-md text-center`}
    >
      {message}
    </div>
  )
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'error' | 'success' | 'warning' }>>([])

  const showToast = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${80 + index * 80}px` }} className="fixed left-1/2 -translate-x-1/2 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  )

  return { showToast, ToastContainer }
}
