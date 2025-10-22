'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ThemeToggle from '@/components/ThemeToggle'
import TrustBadge from '@/components/TrustBadge'

interface LoginForm {
  email: string
  password: string
}

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue } = useForm<LoginForm>()

  // 저장된 이메일 불러오기 + 페이지 prefetch
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email')
    if (savedEmail) {
      setValue('email', savedEmail)
      setRememberEmail(true)
    }
    
    // /chat와 /welcome 페이지 미리 로드
    router.prefetch('/chat')
    router.prefetch('/welcome')
  }, [setValue, router])

  // 자동 리다이렉트 제거 - 사용자가 버튼을 눌러야만 이동

  const onEmailLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        mode: 'login',
        redirect: false,
      })
      
      if (result?.ok) {
        // 이메일 저장 체크 시 localStorage에 저장
        if (rememberEmail) {
          localStorage.setItem('saved_email', data.email)
        } else {
          localStorage.removeItem('saved_email')
        }
        
        const welcomeCompleted = localStorage.getItem('welcome_completed')
        if (welcomeCompleted) {
          router.push('/chat')
        } else {
          router.push('/welcome')
        }
      } else {
        setIsLoading(false)
        alert('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (error) {
      setIsLoading(false)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  const onEmailSignup = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        mode: 'signup',
        redirect: false,
      })
      
      if (result?.ok) {
        // 이메일 저장 체크 시 localStorage에 저장
        if (rememberEmail) {
          localStorage.setItem('saved_email', data.email)
        } else {
          localStorage.removeItem('saved_email')
        }
        
        router.push('/welcome')
      } else {
        setIsLoading(false)
        alert('회원가입에 실패했습니다. 이미 존재하는 이메일일 수 있습니다.')
      }
    } catch (error) {
      setIsLoading(false)
      alert('회원가입 중 오류가 발생했습니다.')
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/chat' })
  }

  const handleAnonymous = () => {
    setIsAnonymous(true)
    const welcomeCompleted = localStorage.getItem('welcome_completed')
    if (welcomeCompleted) {
      router.push('/chat?anonymous=true&skipBreathing=true')
    } else {
      router.push('/welcome')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-soft mb-6">
            <span className="text-5xl">💙</span>
          </div>
          <h1 className="text-4xl font-bold text-text dark:text-white mb-4">
            소곤 SOGON
          </h1>
          <p className="text-text/70 dark:text-white/70 text-lg leading-relaxed px-4">
            말해보세요.<br />
            당신 편이 조용히 듣고 있어요
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 space-y-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text dark:text-white">
                이메일
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text dark:text-white">
                비밀번호
              </label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberEmail"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
              />
              <label 
                htmlFor="rememberEmail" 
                className="text-sm text-text dark:text-white cursor-pointer"
              >
                이메일 주소 저장
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSubmit(onEmailLogin)}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-primary text-primary font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
              <button
                type="button"
                onClick={handleSubmit(onEmailSignup)}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </button>
            </div>
            <p className="text-xs text-center text-text/60 dark:text-white/60 mt-2">
              처음이신가요? 회원가입 버튼을 눌러주세요. 이미 계정이 있다면 로그인하세요.
            </p>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-text/60 dark:text-white/60">
                또는
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text dark:text-white font-semibold py-3 rounded-xl transition-all duration-500 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            구글로 계속하기
          </button>

          <button
            onClick={handleAnonymous}
            className="w-full bg-accent/20 hover:bg-accent/30 text-text dark:text-white font-semibold py-3 rounded-xl transition-all duration-500"
          >
            익명으로 체험하기
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mt-6">
          <TrustBadge variant="text" />
          <p className="text-center text-xs text-text/50 dark:text-white/50 px-4">
            마음지기는 의료 서비스가 아닙니다.<br />
            응급 상황 시 전문 상담사와 상담하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
