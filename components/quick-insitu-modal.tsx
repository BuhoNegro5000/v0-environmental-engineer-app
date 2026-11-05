"use client"

import React, { useState, useEffect } from "react"
import {
  Activity,
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  Gauge,
} from "lucide-react"
import { formatDms, latLngToUtm, type GeoLocationState } from "@/lib/geo-utils"
import { getNorm, getNormCategoryLabel, type NormCategory } from "@/lib/norms"

interface QuickInsituModalProps {
  isOpen: boolean
  onClose: () => void
  currentStation?: string
  onMeasurementSaved?: () => void
}

export function QuickInsituModal({
  isOpen,
  onClose,
  currentStation = "Estación E-01 (Descarga PTAR)",
  onMeasurementSaved,
}: QuickInsituModalProps) {
  const [station, setStation] = useState(currentStation)
  const [normType, setNormType] = useState<NormCategory>("ECA Agua 3-D1")

  // Parámetros in-situ
  const [ph, setPh] = useState<string>("7.2")
  const [temp, setTemp] = useState<string>("21.5")
  const [ec, setEc] = useState<string>("850") // µS/cm
  const [doVal, setDoVal] = useState<string>("5.8") // mg/L
  const [turb, setTurb] = useState<string>("12") // NTU

  const [geo, setGeo] = useState<GeoLocationState | null>(null)

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
        () => setGeo(null),
        { enableHighAccuracy: true, timeout: 8000 },
      )
    }
  }, [isOpen])

  // Evaluación en tiempo real contra normativa peruana
  const evaluate = (parameter: string, value: number): { status: "ok" | "warn" | "fail"; msg: string } => {
    if (Number.isNaN(value)) return { status: "warn", msg: "Sin datos" }
    const limit = getNorm(parameter, normType)
    if (!limit || (limit.min === null && limit.max === null)) {
      return { status: "warn", msg: "Sin límite normativo disponible" }
    }
    const below = limit.min !== null && value < limit.min
    const above = limit.max !== null && value > limit.max
    if (!below && !above) return { status: "ok", msg: "Cumple límite normativo" }
    return { status: "fail", msg: "SUPERÓ LÍMITE NORMATIVO" }
  }

  const evalPh = evaluate("pH", parseFloat(ph))
  const evalDo = evaluate("OD", parseFloat(doVal))
  const evalEc = evaluate("CE", parseFloat(ec))

  const phEval = evalPh
  const doEval = evalDo
  const ecEval = evalEc

  const overallCompliant =
    phEval.status === "ok" && doEval.status === "ok" && ecEval.status === "ok"

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const summaryText = `EVALUACIÓN IN-SITU [${station}]:\n• pH: ${ph} (${phEval.msg})\n• Oxígeno Disuelto: ${doVal} mg/L (${doEval.msg})\n• Cond. Eléctrica: ${ec} µS/cm (${ecEval.msg})\n• Temperatura: ${temp} °C\n• Turbidez: ${turb} NTU\n• Norma Ref: ${getNormCategoryLabel(normType)}`

    const newNote = {
      id: `insitu_${Date.now()}`,
      title: `Medición In-Situ: ${station} [${overallCompliant ? "CUMPLE" : "ALERTA"}]`,
      content: `${summaryText}\n${geo ? "GPS registrado" : "GPS no disponible"}`, 
      category: "agua",
      date: new Date().toISOString(),
      location: {
        lat: geo?.latitude ?? null,
        lng: geo?.longitude ?? null,
        address: geo
          ? `${formatDms(geo.latitude, geo.longitude)} (${geo.utmZone ?? ""} ${geo.utmEasting ?? ""}, ${geo.utmNorthing ?? ""})`
          : "GPS no disponible",
      },
    }

    try {
      const saved = localStorage.getItem("gol_notes")
      const list = saved ? JSON.parse(saved) : []
      localStorage.setItem("gol_notes", JSON.stringify([newNote, ...list]))
      if (onMeasurementSaved) onMeasurementSaved()
      onClose()
    } catch (err) {
      console.error("Error guardando medición:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#0F1A17] border border-[#1B332D] rounded-t-3xl sm:rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header Táctico */}
        <div className="flex items-center justify-between border-b border-[#1B332D] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center text-[#00FFB2]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-[#00FFB2] tracking-wider">
                TEST_IN_SITU // MULTIPARÁMETRO
              </h3>
              <p className="text-[11px] text-[#A3B8B2] font-mono">
                Evaluación y semáforo instantáneo contra ECA
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

        {/* Telemetría y Estación */}
        <div className="bg-[#070B0A] p-2.5 rounded-xl border border-[#1B332D] flex items-center justify-between text-[11px] font-mono text-[#00E5FF]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-[#00FFB2] shrink-0" />
            <span className="truncate">
              {geo ? `UTM: ${geo.utmZone} ${geo.utmEasting}E ${geo.utmNorthing}N` : "SIN GPS"}
            </span>
          </div>
          <span className="text-[#00FFB2] shrink-0 ml-2">PREC: {geo?.accuracy != null ? `±${geo.accuracy}m` : "N/D"}</span>
        </div>

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
              <label className="text-[#A3B8B2] block mb-1">NORMA EVALUACIÓN:</label>
              <select
                value={normType}
                onChange={(e) => setNormType(e.target.value as any)}
                className="w-full bg-[#070B0A] border border-[#1B332D] rounded-lg p-2 text-white text-xs font-mono focus:border-[#00FFB2] focus:outline-none"
              >
                <option value="ECA Agua 1-A1">ECA Agua 1-A1</option>
                <option value="ECA Agua 1-A2">ECA Agua 1-A2</option>
                <option value="ECA Agua 3-D1">ECA Agua 3-D1</option>
                <option value="ECA Agua 3-D2">ECA Agua 3-D2</option>
                <option value="ECA Agua 4-E2">ECA Agua 4-E2</option>
                <option value="LMP PTAR">LMP PTAR</option>
              </select>
            </div>
          </div>

          {/* Grilla de Entradas Multiparámetro con Semáforo */}
          <div className="space-y-2.5">
            {/* pH */}
            <div className="bg-[#070B0A] p-2.5 rounded-xl border border-[#1B332D] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold font-mono text-white block">pH (Acidez / Alcalinidad)</span>
                <span
                  className={`text-[10px] font-mono ${
                    phEval.status === "ok"
                      ? "text-[#00FFB2]"
                      : phEval.status === "warn"
                      ? "text-[#FFB800]"
                      : "text-[#FF3366]"
                  }`}
                >
                  {phEval.msg}
                </span>
              </div>
              <div className="w-28">
                <input
                  type="number"
                  step="0.01"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full text-right bg-[#142622] border border-[#1B332D] rounded px-2 py-1 font-mono text-sm text-[#00FFB2] font-bold focus:border-[#00FFB2] focus:outline-none"
                  placeholder="7.0"
                />
              </div>
            </div>

            {/* Oxígeno Disuelto */}
            <div className="bg-[#070B0A] p-2.5 rounded-xl border border-[#1B332D] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold font-mono text-white block">Oxígeno Disuelto (OD)</span>
                <span
                  className={`text-[10px] font-mono ${
                    doEval.status === "ok"
                      ? "text-[#00FFB2]"
                      : doEval.status === "warn"
                      ? "text-[#FFB800]"
                      : "text-[#FF3366]"
                  }`}
                >
                  {doEval.msg}
                </span>
              </div>
              <div className="w-28 flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={doVal}
                  onChange={(e) => setDoVal(e.target.value)}
                  className="w-full text-right bg-[#142622] border border-[#1B332D] rounded px-2 py-1 font-mono text-sm text-[#00FFB2] font-bold focus:border-[#00FFB2] focus:outline-none"
                  placeholder="6.0"
                />
                <span className="text-[10px] font-mono text-[#A3B8B2]">mg/L</span>
              </div>
            </div>

            {/* Conductividad Eléctrica */}
            <div className="bg-[#070B0A] p-2.5 rounded-xl border border-[#1B332D] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold font-mono text-white block">Conductividad Eléctrica (CE)</span>
                <span
                  className={`text-[10px] font-mono ${
                    ecEval.status === "ok"
                      ? "text-[#00FFB2]"
                      : ecEval.status === "warn"
                      ? "text-[#FFB800]"
                      : "text-[#FF3366]"
                  }`}
                >
                  {ecEval.msg}
                </span>
              </div>
              <div className="w-28 flex items-center gap-1">
                <input
                  type="number"
                  step="1"
                  value={ec}
                  onChange={(e) => setEc(e.target.value)}
                  className="w-full text-right bg-[#142622] border border-[#1B332D] rounded px-2 py-1 font-mono text-sm text-[#00FFB2] font-bold focus:border-[#00FFB2] focus:outline-none"
                  placeholder="800"
                />
                <span className="text-[10px] font-mono text-[#A3B8B2]">µS/cm</span>
              </div>
            </div>

            {/* Temperatura y Turbidez */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#070B0A] p-2 rounded-xl border border-[#1B332D]">
                <span className="text-[11px] font-mono text-[#A3B8B2] block mb-1">Temperatura</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="w-full bg-[#142622] border border-[#1B332D] rounded px-2 py-1 font-mono text-xs text-white"
                  />
                  <span className="text-[10px] font-mono text-[#A3B8B2]">°C</span>
                </div>
              </div>

              <div className="bg-[#070B0A] p-2 rounded-xl border border-[#1B332D]">
                <span className="text-[11px] font-mono text-[#A3B8B2] block mb-1">Turbidez</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={turb}
                    onChange={(e) => setTurb(e.target.value)}
                    className="w-full bg-[#142622] border border-[#1B332D] rounded px-2 py-1 font-mono text-xs text-white"
                  />
                  <span className="text-[10px] font-mono text-[#A3B8B2]">NTU</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de Estado Global */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 font-mono text-xs ${
              overallCompliant
                ? "bg-[#00FFB2]/10 border-[#00FFB2]/40 text-[#00FFB2]"
                : "bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366]"
            }`}
          >
            {overallCompliant ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {overallCompliant ? "ESTADO: EN CUMPLIMIENTO PRELIMINAR" : "ESTADO: PARÁMETROS FUERA DE RANGO"}
              </span>
              <span className="text-[10px] opacity-80">
                {overallCompliant
                  ? "Los valores medidos in-situ están dentro de los rangos admisibles."
                  : "Se detectó excedencia o valor crítico en uno o más parámetros de campo."}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#142622] text-[#A3B8B2] font-mono text-xs font-bold border border-[#1B332D]"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#00FFB2] text-[#070B0A] hover:bg-[#00E599] font-mono text-xs font-bold shadow-lg shadow-[#00FFB2]/20 flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              Guardar Medición
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
