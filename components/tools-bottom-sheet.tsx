"use client"

import { useState, useMemo, useEffect } from "react"
import {
  X,
  Search,
  Star,
  Layers,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStorage } from "@/lib/storage-context"

export interface ToolCatalogItem {
  id: string
  name: string
  category: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K"
  categoryLabel: string
  reference: string
  description: string
  module: string
  subTab?: string
  tags: string[]
}

export const TOOLS_CATALOG: ToolCatalogItem[] = [
  // A. Calculadoras científicas
  {
    id: "dbo5",
    name: "DBO₅ (Demanda Bioquímica de Oxígeno)",
    category: "A",
    categoryLabel: "Calculadoras científicas",
    reference: "Standard Methods 5210 B",
    description: "Cálculo riguroso de DBO a 5 días a 20 °C con dilución (P) y corrección por semilla.",
    module: "calculator",
    subTab: "dbo",
    tags: ["dbo", "dbo5", "oxigeno", "demanda", "agua", "efluente", "sm5210b"],
  },
  {
    id: "dqo",
    name: "DQO (Demanda Química de Oxígeno)",
    category: "A",
    categoryLabel: "Calculadoras científicas",
    reference: "Standard Methods 5220 C/D",
    description: "Titulación con Sulfato Ferroso Amónico (FAS) y digestión con dicromato de potasio.",
    module: "calculator",
    subTab: "dqo",
    tags: ["dqo", "fas", "dicromato", "demanda quimica", "efluente", "sm5220"],
  },
  {
    id: "ica",
    name: "Índice de Calidad del Agua (ICA-NSF)",
    category: "A",
    categoryLabel: "Calculadoras científicas",
    reference: "NSF / R.J. 056-2018-ANA",
    description: "Evaluación integral de cuerpos de agua superficiales mediante 9 parámetros ponderados.",
    module: "calculator",
    subTab: "wqi",
    tags: ["ica", "wqi", "nsf", "ana", "calidad de agua", "rios", "lagunas"],
  },
  {
    id: "gas_converter",
    name: "Conversor de Gases (T y P Reales)",
    category: "A",
    categoryLabel: "Calculadoras científicas",
    reference: "Ley de Gases Ideales (PV = nRT)",
    description: "Conversión termodinámica exacta entre ppm, ppb, mg/m³ y µg/m³ a temperatura y presión reales.",
    module: "converter",
    subTab: "gases",
    tags: ["gas", "ppm", "ppb", "mg/m3", "ug/m3", "chimenea", "temperatura", "presion"],
  },

  // B. Agua y aguas residuales
  {
    id: "reactors",
    name: "Dimensionamiento de Reactores Biológicos",
    category: "B",
    categoryLabel: "Agua y aguas residuales",
    reference: "Metcalf & Eddy / RAS D.S. 003-2010",
    description: "Dimensionamiento por TRH y carga volumétrica para Lodos Activados, Filtros, Lagunas y UASB.",
    module: "measurement",
    subTab: "reactors",
    tags: ["reactor", "ptar", "lodos activados", "uasb", "trh", "dimensionamiento"],
  },
  {
    id: "disinfection_ct",
    name: "Desinfección y Tiempo de Contacto (CT)",
    category: "B",
    categoryLabel: "Agua y aguas residuales",
    reference: "US EPA Disinfection Profiling",
    description: "Inactivación de Giardia, Cryptosporidium y virus según residual libre y tiempo de contacto.",
    module: "tools",
    subTab: "disinfection",
    tags: ["cloro", "desinfeccion", "ct", "giardia", "agua potable", "inactivacion"],
  },
  {
    id: "coagulation",
    name: "Dosificación de Coagulantes & Prueba de Jarras",
    category: "B",
    categoryLabel: "Agua y aguas residuales",
    reference: "AWWA / Standard Methods",
    description: "Optimización de dosis de sulfato de aluminio o PAC en clarificación de agua.",
    module: "tools",
    subTab: "coagulation",
    tags: ["coagulacion", "floculacion", "sulfato de aluminio", "jarras", "turbidez"],
  },
  {
    id: "water_footprint",
    name: "Huella Hídrica Corporativa (WFN)",
    category: "B",
    categoryLabel: "Agua y aguas residuales",
    reference: "Water Footprint Network Standard",
    description: "Evaluación integral de huella hídrica Azul, Verde y Gris con estándar de dilución.",
    module: "advanced",
    subTab: "water",
    tags: ["huella hidrica", "wfn", "agua azul", "agua verde", "agua gris"],
  },

  // C. Calidad del aire
  {
    id: "air_dispersion",
    name: "Dispersión Atmosférica Gaussiana",
    category: "C",
    categoryLabel: "Calidad del aire",
    reference: "EPA Industrial Source Complex (ISC3)",
    description: "Modelado de pluma de dispersión de chimeneas con clases de estabilidad Pasquill-Gifford.",
    module: "tools",
    subTab: "dispersion",
    tags: ["dispersion", "pluma", "chimenea", "pasquill", "aire", "emisiones"],
  },
  {
    id: "carbon_footprint",
    name: "Huella de Carbono (Alcances 1, 2 y 3)",
    category: "C",
    categoryLabel: "Calidad del aire",
    reference: "GHG Protocol / ISO 14064 / Factor SEIN",
    description: "Inventario de emisiones GEI corporativas con factores oficiales de combustibles y red eléctrica.",
    module: "advanced",
    subTab: "carbon",
    tags: ["carbono", "co2", "gei", "ghg protocol", "alcance 1", "alcance 2", "sein"],
  },
  {
    id: "air_regulations",
    name: "Estándares ECA Aire y Ruido",
    category: "C",
    categoryLabel: "Calidad del aire",
    reference: "D.S. 003-2017-MINAM & D.S. 085-2003-PCM",
    description: "Límites máximos y de alerta para PM10, PM2.5, SO2, NO2, O3, CO y decibelios diurnos/nocturnos.",
    module: "resources",
    subTab: "air",
    tags: ["eca aire", "ruido", "pm10", "pm2.5", "so2", "minam"],
  },

  // D. Suelos y caracterización ambiental
  {
    id: "soil_remediation",
    name: "Biorremediación de Suelos & Biopilas",
    category: "D",
    categoryLabel: "Suelos y remediación",
    reference: "EPA 542-R-01-004 / AACE Class 4/5",
    description: "Diseño geométrico de biopilas, balance estequiométrico C:N:P y estimación de costos AACE.",
    module: "advanced",
    subTab: "soil",
    tags: ["suelo", "biopilas", "remediacion", "hidrocarburos", "cnp", "aace"],
  },
  {
    id: "soil_regulations",
    name: "Estándares ECA Suelo",
    category: "D",
    categoryLabel: "Suelos y remediación",
    reference: "D.S. 011-2017-MINAM",
    description: "Límites para metales pesados, hidrocarburos (F1, F2, F3) y VOCs en suelo agrícola, urbano e industrial.",
    module: "resources",
    subTab: "soil",
    tags: ["eca suelo", "metales", "tph", "hidrocarburos", "minam"],
  },

  // E. Herramientas de campo
  {
    id: "field_sampling",
    name: "Registro de Mediciones in situ",
    category: "E",
    categoryLabel: "Herramientas de campo",
    reference: "Protocolo Nacional de Monitoreo ANA/MINAM",
    description: "Bitácora rápida para registrar pH, Conductividad Eléctrica, Turbidez, OD y Temperatura de campo.",
    module: "measurement",
    subTab: "measurements",
    tags: ["campo", "medicion", "ph", "conductividad", "od", "turbidez", "in situ"],
  },
  {
    id: "flow_measurement",
    name: "Aforo y Medición de Caudales",
    category: "E",
    categoryLabel: "Herramientas de campo",
    reference: "Métodos de Aforo USBR / Manning",
    description: "Cálculo de caudal mediante vertederos Thomson (triangular), rectangular, Manning y flotadores.",
    module: "tools",
    subTab: "flow",
    tags: ["aforo", "caudal", "vertedero", "manning", "flotador", "litros por segundo"],
  },

  // F. Análisis y visualización de datos
  {
    id: "charts_panel",
    name: "Panel de Gráficos y Tendencias",
    category: "F",
    categoryLabel: "Análisis y gráficos",
    reference: "Estadística Ambiental & Series Temporales",
    description: "Visualización gráfica de mediciones temporales, percentiles y comparación directa con límites ECA/LMP.",
    module: "charts",
    tags: ["graficos", "tendencias", "series de tiempo", "estadistica", "analisis"],
  },

  // G. Métodos y metodologías
  {
    id: "standard_methods",
    name: "Compendio de Métodos Estándar",
    category: "G",
    categoryLabel: "Métodos y metodologías",
    reference: "Standard Methods (SM 23rd Edition)",
    description: "Guía técnica de procedimientos analíticos oficiales para agua potable y aguas residuales.",
    module: "resources",
    subTab: "methods",
    tags: ["standard methods", "metodologia", "laboratorio", "analitica"],
  },
  {
    id: "glossary",
    name: "Glosario Ambiental y Acrónimos",
    category: "G",
    categoryLabel: "Métodos y metodologías",
    reference: "Terminología Oficial MINAM / EPA / OMS",
    description: "Diccionario técnico de más de 100 términos ambientales, unidades y definiciones normativas.",
    module: "glossary",
    tags: ["glosario", "terminologia", "definiciones", "acronimos"],
  },

  // H. Inteligencia artificial ambiental
  {
    id: "ai_assistant",
    name: "Asistente IA Green Owl",
    category: "H",
    categoryLabel: "Inteligencia artificial ambiental",
    reference: "Modelos Especializados en Ingeniería Ambiental",
    description: "Consultas técnicas, interpretación de reportes de laboratorio, diagnóstico de efluentes y normativa.",
    module: "ai",
    tags: ["ia", "asistente", "diagnostico", "consultas", "inteligencia artificial"],
  },

  // I. Normativa y estándares
  {
    id: "regulations_compendium",
    name: "Compendio Normativo Ambiental",
    category: "I",
    categoryLabel: "Normativa y estándares",
    reference: "MINAM · ANA · OEFA · SENACE · EPA",
    description: "Decretos Supremos de Perú actualizados con citas de artículos y límites de comparación.",
    module: "resources",
    subTab: "regulations",
    tags: ["normativa", "decretos", "minam", "ana", "oefa", "legislacion"],
  },

  // J. Informes y reportes
  {
    id: "field_notes",
    name: "Bitácora y Notas Técnicas de Campo",
    category: "J",
    categoryLabel: "Informes y reportes",
    reference: "Buenas Prácticas de Laboratorio (GLP)",
    description: "Anotaciones georreferenciadas, hallazgos de inspección ambiental y notas de muestreo.",
    module: "notes",
    tags: ["bitacora", "notas", "cuaderno", "informe", "inspeccion"],
  },
  {
    id: "project_mgmt",
    name: "Gestión de Proyectos de Monitoreo",
    category: "J",
    categoryLabel: "Informes y reportes",
    reference: "Planificación de Campañas de Campo",
    description: "Cronograma de muestreos, control de puntos de control y seguimiento de compromisos ambientales.",
    module: "projects",
    tags: ["proyectos", "cronograma", "campañas", "gestion", "monitoreo"],
  },

  // K. Historial y favoritos
  {
    id: "calc_history",
    name: "Historial de Cálculos",
    category: "K",
    categoryLabel: "Historial y favoritos",
    reference: "Trazabilidad de Resultados Locales",
    description: "Consulta, copia y exportación de todos los cálculos ejecutados con fecha y parámetros.",
    module: "history",
    tags: ["historial", "calculos", "registros", "trazabilidad", "exportar"],
  },
]

const CATEGORY_TABS = [
  { key: "ALL", label: "Todas" },
  { key: "A", label: "A. Calculadoras" },
  { key: "B", label: "B. Agua" },
  { key: "C", label: "C. Aire" },
  { key: "D", label: "D. Suelos" },
  { key: "E", label: "E. Campo" },
  { key: "F", label: "F. Gráficos" },
  { key: "G", label: "G. Métodos" },
  { key: "H", label: "H. IA" },
  { key: "I", label: "I. Normativa" },
  { key: "J", label: "J. Informes" },
  { key: "K", label: "K. Historial" },
]

interface ToolsBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTool: (module: string, subTab?: string) => void
}

export function ToolsBottomSheet({ open, onOpenChange, onSelectTool }: ToolsBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const { favorites, addFavorite, removeFavorite, isFavorite } = useStorage()

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Prevent background scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return TOOLS_CATALOG.filter((item) => {
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory
      if (!matchesCategory) return false

      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    })
  }, [searchQuery, selectedCategory])

  const toggleFavorite = (tool: ToolCatalogItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite(tool.id)) {
      removeFavorite(tool.id)
    } else {
      addFavorite({
        id: tool.id,
        name: tool.name,
        module: tool.module,
      })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop overlay with blur */}
      <div
        className="fixed inset-0 bg-[#103B3A]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal Sheet */}
      <div
        className="relative z-50 w-full max-w-3xl mx-auto bg-white dark:bg-[#112827] rounded-t-3xl shadow-2xl border-t border-[#DCE7E1] dark:border-[#1E4644] flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Catálogo Científico de Herramientas"
      >
        {/* Drag Handle Indicator */}
        <div className="pt-3 pb-1 cursor-grab flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-[#DCE7E1] dark:bg-[#1E4644]" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 pb-3 border-b border-[#DCE7E1] dark:border-[#1E4644] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#008F72]/10 dark:bg-[#008F72]/20 flex items-center justify-center text-[#008F72]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#253533] dark:text-[#EAF2EE] leading-tight">
                Catálogo de Herramientas
              </h2>
              <p className="text-[11px] text-[#647773] dark:text-[#8FA49F]">
                Laboratorio Ambiental by Green Owl Labs
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EBF2EE] dark:hover:bg-[#173836] text-[#647773] dark:text-[#8FA49F] transition-colors"
            aria-label="Cerrar catálogo"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="px-5 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#647773] dark:text-[#8FA49F]" />
            <Input
              type="search"
              placeholder="Buscar cálculo, parámetro o norma (ej. DBO5, ECA, gases)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#F4F8F5] dark:bg-[#0B1C1B] border-[#DCE7E1] dark:border-[#1E4644] text-sm focus-visible:ring-[#008F72]"
              autoFocus
            />
          </div>
        </div>

        {/* Category Pills Bar (Horizontal Scroll) */}
        <div className="px-5 py-2 overflow-x-auto scrollbar-none border-b border-[#DCE7E1] dark:border-[#1E4644]">
          <div className="flex gap-1.5 min-w-max">
            {CATEGORY_TABS.map((cat) => {
              const active = selectedCategory === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-[#008F72] text-white shadow-sm"
                      : "bg-[#F4F8F5] dark:bg-[#0B1C1B] text-[#647773] dark:text-[#8FA49F] hover:bg-[#EBF2EE] dark:hover:bg-[#173836]"
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tools Results List (Internal Scroll) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 pb-safe">
          {filteredTools.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-medium text-[#253533] dark:text-[#EAF2EE]">
                No se encontraron herramientas para «{searchQuery}»
              </p>
              <p className="text-xs text-[#647773] dark:text-[#8FA49F] mt-1">
                Intente con otro término o seleccione la categoría "Todas".
              </p>
            </div>
          ) : (
            filteredTools.map((tool) => {
              const favorited = isFavorite(tool.id)
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.module, tool.subTab)
                    onOpenChange(false)
                  }}
                  className="group p-3.5 rounded-xl border border-[#DCE7E1] dark:border-[#1E4644] bg-[#F4F8F5]/60 dark:bg-[#0B1C1B]/60 hover:bg-white dark:hover:bg-[#112827] hover:border-[#008F72]/50 hover:shadow-md transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[#253533] dark:text-[#EAF2EE] group-hover:text-[#008F72] transition-colors leading-snug">
                        {tool.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-[#BCE8D9]/40 dark:bg-[#008F72]/30 text-[#103B3A] dark:text-[#BCE8D9] font-mono border-0 px-2 py-0.5"
                      >
                        {tool.reference}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#647773] dark:text-[#8FA49F] line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#008F72] font-medium">
                      <span>{tool.categoryLabel}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 group-hover:underline">
                        Abrir herramienta <ExternalLink className="h-3 w-3 inline ml-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => toggleFavorite(tool, e)}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#173836] text-[#647773] dark:text-[#8FA49F] transition-colors shrink-0"
                    aria-label={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
                    title={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
                  >
                    <Star
                      className={`h-4 w-4 transition-colors ${
                        favorited
                          ? "fill-[#D99527] text-[#D99527]"
                          : "text-[#647773] dark:text-[#8FA49F] hover:text-[#D99527]"
                      }`}
                    />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
