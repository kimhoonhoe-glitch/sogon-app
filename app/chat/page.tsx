'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// useSearchParams를 호출하는 컴포넌트
function ChatContent() {
  const searchParams = useSearchParams();
  // 여기에 채팅 UI 로직이 들어갑니다.

  // Vercel/Netlify 빌드 성공을 위한 임시 반환
  return (
    <div className="p-6 text-center">
      <h1>채팅 페이지 (빌드 테스트 완료)</h1>
      <p>현재 상태를 확인하기 위한 임시 페이지입니다.</p>
    </div>
  );
}

// Suspense로 감싸서 서버 렌더링 오류를 방지합니다.
export default function ChatPage() {
  return (
    <Suspense fallback={<div>채팅 로딩 중...</div>}>
      <ChatContent />
    </Suspense>
  );
}