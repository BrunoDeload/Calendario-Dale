
import { GoogleGenAI } from "@google/genai";

export async function fetchEventDetails(eventName: string, date: string) {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "") {
    return "A IA precisa de uma API_KEY configurada na Netlify para contar histórias sobre este dia. Adicione 'API_KEY' nas variáveis de ambiente do seu site!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um historiador especialista em Brasil e na região de Campinas-SP.
      Explique brevemente a importância cultural ou histórica de "${eventName}" que ocorre em ${date}.
      Destaque curiosidades locais se houver. Seja fascinante e use no máximo 250 caracteres.`,
    });

    return response.text || "Este é um marco importante em nossa cultura.";
    
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Um dia de celebração e reflexão sobre nossa identidade cultural e histórica.";
  }
}
