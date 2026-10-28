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
      "Accede a calculadoras especializadas para DBO₅, DQO, ICA-NSF, emisiones de CO₂, huella de carbono, huella hídrica y reactores. Todas validadas con Standard Methods.",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Compendio Normativo Oficial",
    description:
      "Consulta estándares de calidad ambiental (ECA) y límites máximos permisibles (LMP) de Perú (MINAM, ANA, OEFA), así como normativas de Colombia, Chile, México y USA (EPA).",
    color: "text-secondary",
  },
  {
    icon: FileText,
    title: "Notas de Campo y Bitácora",
    description:
      "Registra observaciones in situ, mediciones analíticas y exporta reportes técnicos profesionales.",
    color: "text-accent",
  },
  {
    icon: Brain,
    title: "Asistente IA Green Owl",
    description:
      "Consulta al asistente especializado sobre normativas ambientales, interpretación de efluentes, protocolos de muestreo y cálculos de ingeniería.",
    color: "text-chart-1",
  },
  {
    icon: TrendingUp,
    title: "Herramientas Avanzadas y Huellas",
    description:
      "Inventario de huella de carbono GHG Protocol, huella hídrica WFN, diseño de biopilas de remediación y aforo de caudales.",
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Paso {currentStep + 1} de {tourSteps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full bg-primary/10 ${step.color}`}>
              <Icon className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{step.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            Saltar tutorial
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < tourSteps.length - 1 ? (
                "Siguiente"
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Comenzar
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
