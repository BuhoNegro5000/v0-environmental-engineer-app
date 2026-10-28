"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, MapPin, Plus, Download, Trash2, CheckSquare, ClipboardList, Camera, ImageIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface Photo {
  id: string
  url: string
  date: string
  location?: { lat: number; lng: number; address: string }
  author: string
}

interface FieldNote {
  id: string
  title: string
  content: string
  location?: { lat: number; lng: number; address: string }
  date: string
  category: string
  photos?: Photo[]
}

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface Checklist {
  id: string
  title: string
  template: string
  items: ChecklistItem[]
  date: string
  location?: { lat: number; lng: number; address: string }
}

const checklistTemplates = {
  inspection: {
    es: [
      "Verificar permisos y autorizaciones vigentes",
      "Inspeccionar sistemas de tratamiento de agua",
      "Revisar manejo de residuos peligrosos",
      "Evaluar emisiones atmosféricas",
      "Verificar bitácoras y registros",
      "Inspeccionar áreas de almacenamiento",
      "Revisar plan de contingencias ambientales",
      "Verificar cumplimiento de normativas",
    ],
    en: [
      "Verify current permits and authorizations",
      "Inspect water treatment systems",
      "Review hazardous waste management",
      "Evaluate atmospheric emissions",
      "Verify logs and records",
      "Inspect storage areas",
      "Review environmental contingency plan",
      "Verify regulatory compliance",
    ],
    pt: [
      "Verificar licenças e autorizações vigentes",
      "Inspecionar sistemas de tratamento de água",
      "Revisar gestão de resíduos perigosos",
      "Avaliar emissões atmosféricas",
      "Verificar registros e logs",
      "Inspecionar áreas de armazenamento",
      "Revisar plano de contingências ambientais",
      "Verificar conformidade regulatória",
    ],
  },
  sampling: {
    es: [
      "Preparar equipos de muestreo",
      "Calibrar instrumentos de medición",
      "Identificar puntos de muestreo",
      "Tomar muestras según protocolo",
      "Etiquetar y preservar muestras",
      "Registrar condiciones ambientales",
      "Completar cadena de custodia",
      "Transportar muestras al laboratorio",
    ],
    en: [
      "Prepare sampling equipment",
      "Calibrate measurement instruments",
      "Identify sampling points",
      "Take samples according to protocol",
      "Label and preserve samples",
      "Record environmental conditions",
      "Complete chain of custody",
      "Transport samples to laboratory",
    ],
    pt: [
      "Preparar equipamentos de amostragem",
      "Calibrar instrumentos de medição",
      "Identificar pontos de amostragem",
      "Coletar amostras conforme protocolo",
      "Etiquetar e preservar amostras",
      "Registrar condições ambientais",
      "Completar cadeia de custódia",
      "Transportar amostras ao laboratório",
    ],
  },
  audit: {
    es: [
      "Revisar documentación ambiental",
      "Verificar cumplimiento de objetivos",
      "Evaluar indicadores de desempeño",
      "Inspeccionar instalaciones",
      "Entrevistar personal clave",
      "Revisar no conformidades previas",
      "Identificar oportunidades de mejora",
      "Elaborar informe de auditoría",
    ],
    en: [
      "Review environmental documentation",
      "Verify compliance with objectives",
      "Evaluate performance indicators",
      "Inspect facilities",
      "Interview key personnel",
      "Review previous non-conformities",
      "Identify improvement opportunities",
      "Prepare audit report",
    ],
    pt: [
      "Revisar documentação ambiental",
      "Verificar conformidade com objetivos",
      "Avaliar indicadores de desempenho",
      "Inspecionar instalações",
      "Entrevistar pessoal-chave",
      "Revisar não conformidades anteriores",
      "Identificar oportunidades de melhoria",
      "Elaborar relatório de auditoria",
    ],
  },
  laboratory: {
    es: [
      "Verificar calibración de equipos",
      "Preparar reactivos y soluciones",
      "Registrar condiciones de laboratorio",
      "Realizar análisis según método",
      "Registrar resultados en bitácora",
      "Calcular y validar resultados",
      "Preparar informe de resultados",
      "Almacenar muestras residuales",
    ],
    en: [
      "Verify equipment calibration",
      "Prepare reagents and solutions",
      "Record laboratory conditions",
      "Perform analysis according to method",
      "Record results in logbook",
      "Calculate and validate results",
      "Prepare results report",
      "Store residual samples",
    ],
    pt: [
      "Verificar calibração de equipamentos",
      "Preparar reagentes e soluções",
      "Registrar condições de laboratório",
      "Realizar análise conforme método",
      "Registrar resultados em caderno",
      "Calcular e validar resultados",
      "Preparar relatório de resultados",
      "Armazenar amostras residuais",
    ],
  },
  waterQuality: {
    es: [
      "Medir pH in-situ con electrodo calibrado",
      "Determinar temperatura del agua",
      "Medir oxígeno disuelto (OD)",
      "Evaluar turbidez con turbidímetro",
      "Medir conductividad eléctrica",
      "Tomar muestra para DBO5",
      "Tomar muestra para DQO",
      "Analizar coliformes totales y fecales",
      "Determinar sólidos suspendidos totales (SST)",
      "Medir nitratos y nitritos",
      "Analizar fósforo total",
      "Evaluar presencia de metales pesados",
    ],
    en: [
      "Measure pH in-situ with calibrated electrode",
      "Determine water temperature",
      "Measure dissolved oxygen (DO)",
      "Evaluate turbidity with turbidimeter",
      "Measure electrical conductivity",
      "Take sample for BOD5",
      "Take sample for COD",
      "Analyze total and fecal coliforms",
      "Determine total suspended solids (TSS)",
      "Measure nitrates and nitrites",
      "Analyze total phosphorus",
      "Evaluate presence of heavy metals",
    ],
    pt: [
      "Medir pH in-situ com eletrodo calibrado",
      "Determinar temperatura da água",
      "Medir oxigênio dissolvido (OD)",
      "Avaliar turbidez com turbidímetro",
      "Medir condutividade elétrica",
      "Coletar amostra para DBO5",
      "Coletar amostra para DQO",
      "Analisar coliformes totais e fecais",
      "Determinar sólidos suspensos totais (SST)",
      "Medir nitratos e nitritos",
      "Analisar fósforo total",
      "Avaliar presença de metais pesados",
    ],
  },
  airQuality: {
    es: [
      "Calibrar equipos de monitoreo de aire",
      "Medir material particulado PM2.5 y PM10",
      "Determinar concentración de CO",
      "Medir niveles de SO2",
      "Evaluar concentración de NOx",
      "Medir ozono troposférico (O3)",
      "Registrar condiciones meteorológicas",
      "Documentar fuentes de emisión cercanas",
      "Verificar tiempo de muestreo",
      "Calcular índice de calidad del aire (ICA)",
    ],
    en: [
      "Calibrate air monitoring equipment",
      "Measure particulate matter PM2.5 and PM10",
      "Determine CO concentration",
      "Measure SO2 levels",
      "Evaluate NOx concentration",
      "Measure tropospheric ozone (O3)",
      "Record meteorological conditions",
      "Document nearby emission sources",
      "Verify sampling time",
      "Calculate air quality index (AQI)",
    ],
    pt: [
      "Calibrar equipamentos de monitoramento de ar",
      "Medir material particulado PM2.5 e PM10",
      "Determinar concentração de CO",
      "Medir níveis de SO2",
      "Avaliar concentração de NOx",
      "Medir ozônio troposférico (O3)",
      "Registrar condições meteorológicas",
      "Documentar fontes de emissão próximas",
      "Verificar tempo de amostragem",
      "Calcular índice de qualidade do ar (IQA)",
    ],
  },
  soilAnalysis: {
    es: [
      "Identificar puntos de muestreo de suelo",
      "Tomar muestras a diferentes profundidades",
      "Medir pH del suelo",
      "Determinar textura del suelo",
      "Analizar materia orgánica",
      "Evaluar contaminantes orgánicos (TPH, PAH)",
      "Determinar metales pesados (Pb, Cd, Hg)",
      "Medir conductividad eléctrica",
      "Evaluar capacidad de intercambio catiónico",
      "Documentar uso histórico del terreno",
    ],
    en: [
      "Identify soil sampling points",
      "Take samples at different depths",
      "Measure soil pH",
      "Determine soil texture",
      "Analyze organic matter",
      "Evaluate organic contaminants (TPH, PAH)",
      "Determine heavy metals (Pb, Cd, Hg)",
      "Measure electrical conductivity",
      "Evaluate cation exchange capacity",
      "Document historical land use",
    ],
    pt: [
      "Identificar pontos de amostragem de solo",
      "Coletar amostras em diferentes profundidades",
      "Medir pH do solo",
      "Determinar textura do solo",
      "Analisar matéria orgânica",
      "Avaliar contaminantes orgânicos (TPH, PAH)",
      "Determinar metais pesados (Pb, Cd, Hg)",
      "Medir condutividade elétrica",
      "Avaliar capacidade de troca catiônica",
      "Documentar uso histórico do terreno",
    ],
  },
  wasteManagement: {
    es: [
      "Clasificar residuos por tipo y peligrosidad",
      "Verificar etiquetado de residuos peligrosos",
      "Inspeccionar áreas de almacenamiento temporal",
      "Revisar hojas de seguridad (MSDS)",
      "Verificar compatibilidad de residuos",
      "Evaluar sistemas de contención de derrames",
      "Revisar manifiestos de transporte",
      "Verificar certificados de disposición final",
      "Inspeccionar equipos de protección personal",
      "Documentar generación de residuos",
    ],
    en: [
      "Classify waste by type and hazard",
      "Verify hazardous waste labeling",
      "Inspect temporary storage areas",
      "Review safety data sheets (SDS)",
      "Verify waste compatibility",
      "Evaluate spill containment systems",
      "Review transport manifests",
      "Verify final disposal certificates",
      "Inspect personal protective equipment",
      "Document waste generation",
    ],
    pt: [
      "Classificar resíduos por tipo e periculosidade",
      "Verificar rotulagem de resíduos perigosos",
      "Inspecionar áreas de armazenamento temporário",
      "Revisar fichas de segurança (FISPQ)",
      "Verificar compatibilidade de resíduos",
      "Avaliar sistemas de contenção de derramamentos",
      "Revisar manifestos de transporte",
      "Verificar certificados de disposição final",
      "Inspecionar equipamentos de proteção individual",
      "Documentar geração de resíduos",
    ],
  },
  eia: {
    es: [
      "Definir área de influencia del proyecto",
      "Identificar componentes ambientales afectados",
      "Evaluar línea base ambiental",
      "Identificar impactos ambientales potenciales",
      "Evaluar magnitud e importancia de impactos",
      "Proponer medidas de mitigación",
      "Diseñar plan de monitoreo ambiental",
      "Elaborar plan de manejo ambiental",
      "Consultar con comunidades afectadas",
      "Preparar estudio de impacto ambiental",
    ],
    en: [
      "Define project area of influence",
      "Identify affected environmental components",
      "Evaluate environmental baseline",
      "Identify potential environmental impacts",
      "Evaluate magnitude and importance of impacts",
      "Propose mitigation measures",
      "Design environmental monitoring plan",
      "Develop environmental management plan",
      "Consult with affected communities",
      "Prepare environmental impact study",
    ],
    pt: [
      "Definir área de influência do projeto",
      "Identificar componentes ambientais afetados",
      "Avaliar linha de base ambiental",
      "Identificar impactos ambientais potenciais",
      "Avaliar magnitude e importância dos impactos",
      "Propor medidas de mitigação",
      "Projetar plano de monitoramento ambiental",
      "Desenvolver plano de gestão ambiental",
      "Consultar comunidades afetadas",
      "Preparar estudo de impacto ambiental",
    ],
  },
  custom: {
    es: [],
    en: [],
    pt: [],
  },
}

export function NotesModule() {
  const { language } = useI18n()
  const [notes, setNotes] = useState<FieldNote[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [authorName, setAuthorName] = useState<string>("")
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCustomBuilder, setShowCustomBuilder] = useState(false)
  const [customChecklistTitle, setCustomChecklistTitle] = useState("")
  const [customChecklistItems, setCustomChecklistItems] = useState<string[]>([""])

  useEffect(() => {
    // Load notes and checklists from localStorage
    const savedNotes = localStorage.getItem("ecoingenio_notes")
    const savedChecklists = localStorage.getItem("ecoingenio_checklists")

    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedChecklists) setChecklists(JSON.parse(savedChecklists))
  }, [])

  useEffect(() => {
    // Save notes to localStorage
    localStorage.setItem("ecoingenio_notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    // Save checklists to localStorage
    localStorage.setItem("ecoingenio_checklists", JSON.stringify(checklists))
  }, [checklists])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("[v0] Geolocation error:", error)
        },
      )
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedPhotos([...selectedPhotos, ...files])
    }
  }

  const removePhoto = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index))
  }

  const addNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const photos: Photo[] = await Promise.all(
      selectedPhotos.map(async (file) => {
        return new Promise<Photo>((resolve) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            resolve({
              id: `${Date.now()}-${Math.random()}`,
              url: event.target?.result as string,
              date: new Date().toISOString(),
              location: currentLocation
                ? {
                    lat: currentLocation.lat,
                    lng: currentLocation.lng,
                    address: `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`,
                  }
                : undefined,
              author: authorName || "Usuario",
            })
          }
          reader.readAsDataURL(file)
        })
      }),
    )

    const newNote: FieldNote = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      date: new Date().toISOString(),
      location: currentLocation
        ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`,
          }
        : undefined,
      photos: photos.length > 0 ? photos : undefined,
    }

    setNotes([newNote, ...notes])
    e.currentTarget.reset()
    setCurrentLocation(null)
    setSelectedPhotos([])
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const createChecklist = (template: string) => {
    const templateItems =
      checklistTemplates[template as keyof typeof checklistTemplates][
        language as keyof typeof checklistTemplates.inspection
      ]

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title:
        template === "inspection"
          ? language === "es"
            ? "Inspección"
            : language === "en"
              ? "Inspection"
              : "Inspeção"
          : template === "sampling"
            ? language === "es"
              ? "Muestreo"
              : language === "en"
                ? "Sampling"
                : "Amostragem"
            : template === "audit"
              ? language === "es"
                ? "Auditoría"
                : language === "en"
                  ? "Audit"
                  : "Auditoria"
              : template === "laboratory"
                ? language === "es"
                  ? "Laboratorio"
                  : language === "en"
                    ? "Laboratory"
                    : "Laboratório"
                : template === "waterQuality"
                  ? language === "es"
                    ? "Calidad de Agua"
                    : language === "en"
                      ? "Water Quality"
                      : "Qualidade da Água"
                  : template === "airQuality"
                    ? language === "es"
                      ? "Calidad de Aire"
                      : language === "en"
                        ? "Air Quality"
                        : "Qualidade do Ar"
                    : template === "soilAnalysis"
                      ? language === "es"
                        ? "Análisis de Suelo"
                        : language === "en"
                          ? "Soil Analysis"
                          : "Análise de Solo"
                      : template === "wasteManagement"
                        ? language === "es"
                          ? "Gestión de Residuos"
                          : language === "en"
                            ? "Waste Management"
                            : "Gestão de Resíduos"
                        : template === "eia"
                          ? language === "es"
                            ? "EIA"
                            : language === "en"
                              ? "EIA"
                              : "AIA"
                          : language === "es"
                            ? "Checklist"
                            : language === "en"
                              ? "Checklist"
                              : "Checklist",
      template,
      items: templateItems.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        checked: false,
      })),
      date: new Date().toISOString(),
      location: currentLocation
        ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`,
          }
        : undefined,
    }

    setChecklists([newChecklist, ...checklists])
    setCurrentLocation(null)
  }

  const addCustomItem = () => {
    setCustomChecklistItems([...customChecklistItems, ""])
  }

  const updateCustomItem = (index: number, value: string) => {
    const newItems = [...customChecklistItems]
    newItems[index] = value
    setCustomChecklistItems(newItems)
  }

  const removeCustomItem = (index: number) => {
    setCustomChecklistItems(customChecklistItems.filter((_, i) => i !== index))
  }

  const createCustomChecklist = () => {
    if (!customChecklistTitle.trim()) return

    const validItems = customChecklistItems.filter((item) => item.trim() !== "")
    if (validItems.length === 0) return

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: customChecklistTitle,
      template: "custom",
      items: validItems.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        checked: false,
      })),
      date: new Date().toISOString(),
      location: currentLocation
        ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`,
          }
        : undefined,
    }

    setChecklists([newChecklist, ...checklists])
    setShowCustomBuilder(false)
    setCustomChecklistTitle("")
    setCustomChecklistItems([""])
    setCurrentLocation(null)
  }

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(
      checklists.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
          }
        }
        return checklist
      }),
    )
  }

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter((checklist) => checklist.id !== id))
  }

  const exportToPDF = (type: "note" | "checklist", id: string) => {
    // Simple text export (in production, use a PDF library like jsPDF)
    const item = type === "note" ? notes.find((n) => n.id === id) : checklists.find((c) => c.id === id)

    if (!item) return

    let content = ""
    if (type === "note") {
      const note = item as FieldNote
      content = `ECOINGENIO GLOBAL - NOTA DE CAMPO\n\n`
      content += `Título: ${note.title}\n`
      content += `Categoría: ${note.category}\n`
      content += `Fecha: ${new Date(note.date).toLocaleString()}\n`
      if (note.location) {
        content += `Ubicación: ${note.location.address}\n`
      }
      content += `\nContenido:\n${note.content}\n`
      if (note.photos && note.photos.length > 0) {
        content += `\nFotos:\n`
        note.photos.forEach((photo) => {
          content += `Autor: ${photo.author}\n`
          content += `Fecha: ${new Date(photo.date).toLocaleString()}\n`
          if (photo.location) {
            content += `Ubicación: ${photo.location.address}\n`
          }
        })
      }
    } else {
      const checklist = item as Checklist
      content = `ECOINGENIO GLOBAL - CHECKLIST\n\n`
      content += `Título: ${checklist.title}\n`
      content += `Fecha: ${new Date(checklist.date).toLocaleString()}\n`
      if (checklist.location) {
        content += `Ubicación: ${checklist.location.address}\n`
      }
      content += `\nItems:\n`
      checklist.items.forEach((item, index) => {
        content += `${index + 1}. [${item.checked ? "X" : " "}] ${item.text}\n`
      })
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ecoingenio-${type}-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      setStream(mediaStream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.log("[v0] Camera error:", error)
      alert(
        language === "es"
          ? "No se pudo acceder a la cámara"
          : language === "en"
            ? "Could not access camera"
            : "Não foi possível acessar a câmera",
      )
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" })
            setSelectedPhotos([...selectedPhotos, file])
            stopCamera()
          }
        }, "image/jpeg")
      }
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {language === "es" ? "Notas y Checklists" : language === "en" ? "Notes and Checklists" : "Notas e Checklists"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "es"
            ? "Registro de campo con geolocalización"
            : language === "en"
              ? "Field records with geolocation"
              : "Registros de campo com geolocalização"}
        </p>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto gap-2 p-2">
          <TabsTrigger value="notes" className="min-h-[44px] text-sm">
            <FileText className="h-4 w-4 mr-2" />
            {language === "es" ? "Notas" : language === "en" ? "Notes" : "Notas"}
          </TabsTrigger>
          <TabsTrigger value="checklists" className="min-h-[44px] text-sm">
            <CheckSquare className="h-4 w-4 mr-2" />
            {language === "es" ? "Checklists" : language === "en" ? "Checklists" : "Checklists"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4 mt-4">
          {/* New Note Form */}
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5" />
                {language === "es"
                  ? "Nueva Nota de Campo"
                  : language === "en"
                    ? "New Field Note"
                    : "Nova Nota de Campo"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <form onSubmit={addNote} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    {language === "es" ? "Título" : language === "en" ? "Title" : "Título"}
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder={
                      language === "es"
                        ? "Ej: Inspección Planta de Tratamiento"
                        : language === "en"
                          ? "Ex: Treatment Plant Inspection"
                          : "Ex: Inspeção Estação de Tratamento"
                    }
                    className="h-12 text-base w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    {language === "es" ? "Categoría" : language === "en" ? "Category" : "Categoria"}
                  </Label>
                  <Select name="category" defaultValue="general">
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">
                        {language === "es" ? "General" : language === "en" ? "General" : "Geral"}
                      </SelectItem>
                      <SelectItem value="water">
                        {language === "es" ? "Agua" : language === "en" ? "Water" : "Água"}
                      </SelectItem>
                      <SelectItem value="air">
                        {language === "es" ? "Aire" : language === "en" ? "Air" : "Ar"}
                      </SelectItem>
                      <SelectItem value="soil">
                        {language === "es" ? "Suelo" : language === "en" ? "Soil" : "Solo"}
                      </SelectItem>
                      <SelectItem value="waste">
                        {language === "es" ? "Residuos" : language === "en" ? "Waste" : "Resíduos"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    {language === "es" ? "Contenido" : language === "en" ? "Content" : "Conteúdo"}
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    rows={6}
                    placeholder={
                      language === "es"
                        ? "Describe tus observaciones, mediciones y hallazgos..."
                        : language === "en"
                          ? "Describe your observations, measurements and findings..."
                          : "Descreva suas observações, medições e descobertas..."
                    }
                    className="text-base min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium">
                    {language === "es" ? "Autor" : language === "en" ? "Author" : "Autor"}
                  </Label>
                  <Input
                    id="author"
                    type="text"
                    placeholder={
                      language === "es"
                        ? "Nombre del inspector"
                        : language === "en"
                          ? "Inspector name"
                          : "Nome do inspetor"
                    }
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="h-12 text-base w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos" className="text-sm font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    {language === "es"
                      ? "Fotos Georreferenciadas"
                      : language === "en"
                        ? "Geotagged Photos"
                        : "Fotos Georreferenciadas"}
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startCamera}
                      className="flex-1 h-12 text-base rounded-lg bg-transparent"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {language === "es" ? "Tomar Foto" : language === "en" ? "Take Photo" : "Tirar Foto"}
                    </Button>
                    <label htmlFor="photos" className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 text-base rounded-lg bg-transparent"
                        onClick={() => document.getElementById("photos")?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {language === "es" ? "Seleccionar" : language === "en" ? "Select" : "Selecionar"}
                      </Button>
                    </label>
                  </div>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  {showCamera && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                      <div className="w-full max-w-2xl space-y-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg border-2 border-primary"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={stopCamera}
                            className="flex-1 h-12 text-base bg-transparent"
                          >
                            {language === "es" ? "Cancelar" : language === "en" ? "Cancel" : "Cancelar"}
                          </Button>
                          <Button type="button" onClick={capturePhoto} className="flex-1 h-12 text-base">
                            <Camera className="h-4 w-4 mr-2" />
                            {language === "es" ? "Capturar" : language === "en" ? "Capture" : "Capturar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedPhotos.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{photo.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getLocation}
                    className="flex-1 h-12 text-base rounded-lg bg-transparent"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {currentLocation
                      ? language === "es"
                        ? "Ubicación Capturada"
                        : language === "en"
                          ? "Location Captured"
                          : "Localização Capturada"
                      : language === "es"
                        ? "Capturar Ubicación"
                        : language === "en"
                          ? "Capture Location"
                          : "Capturar Localização"}
                  </Button>
                  <Button type="submit" className="flex-1 h-12 text-base rounded-lg">
                    {language === "es" ? "Guardar Nota" : language === "en" ? "Save Note" : "Salvar Nota"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notes List */}
          <div className="space-y-3">
            {notes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {language === "es"
                    ? "No hay notas registradas"
                    : language === "en"
                      ? "No notes recorded"
                      : "Nenhuma nota registrada"}
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{note.title}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {note.category}
                          </Badge>
                          <span className="text-xs">{new Date(note.date).toLocaleString()}</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => exportToPDF("note", note.id)}
                          className="h-10 w-10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteNote(note.id)} className="h-10 w-10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    {note.photos && note.photos.length > 0 && (
                      <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <ImageIcon className="h-4 w-4" />
                          {language === "es" ? "Fotos" : language === "en" ? "Photos" : "Fotos"} ({note.photos.length})
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {note.photos.map((photo) => (
                            <div key={photo.id} className="space-y-2">
                              <img
                                src={photo.url || "/placeholder.svg"}
                                alt="Field photo"
                                className="w-full h-32 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(photo.url, "_blank")}
                              />
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p className="font-medium">{photo.author}</p>
                                <p>{new Date(photo.date).toLocaleString()}</p>
                                {photo.location && (
                                  <p className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    {photo.location.lat.toFixed(4)}, {photo.location.lng.toFixed(4)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {note.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="break-all">{note.location.address}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="checklists" className="space-y-4 mt-4">
          {/* Checklist Templates */}
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5" />
                {language === "es"
                  ? "Plantillas de Checklist"
                  : language === "en"
                    ? "Checklist Templates"
                    : "Modelos de Checklist"}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {language === "es"
                  ? "Selecciona una plantilla predefinida o crea una personalizada"
                  : language === "en"
                    ? "Select a predefined template or create a custom one"
                    : "Selecione um modelo predefinido ou crie um personalizado"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={getLocation}
                  className="w-full h-12 text-base rounded-lg bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {currentLocation
                    ? language === "es"
                      ? "Ubicación Capturada"
                      : language === "en"
                        ? "Location Captured"
                        : "Localização Capturada"
                    : language === "es"
                      ? "Capturar Ubicación"
                      : language === "en"
                        ? "Capture Location"
                        : "Capturar Localização"}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => createChecklist("inspection")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Inspección" : language === "en" ? "Inspection" : "Inspeção"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("sampling")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Muestreo" : language === "en" ? "Sampling" : "Amostragem"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("audit")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Auditoría" : language === "en" ? "Audit" : "Auditoria"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("laboratory")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Laboratorio" : language === "en" ? "Laboratory" : "Laboratório"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("waterQuality")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Calidad de Agua" : language === "en" ? "Water Quality" : "Qualidade da Água"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("airQuality")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Calidad de Aire" : language === "en" ? "Air Quality" : "Qualidade do Ar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("soilAnalysis")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es" ? "Análisis de Suelo" : language === "en" ? "Soil Analysis" : "Análise de Solo"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createChecklist("wasteManagement")}
                  className="h-12 text-base rounded-lg"
                >
                  {language === "es"
                    ? "Gestión de Residuos"
                    : language === "en"
                      ? "Waste Management"
                      : "Gestão de Resíduos"}
                </Button>
                <Button variant="outline" onClick={() => createChecklist("eia")} className="h-12 text-base rounded-lg">
                  {language === "es" ? "EIA" : language === "en" ? "EIA" : "AIA"}
                </Button>
                <Button
                  variant="default"
                  onClick={() => setShowCustomBuilder(true)}
                  className="h-12 text-base rounded-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "es"
                    ? "Crear Personalizado"
                    : language === "en"
                      ? "Create Custom"
                      : "Criar Personalizado"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {showCustomBuilder && (
            <Card className="border-2 border-primary">
              <CardHeader className="px-4 py-5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5" />
                  {language === "es"
                    ? "Crear Checklist Personalizado"
                    : language === "en"
                      ? "Create Custom Checklist"
                      : "Criar Checklist Personalizado"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-title">
                    {language === "es"
                      ? "Título del Checklist"
                      : language === "en"
                        ? "Checklist Title"
                        : "Título do Checklist"}
                  </Label>
                  <Input
                    id="custom-title"
                    value={customChecklistTitle}
                    onChange={(e) => setCustomChecklistTitle(e.target.value)}
                    placeholder={
                      language === "es"
                        ? "Ej: Inspección de Planta Solar"
                        : language === "en"
                          ? "Ex: Solar Plant Inspection"
                          : "Ex: Inspeção de Planta Solar"
                    }
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label>
                    {language === "es"
                      ? "Items del Checklist"
                      : language === "en"
                        ? "Checklist Items"
                        : "Itens do Checklist"}
                  </Label>
                  {customChecklistItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateCustomItem(index, e.target.value)}
                        placeholder={`${language === "es" ? "Item" : language === "en" ? "Item" : "Item"} ${index + 1}`}
                        className="h-12 text-base flex-1"
                      />
                      {customChecklistItems.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeCustomItem(index)}
                          className="h-12 w-12 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomItem}
                    className="w-full h-12 text-base rounded-lg bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "es" ? "Agregar Item" : language === "en" ? "Add Item" : "Adicionar Item"}
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCustomBuilder(false)
                      setCustomChecklistTitle("")
                      setCustomChecklistItems([""])
                    }}
                    className="flex-1 h-12 text-base rounded-lg"
                  >
                    {language === "es" ? "Cancelar" : language === "en" ? "Cancel" : "Cancelar"}
                  </Button>
                  <Button onClick={createCustomChecklist} className="flex-1 h-12 text-base rounded-lg">
                    {language === "es" ? "Crear Checklist" : language === "en" ? "Create Checklist" : "Criar Checklist"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checklists List */}
          <div className="space-y-3">
            {checklists.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {language === "es"
                    ? "No hay checklists creados"
                    : language === "en"
                      ? "No checklists created"
                      : "Nenhum checklist criado"}
                </CardContent>
              </Card>
            ) : (
              checklists.map((checklist) => {
                const completedItems = checklist.items.filter((item) => item.checked).length
                const totalItems = checklist.items.length
                const progress = (completedItems / totalItems) * 100

                return (
                  <Card key={checklist.id}>
                    <CardHeader className="px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base">{checklist.title}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs">{new Date(checklist.date).toLocaleString()}</span>
                            <Badge variant={progress === 100 ? "default" : "secondary"} className="text-xs">
                              {completedItems}/{totalItems}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => exportToPDF("checklist", checklist.id)}
                            className="h-10 w-10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteChecklist(checklist.id)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-4">
                      {checklist.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={() => toggleChecklistItem(checklist.id, item.id)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={item.id}
                            className={`text-sm flex-1 cursor-pointer leading-relaxed ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {item.text}
                          </label>
                        </div>
                      ))}
                      {checklist.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="break-all">{checklist.location.address}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
