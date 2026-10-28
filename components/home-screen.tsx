"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Camera,
  FileText,
  Activity,
  Calculator,
  Compass,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Droplet,
  Wind,
  Flame,
  Gauge,
  Beaker,
  Wrench,
  ShieldCheck,
  Download,
  Clock,
  History,
  Star,
} from "lucide-react"
import { formatDms, latLngToUtm, type GeoLocationState } from "@/lib/geo-utils"
import { useStorage } from "@/lib/storage-context"

interface HomeScreenProps {
  onNavigate: (module: string, subTab?: string) => void
  onOpenToolsCatalog: () => void
  onOpenPhotoCamera?: () => void
  onOpenQuickNote?: () => void
  onOpenQuickInsitu?: () => void
}

export function HomeScreen({
  onNavigate,
  onOpenToolsCatalog,
  onOpenPhotoCamera,
  onOpenQuickNote,
  onOpenQuickInsitu,
}: HomeScreenProps) {
  const { history, favorites } = useStorage()

  // Estación de monitoreo activa
  const [activeStation, setActiveStation] = useState<string>("Estación E-01 (Descarga PTAR)")
  const [isEditingStation, setIsEditingStation] = useState(false)
  const [stationInput, setStationInput] = useState(activeStation)

  // Fotos y notas recientes guardadas en localStorage
  const [recentPhotos, setRecentPhotos] = useState<any[]>([])
  const [recentNotes, setRecentNotes] = useState<any[]>([])

  // Telemetría GPS en tiempo real
  const [geo, setGeo] = useState<GeoLocationState>({
    latitude: -12.046374,
    longitude: -77.042793,
    altitude: 154,
    accuracy: 4.2,
    heading: null,
    speed: null,
    timestamp: Date.now(),
    utmZone: "18S",
    utmEasting: 277618,
    utmNorthing: 8667491,
  })
  const [gpsLocked, setGpsLocked] = useState(false)

  // Cargar estado inicial y GPS
  useEffect(() => {
    // Cargar estación guardada
    const savedStation = localStorage.getItem("gol_active_station")
    if (savedStation) {
      setActiveStation(savedStation)
      setStationInput(savedStation)
    }

    // Cargar evidencias locales
    loadRecentEvidence()

    // Geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const utm = latLngToUtm(lat, lng)
          setGeo({
            latitude: lat,
            longitude: lng,
            altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : 154,
            accuracy: pos.coords.accuracy ? Number(pos.coords.accuracy.toFixed(1)) : 4.0,
            heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
            speed: pos.coords.speed,
            timestamp: pos.timestamp,
            utmZone: utm.zone,
            utmEasting: utm.easting,
            utmNorthing: utm.northing,
          })
          setGpsLocked(true)
        },
        (err) => {
          console.warn("GPS referencial activado:", err)
          setGpsLocked(false)
        },
        { enableHighAccuracy: true, timeout: 8000 },
      )
    }
  }, [])

  const loadRecentEvidence = () => {
    try {
      const photos = localStorage.getItem("gol_field_photos")
      if (photos) setRecentPhotos(JSON.parse(photos).slice(0, 4))
      const notes = localStorage.getItem("gol_notes")
      if (notes) setRecentNotes(JSON.parse(notes).slice(0, 3))
    } catch (e) {
      console.error(e)
    }
  }

  const saveStation = (newStation: string) => {
    setActiveStation(newStation)
    localStorage.setItem("gol_active_station", newStation)
    setIsEditingStation(false)
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
      desc: "Vertedero Thomson 90°, canales Manning, test de jarras y valor C·t",
      icon: Wrench,
      color: "border-[#BCE8D9] text-[#BCE8D9]",
      badge: "Hidráulica",
      onClick: () => onNavigate("tools"),
    },
  ]

  return (
    <div className="space-y-4 pb-28 text-white">
      {/* 1. HUD DE TELEMETRÍA EN VIVO (Cabina Táctica) */}
      <section className="bg-[#0F1A17] border-2 border-[#1B332D] rounded-2xl p-3.5 shadow-xl relative overflow-hidden">
        {/* Glow de acento Bio-Neon superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00FFB2] to-transparent opacity-80" />

        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1B332D]">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${gpsLocked ? "bg-[#00FFB2] animate-pulse" : "bg-[#FFB800]"}`} />
            <span className="font-mono text-xs font-bold tracking-wider text-[#00FFB2]">
              {gpsLocked ? "TELEMETRÍA // GPS_LOCKED" : "TELEMETRÍA // GPS_ESTIMADO"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142622] text-[#00E5FF] border border-[#1B332D]">
              PREC: ±{geo.accuracy ?? 3.8}m
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142622] text-[#00FFB2] border border-[#1B332D]">
              OFFLINE 100%
            </span>
          </div>
        </div>

        {/* Coordenadas en Vivo */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-[#070B0A] p-2 rounded-xl border border-[#1B332D]">
            <span className="text-[10px] text-[#A3B8B2] block">COORDENADAS WGS84:</span>
            <span className="text-[#00E5FF] font-bold text-xs truncate block">
              {formatDms(geo.latitude, geo.longitude)}
            </span>
          </div>

          <div className="bg-[#070B0A] p-2 rounded-xl border border-[#1B332D]">
            <span className="text-[10px] text-[#A3B8B2] block">PROYECCIÓN UTM:</span>
            <span className="text-[#00FFB2] font-bold text-xs truncate block">
              {geo.utmZone} {geo.utmEasting}E {geo.utmNorthing}N
            </span>
          </div>
        </div>

        {/* Estación de Monitoreo Activa */}
        <div className="mt-2.5 pt-2 border-t border-[#1B332D]/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-[#00FFB2] shrink-0" />
            {isEditingStation ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={stationInput}
                  onChange={(e) => setStationInput(e.target.value)}
                  className="bg-[#070B0A] border border-[#00FFB2] rounded px-2 py-0.5 text-xs font-mono text-white flex-1"
                  autoFocus
                />
                <button
                  onClick={() => saveStation(stationInput)}
                  className="px-2 py-0.5 rounded bg-[#00FFB2] text-[#070B0A] font-mono text-xs font-bold"
                >
                  Fijar
                </button>
              </div>
            ) : (
              <div className="truncate flex-1">
                <span className="text-[10px] font-mono text-[#A3B8B2] block leading-none">
                  PUNTO DE MONITOREO ACTIVO:
                </span>
                <span className="font-mono text-xs font-bold text-white truncate block mt-0.5">
                  {activeStation}
                </span>
              </div>
            )}
          </div>

          {!isEditingStation && (
            <button
              onClick={() => setIsEditingStation(true)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-[#142622] hover:bg-[#1B332D] text-[#00FFB2] border border-[#1B332D] shrink-0"
            >
              Cambiar Punto
            </button>
          )}
        </div>
      </section>

      {/* 2. DOCK DE ACCIONES RÁPIDAS DE CAMPO (4 PADS GRANDES DE PULGAR) */}
      <section className="space-y-1.5">
        <h3 className="font-mono text-xs font-bold tracking-wider text-[#A3B8B2] uppercase px-1 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[#00FFB2]" />
          HERRAMIENTAS DE CAMPO // 1-TAP
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Pad 1: Cámara Técnica con Watermark */}
          <button
            onClick={onOpenPhotoCamera}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-[#0F1A17] hover:bg-[#142622] border-2 border-[#00FFB2]/50 hover:border-[#00FFB2] shadow-lg shadow-[#00FFB2]/10 transition-all text-left group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00FFB2] text-[#070B0A] flex items-center justify-center mb-2 shadow-md shadow-[#00FFB2]/30 group-hover:scale-105 transition-transform">
              <Camera className="h-5 w-5 stroke-[2.4]" />
            </div>
            <span className="font-mono text-xs font-bold text-[#00FFB2] tracking-wider leading-tight">
              FOTO CON SELLO
            </span>
            <span className="text-[10px] font-mono text-[#A3B8B2] mt-0.5">
              Estampado GPS & fecha
            </span>
          </button>

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

      {/* 4. FEED DE EVIDENCIAS RECIENTES DE LA JORNADA */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-mono text-xs font-bold tracking-wider text-[#A3B8B2] uppercase flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-[#00E5FF]" />
            EVIDENCIAS REGISTRADAS EN LA JORNADA
          </h3>
          <span className="text-[10px] font-mono text-[#A3B8B2]">
            {recentPhotos.length} fotos • {recentNotes.length} notas
          </span>
        </div>

        {recentPhotos.length === 0 && recentNotes.length === 0 ? (
          <div className="bg-[#0F1A17] border border-[#1B332D] rounded-2xl p-6 text-center text-[#A3B8B2] font-mono space-y-2">
            <Camera className="h-8 w-8 mx-auto text-[#00FFB2]/40" />
            <p className="text-xs">No hay evidencias registradas en esta jornada.</p>
            <p className="text-[10px] text-[#647773]">
              Toca 'FOTO CON SELLO' o 'NOTA DE CAMPO' para iniciar la bitácora técnica.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Galería Rápida de Fotos */}
            {recentPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {recentPhotos.slice(0, 2).map((photo) => (
                  <div
                    key={photo.id}
                    className="relative bg-[#070B0A] border border-[#1B332D] rounded-xl overflow-hidden group"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.station}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 text-[10px] font-mono">
                      <span className="text-[#00FFB2] font-bold block truncate">{photo.station}</span>
                      <span className="text-[#A3B8B2] text-[9px] block">
                        {new Date(photo.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Lista de Notas Recientes */}
            {recentNotes.length > 0 && (
              <div className="space-y-1.5">
                {recentNotes.slice(0, 2).map((note) => (
                  <div
                    key={note.id}
                    className="bg-[#0F1A17] border border-[#1B332D] rounded-xl p-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[#00E5FF] mb-1">
                      <span className="font-bold truncate">{note.title}</span>
                      <span className="text-[9px] text-[#A3B8B2]">
                        {new Date(note.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A3B8B2] line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
