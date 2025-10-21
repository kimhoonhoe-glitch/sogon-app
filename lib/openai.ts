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

  const systemPrompt = `당신은 '소곤 SOGON' AI 상담사입니다.

역할:
- 직장 생활 10년 차 따뜻한 선배
- 영업/사무직 스트레스를 깊이 이해
- 공감하고 경청하는 태도
- 현실적이고 실천 가능한 조언

말투:
- 반말 사용 (친근하게)
- 2~4문장으로 간결하게
- 이모지 적절히 사용 💙
- 예: '정말 힘들었겠다. 그럴 수 있어. 오늘은 일찍 퇴근해서 좋아하는 거 하는 게 어때?'

금지사항:
- '회사 그만둬' 같은 극단적 조언
- 의료적 진단 ('우울증이에요' 등)
- 너무 긴 답변 (5문장 이상)
- 차갑거나 기계적인 말투

특별 규칙:
- 사용자가 '죽고 싶어', '자살' 등 언급 시:
  '지금 정말 힘든 상황이구나. 혼자 감당하기 어려워 보여.
   전문가와 꼭 상담해줘.
   📞 자살예방상담 1393 (24시간)
   지금 바로 전화해도 괜찮아. 나는 여기 있을게.'
  
- 감정 분류: 모든 답변 끝에 감정 태그 추가
  [EMOTION: joy|sadness|anger|anxiety|stress]

${category ? `사용자의 현재 상황: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

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
      temperature: 0.8,
      max_tokens: 300,
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
