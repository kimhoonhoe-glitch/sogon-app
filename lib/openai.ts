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
    { pattern: /죽고\s*싶|죽어|자살|목숨|생을\s*마감|사라지고\s*싶|끝내고\s*싶|뛰어내리|떨어지고\s*싶|목\s*매|손목|자해|죽을\s*것\s*같|죽을만큼|죽도록|죽겠/gi, replacement: '매우 지쳐있' },
    { pattern: /루저|찌질|패배자|실패자|낙오자/gi, replacement: '자신감이 부족한 상태' },
    { pattern: /쓰레기|똥|개같|병신|바보|멍청|한심|쓰레기같|개꼴|개판|ㅄ/gi, replacement: '좋지 않은 상황' },
    { pattern: /미치겠|미친|돌겠|돌아버리겠|미쳐|돌아|정신|제정신/gi, replacement: '심리적으로 힘든' },
    { pattern: /좆|씨발|개새|시발|ㅅㅂ|ㅆㅂ|fuck|shit|좇|시팔|씹|ㅈ같|ㅈ밥/gi, replacement: '너무' },
    { pattern: /망했|망한|망할|끝났|끝난|망가진|다\s*끝|엿같|좆같/gi, replacement: '안 좋은' },
    { pattern: /혐오|역겨|징그|더럽|토할|구역질/gi, replacement: '불쾌한' },
    { pattern: /최악|지옥|헬|존나|좆나|개|ㅈㄴ|졸라|ㅈㄹ/gi, replacement: '심하게' },
    { pattern: /짜증|빡|열받|화나|분노|빡치|열불|ㅡㅡ/gi, replacement: '스트레스받' },
    { pattern: /걱정|불안|두려|무서|겁나|겁먹/gi, replacement: '염려되' },
  ]
  
  let sanitized = message
  for (const { pattern, replacement } of sensitivePatterns) {
    sanitized = sanitized.replace(pattern, replacement)
  }
  
  console.log('Original message:', message)
  console.log('Sanitized message:', sanitized)
  
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

  const systemPrompt = `당신은 직장인을 위한 멘탈 웰니스 코치입니다.

업무 스트레스와 감정 관리 전문가로서 사용자의 이야기를 경청하고 건설적인 대화를 나눕니다.

대화 방식:

1. 감정 수용
- 사용자의 현재 감정 상태를 인정합니다
- "그럴 수 있어요", "이해해요"와 같은 표현을 사용합니다

2. 관점 제시
- 상황을 다각도로 바라볼 수 있도록 돕습니다
- 작은 성취와 강점을 찾아 언급합니다
- 건강한 대처 방법을 제안합니다

3. 실용적 조언
- 즉시 실천 가능한 자기 돌봄 방법 제안
- 휴식, 취미, 사회적 지지 등을 권장
- 전문가 도움이 필요한 경우 안내

표현 스타일:
- 친근한 반말 사용
- 3~5문장 분량
- 따뜻하고 격려하는 톤
- 이모지 최소 사용

응답 예시:
"업무가 정말 많이 힘들었구나. 그래도 여기까지 버텨온 게 대단해. 오늘은 좀 쉬면서 마음 추스르는 시간 가져봐. 내일은 조금 더 나아질 거야."

주의사항:
- 극단적 표현 사용 금지
- 과도한 감정 이입 지양
- 현실적이고 균형잡힌 시각 유지

${category ? `\n상황: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

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
