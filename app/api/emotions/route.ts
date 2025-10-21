import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const period = searchParams.get('period') || 'week'

    const date = new Date()
    if (period === 'week') {
      date.setDate(date.getDate() - 7)
    } else if (period === 'month') {
      date.setMonth(date.getMonth() - 1)
    }

    const emotionLogs = await prisma.emotionLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: date },
      },
      orderBy: { date: 'asc' },
    })

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: date },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      emotionLogs,
      conversations,
      summary: {
        totalConversations: conversations.length,
        emotions: conversations.reduce((acc: Record<string, number>, conv) => {
          if (conv.emotion) {
            acc[conv.emotion] = (acc[conv.emotion] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>),
      },
    })
  } catch (error) {
    console.error('Emotions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emotions' },
      { status: 500 }
    )
  }
}
