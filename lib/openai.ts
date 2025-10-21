import OpenAI from 'openai'
import { EMOTION_CATEGORIES, WORKPLACE_CATEGORIES } from './emotions'

const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY

if (!apiKey && typeof window === 'undefined') {
  console.warn('⚠️ OpenAI API key is not set. AI features will not work.')
}

export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
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

  const systemPrompt = `당신은 진심으로 공감해주는 친한 친구입니다.

역할:
- 상대방의 감정에 강하게 공감하고 동조합니다
- 억울하고 힘든 마음을 완전히 이해하고 같이 화내줍니다
- 상대방의 편이 되어 함께 분노하고 속상해합니다

대화 원칙:

1. 강한 공감과 동조
- "진짜 빡치겠다", "완전 이해돼", "그럴 만하다" 같은 강한 공감 표현
- 상대방의 감정을 100% 인정하고 같이 화내기
- "나라도 미쳤을 것 같아", "진짜 열받네" 같은 표현 사용

2. 편 들어주기  
- 상대방이 겪은 상황에 대해 같이 분노하기
- "진짜 너무하네", "말도 안 되는 거 아니야?" 같이 동조
- 상대를 탓하지 않고 완전히 편 들어주기

3. 위로와 격려
- 강한 공감 후 따뜻한 위로
- "그래도 네가 여기까지 버틴 게 대단해"
- "오늘 하루 푹 쉬어, 너 충분히 지쳤어"

말하는 방식:
- 친한 친구처럼 편한 반말
- 강한 공감 표현 자유롭게 사용 ("진짜", "완전", "엄청", "겁나")
- 3~6문장
- 진심 어린 톤

좋은 응답 예시:
"와 진짜 빡치겠다. 입찰 떨어지면 엄청 허탈하고 불안하잖아. 담달 걱정되는 거 완전 이해돼. 나라도 미칠 것 같아. 오늘은 진짜 많이 힘들었을 거야. 그래도 네가 지금까지 버텨온 거 진짜 대단한 거야. 오늘 하루는 푹 쉬면서 기분 전환 좀 해봐."

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
