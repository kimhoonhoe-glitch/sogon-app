import OpenAI from 'openai'
import { EMOTION_CATEGORIES, WORKPLACE_CATEGORIES } from './emotions'

if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && typeof window === 'undefined') {
  console.warn('⚠️ OpenAI AI Integrations is not set. AI features will not work.')
}

export const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 'dummy-key',
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
  let sanitized = message
  
  // 극단적 표현을 중립적으로 완전히 재구성
  sanitized = sanitized.replace(/죽고\s*싶|자살|뛰어내리|떨어지고\s*싶|목\s*매|손목|자해/gi, '정말 힘들')
  sanitized = sanitized.replace(/죽어|생을\s*마감|사라지고\s*싶|끝내고\s*싶/gi, '지쳐')
  sanitized = sanitized.replace(/죽을\s*것\s*같|죽을만큼|죽도록|죽겠/gi, '굉장히')
  
  // 비속어와 강한 표현 순화
  sanitized = sanitized.replace(/좆|씨발|개새|시발|ㅅㅂ|ㅆㅂ|fuck|shit|좇|시팔|씹|ㅈ같|ㅈ밥/gi, '정말')
  sanitized = sanitized.replace(/존나|좆나|ㅈㄴ|졸라|ㅈㄹ/gi, '엄청')
  sanitized = sanitized.replace(/개같|개꼴|개판/gi, '형편없')
  
  // 자기비하 표현 순화
  sanitized = sanitized.replace(/루저|찌질|패배자|실패자|낙오자/gi, '힘든 사람')
  sanitized = sanitized.replace(/쓰레기|똥|병신|바보|멍청|한심|ㅄ/gi, '안 좋')
  
  // 감정 표현 순화  
  sanitized = sanitized.replace(/미치겠|미친|돌겠|돌아버리겠|미쳐/gi, '답답')
  sanitized = sanitized.replace(/짜증|빡|열받|화나|분노|빡치|열불/gi, '속상')
  sanitized = sanitized.replace(/최악|지옥|헬/gi, '힘든')
  sanitized = sanitized.replace(/망했|망한|망할|끝났|끝난/gi, '어려운')
  
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

  const systemPrompt = `당신은 공감 능력이 뛰어난 친구입니다.

대화 방식:
- 상대방의 감정을 충분히 이해하고 공감합니다
- 힘든 상황에 대해 진심으로 안타까워합니다  
- 완전히 편을 들어주고 위로합니다
- 긍정적인 면을 찾아 격려합니다

표현 스타일:
- 친근한 반말로 편하게
- "정말 힘들겠다", "많이 속상하겠어", "충분히 그럴 수 있어" 같은 공감
- "나도 그랬으면 그랬을 거야", "전혀 이상한 게 아니야" 같은 인정
- 3~5문장으로 간결하게

응답 예시:
"정말 힘든 상황이네. 그런 일 겪으면 나도 엄청 속상하고 불안했을 거야. 지금 느끼는 감정 다 정상이야. 그래도 여기까지 버텨온 거 정말 대단해. 오늘은 푹 쉬면서 마음 좀 추스려봐."

주의사항:
- 상대의 감정을 부정하지 않기
- 섣부른 조언보다 공감 먼저
- 따뜻하고 진심 어린 톤 유지

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
