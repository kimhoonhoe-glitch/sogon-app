import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateEmpathyResponse, analyzeEmotion, detectCrisis } from '@/lib/ai'
import { FREE_DAILY_LIMIT } from '@/lib/stripe'
import { sanitizeInput } from '@/lib/sanitize'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    // 데모 모드: API 키 없으면 샘플 응답 반환
    const hasApiKey = !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY)
    
    if (!hasApiKey) {
      const demoResponse = '힘들었겠어요. 지금 이 순간도 충분히 잘 버티고 있는 거예요. 잠시 숨 고르며 쉬어가도 괜찮아요. 💙'
      const encoder = new TextEncoder()
      
      return new Response(
        new ReadableStream({
          start(controller) {
            for (let i = 0; i < demoResponse.length; i += 3) {
              const chunk = demoResponse.slice(i, i + 3)
              controller.enqueue(encoder.encode(chunk))
            }
            controller.close()
          }
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Emotion': 'stress',
            'X-Crisis': 'false',
          },
        }
      )
    }

    const session = await getServerSession(authOptions)
    let { message, category, conversationHistory, personaId } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 입력 전처리: 반복 제거
    message = sanitizeInput(message)

    const isAnonymous = !session?.user?.id

    const hasCrisis = detectCrisis(message)

    if (!isAnonymous && session?.user?.id) {
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

      if (subscription.plan === 'free' || subscription.plan !== 'premium') {
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

    const history = (conversationHistory as ChatMessage[] || []).slice(-5)
    
    const stream = await generateEmpathyResponse(message, category, history, personaId || 'lover')
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
  } catch (error: any) {
    console.error('Chat error:', error)
    
    if (error?.message?.includes('API key')) {
      return new Response(
        JSON.stringify({ 
          error: 'API key missing',
          message: 'OpenAI API 키가 설정되지 않았습니다.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (error?.code === 'ETIMEDOUT' || error?.message?.includes('timeout')) {
      return new Response(
        JSON.stringify({ 
          error: 'Timeout',
          message: '응답 시간이 초과되었어요. 다시 시도해주세요.',
        }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (error?.code === 'content_filter' || error?.message?.includes('content management policy') || error?.message?.includes('content_filter')) {
      return new Response(
        JSON.stringify({ 
          error: 'Content filtered',
          message: '메시지 내용이 안전 정책에 의해 차단되었어요. 다른 표현으로 말씀해주시겠어요? 💙',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        error: 'Server error',
        message: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
