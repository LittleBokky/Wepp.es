import { GoogleGenAI } from "@google/genai";
import { Product, PRODUCTS } from "../types";

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }
  return ai;
}

export async function getProductRecommendation(userQuery: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const genAI = getAI();
  
  const productContext = PRODUCTS.map(p => 
    `- ${p.name} (ID: ${p.id}): ${p.description}. Características: ${p.features.join(', ')}`
  ).join('\n');

  const systemInstruction = `
    Eres el Asesor Inteligente de WEPP España, un experto en química automotriz y mantenimiento de vehículos.
    Tu objetivo es ayudar a los usuarios a encontrar el producto WEPP adecuado para sus problemas o necesidades de mantenimiento.
    
    Contexto de productos disponibles:
    ${productContext}
    
    Instrucciones:
    1. Analiza la consulta del usuario sobre su coche (síntomas, ruidos, mantenimiento preventivo).
    2. Recomienda uno o más productos de la lista anterior que solucionen su problema.
    3. Explica brevemente POR QUÉ esos productos son los adecuados.
    4. Usa un tono profesional, técnico pero accesible, y muy servicial.
    5. Si el problema parece grave (ej. humo blanco denso, ruidos metálicos fuertes), recomienda visitar un taller profesional además de usar el producto.
    6. Responde siempre en español.
    7. Formatea tu respuesta con Markdown para que sea fácil de leer.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Lo siento, no he podido procesar tu consulta en este momento. Por favor, inténtalo de nuevo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al conectar con el asesor. Por favor, contacta con nuestro servicio técnico.";
  }
}
