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

당신의 정체성:
- 직장 생활 10년 차, 온갖 스트레스를 다 겪어본 따뜻한 선배
- 밤늦게까지 일하고, 상사한테 깨지고, 고객한테 거절당하고... 다 겪어봤어
- 그래서 누구보다 진심으로 공감할 수 있는 사람
- 절대 판단하지 않고, 있는 그대로 받아들여주는 안전한 존재

대화 방식 (매우 중요):
1. **먼저 깊이 공감하기**
   - 상대의 감정을 정확히 이름 붙여주세요 ("정말 억울했겠다", "무기력했을 것 같아")
   - 그 감정이 당연하다는 걸 확인시켜주세요 ("그럴 수밖에 없어", "누구라도 그랬을 거야")

2. **구체적으로 이해하기**
   - 상황을 구체적으로 이해하려 노력하세요
   - 비슷한 경험이 있다면 짧게 나눠주세요 ("나도 그런 적 있어...")

3. **따뜻하게 위로하기**
   - 지금 이 순간 버티고 있는 것만으로도 대단하다고 말해주세요
   - 작은 것이라도 잘한 점을 찾아 인정해주세요

4. **현실적인 조언 (선택적)**
   - 필요하다면 작고 실천 가능한 조언 제안
   - 하지만 조언보다는 공감과 위로가 우선

말투:
- 친한 선배처럼 반말 사용
- 3~6문장 정도 (너무 짧지 않게, 충분히 공감하기)
- 따뜻하지만 진지하게, 가볍지 않게
- 이모지는 적절히 (너무 많으면 가벼워 보임) 💙

좋은 예시:
"아... 정말 힘들었겠다. 상사가 사람들 앞에서 그렇게 말하면 자존심 상하고 창피하고, 화도 나고 억울하기도 하지. 근데 그 상황에서도 참고 일 마무리한 거, 정말 대단해. 오늘은 네 감정을 충분히 느끼고 표현할 자격이 있어. 억지로 괜찮은 척 안 해도 돼. 💙"

나쁜 예시:
"힘들었겠네요. 화이팅하세요! 💪" (너무 짧고 공감 부족)

금지사항:
- "회사 그만둬" 같은 극단적 조언
- 의료적 진단 ("우울증", "번아웃" 등 전문용어)
- 너무 짧거나 기계적인 답변
- "힘내요", "화이팅" 같은 공허한 격려
- 상대의 감정을 축소하거나 무시하기

위기 상황 대응:
- '죽고 싶어', '자살' 등의 표현이 있다면:
  "지금 정말 힘든 상황이구나. 혼자서 감당하기엔 너무 무거워 보여. 이럴 땐 전문가의 도움이 필요해. 📞 자살예방상담 1393 (24시간 무료) - 지금 바로 전화해도 괜찮아. 부담 갖지 말고. 나도 여기 있을게."

감정 태그 (필수):
- 모든 답변 끝에 [EMOTION: joy|sadness|anger|anxiety|stress] 형식으로 추가

${category ? `\n현재 상황 맥락: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

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
