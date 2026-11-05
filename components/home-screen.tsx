"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Activity,
  Calculator,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Droplet,
  Wind,
  Flame,
  Wrench,
  History,
} from "lucide-react"

interface HomeScreenProps {
  onNavigate: (module: string, subTab?: string) => void
  onOpenToolsCatalog: () => void
  onOpenQuickNote?: () => void
  onOpenQuickInsitu?: () => void
}

export function HomeScreen({
  onNavigate,
  onOpenToolsCatalog,
  onOpenQuickNote,
  onOpenQuickInsitu,
}: HomeScreenProps) {
  // Notas recientes guardadas en el cuaderno de laboratorio
  const [recentNotes, setRecentNotes] = useState<any[]>([])

  // Cargar estado inicial y GPS
  useEffect(() => {
    localStorage.removeItem("gol_field_photos")
    loadRecentNotes()
  }, [])

  const loadRecentNotes = () => {
    try {
      const notes = localStorage.getItem("gol_notes")
      if (notes) setRecentNotes(JSON.parse(notes).slice(0, 3))
    } catch (e) {
      console.error(e)
    }
  }

  // 4 Consolas Científicas Principales
  const scientificConsoles = [
    {
      id: "water",
      title: "AGUA & EFLUENTES",
      tag: "Norma D.S. 004-MINAM",
      desc: "DBO₅ dilución, DQO por titulación, ICA-NSF, PTAR (TRH & lodos)",
      icon: Droplet,
      color: "border-[#00FFB2] text-[#00FFB2]",
      badge: "4 Ensayos",
      onClick: () => onNavigate("calculator", "dbo"),
    },
    {
      id: "air",
      title: "AIRE & EMISIONES",
      tag: "Ley de Gases Ideales",
      desc: "Conversión ppm a mg/m³ T/P reales, dispersión Gaussiana de pluma",
      icon: Wind,
      color: "border-[#00E5FF] text-[#00E5FF]",
      badge: "Termodinámica",
      onClick: () => onNavigate("converter"),
    },
    {
      id: "soil",
      title: "SUELOS & REMEDIACIÓN",
      tag: "Balance C:N:P 100:10:1",
      desc: "Diseño de biopilas, fertilización urea/TSP, huella de carbono SEIN",
      icon: Sparkles,
      color: "border-[#FFB800] text-[#FFB800]",
      badge: "Biopilas",
      onClick: () => onNavigate("advanced", "remediation"),
    },
    {
      id: "hydraulics",
      title: "AFOROS & CAMPO",
      tag: "Standard Methods",
      desc: "Vertederos, Manning, flotadores y velocidad-área",
      icon: Wrench,
      color: "border-[#BCE8D9] text-[#BCE8D9]",
      badge: "Hidráulica",
      onClick: () => onNavigate("flow_measurement"),
    },
  ]

  return (
    <div className="space-y-4 pb-28 text-white">
      {/* 1. Panel de orientación del laboratorio */}
      <section className="bg-[#0F1A17] border-2 border-[#1B332D] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        {/* Glow de acento Bio-Neon superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00FFB2] to-transparent opacity-80" />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FFB2]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#00FFB2]">
            LABORATORIO AMBIENTAL // RESOLUCIÓN DE PROBLEMAS
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white text-balance">Calcula, compara y decide con criterio técnico</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A3B8B2]">Un espacio de trabajo para cuantificar problemas de agua, aire, suelo, energía y tratamiento. Elige una herramienta según la pregunta técnica que necesitas resolver.</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-[#070B0A] p-3 rounded-xl border border-[#1B332D]"><span className="text-[#00FFB2] font-bold block">Cuantificar</span><span className="text-[#A3B8B2]">Cargas, caudales y emisiones</span></div>
          <div className="bg-[#070B0A] p-3 rounded-xl border border-[#1B332D]"><span className="text-[#00E5FF] font-bold block">Diseñar</span><span className="text-[#A3B8B2]">PTAR, reactores y remediación</span></div>
          <div className="bg-[#070B0A] p-3 rounded-xl border border-[#1B332D]"><span className="text-[#BCE8D9] font-bold block">Documentar</span><span className="text-[#A3B8B2]">Notas, cálculos y conclusiones</span></div>
        </div>
      </section>

      {/* 2. DOCK DE ACCIONES RÁPIDAS DE CAMPO (4 PADS GRANDES DE PULGAR) */}
      <section className="space-y-1.5">
        <h3 className="font-mono text-xs font-bold tracking-wider text-[#A3B8B2] uppercase px-1 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[#00FFB2]" />
          HERRAMIENTAS DE CAMPO // 1-TAP
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Pad 2: Nota Rápida con Coordenadas */}
          <button
            onClick={onOpenQuickNote}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-[#0F1A17] hover:bg-[#142622] border-2 border-[#00E5FF]/40 hover:border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10 transition-all text-left group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF] text-[#070B0A] flex items-center justify-center mb-2 shadow-md shadow-[#00E5FF]/30 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5 stroke-[2.4]" />
            </div>
            <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-wider leading-tight">
              NOTA DE CAMPO
            </span>
            <span className="text-[10px] font-mono text-[#A3B8B2] mt-0.5">
              Dictado por voz & tags
            </span>
          </button>

          {/* Pad 3: Test In-Situ vs ECA */}
          <button
            onClick={onOpenQuickInsitu}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-[#0F1A17] hover:bg-[#142622] border-2 border-[#FFB800]/40 hover:border-[#FFB800] shadow-lg shadow-[#FFB800]/10 transition-all text-left group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#070B0A] flex items-center justify-center mb-2 shadow-md shadow-[#FFB800]/30 group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5 stroke-[2.4]" />
            </div>
            <span className="font-mono text-xs font-bold text-[#FFB800] tracking-wider leading-tight">
              TEST IN-SITU
            </span>
            <span className="text-[10px] font-mono text-[#A3B8B2] mt-0.5">
              pH, OD, CE vs ECA
            </span>
          </button>

          {/* Pad 4: Dossier / Bitácora Completa */}
          <button
            onClick={() => onNavigate("notes")}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-[#0F1A17] hover:bg-[#142622] border-2 border-[#1B332D] hover:border-[#00FFB2]/50 transition-all text-left group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#142622] text-[#00FFB2] border border-[#1B332D] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="font-mono text-xs font-bold text-white tracking-wider leading-tight">
              DOSSIER & CHECK
            </span>
            <span className="text-[10px] font-mono text-[#A3B8B2] mt-0.5">
              Bitácora & reportes
            </span>
          </button>
        </div>
      </section>

      {/* 3. LAS 4 CONSOLAS CIENTÍFICAS ESPECIALIZADAS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-mono text-xs font-bold tracking-wider text-[#A3B8B2] uppercase flex items-center gap-1.5">
            <Calculator className="h-3.5 w-3.5 text-[#00FFB2]" />
            CONSOLAS INSTRUMENTALES // CÁLCULOS
          </h3>
          <button
            onClick={onOpenToolsCatalog}
            className="text-[10px] font-mono text-[#00FFB2] hover:underline flex items-center gap-1"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {scientificConsoles.map((consoleItem) => {
            const Icon = consoleItem.icon
            return (
              <button
                key={consoleItem.id}
                onClick={consoleItem.onClick}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1A17] hover:bg-[#142622] border border-[#1B332D] hover:border-[#00FFB2]/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl bg-[#070B0A] border flex items-center justify-center shrink-0 ${consoleItem.color}`}
                  >
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono text-xs font-bold text-white tracking-wider">
                        {consoleItem.title}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#142622] text-[#A3B8B2] border border-[#1B332D]">
                        {consoleItem.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#A3B8B2] truncate mt-0.5">
                      {consoleItem.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-[#A3B8B2] group-hover:text-[#00FFB2] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-mono text-xs font-bold tracking-wider text-[#A3B8B2] uppercase flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-[#00E5FF]" />
            CUADERNO DE LABORATORIO
          </h3>
          <button onClick={() => onNavigate("notes")} className="text-[10px] font-mono text-[#00FFB2] hover:underline">Abrir notas</button>
        </div>
        {recentNotes.length === 0 ? (
          <button onClick={() => onNavigate("notes")} className="w-full bg-[#0F1A17] border border-[#1B332D] rounded-2xl p-6 text-center text-[#A3B8B2] font-mono space-y-2 hover:border-[#00FFB2]/50">
            <FileText className="h-8 w-8 mx-auto text-[#00FFB2]/60" />
            <p className="text-xs text-white">Todavía no hay notas técnicas</p>
            <p className="text-[10px] text-[#647773]">Guarda una hipótesis, un dato de ensayo o una decisión de diseño.</p>
          </button>
        ) : (
          <div className="space-y-1.5">
            {recentNotes.slice(0, 2).map((note) => (
              <button key={note.id} onClick={() => onNavigate("notes")} className="w-full text-left bg-[#0F1A17] border border-[#1B332D] rounded-xl p-2.5 text-xs font-mono hover:border-[#00FFB2]/50">
                <div className="flex items-center justify-between text-[#00E5FF] mb-1"><span className="font-bold truncate">{note.title}</span><span className="text-[9px] text-[#A3B8B2]">{new Date(note.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                <p className="text-[11px] text-[#A3B8B2] line-clamp-2 leading-relaxed">{note.content}</p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
