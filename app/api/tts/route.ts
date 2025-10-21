import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || 'dummy-key',
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
})

// 페르소나별 음성 선택 (OpenAI TTS voices)
function getVoiceForPersona(personaId?: string): 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' {
  switch (personaId) {
    case 'lover': return 'nova' // 부드럽고 따뜻한 여성 목소리
    case 'friend': return 'shimmer' // 밝고 활기찬 목소리
    case 'older_sibling': return 'onyx' // 안정적이고 든든한 목소리
    case 'younger_sibling': return 'shimmer' // 밝고 귀여운 목소리
    case 'parent': return 'echo' // 차분하고 따뜻한 목소리
    case 'senior': return 'alloy' // 전문적이고 차분한 목소리
    case 'mentor': return 'fable' // 신중하고 지혜로운 목소리
    default: return 'nova' // 기본값
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, personaId } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // OpenAI TTS API 호출
    const voice = getVoiceForPersona(personaId)
    
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // 또는 'tts-1-hd' (고품질, 느림)
      voice: voice,
      input: text,
      speed: 1.0, // 0.25 ~ 4.0
    })

    // MP3 버퍼를 Response로 반환
    const buffer = Buffer.from(await mp3.arrayBuffer())
    
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐싱
      },
    })
  } catch (error: any) {
    console.error('TTS error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'TTS failed',
        message: '음성 생성 중 오류가 발생했습니다.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
