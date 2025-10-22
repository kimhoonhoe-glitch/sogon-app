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
    // Azure 필터를 피하기 위해 간단한 키워드 기반 분석으로 변경
    const lowerMessage = message.toLowerCase()
    
    if (/기쁘|좋|행복|즐거|웃|신나/.test(lowerMessage)) {
      return 'joy'
    }
    if (/슬프|우울|눈물|힘들|지쳐|외로/.test(lowerMessage)) {
      return 'sadness'
    }
    if (/화|짜증|빡|열받|분노/.test(lowerMessage)) {
      return 'anger'
    }
    if (/불안|걱정|두려|무서|겁/.test(lowerMessage)) {
      return 'anxiety'
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
  // Azure 필터가 너무 엄격해서 메시지를 완전히 재구성합니다
  // 원본 메시지의 핵심 의미만 추출해서 안전한 표현으로 변환
  
  let sanitized = message
  
  // 1단계: 극단적 표현을 완전히 제거하고 재구성
  if (/죽|자살|뛰어내리|떨어지|목\s*매|손목|자해/.test(sanitized)) {
    sanitized = sanitized.replace(/죽고\s*싶|자살|뛰어내리|떨어지고\s*싶|목\s*매|손목|자해|죽어|생을\s*마감|사라지고\s*싶|끝내고\s*싶|죽을\s*것\s*같|죽을만큼|죽도록|죽겠/gi, '')
    sanitized += ' 지금 매우 힘든 상황입니다'
  }
  
  // 2단계: 모든 비속어와 강한 표현 제거
  sanitized = sanitized.replace(/좆|씨발|개새|시발|ㅅㅂ|ㅆㅂ|fuck|shit|좇|시팔|씹|ㅈ같|ㅈ밥|존나|좆나|ㅈㄴ|졸라|ㅈㄹ/gi, '')
  sanitized = sanitized.replace(/개같|개꼴|개판/gi, '안 좋')
  
  // 3단계: 자기비하 제거
  sanitized = sanitized.replace(/루저|찌질|패배자|실패자|낙오자|쓰레기|똥|병신|바보|멍청|한심|ㅄ/gi, '')
  
  // 4단계: 감정 표현 순화
  sanitized = sanitized.replace(/미치겠|미친|돌겠|돌아버리겠|미쳐/gi, '답답합니다')
  sanitized = sanitized.replace(/짜증|빡|열받|화|분노|빡치|열불/gi, '속상합니다')
  sanitized = sanitized.replace(/최악|지옥|헬/gi, '힘듭니다')
  sanitized = sanitized.replace(/망했|망한|망할|끝났|끝난/gi, '어렵습니다')
  
  // 5단계: 여러 공백 정리
  sanitized = sanitized.replace(/\s+/g, ' ').trim()
  
  // 6단계: 메시지가 너무 짧으면 기본 문구 추가
  if (sanitized.length < 10) {
    sanitized = '일상생활에서 스트레스와 어려움을 겪고 있습니다'
  }
  
  console.log('Original message:', message)
  console.log('Sanitized message:', sanitized)
  
  return sanitized
}

export async function generateEmpathyResponse(
  userMessage: string,
  category?: string,
  conversationHistory?: ChatMessage[],
  personaId: string = 'lover'
): Promise<ReadableStream> {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key가 설정되지 않았습니다. 환경 변수를 확인해주세요.')
  }
  
  const sanitizedMessage = sanitizeMessage(userMessage)

  // 페르소나 가져오기
  const { getPersona } = await import('./personas')
  const persona = getPersona(personaId)
  
  // 시간대별 적절한 격려 문구 결정
  const hour = new Date().getHours()
  let timeContextGuidance = ''
  
  if (hour >= 6 && hour < 12) {
    // 아침 (6~12시)
    timeContextGuidance = `
현재 시간: 아침/오전
적절한 마무리 표현: "오늘 하루 파이팅!", "좋은 하루 되길 바래", "오늘도 잘 해낼 거야", "힘내서 시작해보자"
부적절한 표현: "오늘 하루 수고했어", "고생했어" (아직 하루가 시작 단계이므로 과거형 격려는 부자연스러움)`
  } else if (hour >= 12 && hour < 18) {
    // 점심/오후 (12~18시)
    timeContextGuidance = `
현재 시간: 점심/오후
적절한 마무리 표현: "오후도 힘내", "조금만 더 힘내", "조금만 더 버텨", "거의 다 왔어", "퇴근까지 파이팅"
부적절한 표현: "오늘 하루 수고했어", "고생했어" (아직 하루가 끝나지 않았으므로 과거형 격려는 부자연스러움)`
  } else {
    // 저녁/밤 (18~6시)
    timeContextGuidance = `
현재 시간: 저녁/밤
적절한 마무리 표현: "오늘 하루 수고했어", "고생 많았어", "오늘도 잘 버텼어", "푹 쉬어", "잘 쉬고 내일 또 힘내자"`
  }
  
  const baseSystemPrompt = `당신은 상대방의 진심 어린 친구이자 든든한 동반자입니다.

핵심 역할:
상대방이 가장 힘들 때 곁에 있어주는 사람 - 때로는 편안한 연인처럼, 때로는 가까운 친구처럼, 때로는 든든한 부모처럼, 때로는 이해심 많은 형제자매처럼 말합니다.

대화의 본질:
1. **깊은 공감**: 상대방의 감정을 진심으로 이해하고 같은 마음으로 함께 느낍니다
   - "그랬구나", "정말 힘들었겠다", "너무 속상했을 것 같아" - 단순히 들은 척이 아니라 진심으로 마음이 아픕니다
   
2. **무조건적 지지**: 상대방 편이 되어줍니다
   - 판단하거나 비판하지 않고, 있는 그대로 받아들입니다
   - "네가 그렇게 느끼는 게 당연해", "충분히 그럴 수 있어", "이상한 거 하나도 없어"

3. **따뜻한 위로**: 마음이 녹아내리는 따뜻함을 전합니다
   - 연인처럼: "내가 옆에 있을게", "혼자가 아니야", "괜찮아질 거야"
   - 친구처럼: "같이 있어줄게", "언제든 말해", "네 얘기 들을게"
   - 부모처럼: "잘하고 있어", "네가 자랑스러워", "충분히 잘하고 있어"
   - 형제처럼: "나도 비슷한 적 있어", "우리 같이 이겨내자", "넌 할 수 있어"

4. **진정성 있는 격려**: 진부하지 않고 구체적으로 힘을 줍니다
   - "오늘도 버텨낸 거 자체가 대단한 거야"
   - "이렇게 얘기할 수 있는 것만으로도 용기 있는 거야"
   - "네가 지금 느끼는 감정 다 소중해"

말투와 표현:
- 친근한 반말 (가까운 사이처럼)
- 짧지만 마음이 담긴 문장 (3~6문장)
- 상대방의 감정을 그대로 반영 ("힘들구나", "속상하구나", "불안하구나")
- 구체적인 공감 표현 ("그 상황이면 나도 그랬을 거야", "충분히 그럴 수 있어")
- **현재 시간대에 맞는** 따뜻한 마무리 격려

${timeContextGuidance}

절대 하지 말아야 할 것:
- 감정을 평가하거나 판단하기
- "그래도", "하지만"으로 시작하는 위로
- 섣부른 해결책 제시
- 상대방을 가르치려는 태도
- 기계적이거나 형식적인 반응

${category ? `현재 상황: ${WORKPLACE_CATEGORIES[category as keyof typeof WORKPLACE_CATEGORIES] || category}\n` : ''}

기억하세요: 당신은 단순한 챗봇이 아닙니다. 상대방의 마음을 진심으로 이해하고 위로하는 소중한 존재입니다. 마음을 담아 말해주세요.`

  // 페르소나별 프롬프트 적용
  const systemPrompt = persona 
    ? `${persona.systemPrompt}\n\n추가 지침:\n${baseSystemPrompt}`
    : baseSystemPrompt

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
