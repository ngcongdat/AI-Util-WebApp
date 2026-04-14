import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface QuoteData {
  text: string;
  keywords: string[];
}

export async function generateQuotes(theme: string): Promise<QuoteData[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: `Tạo 5 câu trích dẫn ngắn gọn, sâu sắc và truyền cảm hứng về chủ đề: "${theme}". 
    Với mỗi câu, hãy xác định 1-3 từ quan trọng nhất cần được làm nổi bật để thu hút người xem.
    Trả về kết quả dưới dạng JSON array, mỗi object có thuộc tính "text" (câu trích dẫn) và "keywords" (mảng các từ quan trọng).`,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data.slice(0, 5);
  } catch (e) {
    console.error("Error parsing quotes JSON:", e);
    return [];
  }
}

export async function generateImageFromReference(base64Image: string, prompt: string): Promise<string> {
  // Using gemini-2.5-flash-image for image editing/generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1], // Remove data:image/png;base64,
            mimeType: 'image/png',
          },
        },
        {
          text: `Dựa trên ảnh này, hãy tạo một ảnh mới với bối cảnh: ${prompt}. 
          QUAN TRỌNG: Phải GIỮ NGUYÊN khuôn mặt và đặc điểm nhận dạng của nhân vật trong ảnh gốc. 
          Chỉ thay đổi bối cảnh, trang phục hoặc tư thế sao cho phù hợp với bối cảnh mới nhưng vẫn đảm bảo người xem nhận ra đó là cùng một người.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Không thể tạo ảnh từ AI.");
}
