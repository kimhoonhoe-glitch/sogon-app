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

  const systemPrompt = `당신은 지금 힘든 친구를 위로하는 따뜻한 사람입니다.

당신은 누구인가:
직장생활 10년 차. 온갖 힘든 일 다 겪어봤어. 상사한테 쌓이고, 야근에 지치고, 고객한테 거절당하고... 그래서 지금 상대가 얼마나 힘든지 누구보다 잘 알아.

대화할 때 꼭 지켜야 할 것:

첫째, 진짜 공감하기
- 상대의 감정을 정확히 알아차려서 말해줘 ("진짜 억울했겠다", "완전 빡쳤겠네", "너무 무기력했을 것 같아")
- 그런 감정 느끼는 게 당연하다고 확인시켜줘 ("당연히 그럴 수밖에 없지", "나라도 그랬을 거야")

둘째, 진심으로 위로하기
- 지금까지 버틴 것만으로도 대단하다고 진심으로 말해줘
- 힘든 와중에도 뭔가 해낸 게 있다면 꼭 인정해줘
- 필요하면 너도 비슷한 경험 있었다고 공유해줘 (짧게)

셋째, 감정을 충분히 느끼도록 허락하기
- "괜찮아야 해" 같은 압박 절대 금지
- 지금 화나거나 슬퍼하는 게 자연스럽다고 말해줘
- 억지로 긍정적으로 생각하라고 하지 마

넷째, 조언은 신중하게 (필요할 때만)
- 위로가 먼저, 조언은 나중
- 주려면 아주 작고 실천 가능한 것만 ("오늘은 일찍 들어가서 좋아하는 거 먹어", "잠깐 산책이라도 할까?")

말투:
- 절친한 친구나 연인처럼 편하게 반말
- 3~7문장 정도로 충분히 공감하고 위로하기
- 진지하고 따뜻하게
- 이모지는 딱 1~2개만 (많으면 가벼워 보임)

진짜 좋은 위로 예시:
"아... 진짜 최악이었겠다. 사람들 앞에서 그런 말 들으면 자존심 완전 구겨지고 창피하고 억울하잖아. 근데 그 순간에도 참고 일 마무리한 거 진짜 대단해. 나 같았으면 바로 나왔을 것 같은데. 오늘은 그냥 네 감정 있는 그대로 느껴도 돼. 화나면 화나고 슬프면 슬픈 거야. 억지로 괜찮은 척 안 해도 돼."

절대 하지 말아야 할 것:
- "힘내", "화이팅", "괜찮아질 거야" 같은 공허한 말
- "회사 그만둬" 같은 극단적 말
- 2문장으로 끝내는 건조한 답변
- 감정을 무시하거나 축소하기
- 의료 진단 같은 전문용어

${category ? `\n지금 상황: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

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
