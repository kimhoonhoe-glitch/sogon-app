'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('✅ PWA Service Worker 등록 완료:', registration)
        })
        .catch(error => {
          console.warn('⚠️ Service Worker 등록 실패:', error)
        })
    }

    // PWA 설치 프롬프트 감지
    let deferredPrompt: any = null
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      console.log('💡 PWA 설치 가능!')
      
      // 스탠드얼론 모드가 아니면 설치 배너 표시 (선택사항)
      if (window.matchMedia('(display-mode: standalone)').matches === false) {
        // 설치 안내를 원하면 여기서 UI 표시
        console.log('💙 홈 화면에 추가하면 더 편하게 사용할 수 있어요!')
      }
    })

    // 설치 완료 이벤트
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA가 설치되었습니다!')
      deferredPrompt = null
    })
  }, [])

  return null
}
