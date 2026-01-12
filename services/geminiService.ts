
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchEventDetails(eventName: string, date: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explique a importância histórica e cultural de "${eventName}" para o Brasil e especificamente se houver relevância para a região de Campinas-SP. Responda em português de forma concisa e amigável. A data é ${date}.`,
    });
    return response.text || "Não foi possível obter detalhes adicionais.";
  } catch (error) {
    console.error("Error fetching event details:", error);
    return "Erro ao carregar curiosidades via IA.";
  }
}
