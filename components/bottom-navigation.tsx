"use client"

import {
  Compass,
  FlaskConical,
  Plus,
  ShieldCheck,
  FileCheck2,
  Activity,
  Layers,
} from "lucide-react"

export type NavigationDestination = "home" | "lab" | "regulations" | "dossier" | "profile"

interface BottomNavigationProps {
  currentDestination: NavigationDestination
  onSelectDestination: (dest: NavigationDestination) => void
  onOpenActionDock: () => void
}

export function BottomNavigation({
  currentDestination,
  onSelectDestination,
  onOpenActionDock,
}: BottomNavigationProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[#070B0A]/95 backdrop-blur-md border-t border-[#1B332D] transition-colors"
      aria-label="Navegación táctica de campo"
    >
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-between pb-safe">
        {/* 1. HUD CAMPO (HOME) */}
        <button
          onClick={() => onSelectDestination("home")}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all ${
            currentDestination === "home"
              ? "text-[#00FFB2]"
              : "text-[#647773] hover:text-[#A3B8B2]"
          }`}
          aria-label="HUD Campo"
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
              currentDestination === "home" ? "bg-[#00FFB2]/15 border border-[#00FFB2]/40" : ""
            }`}
          >
            <Compass className={`h-4 w-4 ${currentDestination === "home" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${currentDestination === "home" ? "font-bold" : "font-medium"}`}>
            HUD CAMPO
          </span>
        </button>

        {/* 2. INSTRUMENTOS (LAB) */}
        <button
          onClick={() => onSelectDestination("lab")}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all ${
            currentDestination === "lab"
              ? "text-[#00FFB2]"
              : "text-[#647773] hover:text-[#A3B8B2]"
          }`}
          aria-label="Instrumentos"
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
              currentDestination === "lab" ? "bg-[#00FFB2]/15 border border-[#00FFB2]/40" : ""
            }`}
          >
            <FlaskConical className={`h-4 w-4 ${currentDestination === "lab" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${currentDestination === "lab" ? "font-bold" : "font-medium"}`}>
            CÁLCULOS
          </span>
        </button>

        {/* 3. BOTÓN CENTRAL TÁCTICO FLOTANTE (1-TAP ACTION) */}
        <div className="flex flex-col items-center justify-center px-1">
          <button
            onClick={onOpenActionDock}
            className="group relative -mt-5 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#00FFB2] text-[#070B0A] shadow-lg shadow-[#00FFB2]/40 border-2 border-[#070B0A] active:scale-90 hover:scale-105 transition-all"
            aria-label="Acciones de Campo 1-Tap"
          >
            <Plus className="h-6 w-6 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            <div className="absolute -inset-1 rounded-2xl bg-[#00FFB2] opacity-25 animate-ping -z-10" />
          </button>
          <span className="text-[9px] font-mono font-bold text-[#00FFB2] tracking-wider mt-1">
            ACCIÓN
          </span>
        </div>

        {/* 4. NORMATIVA */}
        <button
          onClick={() => onSelectDestination("regulations")}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all ${
            currentDestination === "regulations"
              ? "text-[#00FFB2]"
              : "text-[#647773] hover:text-[#A3B8B2]"
          }`}
          aria-label="Normativa"
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
              currentDestination === "regulations" ? "bg-[#00FFB2]/15 border border-[#00FFB2]/40" : ""
            }`}
          >
            <ShieldCheck className={`h-4 w-4 ${currentDestination === "regulations" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${currentDestination === "regulations" ? "font-bold" : "font-medium"}`}>
            NORMAS
          </span>
        </button>

        {/* 5. DOSSIER & BITÁCORA */}
        <button
          onClick={() => onSelectDestination("dossier")}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all ${
            currentDestination === "dossier"
              ? "text-[#00FFB2]"
              : "text-[#647773] hover:text-[#A3B8B2]"
          }`}
          aria-label="Dossier"
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
              currentDestination === "dossier" ? "bg-[#00FFB2]/15 border border-[#00FFB2]/40" : ""
            }`}
          >
            <FileCheck2 className={`h-4 w-4 ${currentDestination === "dossier" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${currentDestination === "dossier" ? "font-bold" : "font-medium"}`}>
            DOSSIER
          </span>
        </button>
      </div>
    </nav>
  )
}
