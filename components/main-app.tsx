"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowLeft,
  Layers,
  Star,
} from "lucide-react"
import { SettingsDialog } from "@/components/settings-dialog"
import { BottomNavigation, type NavigationDestination } from "@/components/bottom-navigation"
import { ToolsBottomSheet } from "@/components/tools-bottom-sheet"
import { HomeScreen } from "@/components/home-screen"
import { LaboratoryModule } from "@/components/laboratory-module"
import { RegulationsView } from "@/components/regulations-view"
import { ProfileModule } from "@/components/profile-module"
import { AdvancedToolsModule } from "@/components/advanced-tools-module"
import { AIAssistantModule } from "@/components/ai-assistant-module"
import { NotesModule } from "@/components/notes-module"
import { ChartsPanel } from "@/components/charts-panel"
import { HistoryPanel } from "@/components/history-panel"
import { ProjectManagementModule } from "@/components/project-management-module"
import { CalculatorModule } from "@/components/calculator-module"
import { ConverterModule } from "@/components/converter-module"
import { MeasurementModule } from "@/components/measurement-module"
import { PracticalToolsModule } from "@/components/practical-tools-module"
import { useStorage } from "@/lib/storage-context"

export function MainApp() {
  const [currentDestination, setCurrentDestination] = useState<NavigationDestination>("home")
  const [activeDirectModule, setActiveDirectModule] = useState<string | null>(null)
  const [subTab, setSubTab] = useState<string | undefined>(undefined)
  const [toolsSheetOpen, setToolsSheetOpen] = useState(false)
  const { favorites, addFavorite, removeFavorite, isFavorite } = useStorage()

  const handleNavigate = (module: string, targetSubTab?: string) => {
    setSubTab(targetSubTab)

    if (module === "profile") {
      setCurrentDestination("profile")
      setActiveDirectModule(null)
    } else if (module === "resources" || module === "glossary") {
      setCurrentDestination("regulations")
      setActiveDirectModule(module)
    } else {
      setActiveDirectModule(module)
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSelectDestination = (dest: NavigationDestination) => {
    setCurrentDestination(dest)
    setActiveDirectModule(null)
    setSubTab(undefined)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getModuleTitle = (mod: string) => {
    switch (mod) {
      case "calculator":
        return "Calculadora Científica Ambiental"
      case "converter":
        return "Conversor Instrumental & Gases"
      case "measurement":
        return "Reactores PTAR & Calidad de Agua"
      case "advanced":
        return "Huellas Ambientales & Remediación"
      case "tools":
        return "Herramientas de Campo & Aforos"
      case "ai":
        return "Asistente IA Green Owl"
      case "resources":
        return "Compendio Normativo Oficial"
      case "glossary":
        return "Glosario Técnico Oficial"
      case "charts":
        return "Análisis Gráfico y Tendencias"
      case "notes":
        return "Bitácora & Notas de Campo"
      case "projects":
        return "Gestión de Proyectos"
      case "history":
        return "Historial de Cálculos"
      default:
        return "Laboratorio Ambiental"
    }
  }

  const toggleCurrentFavorite = () => {
    if (!activeDirectModule) return
    if (isFavorite(activeDirectModule)) {
      removeFavorite(activeDirectModule)
    } else {
      addFavorite({
        id: activeDirectModule,
        name: getModuleTitle(activeDirectModule),
        module: activeDirectModule,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8F5] dark:bg-[#0B1C1B] text-[#253533] dark:text-[#EAF2EE] transition-colors">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#DCE7E1] dark:border-[#1E4644] bg-white/95 dark:bg-[#112827]/95 backdrop-blur-md">
        <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-4">
          {activeDirectModule ? (
            /* Contextual Back Navigation Header */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveDirectModule(null)
                  setCurrentDestination("home")
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#008F72] dark:text-[#00A887] hover:underline p-1.5 -ml-1 rounded-lg"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver</span>
              </button>
              <div className="h-4 w-[1px] bg-[#DCE7E1] dark:border-[#1E4644] mx-1" />
              <h2 className="text-xs sm:text-sm font-bold text-[#253533] dark:text-[#EAF2EE] truncate max-w-[200px] sm:max-w-xs">
                {getModuleTitle(activeDirectModule)}
              </h2>
            </div>
          ) : (
            /* Standard Brand Identity Header */
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 border border-[#DCE7E1] dark:border-[#1E4644] shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Green Owl Labs"
                  width={28}
                  height={28}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
              <div>
                <h1 className="text-sm font-bold leading-none text-[#103B3A] dark:text-[#EAF2EE]">
                  Laboratorio Ambiental
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-[#008F72] dark:text-[#BCE8D9] uppercase leading-tight mt-0.5">
                  by GREEN OWL LABS
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {activeDirectModule && (
              <button
                onClick={toggleCurrentFavorite}
                className="p-2 rounded-xl text-[#647773] dark:text-[#8FA49F] hover:bg-[#EBF2EE] dark:hover:bg-[#173836] transition-colors"
                title={isFavorite(activeDirectModule) ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-label="Favorito"
              >
                <Star
                  className={`h-4 w-4 ${
                    isFavorite(activeDirectModule)
                      ? "fill-[#D99527] text-[#D99527]"
                      : "text-[#647773] dark:text-[#8FA49F]"
                  }`}
                />
              </button>
            )}

            <button
              onClick={() => setToolsSheetOpen(true)}
              className="p-2 rounded-xl text-[#647773] dark:text-[#8FA49F] hover:bg-[#EBF2EE] dark:hover:bg-[#173836] transition-colors"
              title="Catálogo de herramientas"
              aria-label="Catálogo de herramientas"
            >
              <Layers className="h-4 w-4" />
            </button>
            <SettingsDialog />
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="container max-w-4xl mx-auto px-4 py-5">
        {/* If user navigated directly into any of the 12 modules */}
        {activeDirectModule ? (
          <div className="pb-28">
            {activeDirectModule === "calculator" && <CalculatorModule />}
            {activeDirectModule === "converter" && <ConverterModule />}
            {activeDirectModule === "measurement" && <MeasurementModule />}
            {activeDirectModule === "advanced" && <AdvancedToolsModule />}
            {activeDirectModule === "tools" && <PracticalToolsModule />}
            {activeDirectModule === "ai" && <AIAssistantModule />}
            {activeDirectModule === "charts" && <ChartsPanel />}
            {activeDirectModule === "notes" && <NotesModule />}
            {activeDirectModule === "projects" && <ProjectManagementModule />}
            {activeDirectModule === "history" && <HistoryPanel />}
            {activeDirectModule === "resources" && <RegulationsView initialTab="resources" />}
            {activeDirectModule === "glossary" && <RegulationsView initialTab="glossary" />}
          </div>
        ) : (
          /* Primary Router Destinations */
          <div>
            {currentDestination === "home" && (
              <HomeScreen
                onNavigate={handleNavigate}
                onOpenToolsCatalog={() => setToolsSheetOpen(true)}
              />
            )}

            {currentDestination === "lab" && (
              <LaboratoryModule initialSubTab={subTab} />
            )}

            {currentDestination === "regulations" && (
              <RegulationsView />
            )}

            {currentDestination === "profile" && (
              <ProfileModule />
            )}
          </div>
        )}
      </main>

      {/* Categorized Tools Bottom Sheet (Drawer A to K) */}
      <ToolsBottomSheet
        open={toolsSheetOpen}
        onOpenChange={setToolsSheetOpen}
        onSelectTool={handleNavigate}
      />

      {/* Fixed 5-Destination Bottom Navigation */}
      <BottomNavigation
        currentDestination={currentDestination}
        onSelectDestination={handleSelectDestination}
        onOpenToolsSheet={() => setToolsSheetOpen(true)}
      />
    </div>
  )
}
