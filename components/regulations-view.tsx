"use client"

import { useState } from "react"
import { ShieldCheck, BookText } from "lucide-react"
import { ResourcesModule } from "@/components/resources-module"
import { GlossaryModule } from "@/components/glossary-module"

interface RegulationsViewProps {
  initialTab?: "resources" | "glossary"
}

export function RegulationsView({ initialTab = "resources" }: RegulationsViewProps) {
  const [activeTab, setActiveTab] = useState<"resources" | "glossary">(initialTab)

  return (
    <div className="space-y-4 pb-24">
      {/* Segmented Top Bar for Regulations & Standards */}
      <div className="p-1 rounded-2xl bg-[#EBF2EE] dark:bg-[#112827] border border-[#DCE7E1] dark:border-[#1E4644] flex gap-1">
        <button
          onClick={() => setActiveTab("resources")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "resources"
              ? "bg-white dark:bg-[#008F72] text-[#103B3A] dark:text-white shadow-xs"
              : "text-[#647773] dark:text-[#8FA49F] hover:text-[#253533] dark:hover:text-white"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Normativa y Decretos</span>
        </button>

        <button
          onClick={() => setActiveTab("glossary")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "glossary"
              ? "bg-white dark:bg-[#008F72] text-[#103B3A] dark:text-white shadow-xs"
              : "text-[#647773] dark:text-[#8FA49F] hover:text-[#253533] dark:hover:text-white"
          }`}
        >
          <BookText className="h-4 w-4" />
          <span>Glosario Técnico</span>
        </button>
      </div>

      <div>
        {activeTab === "resources" && <ResourcesModule />}
        {activeTab === "glossary" && <GlossaryModule />}
      </div>
    </div>
  )
}
