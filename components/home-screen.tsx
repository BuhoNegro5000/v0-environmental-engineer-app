"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Search,
  Droplet,
  Flame,
  Wind,
  Layers,
  Sparkles,
  ArrowRight,
  Star,
  History,
  ShieldCheck,
  Clock,
  Compass,
  CheckCircle2,
  BookmarkCheck,
  Brain,
  BarChart3,
  FileText,
  CalendarDays,
  Gauge,
  Beaker,
  Wrench,
  BookText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useStorage } from "@/lib/storage-context"

interface HomeScreenProps {
  onNavigate: (module: string, subTab?: string) => void
  onOpenToolsCatalog: () => void
}

export function HomeScreen({ onNavigate, onOpenToolsCatalog }: HomeScreenProps) {
  const { history, favorites, getRecentCalculations } = useStorage()

  const recentCalcs = getRecentCalculations(undefined, 3)

  const primaryTools = [
    {
      id: "dbo5",
      name: "DBO₅",
      fullName: "Demanda Bioquímica de Oxígeno",
      norm: "SM 5210 B",
      module: "calculator",
      subTab: "dbo",
      icon: Droplet,
      color: "text-[#008F72]",
      bg: "bg-[#008F72]/10",
    },
    {
      id: "dqo",
      name: "DQO",
      fullName: "Demanda Química de Oxígeno",
      norm: "SM 5220 C/D",
      module: "calculator",
      subTab: "dqo",
      icon: Flame,
      color: "text-[#D99527]",
      bg: "bg-[#D99527]/10",
    },
    {
      id: "ica",
      name: "Índice ICA",
      fullName: "Calidad de Agua Superficial",
      norm: "R.J. 056-2018-ANA",
      module: "calculator",
      subTab: "wqi",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      id: "gas_converter",
      name: "Gases T y P",
      fullName: "ppm / mg/m³ a T y P Reales",
      norm: "PV = nRT",
      module: "converter",
      subTab: "gases",
      icon: Wind,
      color: "text-cyan-600",
      bg: "bg-cyan-500/10",
    },
    {
      id: "reactors",
      name: "Reactores PTAR",
      fullName: "Dimensionamiento TRH & Carga",
      norm: "Metcalf & Eddy",
      module: "measurement",
      subTab: "reactors",
      icon: Beaker,
      color: "text-emerald-700",
      bg: "bg-emerald-700/10",
    },
    {
      id: "carbon",
      name: "Huella Carbono",
      fullName: "Alcances 1, 2 y 3 (SEIN)",
      norm: "GHG Protocol",
      module: "advanced",
      subTab: "carbon",
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      id: "soil",
      name: "Biopilas Suelos",
      fullName: "Biorremediación C:N:P & AACE",
      norm: "EPA 542 / AACE",
      module: "advanced",
      subTab: "soil",
      icon: Layers,
      color: "text-amber-700",
      bg: "bg-amber-700/10",
    },
    {
      id: "flow",
      name: "Aforo Caudales",
      fullName: "Vertederos & Manning",
      norm: "USBR / Manning",
      module: "tools",
      subTab: "flow",
      icon: Wrench,
      color: "text-teal-600",
      bg: "bg-teal-500/10",
    },
  ]

  const allTwelveModules = [
    {
      id: "calculator",
      title: "Calculadoras Científicas",
      desc: "DBO₅, DQO, Índice ICA-NSF, Emisiones CO₂",
      icon: Calculator,
      tag: "4 Ensayos",
      color: "border-l-[#008F72]",
    },
    {
      id: "converter",
      title: "Conversor Instrumental",
      desc: "Gases a T/P reales, Turbidez óptica, Conductividad/TDS",
      icon: Gauge,
      tag: "Termodinámico",
      color: "border-l-cyan-600",
    },
    {
      id: "measurement",
      title: "Reactores PTAR & Calidad de Agua",
      desc: "Lodos activados, filtros, UASB y mediciones in-situ con ECA",
      icon: Beaker,
      tag: "Metcalf & Eddy",
      color: "border-l-emerald-600",
    },
    {
      id: "advanced",
      title: "Huellas Ambientales & Remediación",
      desc: "Huella de carbono (SEIN), huella hídrica (WFN) y biopilas de suelo",
      icon: Sparkles,
      tag: "GHG & WFN",
      color: "border-l-purple-600",
    },
    {
      id: "tools",
      title: "Herramientas de Campo & Aforos",
      desc: "Vertederos, pluma gaussiana, test de jarras y desinfección CT",
      icon: Wrench,
      tag: "EPA / Aforos",
      color: "border-l-teal-600",
    },
    {
      id: "ai",
      title: "Asistente IA Green Owl",
      desc: "Diagnóstico de efluentes, asesoría de métodos y consultas normativas",
      icon: Brain,
      tag: "IA Ambiental",
      color: "border-l-[#008F72]",
    },
    {
      id: "resources",
      title: "Compendio Normativo Oficial",
      desc: "ECA Agua, LMP PTAR, ECA Aire, ECA Suelo y Ruido con citas legales",
      icon: ShieldCheck,
      tag: "D.S. MINAM",
      color: "border-l-[#103B3A]",
    },
    {
      id: "glossary",
      title: "Glosario Técnico Oficial",
      desc: "Definiciones oficiales, acrónimos y vocabulario de ingeniería ambiental",
      icon: BookText,
      tag: "100+ Términos",
      color: "border-l-indigo-600",
    },
    {
      id: "charts",
      title: "Análisis Gráfico y Tendencias",
      desc: "Gráficos de series de tiempo, percentiles y comparación con límites",
      icon: BarChart3,
      tag: "Series Temporales",
      color: "border-l-blue-600",
    },
    {
      id: "notes",
      title: "Bitácora & Notas de Campo",
      desc: "Cuaderno digital para registrar observaciones e inspecciones ambientales",
      icon: FileText,
      tag: "Inspecciones",
      color: "border-l-amber-600",
    },
    {
      id: "projects",
      title: "Gestión de Proyectos",
      desc: "Planificación de campañas de monitoreo y cronograma de control",
      icon: CalendarDays,
      tag: "Campañas",
      color: "border-l-emerald-700",
    },
    {
      id: "history",
      title: "Historial de Cálculos",
      desc: "Consulta, copia y exportación de todos los cálculos ejecutados localmente",
      icon: History,
      tag: "Trazabilidad",
      color: "border-l-orange-600",
    },
  ]

  return (
    <div className="space-y-6 pb-28">
      {/* Brand Header */}
      <div className="bg-[#103B3A] text-white -mx-4 -mt-5 p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Subtle background coordinate line */}
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full stroke-[#BCE8D9]" fill="none">
            <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="50" strokeWidth="1" />
            <line x1="20" y1="100" x2="180" y2="100" strokeWidth="0.5" />
            <line x1="100" y1="20" x2="100" y2="180" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Green Owl Labs"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                  Laboratorio Ambiental
                </h1>
                <p className="text-[11px] font-mono tracking-widest text-[#BCE8D9] uppercase">
                  by GREEN OWL LABS
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="bg-white/10 text-white border-white/20 text-[10px] font-mono py-1 px-2.5 backdrop-blur-sm"
            >
              🇵🇪 Perú · MINAM Activo
            </Badge>
          </div>

          <p className="mt-3 text-xs text-white/80 leading-relaxed max-w-sm">
            Laboratorio ambiental digital para profesionales. Cálculos estequiométricos validados, métodos oficiales y compendio normativo.
          </p>

          {/* Quick Search Launcher Bar */}
          <div className="mt-4">
            <button
              onClick={onOpenToolsCatalog}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white text-[#647773] hover:text-[#253533] shadow-md transition-all text-left text-sm"
              aria-label="Abrir buscador de herramientas"
            >
              <Search className="h-4 w-4 text-[#008F72] shrink-0" />
              <span className="flex-1 text-xs sm:text-sm text-[#647773] truncate">
                Buscar cálculo, método o norma (ej. DBO5, ECA, gases)...
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#EBF2EE] text-[#253533] rounded border border-[#DCE7E1]">
                Catálogo (20+)
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Real Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 px-1">
        <div className="p-3 rounded-xl bg-white dark:bg-[#112827] border border-[#DCE7E1] dark:border-[#1E4644] text-center shadow-xs">
          <span className="block text-lg font-bold text-[#008F72] dark:text-[#00A887] font-mono">
            {history.length}
          </span>
          <span className="text-[10px] text-[#647773] dark:text-[#8FA49F] uppercase font-medium tracking-tight">
            Cálculos Guardados
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#112827] border border-[#DCE7E1] dark:border-[#1E4644] text-center shadow-xs">
          <span className="block text-lg font-bold text-[#103B3A] dark:text-[#BCE8D9] font-mono">
            {favorites.length}
          </span>
          <span className="text-[10px] text-[#647773] dark:text-[#8FA49F] uppercase font-medium tracking-tight">
            Herramientas Favoritas
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#112827] border border-[#DCE7E1] dark:border-[#1E4644] text-center shadow-xs">
          <span className="block text-lg font-bold text-[#008F72] font-mono">
            12 / 12
          </span>
          <span className="text-[10px] text-[#647773] dark:text-[#8FA49F] uppercase font-medium tracking-tight">
            Módulos Integrados
          </span>
        </div>
      </div>

      {/* Acceso Rápido Instrumental (8 Herramientas de Cálculo Frecuente) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#253533] dark:text-[#EAF2EE] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-[#008F72]" />
            Acceso Rápido Instrumental
          </h2>
          <button
            onClick={onOpenToolsCatalog}
            className="text-xs text-[#008F72] hover:underline font-medium"
          >
            Abrir Catálogo Completo →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {primaryTools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.module, tool.subTab)}
                className="group p-3 rounded-xl border border-[#DCE7E1] dark:border-[#1E4644] bg-white dark:bg-[#112827] hover:border-[#008F72] hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg ${tool.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <span className="text-[9px] font-mono bg-[#EBF2EE] dark:bg-[#173836] text-[#253533] dark:text-[#EAF2EE] px-1.5 py-0.5 rounded">
                      {tool.norm}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#253533] dark:text-[#EAF2EE] group-hover:text-[#008F72] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-[#647773] dark:text-[#8FA49F] line-clamp-1 mt-0.5">
                    {tool.fullName}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#DCE7E1]/50 dark:border-[#1E4644]/50 flex items-center justify-between text-[10px] text-[#008F72] font-semibold">
                  <span>Calcular</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Favoritos (si existen) */}
      {favorites.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#253533] dark:text-[#EAF2EE] uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-4 w-4 text-[#D99527] fill-[#D99527]" />
              Tus Herramientas Favoritas
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => onNavigate(fav.module)}
                className="px-3 py-2 rounded-xl border border-[#DCE7E1] dark:border-[#1E4644] bg-white dark:bg-[#112827] text-xs font-semibold text-[#253533] dark:text-[#EAF2EE] hover:border-[#008F72] flex items-center gap-2 shrink-0 shadow-xs"
              >
                <BookmarkCheck className="h-3.5 w-3.5 text-[#008F72]" />
                <span>{fav.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cálculos Recientes */}
      {recentCalcs.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#253533] dark:text-[#EAF2EE] uppercase tracking-wider flex items-center gap-1.5">
              <History className="h-4 w-4 text-[#647773]" />
              Últimos Cálculos Realizados
            </h2>
            <button
              onClick={() => onNavigate("history")}
              className="text-xs text-[#008F72] hover:underline font-medium"
            >
              Ver historial completo →
            </button>
          </div>

          <div className="space-y-2">
            {recentCalcs.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.module)}
                className="p-3 rounded-xl border border-[#DCE7E1] dark:border-[#1E4644] bg-white dark:bg-[#112827] flex items-center justify-between gap-3 text-xs cursor-pointer hover:border-[#008F72] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#253533] dark:text-[#EAF2EE] uppercase">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-[#647773] dark:text-[#8FA49F] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#647773] dark:text-[#8FA49F] font-mono">
                    Resultado: <strong className="text-[#008F72]">{String(item.result)}</strong>
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#647773] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catálogo Completo: Todos los 12 Módulos Integrados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#253533] dark:text-[#EAF2EE] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-[#008F72]" />
            Catálogo Integral de Módulos (12 Herramientas)
          </h2>
          <span className="text-xs text-[#647773] dark:text-[#8FA49F]">100% Integradas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allTwelveModules.map((mod) => {
            const Icon = mod.icon
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className={`p-3.5 rounded-xl border border-[#DCE7E1] dark:border-[#1E4644] bg-white dark:bg-[#112827] hover:shadow-md transition-all text-left flex items-start gap-3 border-l-4 ${mod.color}`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#F4F8F5] dark:bg-[#0B1C1B] flex items-center justify-center text-[#008F72] shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-xs sm:text-sm text-[#253533] dark:text-[#EAF2EE] truncate">
                      {mod.title}
                    </h3>
                    <Badge variant="secondary" className="text-[9px] font-mono px-1.5 py-0">
                      {mod.tag}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#647773] dark:text-[#8FA49F] mt-1 line-clamp-1">
                    {mod.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
