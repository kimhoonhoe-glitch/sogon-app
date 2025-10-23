import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

// --- AI 함수들 ---

// 1. 감정 분석 함수
export async function analyzeEmotion(text: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are an emotion analysis expert. Analyze the emotion in the user's text and respond in Korean."
            },
            {
                role: "user",
                content: `다음 텍스트의 감정을 분석해주세요: "${text}"`
            }
        ],
        max_tokens: 100,
        temperature: 0.7,
    });
    return response.choices[0].message.content?.trim() || "";
}

// 2. 공감 답변 생성 함수
export async function generateEmpathyResponse(emotion: string, context: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a compassionate Korean counselor. Provide empathetic responses based on the user's emotions."
            },
            {
                role: "user",
                content: `감정: "${emotion}", 상황: "${context}". 공감하는 답변을 작성해주세요.`
            }
        ],
        max_tokens: 200,
        temperature: 0.8,
    });
    return response.choices[0].message.content?.trim() || "";
}

// 3. 위기 감지 함수
export async function detectCrisis(text: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a crisis detection expert. Determine if the text indicates a mental health crisis. Respond ONLY with 'YES' or 'NO'."
            },
            {
                role: "user",
                content: `Does this text indicate a crisis?: "${text}"`
            }
        ],
        max_tokens: 10,
        temperature: 0.3,
    });
    return response.choices[0].message.content?.trim() || "NO";
}