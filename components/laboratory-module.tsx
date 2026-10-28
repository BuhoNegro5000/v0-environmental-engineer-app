"use client"

import { useState } from "react"
import {
  Calculator,
  Gauge,
  Beaker,
  Sparkles,
  Wrench,
  Brain,
  BarChart3,
  FileText,
  CalendarDays,
  History,
  Layers,
  FlaskConical,
} from "lucide-react"
import { CalculatorModule } from "@/components/calculator-module"
import { ConverterModule } from "@/components/converter-module"
import { MeasurementModule } from "@/components/measurement-module"
import { AdvancedToolsModule } from "@/components/advanced-tools-module"
import { PracticalToolsModule } from "@/components/practical-tools-module"
import { AIAssistantModule } from "@/components/ai-assistant-module"
import { ChartsPanel } from "@/components/charts-panel"
import { NotesModule } from "@/components/notes-module"
import { ProjectManagementModule } from "@/components/project-management-module"
import { HistoryPanel } from "@/components/history-panel"

interface LaboratoryModuleProps {
  initialSubTab?: string
}

export function LaboratoryModule({ initialSubTab }: LaboratoryModuleProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialSubTab) return initialSubTab
    return "calculators"
  })

  const tools = [
    {
      id: "calculators",
      label: "Ensayos DBO/DQO",
      subLabel: "SM 5210 B • ICA-NSF",
      icon: Calculator,
      component: <CalculatorModule />,
    },
    {
      id: "converter",
      label: "Conversor T/P",
      subLabel: "Gases • Turbidez • CE",
      icon: Gauge,
      component: <ConverterModule />,
    },
    {
      id: "reactors",
      label: "Reactores PTAR",
      subLabel: "TRH • Carga • Lodos",
      icon: Beaker,
      component: <MeasurementModule />,
    },
    {
      id: "advanced",
      label: "Suelos & Huellas",
      subLabel: "Biopilas C:N:P • SEIN",
      icon: Sparkles,
      component: <AdvancedToolsModule />,
    },
    {
      id: "field",
      label: "Aforos & Campo",
      subLabel: "Thomson • Manning • CT",
      icon: Wrench,
      component: <PracticalToolsModule />,
    },
    {
      id: "ai",
      label: "Asistente IA",
      subLabel: "Diagnóstico efluentes",
      icon: Brain,
      component: <AIAssistantModule />,
    },
    {
      id: "charts",
      label: "Gráficos & ECA",
      subLabel: "Tendencias y límites",
      icon: BarChart3,
      component: <ChartsPanel />,
    },
    {
      id: "notes",
      label: "Dossier & Notas",
      subLabel: "Bitácora georreferenciada",
      icon: FileText,
      component: <NotesModule />,
    },
    {
      id: "projects",
      label: "Proyectos",
      subLabel: "Campañas de campo",
      icon: CalendarDays,
      component: <ProjectManagementModule />,
    },
    {
      id: "history",
      label: "Historial",
      subLabel: "Memoria técnica local",
      icon: History,
      component: <HistoryPanel />,
    },
  ]

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0]

  return (
    <div className="space-y-4 pb-28 text-white">
      {/* Laboratory Suite Header & Horizontal Navigation Bar (Táctico) */}
      <div className="bg-[#0F1A17] rounded-2xl border-2 border-[#1B332D] p-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1B332D] px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center text-[#00FFB2]">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-white tracking-wider uppercase leading-tight">
                CONSOLA INSTRUMENTAL // LABORATORIO
              </h2>
              <p className="text-[10px] font-mono text-[#A3B8B2]">
                Selecciona un módulo de cálculo y evaluación
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142622] text-[#00FFB2] border border-[#1B332D] font-bold">
            10 MÓDULOS
          </span>
        </div>

        {/* Scrollable Pill Bar (Pads Tácticos) */}
        <div className="overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {tools.map((t) => {
              const Icon = t.icon
              const isActive = activeTab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all shrink-0 ${
                    isActive
                      ? "bg-[#00FFB2] text-[#070B0A] font-bold shadow-md shadow-[#00FFB2]/20 border border-[#00FFB2]"
                      : "bg-[#070B0A] text-[#A3B8B2] hover:bg-[#142622] hover:text-white border border-[#1B332D]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#070B0A]" : "text-[#00FFB2]"}`} />
                  <div className="text-left">
                    <span className="block leading-none">{t.label}</span>
                    <span
                      className={`block text-[9px] font-mono leading-tight mt-0.5 ${
                        isActive ? "text-[#070B0A]/80 font-normal" : "text-[#647773]"
                      }`}
                    >
                      {t.subLabel}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Render Active Scientific Tool Component */}
      <div className="transition-all animate-in fade-in duration-150">
        {currentTool.component}
      </div>
    </div>
  )
}
