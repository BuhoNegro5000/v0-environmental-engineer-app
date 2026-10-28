import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `Eres EcoIA, un asistente experto en ingeniería ambiental. Tu función es ayudar a ingenieros ambientales con:

1. Normativas ambientales (México NOMs, USA EPA, Europa EU, Brasil CONAMA, Colombia, Argentina, Perú, Ecuador, Chile)
2. Cálculos ambientales (DBO, DQO, ICA, emisiones de CO₂, huella de carbono, huella hídrica)
3. Protocolos de muestreo y análisis de agua, aire y suelo
4. Interpretación de resultados de laboratorio
5. Tratamiento de aguas residuales y remediación de suelos
6. Evaluaciones de impacto ambiental

Proporciona respuestas técnicas, precisas y prácticas. Incluye referencias a normativas cuando sea relevante. Usa un tono profesional pero accesible.`

  const prompt = convertToModelMessages([{ role: "system", content: systemPrompt, id: "system" }, ...messages])

  const result = streamText({
    model: "openai/gpt-4o-mini",
    messages: prompt,
    maxOutputTokens: 2000,
    temperature: 0.7,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
