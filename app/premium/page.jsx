import { Suspense } from 'react';
import PremiumClient from './PremiumClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PremiumPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const sessionId = searchParams?.session_id;
  const success = searchParams?.success === 'true';
  const canceled = searchParams?.canceled === 'true';

  return (
    <Suspense fallback={<div className="text-center p-8">프리미엄 정보 로딩 중...</div>}>
      <PremiumClient 
        initialSession={session} 
        sessionId={sessionId} 
        success={success} 
        canceled={canceled} 
      />
    </Suspense>
  );
}
