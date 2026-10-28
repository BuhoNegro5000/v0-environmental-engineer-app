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
      label: "Calculadoras",
      subLabel: "DBO, DQO, ICA",
      icon: Calculator,
      component: <CalculatorModule />,
    },
    {
      id: "converter",
      label: "Conversor",
      subLabel: "Gases T/P, Turbidez",
      icon: Gauge,
      component: <ConverterModule />,
    },
    {
      id: "reactors",
      label: "Reactores PTAR",
      subLabel: "TRH & Carga",
      icon: Beaker,
      component: <MeasurementModule />,
    },
    {
      id: "advanced",
      label: "Huellas & Suelos",
      subLabel: "Carbono, Agua, Biopilas",
      icon: Sparkles,
      component: <AdvancedToolsModule />,
    },
    {
      id: "field",
      label: "Campo & Aforos",
      subLabel: "Vertederos, Pluma, CT",
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
      label: "Gráficos",
      subLabel: "Tendencias & límites",
      icon: BarChart3,
      component: <ChartsPanel />,
    },
    {
      id: "notes",
      label: "Bitácora",
      subLabel: "Notas de inspección",
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
      subLabel: "Memoria local",
      icon: History,
      component: <HistoryPanel />,
    },
  ]

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0]

  return (
    <div className="space-y-4 pb-28">
      {/* Laboratory Suite Header & Horizontal Navigation Bar */}
      <div className="bg-white dark:bg-[#112827] rounded-2xl border border-[#DCE7E1] dark:border-[#1E4644] p-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCE7E1] dark:border-[#1E4644] px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#008F72]/10 dark:bg-[#008F72]/20 flex items-center justify-center text-[#008F72]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#253533] dark:text-[#EAF2EE] leading-tight">
                Módulos Científicos del Laboratorio
              </h2>
              <p className="text-[11px] text-[#647773] dark:text-[#8FA49F]">
                Selecciona una herramienta instrumental para comenzar
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBF2EE] dark:bg-[#173836] text-[#008F72] font-semibold">
            10 Herramientas
          </span>
        </div>

        {/* Scrollable Pill Bar */}
        <div className="overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {tools.map((t) => {
              const Icon = t.icon
              const isActive = activeTab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? "bg-[#008F72] text-white shadow-sm shadow-[#008F72]/20"
                      : "bg-[#F4F8F5] dark:bg-[#0B1C1B] text-[#647773] dark:text-[#8FA49F] hover:bg-[#EBF2EE] dark:hover:bg-[#173836] hover:text-[#253533] dark:hover:text-white border border-[#DCE7E1] dark:border-[#1E4644]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#008F72]"}`} />
                  <div className="text-left">
                    <span className="block leading-none">{t.label}</span>
                    <span
                      className={`block text-[9px] font-normal leading-tight mt-0.5 ${
                        isActive ? "text-white/80" : "text-[#647773] dark:text-[#8FA49F]"
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
