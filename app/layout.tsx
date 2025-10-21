import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const pretendard = localFont({
  src: [
    {
      path: './fonts/PretendardVariable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  title: '마음지기 | MindKeeper',
  description: '직장인을 위한 AI 감정 코칭 앱. 당신의 감정을 먼저 들어드릴게요.',
  keywords: ['감정 상담', 'AI 코칭', '직장인', '스트레스', '멘탈 헬스'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${pretendard.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
