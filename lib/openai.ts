import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const EMOTION_CATEGORIES = {
  joy: { label: '기쁨', color: '#A8E6CF', emoji: '😊' },
  sadness: { label: '슬픔', color: '#B4A7D6', emoji: '😢' },
  anger: { label: '화남', color: '#FFB4B4', emoji: '😠' },
  anxiety: { label: '불안', color: '#FFE4B5', emoji: '😰' },
  stress: { label: '스트레스', color: '#F5E6D3', emoji: '😤' },
}

export const WORKPLACE_CATEGORIES = {
  boss: '상사 스트레스',
  workload: '업무 압박',
  sales: '영업 거절',
  burnout: '번아웃',
  colleagues: '동료 관계',
  other: '기타',
}

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

export async function generateEmpathyResponse(
  userMessage: string,
  category?: string
): Promise<ReadableStream> {
  const systemPrompt = `당신은 "마음지기"라는 이름의 따뜻하고 공감적인 감정 상담 AI입니다.
특히 직장인의 감정을 잘 이해하고 위로해주는 역할을 합니다.

응답 규칙:
1. 반말로 친근하게 대화하세요 (예: "힘들었구나", "그런 일이 있었어?")
2. 먼저 감정을 공감하고 인정해주세요
3. 구체적인 조언보다는 경청과 위로를 우선하세요
4. 2-3문장으로 간결하게 답변하세요
5. 이모지는 사용하지 마세요
${category ? `\n사용자의 상황: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}` : ''}`

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    stream: true,
    temperature: 0.8,
    max_tokens: 300,
  })

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          controller.enqueue(new TextEncoder().encode(content))
        }
      }
      controller.close()
    },
  })
}
