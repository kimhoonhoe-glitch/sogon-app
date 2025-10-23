import OpenAI from 'openai'; // 더 깔끔한 최신 임포트 방식

export const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  // v4에서는 Configuration 객체를 new OpenAI()에 바로 전달합니다.
});