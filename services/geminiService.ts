
import { GoogleGenAI } from "@google/genai";

export async function fetchEventDetails(eventName: string, date: string) {
  try {
    // A chave deve ser obtida exclusivamente de process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um historiador especialista em Brasil e na região de Campinas-SP.
      Explique brevemente a importância cultural ou histórica de "${eventName}" que ocorre em ${date}.
      Destaque curiosidades locais se houver. Seja fascinante e use no máximo 250 caracteres.`,
    });

    // O SDK retorna a resposta na propriedade .text
    return response.text || "Um marco importante para a cultura e história local.";
    
  } catch (error) {
    console.error("Erro na Gemini API:", error);
    // Retorna uma mensagem amigável caso a API_KEY não esteja injetada corretamente no runtime
    return "Não foi possível carregar os detalhes históricos no momento. Este é um feriado ou data comemorativa significativa para a região.";
  }
}
