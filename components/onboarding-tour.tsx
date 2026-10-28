"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calculator, Globe, FileText, Brain, TrendingUp, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface OnboardingTourProps {
  onComplete: () => void
  onSkip: () => void
}

const tourSteps = [
  {
    icon: Calculator,
    title: "Calculadoras Ambientales",
    description:
      "Accede a calculadoras especializadas para DBO, DQO, ICA, emisiones de CO₂, huella de carbono, huella hídrica y más. Todas con fórmulas validadas internacionalmente.",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Normativas Internacionales",
    description:
      "Consulta límites máximos permisibles y regulaciones de México (NOMs), USA (EPA), Europa (EU), Brasil (CONAMA), Colombia y Argentina. Actualizado constantemente.",
    color: "text-secondary",
  },
  {
    icon: FileText,
    title: "Notas de Campo y Checklists",
    description:
      "Registra observaciones con geolocalización, usa plantillas de inspección predefinidas y exporta reportes profesionales en PDF.",
    color: "text-accent",
  },
  {
    icon: Brain,
    title: "Asistente IA - EcoIA",
    description:
      "Pregunta al asistente de inteligencia artificial sobre normativas, cálculos ambientales, identificación de especies y análisis predictivo de datos.",
    color: "text-chart-1",
  },
  {
    icon: TrendingUp,
    title: "Herramientas Avanzadas",
    description:
      "Monitoreo en tiempo real, análisis de impacto ambiental, evaluación de riesgos, remediación de suelos y visualización 3D de datos ambientales.",
    color: "text-chart-2",
  },
]

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = tourSteps[currentStep]
  const Icon = step.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-8 animate-fade-in">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Paso {currentStep + 1} de {tourSteps.length}
            </span>
            <button onClick={onSkip} className="hover:text-foreground transition-colors">
              Saltar tour
            </button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-6">
              <Icon className={`h-20 w-20 ${step.color}`} />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground">{step.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button onClick={handlePrevious} variant="outline" className="flex-1 bg-transparent">
              Anterior
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {currentStep === tourSteps.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Comenzar a Usar
              </>
            ) : (
              "Siguiente"
            )}
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2">
          {tourSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
