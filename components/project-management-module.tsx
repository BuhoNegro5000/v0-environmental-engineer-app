"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, CheckCircle2, Clock, AlertTriangle, CalendarDays, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface Activity {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  startDate: string
  endDate: string
  responsible: string
  deliverable: string
}

export function ProjectManagementModule() {
  const { language } = useI18n()
  const [activities, setActivities] = useState<Activity[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("gol_activities") || localStorage.getItem("ecoai_activities")
    if (saved) setActivities(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("gol_activities", JSON.stringify(activities))
  }, [activities])

  const addActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "pending" | "in-progress" | "completed",
      priority: formData.get("priority") as "low" | "medium" | "high",
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      responsible: formData.get("responsible") as string,
      deliverable: formData.get("deliverable") as string,
    }

    setActivities([...activities, newActivity])
    setShowAddForm(false)
  }

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((act) => act.id !== id))
  }

  const updateStatus = (id: string, newStatus: "pending" | "in-progress" | "completed") => {
    setActivities(activities.map((act) => (act.id === id ? { ...act, status: newStatus } : act)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-600 text-white flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completada
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-yellow-600 text-white flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En Progreso
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gray-600 text-white flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pendiente
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 px-1 pb-24">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          Gestión de Proyectos Ambientales
        </h2>
        <p className="text-sm text-muted-foreground">
          Planificación y seguimiento de actividades, campañas de monitoreo y compromisos ambientales
        </p>
      </div>

      <div className="flex justify-between items-center px-3">
        <div className="flex gap-2">
          <Badge variant="outline">Total: {activities.length}</Badge>
          <Badge variant="outline" className="border-green-600 text-green-600">
            Completadas: {activities.filter((a) => a.status === "completed").length}
          </Badge>
          <Badge variant="outline" className="border-yellow-600 text-yellow-600">
            En Progreso: {activities.filter((a) => a.status === "in-progress").length}
          </Badge>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#008F72] hover:bg-[#103B3A]">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Actividad
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Actividad</CardTitle>
            <CardDescription>Detalla la tarea o campaña de monitoreo ambiental</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Actividad *</Label>
                  <Input id="title" name="title" required placeholder="Ej: Muestreo de Calidad de Agua - Cuenca Alta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsable *</Label>
                  <Input id="responsible" name="responsible" required placeholder="Ej: Ing. Carlos Mendoza" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" placeholder="Objetivos y metodología a aplicar..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select name="status" defaultValue="pending">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha Límite *</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverable">Entregable o Informe Asociado</Label>
                <Input id="deliverable" name="deliverable" placeholder="Ej: Informe de Ensayo de Laboratorio Acreditado" />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#008F72] hover:bg-[#103B3A]">
                  Guardar Actividad
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{activity.title}</h3>
                  {getStatusBadge(activity.status)}
                  <Badge className={getPriorityColor(activity.priority)}>
                    Prioridad: {activity.priority === "high" ? "Alta" : activity.priority === "medium" ? "Media" : "Baja"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="text-xs text-muted-foreground flex gap-4 flex-wrap pt-2">
                  <span>
                    <strong>Responsable:</strong> {activity.responsible}
                  </span>
                  <span>
                    <strong>Inicio:</strong> {activity.startDate}
                  </span>
                  <span>
                    <strong>Fin:</strong> {activity.endDate}
                  </span>
                  {activity.deliverable && (
                    <span>
                      <strong>Entregable:</strong> {activity.deliverable}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={activity.status}
                  onValueChange={(val) => updateStatus(activity.id, val as any)}
                >
                  <SelectTrigger className="w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in-progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteActivity(activity.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
