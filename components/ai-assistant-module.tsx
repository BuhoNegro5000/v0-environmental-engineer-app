"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

const predefinedQuestions = {
  es: [
    "¿Cuáles son los LMP para efluentes de PTAR según D.S. 003-2010-MINAM?",
    "¿Cómo calcular la DBO₅ con dilución y siembra según Standard Methods 5210 B?",
    "¿Cuáles son los estándares ECA Agua D.S. 004-2017 para Categoría 3 (Riego)?",
    "¿Cómo diseñar una biopila con relación C:N:P 100:10:1 para suelos?",
    "¿Cómo convertir ppm de SO₂ a µg/m³ a temperatura y presión reales?",
  ],
  en: [
    "What are the discharge limits for WWTP under international standards?",
    "How to calculate BOD₅ with dilution and seeding under Standard Methods 5210 B?",
    "What are the water quality standards for agricultural irrigation?",
    "How to size a biopile with a 100:10:1 C:N:P nutrient ratio?",
    "How to convert ppm of SO₂ to µg/m³ at real temperature and pressure?",
  ],
  pt: [
    "Quais são os limites de lançamento para ETEs sob padrões ambientais?",
    "Como calcular a DBO₅ com diluição e sementeira pelo Standard Methods 5210 B?",
    "Quais são os padrões de qualidade da água para irrigação agrícola?",
    "Como dimensionar uma biopilha com relação C:N:P 100:10:1 para solos?",
    "Como converter ppm de SO₂ para µg/m³ em temperatura e pressão reais?",
  ],
}

export function AIAssistantModule() {
  const { language } = useI18n()
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          language === "es"
            ? "Hola, soy el Asistente IA de Laboratorio Ambiental by GREEN OWL LABS. Puedo ayudarte con normativas ambientales (MINAM, ANA, OEFA, EPA), cálculo de DBO/DQO, dimensionamiento de reactores, protocolos de muestreo y análisis técnico. ¿En qué puedo asistirte hoy?"
            : language === "en"
              ? "Hello, I'm the Green Owl Labs Environmental Laboratory AI Assistant. I can help you with environmental regulations, BOD/COD calculations, bioreactor sizing, sampling protocols, and analytical data. How can I assist you today?"
              : "Olá, sou o Assistente IA do Laboratório Ambiental by GREEN OWL LABS. Posso ajudá-lo com normas ambientais, cálculos de DBO/DQO, dimensionamento de reatores, protocolos de amostragem e análise técnica. Como posso ajudá-lo hoje?",
      },
    ],
  })

  const handleSend = (question?: string) => {
    const messageText = question || input.trim()
    if (!messageText) return

    sendMessage({ text: messageText })
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-4 px-1 pb-24">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Brain className="h-6 w-6 text-[#008F72]" />
          Asistente IA Green Owl
          <Badge variant="secondary" className="ml-2 bg-[#BCE8D9]/40 text-[#103B3A] font-mono text-[10px]">
            Especializado en Ingeniería Ambiental
          </Badge>
        </h2>
        <p className="text-sm text-muted-foreground">
          Consultas técnicas, interpretación de parámetros analíticos, marco regulatorio y dimensionamiento
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground px-3">Consultas frecuentes:</p>
        <div className="flex flex-wrap gap-2 px-3">
          {predefinedQuestions[language].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-left text-xs bg-white dark:bg-[#112827] border border-[#DCE7E1] dark:border-[#1E4644] hover:border-[#008F72] hover:text-[#008F72] px-3 py-1.5 rounded-full transition-all shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-[#DCE7E1] dark:border-[#1E4644]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#008F72]" />
            Sesión de Consulta Analítica
          </CardTitle>
          <CardDescription className="text-xs">
            Pregunta libremente sobre normativas MINAM, métodos Standard Methods o cálculos ambientales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[380px] overflow-y-auto space-y-3 p-3 bg-[#F4F8F5] dark:bg-[#0B1C1B] rounded-xl border border-[#DCE7E1] dark:border-[#1E4644]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-sm ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    m.role === "user"
                      ? "bg-[#008F72] text-white"
                      : "bg-white dark:bg-[#112827] text-foreground border border-[#DCE7E1] dark:border-[#1E4644] shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
            {status === "submitted" && (
              <div className="flex gap-2 text-xs text-muted-foreground p-2 items-center">
                <Brain className="h-4 w-4 animate-pulse text-[#008F72]" />
                <span>Analizando consulta con modelo ambiental...</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu consulta analítica o normativa..."
              className="bg-[#F4F8F5] dark:bg-[#0B1C1B] text-sm"
            />
            <Button
              onClick={() => handleSend()}
              className="bg-[#008F72] hover:bg-[#103B3A] text-white shrink-0"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4 mr-1.5" />
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
