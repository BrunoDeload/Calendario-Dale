
import { GoogleGenAI } from "@google/genai";

export async function fetchEventDetails(eventName: string, date: string) {
  try {
    // Inicialização dinâmica para garantir que usa a chave mais atual do ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    if (!process.env.API_KEY) {
      return "Chave de API não configurada. Não é possível carregar detalhes.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explique a importância histórica e cultural de "${eventName}" para o Brasil e especificamente se houver relevância para a região de Campinas-SP. Responda em português de forma concisa (máximo 3 frases) e amigável. A data é ${date}.`,
    });
    return response.text || "Não foi possível obter detalhes adicionais.";
  } catch (error) {
    console.error("Error fetching event details:", error);
    return "Curiosidade: Este é um dia muito especial para a cultura local e nacional!";
  }
}
