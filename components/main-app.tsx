"use client"

import Image from "next/image"
import {
  Calculator,
  Gauge,
  Beaker,
  BookOpen,
  FileText,
  TrendingUp,
  Brain,
  BookText,
  Wrench,
  History,
  BarChart3,
  CalendarDays,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalculatorModule } from "@/components/calculator-module"
import { ConverterModule } from "@/components/converter-module"
import { MeasurementModule } from "@/components/measurement-module"
import { ResourcesModule } from "@/components/resources-module"
import { NotesModule } from "@/components/notes-module"
import { AdvancedToolsModule } from "@/components/advanced-tools-module"
import { AIAssistantModule } from "@/components/ai-assistant-module"
import { GlossaryModule } from "@/components/glossary-module"
import { PracticalToolsModule } from "@/components/practical-tools-module"
import { SettingsDialog } from "@/components/settings-dialog"
import { useI18n } from "@/lib/i18n-context"
import { HistoryPanel } from "@/components/history-panel"
import { ChartsPanel } from "@/components/charts-panel"
import { ProjectManagementModule } from "@/components/project-management-module"

export function MainApp() {
  const { t, language } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-white p-1">
              <Image src="/logo.png" alt="EcoAI Logo" width={48} height={48} className="object-contain" priority />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none text-foreground">EcoAI</h1>
              <p className="text-xs text-muted-foreground leading-tight">Tu Laboratorio Ambiental</p>
            </div>
          </div>
          <SettingsDialog />
        </div>
      </header>

      <main className="container px-4 py-6">
        <Tabs defaultValue="calculator" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full mb-6">
              <TabsTrigger
                value="calculator"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
              >
                <Calculator className="h-5 w-5" />
                <span className="text-xs">{t("nav.calculator")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="converter"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
              >
                <Gauge className="h-5 w-5" />
                <span className="text-xs">{t("nav.converter")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="measurement"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#f59e0b] data-[state=active]:text-white"
              >
                <Beaker className="h-5 w-5" />
                <span className="text-xs">{t("nav.measurement")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-white"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">{t("nav.notes")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#ef4444] data-[state=active]:text-white"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs">
                  {language === "es" ? "Avanzado" : language === "en" ? "Advanced" : "Avançado"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
              >
                <Brain className="h-5 w-5" />
                <span className="text-xs">{t("nav.ai")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#6366f1] data-[state=active]:text-white"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">{t("nav.resources")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="glossary"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#ec4899] data-[state=active]:text-white"
              >
                <BookText className="h-5 w-5" />
                <span className="text-xs">
                  {language === "es" ? "Glosario" : language === "en" ? "Glossary" : "Glossário"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#14b8a6] data-[state=active]:text-white"
              >
                <Wrench className="h-5 w-5" />
                <span className="text-xs">
                  {language === "es" ? "Herramientas" : language === "en" ? "Tools" : "Ferramentas"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-white"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">
                  {language === "es" ? "Gráficos" : language === "en" ? "Charts" : "Gráficos"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
              >
                <History className="h-5 w-5" />
                <span className="text-xs">
                  {language === "es" ? "Historial" : language === "en" ? "History" : "Histórico"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex flex-col gap-1 py-3 px-4 data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
              >
                <CalendarDays className="h-5 w-5" />
                <span className="text-xs">
                  {language === "es" ? "Proyectos" : language === "en" ? "Projects" : "Projetos"}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calculator" className="mt-0">
            <CalculatorModule />
          </TabsContent>

          <TabsContent value="converter" className="mt-0">
            <ConverterModule />
          </TabsContent>

          <TabsContent value="measurement" className="mt-0">
            <MeasurementModule />
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <NotesModule />
          </TabsContent>

          <TabsContent value="advanced" className="mt-0">
            <AdvancedToolsModule />
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <AIAssistantModule />
          </TabsContent>

          <TabsContent value="resources" className="mt-0">
            <ResourcesModule />
          </TabsContent>

          <TabsContent value="glossary" className="mt-0">
            <GlossaryModule />
          </TabsContent>

          <TabsContent value="tools" className="mt-0">
            <PracticalToolsModule />
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <ChartsPanel />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryPanel />
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <ProjectManagementModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
