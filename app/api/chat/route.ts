import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateEmpathyResponse, analyzeEmotion, detectCrisis } from '@/lib/openai'
import { FREE_DAILY_LIMIT } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { message, category, isAnonymous } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hasCrisis = detectCrisis(message)

    if (!isAnonymous && session?.user?.id) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
      })

      if (subscription?.plan === 'free') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayConversations = await prisma.conversation.count({
          where: {
            userId: session.user.id,
            createdAt: { gte: today },
          },
        })

        if (todayConversations >= FREE_DAILY_LIMIT) {
          return new Response(
            JSON.stringify({ 
              error: 'Daily limit reached',
              message: '오늘의 무료 대화 횟수를 모두 사용했어요. 프리미엄으로 업그레이드하면 무제한으로 이용할 수 있어요.',
            }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    const stream = await generateEmpathyResponse(message, category)
    const emotion = await analyzeEmotion(message)

    if (!isAnonymous && session?.user?.id) {
      await prisma.conversation.create({
        data: {
          userId: session.user.id,
          messages: JSON.stringify([{ role: 'user', content: message }]),
          emotion,
          category: category || null,
        },
      })

      await prisma.emotionLog.create({
        data: {
          userId: session.user.id,
          emotions: JSON.stringify({ [emotion]: 1 }),
          score: 5,
        },
      })
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Emotion': emotion,
        'X-Crisis': hasCrisis.toString(),
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
