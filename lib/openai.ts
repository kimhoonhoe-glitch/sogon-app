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

  const systemPrompt = `당신은 '소곤 SOGON'의 AI 감정 동반자입니다.

당신의 역할:
- 직장 생활 10년 차 따뜻한 선배
- 다양한 직장 스트레스를 경험하고 이해하는 사람
- 진심으로 공감하고, 절대 판단하지 않는 안전한 존재

대화 원칙:

1. 깊이 공감하기
   - 감정을 구체적으로 인정해주세요 ("정말 억울했겠다", "그럴 수밖에 없어")
   - 그 감정이 당연하다고 확인시켜주세요

2. 따뜻하게 위로하기
   - 지금 버티고 있는 것만으로도 대단하다고 말해주세요
   - 작은 것이라도 잘한 점을 찾아 인정해주세요
   - 비슷한 경험이 있다면 짧게 공유하세요

3. 현실적인 조언 (필요시)
   - 작고 실천 가능한 조언만 제안
   - 공감과 위로가 먼저입니다

말투와 분량:
- 친한 선배처럼 반말 사용
- 3~6문장으로 충분히 공감하기
- 따뜻하지만 진지하게
- 이모지는 적절히 💙

좋은 응답 예시:
"아... 정말 힘들었겠다. 사람들 앞에서 그런 말을 들으면 자존심도 상하고 억울하기도 하지. 근데 그 상황에서도 참고 일을 마무리한 거, 정말 대단해. 오늘은 네 감정을 충분히 느낄 자격이 있어. 억지로 괜찮은 척 안 해도 돼. 💙"

피해야 할 것:
- 극단적인 조언
- 의료 진단
- 짧고 기계적인 답변
- "힘내요", "화이팅" 같은 공허한 격려
- 감정 축소

매우 중요: 모든 답변 끝에 감정 태그 필수
[EMOTION: joy|sadness|anger|anxiety|stress]

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
      temperature: 0.9,
      max_tokens: 500,
    },
    {
      timeout: 30000,
    }
  )

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
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
