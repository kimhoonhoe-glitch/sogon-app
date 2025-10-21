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

function sanitizeMessage(message: string): string {
  const sensitivePatterns = [
    { pattern: /루저/gi, replacement: '부족하다고 느끼는 사람' },
    { pattern: /쓰레기/gi, replacement: '가치 없다고 느끼는 사람' },
    { pattern: /죽고\s*싶/gi, replacement: '매우 힘들' },
    { pattern: /자살/gi, replacement: '극심한 고통' },
  ]
  
  let sanitized = message
  for (const { pattern, replacement } of sensitivePatterns) {
    sanitized = sanitized.replace(pattern, replacement)
  }
  
  return sanitized
}

export async function generateEmpathyResponse(
  userMessage: string,
  category?: string,
  conversationHistory?: ChatMessage[]
): Promise<ReadableStream> {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key가 설정되지 않았습니다. 환경 변수를 확인해주세요.')
  }
  
  const sanitizedMessage = sanitizeMessage(userMessage)

  const systemPrompt = `당신은 공감과 위로를 제공하는 따뜻한 대화 상담사입니다.

역할: 
감정을 이해하고 건강한 관점을 제시하는 지지적 상담사입니다.

대화 원칙:

1. 감정 인정하기
- 상대방의 현재 감정을 인정해주세요
- "힘든 상황이네요", "그런 기분이 드는 게 이해돼요"와 같이 표현하세요

2. 긍정적 재구성
- 어려움 속에서도 성장과 배움의 기회를 찾아주세요
- 이미 가지고 있는 강점을 상기시켜주세요
- 작은 진전도 격려해주세요

3. 건설적 조언
- 실천 가능한 작은 행동을 제안하세요
- 자기 돌봄의 중요성을 강조하세요
- 예: "충분한 휴식 취하기", "작은 목표부터 시작하기"

4. 희망과 회복력 강조
- 변화와 성장의 가능성을 상기시키세요
- 현재 상황이 영원하지 않음을 알려주세요
- 내면의 힘과 잠재력을 믿어주세요

말하는 방식:
- 따뜻하고 지지적인 반말 사용
- 3~5문장으로 간결하게 표현
- 차분하고 희망적인 톤 유지
- 이모지는 최소한으로 사용 (1개 정도)

좋은 응답 예시:
"지금 많이 힘든 시간을 보내고 있는 것 같아요. 하지만 이렇게 자신의 감정을 표현할 수 있다는 것 자체가 큰 용기예요. 완벽하지 않아도 괜찮아요. 한 걸음씩 나아가다 보면 변화가 올 거예요."

피하기:
- 부정적 감정을 강화하는 표현
- 과도한 동정이나 연민
- 비현실적인 낙관론

${category ? `\n대화 맥락: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
  ]

  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-5).map(msg => ({
      role: msg.role,
      content: msg.role === 'user' ? sanitizeMessage(msg.content) : msg.content
    }))
    messages.push(...recentHistory)
  }

  messages.push({ role: 'user', content: sanitizedMessage })

  const stream = await openai.chat.completions.create(
    {
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
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
