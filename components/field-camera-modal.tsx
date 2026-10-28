"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Camera,
  X,
  RefreshCw,
  Upload,
  CheckCircle2,
  Download,
  MapPin,
  Compass,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react"
import { latLngToUtm, formatDms, type GeoLocationState } from "@/lib/geo-utils"

export interface StampedPhoto {
  id: string
  dataUrl: string
  timestamp: string
  station: string
  matrix: string
  coords: {
    lat: number
    lng: number
    altitude: number | null
    accuracy: number | null
    utmZone?: string
    utmEasting?: number
    utmNorthing?: number
  }
  notes?: string
}

interface FieldCameraModalProps {
  isOpen: boolean
  onClose: () => void
  currentStation?: string
  onPhotoSaved?: (photo: StampedPhoto) => void
}

export function FieldCameraModal({
  isOpen,
  onClose,
  currentStation = "Estación E-01 (Descarga PTAR)",
  onPhotoSaved,
}: FieldCameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [stationName, setStationName] = useState(currentStation)
  const [selectedMatrix, setSelectedMatrix] = useState("Agua / Efluente")
  const [geo, setGeo] = useState<GeoLocationState>({
    latitude: -12.046374,
    longitude: -77.042793,
    altitude: 154,
    accuracy: 4.2,
    heading: 45,
    speed: null,
    timestamp: Date.now(),
    utmZone: "18S",
    utmEasting: 277618,
    utmNorthing: 8667491,
  })
  const [capturedPhoto, setCapturedPhoto] = useState<StampedPhoto | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Actualizar estación si cambia la prop
  useEffect(() => {
    if (currentStation) setStationName(currentStation)
  }, [currentStation])

  // Obtener geolocalización en vivo de alta precisión
  useEffect(() => {
    if (!isOpen) return

    let watchId: number | null = null
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const utm = latLngToUtm(lat, lng)
          setGeo({
            latitude: lat,
            longitude: lng,
            altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
            accuracy: pos.coords.accuracy ? Number(pos.coords.accuracy.toFixed(1)) : null,
            heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
            speed: pos.coords.speed,
            timestamp: pos.timestamp,
            utmZone: utm.zone,
            utmEasting: utm.easting,
            utmNorthing: utm.northing,
          })
        },
        (err) => {
          console.warn("Geolocalización referencial activada:", err.message)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    }
  }, [isOpen])

  // Iniciar cámara al abrir
  useEffect(() => {
    if (!isOpen) {
      stopCamera()
      return
    }

    startCamera(facingMode)

    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  const startCamera = async (mode: "environment" | "user") => {
    stopCamera()
    setCameraError(null)

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("La cámara no está soportada en este entorno. Puedes subir una foto desde tus archivos.")
        return
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err: unknown) {
      console.warn("No se pudo acceder a la cámara:", err)
      setCameraError(
        "No se pudo acceder a la cámara del dispositivo (permiso denegado o no disponible). Usa el botón 'Cargar Archivo' para estampar una fotografía existente.",
      )
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
  }

  // Estampa los metadatos científicos sobre el canvas
  const stampMetadataOnCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    station: string,
    matrix: string,
    geoState: GeoLocationState,
  ) => {
    const bannerHeight = Math.max(90, Math.round(height * 0.14))
    const yTop = height - bannerHeight

    // Fondo semitransparente táctico ultra oscuro
    ctx.fillStyle = "rgba(7, 11, 10, 0.90)"
    ctx.fillRect(0, yTop, width, bannerHeight)

    // Línea superior de acento Bio-Neon
    ctx.fillStyle = "#00FFB2"
    ctx.fillRect(0, yTop, width, Math.max(3, Math.round(height * 0.005)))

    // Tipografía técnica y escalable
    const fontSizePrimary = Math.max(13, Math.round(width * 0.022))
    const fontSizeSecondary = Math.max(10, Math.round(width * 0.017))
    const paddingX = Math.max(16, Math.round(width * 0.025))

    ctx.textBaseline = "middle"

    // Fila 1: Marca y Estación
    const row1Y = yTop + bannerHeight * 0.28
    ctx.font = `bold ${fontSizePrimary}px monospace`
    ctx.fillStyle = "#00FFB2"
    ctx.fillText("LABORATORIO AMBIENTAL · GREEN OWL LABS", paddingX, row1Y)

    ctx.font = `bold ${fontSizePrimary}px sans-serif`
    ctx.fillStyle = "#FFFFFF"
    const stationLabel = `📍 ${station.toUpperCase()} [${matrix.toUpperCase()}]`
    const stationWidth = ctx.measureText(stationLabel).width
    if (width > 500) {
      ctx.fillText(stationLabel, width - stationWidth - paddingX, row1Y)
    }

    // Fila 2: Coordenadas UTM y WGS84
    const row2Y = yTop + bannerHeight * 0.58
    ctx.font = `${fontSizeSecondary}px monospace`
    ctx.fillStyle = "#00E5FF" // Cryo Cyan
    const utmText = geoState.utmZone
      ? `UTM: ${geoState.utmZone} ${geoState.utmEasting}m E ${geoState.utmNorthing}m N`
      : ""
    const dmsText = formatDms(geoState.latitude, geoState.longitude)
    ctx.fillText(`${dmsText}  |  ${utmText}`, paddingX, row2Y)

    // Fila 3: Fecha / Hora ISO + Precisión + Altitud
    const row3Y = yTop + bannerHeight * 0.84
    ctx.fillStyle = "#A3B8B2"
    const nowIso = new Date().toLocaleString("es-PE", {
      timeZone: "America/Lima",
      dateStyle: "short",
      timeStyle: "medium",
    })
    const altText = geoState.altitude ? `ALT: ${geoState.altitude} msnm` : "ALT: N/D"
    const accText = geoState.accuracy ? `PREC: ±${geoState.accuracy}m` : "GPS REF"
    ctx.fillText(`FECHA: ${nowIso} (UTC-5)  •  ${accText}  •  ${altText}`, paddingX, row3Y)
  }

  // Disparador de foto desde la cámara
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    setIsProcessing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    const width = video.videoWidth || 1280
    const height = video.videoHeight || 720

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setIsProcessing(false)
      return
    }

    // Dibujar imagen de video
    ctx.drawImage(video, 0, 0, width, height)

    // Estampar telemetría de campo
    stampMetadataOnCanvas(ctx, width, height, stationName, selectedMatrix, geo)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)

    const newPhoto: StampedPhoto = {
      id: `photo_${Date.now()}`,
      dataUrl,
      timestamp: new Date().toISOString(),
      station: stationName,
      matrix: selectedMatrix,
      coords: {
        lat: geo.latitude,
        lng: geo.longitude,
        altitude: geo.altitude,
        accuracy: geo.accuracy,
        utmZone: geo.utmZone,
        utmEasting: geo.utmEasting,
        utmNorthing: geo.utmNorthing,
      },
    }

    savePhotoToStorage(newPhoto)
    setCapturedPhoto(newPhoto)
    setIsProcessing(false)
  }

  // Carga de archivo externo (fallback o foto tomada con app de cámara nativa)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvasRef.current) return

    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current!
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.drawImage(img, 0, 0)
        stampMetadataOnCanvas(ctx, img.width, img.height, stationName, selectedMatrix, geo)

        const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
        const newPhoto: StampedPhoto = {
          id: `photo_${Date.now()}`,
          dataUrl,
          timestamp: new Date().toISOString(),
          station: stationName,
          matrix: selectedMatrix,
          coords: {
            lat: geo.latitude,
            lng: geo.longitude,
            altitude: geo.altitude,
            accuracy: geo.accuracy,
            utmZone: geo.utmZone,
            utmEasting: geo.utmEasting,
            utmNorthing: geo.utmNorthing,
          },
        }

        savePhotoToStorage(newPhoto)
        setCapturedPhoto(newPhoto)
        setIsProcessing(false)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Persistir en localStorage
  const savePhotoToStorage = (photo: StampedPhoto) => {
    try {
      const saved = localStorage.getItem("gol_field_photos")
      const list: StampedPhoto[] = saved ? JSON.parse(saved) : []
      const updated = [photo, ...list].slice(0, 50) // Guardar hasta 50 fotos con sello
      localStorage.setItem("gol_field_photos", JSON.stringify(updated))

      // También registrar una nota técnica automática en la bitácora
      const savedNotes = localStorage.getItem("gol_notes")
      const notesList = savedNotes ? JSON.parse(savedNotes) : []
      const newNote = {
        id: `note_photo_${Date.now()}`,
        title: `Evidencia Fotográfica: ${photo.station}`,
        content: `Registro fotográfico técnico de campo en matriz ${photo.matrix}.\nCoordenadas: ${formatDms(
          photo.coords.lat,
          photo.coords.lng,
        )} (${photo.coords.utmZone ?? "18S"} ${photo.coords.utmEasting ?? ""}, ${photo.coords.utmNorthing ?? ""}).\nAltitud: ${
          photo.coords.altitude ?? "N/D"
        } msnm.`,
        category: photo.matrix.toLowerCase().includes("agua")
          ? "agua"
          : photo.matrix.toLowerCase().includes("aire")
          ? "aire"
          : photo.matrix.toLowerCase().includes("suelo")
          ? "suelo"
          : "residuos",
        date: photo.timestamp,
        location: {
          lat: photo.coords.lat,
          lng: photo.coords.lng,
          address: `${photo.coords.lat.toFixed(5)}, ${photo.coords.lng.toFixed(5)}`,
        },
        photoId: photo.id,
      }
      localStorage.setItem("gol_notes", JSON.stringify([newNote, ...notesList]))

      if (onPhotoSaved) {
        onPhotoSaved(photo)
      }
    } catch (err) {
      console.error("Error guardando foto en almacenamiento local:", err)
    }
  }

  const downloadStampedPhoto = () => {
    if (!capturedPhoto) return
    const a = document.createElement("a")
    a.href = capturedPhoto.dataUrl
    a.download = `evidencia-${capturedPhoto.station.toLowerCase().replace(/[^a-z0-9]/g, "_")}-${Date.now()}.jpg`
    a.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070B0A] text-white">
      {/* Header Táctico HUD */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0F1A17] border-b border-[#1B332D]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FFB2] animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#00FFB2]">
            CAM_VIEWFINDER // HUD_ON
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFacingMode}
            className="p-1.5 rounded-lg bg-[#142622] text-[#A3B8B2] hover:text-[#00FFB2] border border-[#1B332D] text-xs font-mono flex items-center gap-1"
            title="Cambiar Cámara"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Girar</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-[#142622] text-[#A3B8B2] hover:text-[#00FFB2] border border-[#1B332D] text-xs font-mono flex items-center gap-1"
            title="Cargar Archivo"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cargar</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#251417] text-[#FF3366] hover:bg-[#3D1A20] border border-[#4D1C24]"
            aria-label="Cerrar cámara"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Selector Rápido de Estación y Matriz (Sticky Arriba del Viewfinder) */}
      <div className="bg-[#0B1412] px-4 py-2 border-b border-[#1B332D] flex flex-wrap gap-2 items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <span className="text-[#00FFB2] font-bold">ESTACIÓN:</span>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="bg-[#070B0A] border border-[#1B332D] rounded px-2 py-0.5 text-white text-xs font-mono focus:border-[#00FFB2] focus:outline-none flex-1"
            placeholder="Ej. E-01 Descarga PTAR"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#00E5FF] font-bold">MATRIZ:</span>
          <select
            value={selectedMatrix}
            onChange={(e) => setSelectedMatrix(e.target.value)}
            className="bg-[#070B0A] border border-[#1B332D] rounded px-2 py-0.5 text-white text-xs font-mono focus:border-[#00FFB2] focus:outline-none"
          >
            <option value="Agua / Efluente">Agua / Efluente</option>
            <option value="Agua Subterránea">Agua Subterránea</option>
            <option value="Suelo / Sedimento">Suelo / Sedimento</option>
            <option value="Calidad de Aire">Calidad de Aire</option>
            <option value="Emisión Gaseosa">Emisión Gaseosa</option>
            <option value="Residuos Sólidos">Residuos Sólidos</option>
            <option value="Ruido Ambiental">Ruido Ambiental</option>
          </select>
        </div>
      </div>

      {/* Área del Viewfinder con Retícula Táctica */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {capturedPhoto ? (
          /* Vista Previa de Foto Capturada con Watermark */
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-black p-2">
            <img
              src={capturedPhoto.dataUrl}
              alt="Evidencia con Sello Técnico"
              className="max-h-full max-w-full object-contain rounded-lg border border-[#00FFB2]/40"
            />
            <div className="absolute top-4 left-4 bg-[#070B0A]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#00FFB2] text-xs font-mono text-[#00FFB2] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>FOTO ESTAMPADA & GUARDADA EN BITÁCORA</span>
            </div>
          </div>
        ) : cameraError ? (
          /* Estado de Error de Cámara */
          <div className="text-center p-6 max-w-sm space-y-4">
            <AlertCircle className="h-12 w-12 text-[#FFB800] mx-auto opacity-80" />
            <p className="text-xs text-[#A3B8B2] font-mono leading-relaxed">{cameraError}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#00FFB2] text-[#070B0A] font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 mx-auto"
            >
              <Upload className="h-4 w-4" />
              Seleccionar Foto del Dispositivo
            </button>
          </div>
        ) : (
          /* Video Stream en Vivo con Retícula de Enfoque */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Retícula de Cruz Central (Crosshair HUD) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Esquinas tácticas */}
              <div className="w-64 h-64 relative border border-[#00FFB2]/20">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00FFB2]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00FFB2]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00FFB2]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00FFB2]" />

                {/* Cruz central */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                  <div className="w-8 h-[1px] bg-[#00FFB2]/60" />
                  <div className="h-8 w-[1px] bg-[#00FFB2]/60 -ml-4" />
                </div>
              </div>
            </div>

            {/* Telemetría Superpuesta en Pantalla (Preview HUD) */}
            <div className="absolute top-3 inset-x-3 pointer-events-none flex justify-between items-start text-[10px] font-mono text-[#00E5FF] bg-[#070B0A]/70 px-3 py-1.5 rounded-lg border border-[#1B332D]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#00FFB2]" />
                  <span>{formatDms(geo.latitude, geo.longitude)}</span>
                </div>
                <div>UTM: {geo.utmZone} {geo.utmEasting}E {geo.utmNorthing}N</div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="text-[#00FFB2]">PRECISIÓN: ±{geo.accuracy ?? 3.5}m</div>
                <div className="text-[#A3B8B2]">{geo.altitude ? `${geo.altitude} msnm` : "GPS FIX"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Canvas Oculto para Render y Estampado */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Barra de Control Inferior (Disparador Táctico) */}
      <div className="p-4 bg-[#0F1A17] border-t border-[#1B332D] flex items-center justify-around">
        {capturedPhoto ? (
          <div className="flex items-center justify-between w-full max-w-md mx-auto gap-3">
            <button
              onClick={() => setCapturedPhoto(null)}
              className="flex-1 py-3 rounded-xl bg-[#142622] hover:bg-[#1C3630] text-[#A3B8B2] font-mono text-xs font-bold border border-[#1B332D] flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tomar Otra Foto
            </button>

            <button
              onClick={downloadStampedPhoto}
              className="flex-1 py-3 rounded-xl bg-[#00FFB2] text-[#070B0A] hover:bg-[#00E599] font-mono text-xs font-bold shadow-lg shadow-[#00FFB2]/20 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar Evidencia
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <button
              onClick={handleCapture}
              disabled={isProcessing}
              className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-[#142622] border-2 border-[#00FFB2] shadow-lg shadow-[#00FFB2]/30 active:scale-95 transition-all"
              aria-label="Disparar foto con sello técnico"
            >
              <div className="w-16 h-16 rounded-full bg-[#00FFB2] group-hover:scale-105 transition-all flex items-center justify-center text-[#070B0A]">
                <Camera className="h-8 w-8 stroke-[2.2]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
