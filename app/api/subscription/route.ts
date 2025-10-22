import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, PREMIUM_PRICE } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      const newSubscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          status: 'free',
          plan: 'free',
        },
      })
      return NextResponse.json(newSubscription)
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Subscription GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          status: 'free',
          plan: 'free',
        },
      })
    }

      const checkoutSession = await stripe!.checkout.sessions.create({ // 여기에 느낌표 추가!
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'krw',
            product_data: {
              name: '마음지기 프리미엄',
              description: '무제한 대화 + PDF 감정 리포트',
            },
            unit_amount: PREMIUM_PRICE,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/premium?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Subscription POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
