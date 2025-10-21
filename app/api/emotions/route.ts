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
    const daysBack = period === 'week' ? 7 : 30
    date.setDate(date.getDate() - daysBack)

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: date },
      },
      orderBy: { createdAt: 'asc' },
    })

    const emotionSummary: Record<string, number> = {}
    const dailyData: Record<string, { emotions: Record<string, number>, count: number }> = {}

    conversations.forEach(conv => {
      if (conv.emotion) {
        emotionSummary[conv.emotion] = (emotionSummary[conv.emotion] || 0) + 1
        
        const dateStr = conv.createdAt.toISOString().split('T')[0]
        if (!dailyData[dateStr]) {
          dailyData[dateStr] = { emotions: {}, count: 0 }
        }
        dailyData[dateStr].emotions[conv.emotion] = (dailyData[dateStr].emotions[conv.emotion] || 0) + 1
        dailyData[dateStr].count++
      }
    })

    const dailyEmotions = Object.entries(dailyData).map(([date, data]) => {
      const mostFrequent = Object.entries(data.emotions).reduce((max, [emotion, count]) => 
        count > (data.emotions[max] || 0) ? emotion : max
      , Object.keys(data.emotions)[0])

      return {
        date,
        emotion: mostFrequent,
        conversationCount: data.count,
      }
    })

    const chartData = []
    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      
      chartData.push({
        date: dateStr,
        emotions: dailyData[dateStr]?.emotions || {},
      })
    }

    return NextResponse.json({
      summary: {
        totalConversations: conversations.length,
        emotions: emotionSummary,
      },
      chartData,
      dailyEmotions,
    })
  } catch (error) {
    console.error('Emotions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emotions' },
      { status: 500 }
    )
  }
}
