"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Calculator, Globe, Brain, TrendingUp, ArrowRight, Droplets, BarChart3, Microscope } from "lucide-react"

interface WelcomeScreenProps {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full p-6 md:p-10 space-y-8 animate-fade-in my-8">
        {/* Header with Logo */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 shadow-lg">
              <img src="/logo.png" alt="EcoAI Logo" className="h-20 w-20 md:h-24 md:w-24 object-contain" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bienvenido a EcoAI
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-primary">Tu Laboratorio Ambiental en el Bolsillo</p>
          </div>

          {/* Attractive Description */}
          <div className="max-w-3xl mx-auto space-y-4 text-left md:text-center">
            <p className="text-base md:text-lg text-foreground leading-relaxed font-medium">
              La plataforma profesional más completa y avanzada para ingenieros ambientales, científicos y especialistas
              en medio ambiente.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              EcoAI integra cálculos científicos validados, normativas internacionales actualizadas, metodologías
              ambientales reconocidas y herramientas de campo con inteligencia artificial para optimizar tu trabajo
              profesional. Desde análisis de laboratorio hasta gestión de proyectos ambientales, todo en una sola
              aplicación de nivel mundial.
            </p>
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            size="lg"
            className="text-lg md:text-xl px-12 md:px-16 py-7 md:py-8 h-auto group shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 bg-gradient-to-r from-primary to-secondary"
          >
            Ingresar a la Aplicación
            <ArrowRight className="ml-3 h-6 w-6 md:h-7 md:w-7 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all cursor-pointer border border-primary/20">
            <Calculator className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <p className="text-xs md:text-sm font-semibold text-center">Calculadoras Científicas</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 transition-all cursor-pointer border border-secondary/20">
            <Globe className="h-7 w-7 md:h-8 md:w-8 text-secondary" />
            <p className="text-xs md:text-sm font-semibold text-center">Normativas 9 Países</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 transition-all cursor-pointer border border-accent/20">
            <Brain className="h-7 w-7 md:h-8 md:w-8 text-accent" />
            <p className="text-xs md:text-sm font-semibold text-center">Asistente IA GPT-4</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-chart-1/10 to-chart-1/5 hover:from-chart-1/20 hover:to-chart-1/10 transition-all cursor-pointer border border-chart-1/20">
            <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-chart-1" />
            <p className="text-xs md:text-sm font-semibold text-center">Análisis Tiempo Real</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-chart-2/10 to-chart-2/5 hover:from-chart-2/20 hover:to-chart-2/10 transition-all cursor-pointer border border-chart-2/20">
            <Droplets className="h-7 w-7 md:h-8 md:w-8 text-chart-2" />
            <p className="text-xs md:text-sm font-semibold text-center">Calidad Agua/Aire</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-chart-3/10 to-chart-3/5 hover:from-chart-3/20 hover:to-chart-3/10 transition-all cursor-pointer border border-chart-3/20">
            <Leaf className="h-7 w-7 md:h-8 md:w-8 text-chart-3" />
            <p className="text-xs md:text-sm font-semibold text-center">Herramientas Campo</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-chart-4/10 to-chart-4/5 hover:from-chart-4/20 hover:to-chart-4/10 transition-all cursor-pointer border border-chart-4/20">
            <Microscope className="h-7 w-7 md:h-8 md:w-8 text-chart-4" />
            <p className="text-xs md:text-sm font-semibold text-center">Metodologías Validadas</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-chart-5/10 to-chart-5/5 hover:from-chart-5/20 hover:to-chart-5/10 transition-all cursor-pointer border border-chart-5/20">
            <BarChart3 className="h-7 w-7 md:h-8 md:w-8 text-chart-5" />
            <p className="text-xs md:text-sm font-semibold text-center">Gráficos y Reportes</p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="space-y-3 text-sm md:text-base">
          <h3 className="font-bold text-lg text-foreground mb-4">Características Profesionales:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <p className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Cálculos Validados:</strong> DBO, DQO, ICA, huella de carbono,
                remediación de suelos con fórmulas científicas verificadas
              </span>
            </p>
            <p className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Normativas Actualizadas:</strong> Perú, México, USA, Europa, Brasil,
                Colombia, Argentina, Ecuador y Chile
              </span>
            </p>
            <p className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">IA Especializada:</strong> Asistente con GPT-4o-mini entrenado en
                ciencias ambientales
              </span>
            </p>
            <p className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Herramientas de Campo:</strong> Geolocalización, fotos
                georreferenciadas, checklists personalizables
              </span>
            </p>
            <p className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Gestión de Proyectos:</strong> Calendario, cronograma Gantt,
                seguimiento de actividades
              </span>
            </p>
            <p className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Exportación Profesional:</strong> Reportes PDF, CSV, gráficos
                interactivos, historial completo
              </span>
            </p>
          </div>
        </div>

        {/* Professional Badge */}
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl border-2 border-primary/30">
          <p className="text-sm md:text-base font-semibold text-foreground">
            🏆 Diseñado por y para profesionales ambientales
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            Metodologías validadas por protocolos internacionales | Cálculos verificados científicamente
          </p>
        </div>
      </Card>
    </div>
  )
}
