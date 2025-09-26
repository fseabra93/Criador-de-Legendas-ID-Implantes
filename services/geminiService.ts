
import { GoogleGenAI, Type } from '@google/genai';
import type { CaptionData, ImagePart } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function base64ToGenerativePart(base64String: string): ImagePart {
    const [header, data] = base64String.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return {
      inlineData: {
        mimeType,
        data,
      },
    };
}

export const generateCaptions = async (
  imagesBase64: string[],
  userText: string
): Promise<CaptionData> => {
    const model = 'gemini-2.5-flash';

    const imageParts: ImagePart[] = imagesBase64.map(base64ToGenerativePart);

    const prompt_text_style_analysis = userText
    ? `Analise também o seguinte texto fornecido pelo usuário para entender seu estilo de escrita preferido. Se nenhum texto for fornecido, use um tom geral envolvente e positivo.
Texto de exemplo do usuário: "${userText}"`
    : `Como nenhum texto de referência foi fornecido, use um tom geral envolvente, positivo e apropriado para uma clínica odontológica de ponta.`;

    const prompt = `
    Você é um assistente de marketing digital altamente qualificado para uma clínica odontológica de prestígio chamada "ID Implantes", especializada em implantes dentários. Sua tarefa é criar legendas atraentes para o Instagram.

    Analise a(s) imagem(ns) fornecida(s) para entender seu contexto, assunto e clima geral. As imagens podem mostrar a clínica, a equipe, os pacientes, procedimentos odontológicos ou conceitos relacionados.

    ${prompt_text_style_analysis}

    Com base na sua análise das imagens e do estilo de escrita, gere três legendas distintas para o Instagram. Cada legenda deve ser adequada para uma postagem promocional e incluir hashtags relevantes e emojis apropriados.

    As três legendas devem ter os seguintes tons:
    1.  **Informativo:** Educacional, focando nos benefícios, tecnologia ou detalhes do procedimento mostrado ou implícito.
    2.  **Amigável:** Caloroso, acessível e relacionável. Deve construir uma conexão com o público.
    3.  **Profissional:** Confiante, autoritário e focado na qualidade, experiência e altos padrões da ID Implantes.

    Retorne sua resposta estritamente como um objeto JSON.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            informative: { type: Type.STRING, description: 'A legenda informativa.' },
            friendly: { type: Type.STRING, description: 'A legenda amigável.' },
            professional: { type: Type.STRING, description: 'A legenda profissional.' }
        },
        required: ['informative', 'friendly', 'professional']
    };
    
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [...imageParts, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
    });

    try {
        const responseText = response.text.trim();
        const parsedJson = JSON.parse(responseText);
        return parsedJson as CaptionData;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("A resposta da IA não estava no formato JSON esperado.");
    }
};
