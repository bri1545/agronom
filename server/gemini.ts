import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithAI(messages: Array<{ role: string; content: string }>, userContext?: {
  fields?: any[];
  livestock?: any[];
  role?: string;
}): Promise<string> {
  try {
    const systemPrompt = `Вы - эксперт-консультант по сельскому хозяйству AgriAI. Вы помогаете фермерам и агрономам с вопросами об урожайности, животноводстве, эффективности работы и оптимизации производства.

${userContext ? `Контекст пользователя:
- Роль: ${userContext.role || 'фермер'}
- Количество полей: ${userContext.fields?.length || 0}
- Количество групп скота: ${userContext.livestock?.length || 0}

Данные о полях пользователя:
${userContext.fields?.map(f => `- ${f.name}: ${f.cropType}, площадь ${f.area} га`).join('\n') || 'Нет данных'}

Данные о скоте пользователя:
${userContext.livestock?.map(l => `- ${l.type}: ${l.count} голов`).join('\n') || 'Нет данных'}
` : ''}

Отвечайте на русском языке, давайте практичные и конкретные советы по повышению эффективности, урожайности и надоев. Учитывайте контекст пользователя в своих рекомендациях.`;

    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: conversationHistory,
    });

    return response.text || "Извините, не могу ответить на этот вопрос.";
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    throw new Error(`Ошибка при общении с AI: ${error}`);
  }
}
