import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  // 최신 버전(v4)은 Configuration 객체 대신 apiKey를 바로 전달합니다.
});

// --- Vercel 오류가 요구했던 AI 함수들입니다. (v4 문법으로 변환) ---

// 1. 감정 분석 함수 (Export 포함)
export async function analyzeEmotion(text: string) {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Analyze the emotion in the following text: "${text}"`,
    max_tokens: 50,
  });
  return response.choices[0].text.trim();
}

// 2. 공감 답변 생성 함수 (Export 포함)
export async function generateEmpathyResponse(emotion: string, context: string) {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Based on the emotion "${emotion}" and context "${context}", generate an empathetic response.`,
    max_tokens: 150,
  });
  return response.choices[0].text.trim();
}

// 3. 위기 감지 함수 (Export 포함)
export async function detectCrisis(text: string) {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Determine if the following text indicates a crisis (return YES or NO): "${text}"`,
    max_tokens: 10,
  });
  return response.choices[0].text.trim();
}