"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowLeft,
  Layers,
  Star,
  Settings,
  Camera,
  Activity,
  FileText,
  Compass,
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
import { FieldCameraModal } from "@/components/field-camera-modal"
import { QuickNoteModal } from "@/components/quick-note-modal"
import { QuickInsituModal } from "@/components/quick-insitu-modal"
import { FieldActionDock } from "@/components/field-action-dock"
import { useStorage } from "@/lib/storage-context"

export function MainApp() {
  const [currentDestination, setCurrentDestination] = useState<NavigationDestination>("home")
  const [activeDirectModule, setActiveDirectModule] = useState<string | null>(null)
  const [subTab, setSubTab] = useState<string | undefined>(undefined)
  const [toolsSheetOpen, setToolsSheetOpen] = useState(false)

  // Modales de Acción Rápida en Campo
  const [actionDockOpen, setActionDockOpen] = useState(false)
  const [cameraModalOpen, setCameraModalOpen] = useState(false)
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)
  const [quickInsituOpen, setQuickInsituOpen] = useState(false)

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
        return "Bitácora & Dossier de Campo"
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
    <div className="min-h-screen bg-[#070B0A] text-[#EAF2EE] transition-colors selection:bg-[#00FFB2] selection:text-[#070B0A]">
      {/* Top Application Bar (Cabina Táctica) */}
      <header className="sticky top-0 z-30 w-full border-b border-[#1B332D] bg-[#0F1A17]/95 backdrop-blur-md">
        <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-3 sm:px-4">
          {activeDirectModule ? (
            /* Contextual Back Navigation Header */
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => {
                  setActiveDirectModule(null)
                  setCurrentDestination("home")
                }}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#00FFB2] hover:underline p-1.5 -ml-1 rounded-lg shrink-0"
                aria-label="Volver al HUD"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>HUD</span>
              </button>
              <div className="h-4 w-[1px] bg-[#1B332D] mx-1 shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold font-mono text-white truncate max-w-[200px] sm:max-w-xs">
                {getModuleTitle(activeDirectModule)}
              </h2>
            </div>
          ) : (
            /* Standard Brand Identity Header */
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#070B0A] p-1 border border-[#00FFB2]/40 shadow-xs shadow-[#00FFB2]/20">
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
                <h1 className="text-sm font-bold leading-none text-white tracking-wide">
                  Laboratorio Ambiental
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-[#00FFB2] uppercase leading-tight mt-0.5">
                  by GREEN OWL LABS
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Acceso rápido a cámara desde el header */}
            <button
              onClick={() => setCameraModalOpen(true)}
              className="p-2 rounded-xl text-[#00FFB2] hover:bg-[#142622] transition-colors border border-transparent hover:border-[#00FFB2]/30"
              title="Cámara con Sello Técnico"
              aria-label="Abrir cámara técnica"
            >
              <Camera className="h-4 w-4" />
            </button>

            {activeDirectModule && (
              <button
                onClick={toggleCurrentFavorite}
                className="p-2 rounded-xl text-[#A3B8B2] hover:bg-[#142622] transition-colors"
                title={isFavorite(activeDirectModule) ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-label="Favorito"
              >
                <Star
                  className={`h-4 w-4 ${
                    isFavorite(activeDirectModule)
                      ? "fill-[#FFB800] text-[#FFB800]"
                      : "text-[#A3B8B2]"
                  }`}
                />
              </button>
            )}

            <button
              onClick={() => setToolsSheetOpen(true)}
              className="p-2 rounded-xl text-[#A3B8B2] hover:bg-[#142622] hover:text-[#00FFB2] transition-colors"
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
      <main className="container max-w-4xl mx-auto px-3 sm:px-4 py-4">
        {/* If user navigated directly into any of the modules */}
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
                onOpenPhotoCamera={() => setCameraModalOpen(true)}
                onOpenQuickNote={() => setQuickNoteOpen(true)}
                onOpenQuickInsitu={() => setQuickInsituOpen(true)}
              />
            )}

            {currentDestination === "lab" && (
              <LaboratoryModule initialSubTab={subTab} />
            )}

            {currentDestination === "regulations" && (
              <RegulationsView />
            )}

            {currentDestination === "dossier" && (
              <NotesModule />
            )}

            {currentDestination === "profile" && (
              <ProfileModule />
            )}
          </div>
        )}
      </main>

      {/* Modales Tácticos de Operaciones en Campo */}
      <FieldCameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
      />

      <QuickNoteModal
        isOpen={quickNoteOpen}
        onClose={() => setQuickNoteOpen(false)}
      />

      <QuickInsituModal
        isOpen={quickInsituOpen}
        onClose={() => setQuickInsituOpen(false)}
      />

      <FieldActionDock
        isOpen={actionDockOpen}
        onClose={() => setActionDockOpen(false)}
        onOpenPhotoCamera={() => setCameraModalOpen(true)}
        onOpenQuickNote={() => setQuickNoteOpen(true)}
        onOpenQuickInsitu={() => setQuickInsituOpen(true)}
        onOpenCalculators={() => {
          handleSelectDestination("lab")
        }}
      />

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
        onOpenActionDock={() => setActionDockOpen(true)}
      />
    </div>
  )
}
