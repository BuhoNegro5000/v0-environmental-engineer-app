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

const templates = {
  water_sampling: {
    title: "Muestreo de Agua",
    items: [
      "Verificar calibración de equipos multiparámetro",
      "Rotular frascos de muestreo con código de punto",
      "Medir parámetros de campo in-situ (pH, CE, T, OD)",
      "Preservar muestras según protocolo (ácido nítrico/sulfúrico)",
      "Completar cadena de custodia con firmas",
      "Almacenar muestras en cooler a 4 °C con geles refrigerantes",
    ],
  },
  air_monitoring: {
    title: "Monitoreo de Calidad de Aire",
    items: [
      "Inspeccionar tren de muestreo y sellos de cabezal",
      "Calibrar flujo volumétrico con calibrador primario",
      "Colocar filtro de cuarzo o teflón previamente pesado",
      "Registrar presión barométrica y temperatura ambiental",
      "Anotar horómetro inicial y verificar alimentación eléctrica",
    ],
  },
  soil_sampling: {
    title: "Muestreo de Suelo y Caracterización",
    items: [
      "Despejar cubierta vegetal superficial",
      "Tomar muestra superficial (0 a 30 cm) o testigo profundo",
      "Homogeneizar en bandeja de acero inoxidable (método cuarteo)",
      "Envasar en frascos de vidrio ámbar para orgánicos/TPH",
      "Registrar coordenadas UTM WGS84 del punto",
    ],
  },
}

export function NotesModule() {
  const { language } = useI18n()
  const [notes, setNotes] = useState<FieldNote[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("water_sampling")
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showChecklistForm, setShowChecklistForm] = useState(false)

  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteCategory, setNoteCategory] = useState("agua")
  const [noteLocation, setNoteLocation] = useState<{ lat: number; lng: number; address: string } | undefined>()
  const [notePhotos, setNotePhotos] = useState<Photo[]>([])

  const [checklistTitle, setChecklistTitle] = useState("")
  const [customItems, setCustomItems] = useState<string[]>([])
  const [newItemText, setNewItemText] = useState("")

  const [showCamera, setShowCamera] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [photoAuthor, setPhotoAuthor] = useState("Inspector Ambiental")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const savedNotes = localStorage.getItem("gol_notes") || localStorage.getItem("ecoingenio_notes")
    const savedChecklists = localStorage.getItem("gol_checklists") || localStorage.getItem("ecoingenio_checklists")

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (e) {
        console.error(e)
      }
    }

    if (savedChecklists) {
      try {
        setChecklists(JSON.parse(savedChecklists))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gol_notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("gol_checklists", JSON.stringify(checklists))
  }, [checklists])

  const getLocation = (): Promise<{ lat: number; lng: number; address: string }> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            resolve({
              lat: latitude,
              lng: longitude,
              address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)} (WGS84)`,
            })
          },
          () => {
            resolve({
              lat: -12.046374,
              lng: -77.042793,
              address: "Lima, Perú (Referencial)",
            })
          },
        )
      } else {
        resolve({
          lat: -12.046374,
          lng: -77.042793,
          address: "Lima, Perú (Referencial)",
        })
      }
    })
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    const loc = await getLocation()

    const newNote: FieldNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      location: loc,
      date: new Date().toISOString(),
      photos: notePhotos,
    }

    setNotes([newNote, ...notes])
    setNoteTitle("")
    setNoteContent("")
    setNotePhotos([])
    setShowNoteForm(false)
  }

  const handleCreateChecklist = async (e: React.FormEvent) => {
    e.preventDefault()
    const loc = await getLocation()
    const template = templates[selectedTemplate as keyof typeof templates]

    const items: ChecklistItem[] = [
      ...template.items.map((text) => ({
        id: Math.random().toString(),
        text,
        checked: false,
      })),
      ...customItems.map((text) => ({
        id: Math.random().toString(),
        text,
        checked: false,
      })),
    ]

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: checklistTitle || template.title,
      template: selectedTemplate,
      items,
      date: new Date().toISOString(),
      location: loc,
    }

    setChecklists([newChecklist, ...checklists])
    setChecklistTitle("")
    setCustomItems([])
    setShowChecklistForm(false)
  }

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(
      checklists.map((cl) => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            items: cl.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
          }
        }
        return cl
      }),
    )
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
  }

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter((c) => c.id !== id))
  }

  const exportData = (type: "note" | "checklist", id: string) => {
    const item = type === "note" ? notes.find((n) => n.id === id) : checklists.find((c) => c.id === id)
    if (!item) return

    let content = ""
    if (type === "note") {
      const note = item as FieldNote
      content = `LABORATORIO AMBIENTAL BY GREEN OWL LABS - NOTA DE CAMPO\n\n`
      content += `Título: ${note.title}\n`
      content += `Categoría: ${note.category}\n`
      content += `Fecha: ${new Date(note.date).toLocaleString()}\n`
      if (note.location) {
        content += `Ubicación: ${note.location.address}\n`
      }
      content += `\nContenido:\n${note.content}\n`
    } else {
      const checklist = item as Checklist
      content = `LABORATORIO AMBIENTAL BY GREEN OWL LABS - CHECKLIST\n\n`
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
    a.download = `laboratorio-ambiental-${type}-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 px-1 pb-24">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#008F72]" />
          Bitácora & Notas Técnicas de Campo
        </h2>
        <p className="text-sm text-muted-foreground">
          Registro de observaciones georreferenciadas y listas de verificación según protocolos MINAM
        </p>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Notas de Campo ({notes.length})</TabsTrigger>
          <TabsTrigger value="checklists">Checklists de Muestreo ({checklists.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4 pt-3">
          <div className="flex justify-end">
            <Button onClick={() => setShowNoteForm(!showNoteForm)} className="bg-[#008F72] hover:bg-[#103B3A]">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Nota
            </Button>
          </div>

          {showNoteForm && (
            <Card className="border-[#DCE7E1]">
              <CardHeader>
                <CardTitle className="text-base">Registrar Nueva Observación de Campo</CardTitle>
                <CardDescription className="text-xs">
                  Se capturarán automáticamente coordenadas geográficas de referencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note-title">Título del Punto / Estación</Label>
                    <Input
                      id="note-title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Ej. Estación E-01: Descarga efluente industrial"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-category">Matriz Ambiental</Label>
                    <Select value={noteCategory} onValueChange={setNoteCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agua">Agua y Efluentes</SelectItem>
                        <SelectItem value="aire">Calidad de Aire</SelectItem>
                        <SelectItem value="suelo">Suelos y Sedimentos</SelectItem>
                        <SelectItem value="ruido">Ruido Ambiental</SelectItem>
                        <SelectItem value="residuos">Residuos Sólidos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-content">Observaciones y Condiciones In-situ</Label>
                    <Textarea
                      id="note-content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Describe color, olor, turbidez visible, caudal aproximado y condiciones meteorológicas..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowNoteForm(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-[#008F72] hover:bg-[#103B3A]">
                      Guardar Nota
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-40 text-[#008F72]" />
                <p>No hay notas registradas</p>
                <p className="text-xs">Crea una nueva nota técnica para iniciar la bitácora</p>
              </div>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="p-4 border-[#DCE7E1]">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{note.title}</h3>
                        <Badge variant="secondary" className="capitalize text-[10px]">
                          {note.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                        {note.content}
                      </p>
                      {note.location && (
                        <div className="flex items-center gap-1 text-[11px] text-[#008F72] pt-1 font-mono">
                          <MapPin className="h-3 w-3" />
                          <span>{note.location.address}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground block">
                        {new Date(note.date).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportData("note", note.id)}
                        title="Descargar TXT"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteNote(note.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="checklists" className="space-y-4 pt-3">
          <div className="flex justify-end">
            <Button onClick={() => setShowChecklistForm(!showChecklistForm)} className="bg-[#008F72] hover:bg-[#103B3A]">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Checklist
            </Button>
          </div>

          {showChecklistForm && (
            <Card className="border-[#DCE7E1]">
              <CardHeader>
                <CardTitle className="text-base">Crear Checklist de Verificación</CardTitle>
                <CardDescription className="text-xs">
                  Selecciona una plantilla estandarizada de protocolo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateChecklist} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Plantilla de Protocolo</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water_sampling">Muestreo de Agua (ANA / Standard Methods)</SelectItem>
                        <SelectItem value="air_monitoring">Monitoreo de Calidad de Aire (EPA)</SelectItem>
                        <SelectItem value="soil_sampling">Muestreo de Suelo (Guía MINAM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowChecklistForm(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-[#008F72] hover:bg-[#103B3A]">
                      Iniciar Checklist
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {checklists.map((cl) => {
              const completed = cl.items.filter((i) => i.checked).length
              const total = cl.items.length
              return (
                <Card key={cl.id} className="p-4 border-[#DCE7E1]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{cl.title}</h3>
                      <span className="text-xs text-muted-foreground font-mono">
                        Progreso: {completed}/{total} completados
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportData("checklist", cl.id)}
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteChecklist(cl.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {cl.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleChecklistItem(cl.id, item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className={`cursor-pointer ${
                            item.checked ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
