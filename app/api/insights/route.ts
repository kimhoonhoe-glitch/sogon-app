import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { openai } from '@/lib/openai'
import { EMOTION_CATEGORIES } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { period, emotionData } = await req.json()

    if (!emotionData || Object.keys(emotionData).length === 0) {
      return NextResponse.json({ 
        insight: '아직 데이터가 충분하지 않아요. 조금 더 대화를 나눠볼까요? 💙' 
      })
    }

    const emotionSummary = Object.entries(emotionData)
      .map(([emotion, count]) => {
        const info = EMOTION_CATEGORIES[emotion as keyof typeof EMOTION_CATEGORIES]
        return `${info?.label || emotion}: ${count}회`
      })
      .join(', ')

    const prompt = `당신은 감정 코칭 전문가입니다. 다음 감정 데이터를 분석하여 짧고 따뜻한 인사이트를 제공해주세요.

기간: ${period === 'week' ? '이번 주' : '이번 달'}
감정 데이터: ${emotionSummary}

조건:
- 2-3문장으로 간결하게
- 반말 사용
- 공감하고 위로하는 톤
- 실천 가능한 조언 포함
- 이모지 1-2개 사용

예시:
"이번 주 월요일에 스트레스가 높았어요. 주말에 충분히 쉬는 게 중요할 것 같아요. 💙"
"감정 변화가 다양했네요. 자신의 감정을 잘 느끼고 있다는 뜻이에요. 👍"`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '당신은 따뜻하고 공감적인 감정 코칭 전문가입니다.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const insight = response.choices[0]?.message?.content?.trim() || 
      '감정 패턴을 분석하고 있어요. 조금 더 대화를 나눠볼까요? 💙'

    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Insight generation error:', error)
    return NextResponse.json({ 
      insight: '데이터를 분석하는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요. 💙' 
    })
  }
}
