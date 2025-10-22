import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import SessionProvider from '@/components/SessionProvider'
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary'
import GuestGate from '@/components/GuestGate'
import PWARegister from '@/components/PWARegister'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '소곤 SOGON',
  description: '말해보세요. 당신 편이 조용히 듣고 있어요',
  keywords: ['감정 상담', 'AI 코칭', '직장인', '스트레스', '멘탈 헬스'],
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#B4A7D6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PWARegister />
        <ErrorBoundaryWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <SessionProvider>
              <GuestGate>
                {children}
              </GuestGate>
            </SessionProvider>
          </ThemeProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
}
