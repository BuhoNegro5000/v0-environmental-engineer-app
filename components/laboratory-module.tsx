"use client"

import { useState } from "react"
import { Calculator, Gauge, Beaker, Wrench } from "lucide-react"
import { CalculatorModule } from "@/components/calculator-module"
import { ConverterModule } from "@/components/converter-module"
import { MeasurementModule } from "@/components/measurement-module"
import { PracticalToolsModule } from "@/components/practical-tools-module"

interface LaboratoryModuleProps {
  initialSubTab?: string
}

export function LaboratoryModule({ initialSubTab }: LaboratoryModuleProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialSubTab === "converter" || initialSubTab === "gases") return "converter"
    if (initialSubTab === "reactors" || initialSubTab === "measurements") return "reactors"
    if (initialSubTab === "tools" || initialSubTab === "dispersion" || initialSubTab === "flow") return "field"
    return "calculators"
  })

  const tabs = [
    { id: "calculators", label: "Calculadoras", icon: Calculator },
    { id: "converter", label: "Conversor", icon: Gauge },
    { id: "reactors", label: "Reactores & PTAR", icon: Beaker },
    { id: "field", label: "Herramientas Campo", icon: Wrench },
  ]

  return (
    <div className="space-y-4 pb-24">
      {/* Segmented Top Bar for Laboratory */}
      <div className="p-1 rounded-2xl bg-[#EBF2EE] dark:bg-[#112827] border border-[#DCE7E1] dark:border-[#1E4644] flex gap-1">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? "bg-white dark:bg-[#008F72] text-[#103B3A] dark:text-white shadow-xs"
                  : "text-[#647773] dark:text-[#8FA49F] hover:text-[#253533] dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Render active laboratory section */}
      <div>
        {activeTab === "calculators" && <CalculatorModule />}
        {activeTab === "converter" && <ConverterModule />}
        {activeTab === "reactors" && <MeasurementModule />}
        {activeTab === "field" && <PracticalToolsModule />}
      </div>
    </div>
  )
}
