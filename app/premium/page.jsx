import { Suspense } from 'react';
import PremiumClient from './PremiumClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

// 이 파일은 Next.js의 표준 서버 컴포넌트이며, useSearchParams 훅을 사용하지 않습니다.

export default async function PremiumPage({ searchParams }) {
  // 1. 서버에서 로그인 상태 확인 및 리다이렉트 (안전한 서버 로직)
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // 2. 서버에서 쿼리 파라미터를 읽어서 클라이언트에 전달 (빌드 오류 방지)
  const sessionId = searchParams?.session_id;
  const success = searchParams?.success === 'true';
  const canceled = searchParams?.canceled === 'true';

  // 3. 클라이언트 컴포넌트 렌더링
  return (
    <Suspense fallback={<div className="text-center p-8">프리미엄 정보 로딩 중...</div>}>
      {/* PremiumClient에 필요한 모든 props를 서버에서 전달합니다. */}
      <PremiumClient 
        initialSession={session} 
        sessionId={sessionId} 
        success={success} 
        canceled={canceled} 
      />
    </Suspense>
  );
}
