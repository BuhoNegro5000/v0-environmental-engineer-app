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
    "¿Cuál es el límite de DBO para descargas en México?",
    "¿Cómo calcular la huella de carbono de una empresa?",
    "¿Qué es la biorremediación de suelos?",
    "¿Cuáles son los parámetros de calidad del aire?",
    "¿Cómo realizar un muestreo de agua correctamente?",
  ],
  en: [
    "What is the BOD limit for discharges in the USA?",
    "How to calculate a company's carbon footprint?",
    "What is soil bioremediation?",
    "What are the air quality parameters?",
    "How to properly conduct water sampling?",
  ],
  pt: [
    "Qual é o limite de DBO para descargas no Brasil?",
    "Como calcular a pegada de carbono de uma empresa?",
    "O que é biorremediação de solos?",
    "Quais são os parâmetros de qualidade do ar?",
    "Como realizar uma amostragem de água corretamente?",
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
            ? "Hola, soy EcoIA, tu asistente de ingeniería ambiental. Puedo ayudarte con normativas, cálculos, protocolos y análisis de datos ambientales. ¿En qué puedo asistirte?"
            : language === "en"
              ? "Hello, I'm EcoIA, your environmental engineering assistant. I can help you with regulations, calculations, protocols, and environmental data analysis. How can I assist you?"
              : "Olá, sou EcoIA, seu assistente de engenharia ambiental. Posso ajudá-lo com normativas, cálculos, protocolos e análise de dados ambientais. Como posso ajudá-lo?",
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
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          EcoIA
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            {language === "es" ? "Asistente IA" : language === "en" ? "AI Assistant" : "Assistente IA"}
          </Badge>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "es"
            ? "Tu asistente inteligente para consultas ambientales"
            : language === "en"
              ? "Your intelligent assistant for environmental queries"
              : "Seu assistente inteligente para consultas ambientais"}
        </p>
      </div>

      {/* Predefined Questions */}
      <Card>
        <CardHeader className="px-4 py-5">
          <CardTitle className="text-base">
            {language === "es"
              ? "Preguntas Frecuentes"
              : language === "en"
                ? "Frequent Questions"
                : "Perguntas Frequentes"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {language === "es"
              ? "Haz clic en una pregunta para comenzar"
              : language === "en"
                ? "Click a question to start"
                : "Clique em uma pergunta para começar"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6">
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions[language as keyof typeof predefinedQuestions].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSend(question)}
                className="text-xs h-auto py-2 px-3 hover:bg-primary/10 transition-colors"
                disabled={status === "in_progress"}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">EcoIA</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return <span key={index}>{part.text}</span>
                    }
                    return null
                  })}
                </div>
              </div>
            </div>
          ))}
          {status === "in_progress" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2 border border-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {language === "es" ? "Pensando..." : language === "en" ? "Thinking..." : "Pensando..."}
                </span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === "es"
                  ? "Escribe tu pregunta..."
                  : language === "en"
                    ? "Type your question..."
                    : "Digite sua pergunta..."
              }
              disabled={status === "in_progress"}
              className="h-12 text-base"
              aria-label={
                language === "es"
                  ? "Campo de entrada de mensaje"
                  : language === "en"
                    ? "Message input field"
                    : "Campo de entrada de mensagem"
              }
            />
            <Button
              onClick={() => handleSend()}
              disabled={status === "in_progress" || !input.trim()}
              className="h-12 px-4 hover:bg-primary/90 active:bg-primary/80 transition-colors"
              aria-label={language === "es" ? "Enviar mensaje" : language === "en" ? "Send message" : "Enviar mensagem"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
