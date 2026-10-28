"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calculator, Globe, Brain, TrendingUp, ArrowRight, Droplets, Sparkles, ShieldCheck } from "lucide-react"

interface WelcomeScreenProps {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#F4F8F5] dark:bg-[#0B1C1B] flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full p-6 md:p-10 space-y-8 animate-fade-in my-8 border-[#DCE7E1] dark:border-[#1E4644] bg-white dark:bg-[#112827] shadow-xl">
        {/* Header with Logo */}
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-[#DCE7E1] dark:border-[#1E4644]">
              <Image
                src="/logo.png"
                alt="Green Owl Labs"
                width={80}
                height={80}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#103B3A] dark:text-[#EAF2EE] tracking-tight">
              Laboratorio Ambiental
            </h1>
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-[#008F72] dark:text-[#BCE8D9] font-bold">
              by GREEN OWL LABS
            </p>
            <p className="text-base md:text-lg font-medium text-[#253533] dark:text-[#EAF2EE] pt-1">
              Laboratorio ambiental digital para profesionales
            </p>
            <p className="text-xs text-[#647773] dark:text-[#8FA49F] italic">
              «La ciencia ambiental, en tu bolsillo»
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3 text-left md:text-center pt-2">
            <p className="text-sm md:text-base text-[#253533] dark:text-[#EAF2EE] leading-relaxed">
              Herramientas científicas, cálculos ambientales estequiométricos, métodos analíticos oficiales, compendio normativo e informes accesibles desde una única aplicación profesional de campo.
            </p>
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            size="lg"
            className="text-base md:text-lg px-10 md:px-14 py-6 h-auto bg-[#008F72] hover:bg-[#103B3A] text-white shadow-lg transition-all transform hover:scale-[1.02] font-semibold"
          >
            Ingresar al Laboratorio
            <ArrowRight className="ml-2.5 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-[#F4F8F5] dark:bg-[#0B1C1B] border border-[#DCE7E1] dark:border-[#1E4644]">
            <Calculator className="h-6 w-6 text-[#008F72]" />
            <p className="text-xs font-semibold text-center text-[#253533] dark:text-[#EAF2EE]">
              Calculadoras DBO/DQO
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-[#F4F8F5] dark:bg-[#0B1C1B] border border-[#DCE7E1] dark:border-[#1E4644]">
            <ShieldCheck className="h-6 w-6 text-[#103B3A] dark:text-[#BCE8D9]" />
            <p className="text-xs font-semibold text-center text-[#253533] dark:text-[#EAF2EE]">
              Normativas MINAM
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-[#F4F8F5] dark:bg-[#0B1C1B] border border-[#DCE7E1] dark:border-[#1E4644]">
            <Brain className="h-6 w-6 text-cyan-600" />
            <p className="text-xs font-semibold text-center text-[#253533] dark:text-[#EAF2EE]">
              Asistente IA Ambiental
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-[#F4F8F5] dark:bg-[#0B1C1B] border border-[#DCE7E1] dark:border-[#1E4644]">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <p className="text-xs font-semibold text-center text-[#253533] dark:text-[#EAF2EE]">
              Huellas & Suelos
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
