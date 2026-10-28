"use client"

import React, { useState, useEffect } from "react"
import {
  FileText,
  X,
  MapPin,
  Mic,
  MicOff,
  CheckCircle2,
  Tag,
  Save,
} from "lucide-react"
import { formatDms, latLngToUtm, type GeoLocationState } from "@/lib/geo-utils"

interface QuickNoteModalProps {
  isOpen: boolean
  onClose: () => void
  currentStation?: string
  onNoteSaved?: () => void
}

export function QuickNoteModal({
  isOpen,
  onClose,
  currentStation = "Estación E-01 (Descarga PTAR)",
  onNoteSaved,
}: QuickNoteModalProps) {
  const [station, setStation] = useState(currentStation)
  const [category, setCategory] = useState("agua")
  const [content, setContent] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [geo, setGeo] = useState<GeoLocationState>({
    latitude: -12.046374,
    longitude: -77.042793,
    altitude: 154,
    accuracy: 4.0,
    heading: null,
    speed: null,
    timestamp: Date.now(),
    utmZone: "18S",
    utmEasting: 277618,
    utmNorthing: 8667491,
  })

  useEffect(() => {
    if (currentStation) setStation(currentStation)
  }, [currentStation])

  useEffect(() => {
    if (!isOpen) return
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const utm = latLngToUtm(lat, lng)
          setGeo({
            latitude: lat,
            longitude: lng,
            altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
            accuracy: pos.coords.accuracy ? Number(pos.coords.accuracy.toFixed(1)) : null,
            heading: null,
            speed: null,
            timestamp: pos.timestamp,
            utmZone: utm.zone,
            utmEasting: utm.easting,
            utmNorthing: utm.northing,
          })
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 },
      )
    }
  }, [isOpen])

  // Reconocimiento de voz para dictado en campo
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("El reconocimiento de voz no está soportado en este navegador. Escribe la nota manualmente.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = "es-PE"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setContent((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }

      recognition.start()
    } catch (e) {
      console.warn("Speech recognition error:", e)
      setIsListening(false)
    }
  }

  // Tags rápidos táctiles para inspección rápida
  const quickTags = [
    "Olor sulfuroso / cloacal",
    "Turbidez aparente alta",
    "Espuma superficial persistente",
    "Iridescencia de hidrocarburos",
    "Coloración anómala",
    "Caudal bajo / estiaje",
    "Sedimentos oscuros",
    "Presencia de sólidos flotantes",
    "Filtro saturado / fuga",
    "Condición meteorológica: Soleado",
  ]

  const addTag = (tag: string) => {
    setContent((prev) => (prev ? `${prev}. ${tag}` : tag))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const newNote = {
      id: `note_${Date.now()}`,
      title: `Inspección: ${station}`,
      content: content.trim(),
      category,
      date: new Date().toISOString(),
      location: {
        lat: geo.latitude,
        lng: geo.longitude,
        address: `${formatDms(geo.latitude, geo.longitude)} (UTM ${geo.utmZone ?? "18S"} ${geo.utmEasting ?? ""}, ${geo.utmNorthing ?? ""})`,
      },
    }

    try {
      const saved = localStorage.getItem("gol_notes")
      const list = saved ? JSON.parse(saved) : []
      localStorage.setItem("gol_notes", JSON.stringify([newNote, ...list]))
      if (onNoteSaved) onNoteSaved()
      setContent("")
      onClose()
    } catch (err) {
      console.error("Error guardando nota:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#0F1A17] border border-[#1B332D] rounded-t-3xl sm:rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header Táctico */}
        <div className="flex items-center justify-between border-b border-[#1B332D] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center text-[#00FFB2]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-[#00FFB2] tracking-wider">
                NOTA_RÁPIDA // BITÁCORA_EXPRESS
              </h3>
              <p className="text-[11px] text-[#A3B8B2] font-mono">
                Registro inmediato georreferenciado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#142622] text-[#A3B8B2] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Telemetría GPS Automática */}
        <div className="bg-[#070B0A] p-2.5 rounded-xl border border-[#1B332D] flex items-center justify-between text-[11px] font-mono text-[#00E5FF]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-[#00FFB2] shrink-0" />
            <span className="truncate">
              {geo.utmZone ? `UTM: ${geo.utmZone} ${geo.utmEasting}E ${geo.utmNorthing}N` : `${geo.latitude.toFixed(5)}, ${geo.longitude.toFixed(5)}`}
            </span>
          </div>
          <span className="text-[#00FFB2] shrink-0 ml-2">PREC: ±{geo.accuracy ?? 3}m</span>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[#A3B8B2] block mb-1">ESTACIÓN:</label>
              <input
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full bg-[#070B0A] border border-[#1B332D] rounded-lg p-2 text-white text-xs font-mono focus:border-[#00FFB2] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[#A3B8B2] block mb-1">MATRIZ:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#070B0A] border border-[#1B332D] rounded-lg p-2 text-white text-xs font-mono focus:border-[#00FFB2] focus:outline-none"
              >
                <option value="agua">Agua y Efluentes</option>
                <option value="aire">Calidad de Aire</option>
                <option value="suelo">Suelos y Sedimentos</option>
                <option value="ruido">Ruido Ambiental</option>
                <option value="residuos">Residuos Sólidos</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <label className="text-[#A3B8B2]">OBSERVACIÓN DE CAMPO:</label>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-mono ${
                  isListening
                    ? "bg-[#FF3366] text-white animate-pulse"
                    : "bg-[#142622] text-[#00FFB2] border border-[#1B332D]"
                }`}
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                <span>{isListening ? "Escuchando..." : "Dictar por voz"}</span>
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe color, olor, anomalías, estado de equipos o condiciones del entorno..."
              rows={4}
              className="w-full bg-[#070B0A] border border-[#1B332D] rounded-xl p-3 text-white text-xs font-mono focus:border-[#00FFB2] focus:outline-none resize-none leading-relaxed"
              required
            />
          </div>

          {/* Quick-Tags Táctiles */}
          <div>
            <span className="text-[10px] font-mono text-[#A3B8B2] block mb-1.5 flex items-center gap-1">
              <Tag className="h-3 w-3 text-[#00FFB2]" />
              ATRIBUTOS RÁPIDOS DE CAMPO (1-TAP):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {quickTags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-2 py-1 rounded-lg bg-[#142622] hover:bg-[#1C3630] text-[#A3B8B2] hover:text-[#00FFB2] border border-[#1B332D] text-[10px] font-mono transition-all text-left"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#142622] text-[#A3B8B2] font-mono text-xs font-bold border border-[#1B332D]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#00FFB2] text-[#070B0A] hover:bg-[#00E599] font-mono text-xs font-bold shadow-lg shadow-[#00FFB2]/20 flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              Guardar Nota de Campo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
