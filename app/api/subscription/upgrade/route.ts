import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    if (
      checkoutSession.payment_status !== 'paid' ||
      checkoutSession.metadata?.userId !== session.user.id ||
      checkoutSession.status !== 'complete'
    ) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    const existingSession = await prisma.subscription.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (existingSession) {
      return NextResponse.json({ error: 'Session already used' }, { status: 400 })
    }

    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        stripeCustomerId: checkoutSession.customer as string,
        stripeSessionId: sessionId,
        status: 'active',
        plan: 'premium',
      },
      create: {
        userId: session.user.id,
        stripeCustomerId: checkoutSession.customer as string,
        stripeSessionId: sessionId,
        status: 'active',
        plan: 'premium',
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    )
  }
}
