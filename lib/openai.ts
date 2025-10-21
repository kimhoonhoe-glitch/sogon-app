import OpenAI from 'openai'
import { EMOTION_CATEGORIES, WORKPLACE_CATEGORIES } from './emotions'

const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL

if (!apiKey && typeof window === 'undefined') {
  console.warn('⚠️ OpenAI API key is not set. AI features will not work.')
}

export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  baseURL: baseURL || undefined,
})

export { EMOTION_CATEGORIES, WORKPLACE_CATEGORIES }

export const CRISIS_KEYWORDS = [
  '죽고 싶',
  '자살',
  '목숨',
  '생을 마감',
  '사라지고 싶',
  '끝내고 싶',
]

export function detectCrisis(message: string): boolean {
  return CRISIS_KEYWORDS.some(keyword => message.includes(keyword))
}

export async function analyzeEmotion(message: string): Promise<keyof typeof EMOTION_CATEGORIES> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '다음 메시지의 감정을 하나만 선택하세요: joy, sadness, anger, anxiety, stress. 단어 하나만 답변하세요.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    })

    const emotion = response.choices[0]?.message?.content?.trim().toLowerCase() as keyof typeof EMOTION_CATEGORIES
    
    if (emotion && emotion in EMOTION_CATEGORIES) {
      return emotion
    }
    
    return 'stress'
  } catch (error) {
    console.error('Emotion analysis error:', error)
    return 'stress'
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function generateEmpathyResponse(
  userMessage: string,
  category?: string,
  conversationHistory?: ChatMessage[]
): Promise<ReadableStream> {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key가 설정되지 않았습니다. 환경 변수를 확인해주세요.')
  }

  const systemPrompt = `당신은 따뜻하게 위로해주는 친구입니다.

역할:
직장 생활 경험이 많은 선배로, 상대방의 힘든 마음을 잘 이해합니다.

대화 원칙:

1. 진심으로 공감하기
- 상대의 감정을 정확히 알아주세요 ("정말 힘들었겠다", "속상했을 것 같아", "많이 지쳤겠어")
- 그 감정이 당연하다고 확인해주세요 ("충분히 그럴 수 있어", "누구나 그랬을 거야")

2. 따뜻하게 위로하기
- 버티고 있는 것만으로도 잘하고 있다고 말해주세요
- 작은 것이라도 해낸 점을 인정해주세요
- 비슷한 경험이 있다면 짧게 나눠주세요

3. 감정 허용하기
- 지금 느끼는 감정을 충분히 느껴도 된다고 말해주세요
- 무조건 긍정적으로 생각하라고 하지 마세요

4. 조언은 조심스럽게
- 위로를 먼저 하고, 필요하면 작은 조언만
- 예: "오늘은 푹 쉬어", "좋아하는 것 하면서 기분 전환해봐"

말하는 방식:
- 친한 친구처럼 반말로 편하게
- 3~6문장으로 충분히 공감하고 위로
- 진지하고 따뜻한 톤
- 이모지 1~2개 정도만

좋은 위로 예시:
"정말 힘든 하루였겠다. 그런 말 들으면 속상하고 억울하지. 그래도 끝까지 버텨낸 거 정말 대단해. 나라도 힘들었을 것 같아. 오늘은 네 감정 그대로 느껴도 괜찮아. 무리하지 마."

피하기:
- 공허한 격려 ("힘내", "화이팅")
- 짧고 형식적인 답변
- 감정 무시하기

${category ? `\n상황: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
  ]

  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-5)
    messages.push(...recentHistory)
  }

  messages.push({ role: 'user', content: userMessage })

  const stream = await openai.chat.completions.create(
    {
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 1.0,
      max_tokens: 600,
    },
    {
      timeout: 30000,
    }
  )

  return new ReadableStream({
    async start(controller) {
      try {
        let fullResponse = ''
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            controller.enqueue(new TextEncoder().encode(content))
          }
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
