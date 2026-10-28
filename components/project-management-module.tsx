"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Trash2, CalendarDays, GanttChart } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Activity {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "pending" | "in-progress" | "completed"
  category: string
  priority: "low" | "medium" | "high"
}

export function ProjectManagementModule() {
  const { language } = useI18n()
  const [activities, setActivities] = useState<Activity[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("ecoai_activities")
    if (saved) setActivities(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("ecoai_activities", JSON.stringify(activities))
  }, [activities])

  const addActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: "pending",
      category: formData.get("category") as string,
      priority: formData.get("priority") as "low" | "medium" | "high",
    }

    setActivities([...activities, newActivity])
    setShowAddForm(false)
    e.currentTarget.reset()
  }

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id))
  }

  const updateStatus = (id: string, status: Activity["status"]) => {
    setActivities(activities.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getPriorityColor = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  // Calculate Gantt chart dimensions
  const calculateGanttPosition = (activity: Activity) => {
    if (activities.length === 0) return { left: 0, width: 0 }

    const allDates = activities.flatMap((a) => [new Date(a.startDate), new Date(a.endDate)])
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))

    const startDays = Math.ceil((new Date(activity.startDate).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    const duration = Math.ceil(
      (new Date(activity.endDate).getTime() - new Date(activity.startDate).getTime()) / (1000 * 60 * 60 * 24),
    )

    return {
      left: (startDays / totalDays) * 100,
      width: (duration / totalDays) * 100,
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          {language === "es"
            ? "Gestión de Proyectos Ambientales"
            : language === "en"
              ? "Environmental Project Management"
              : "Gestão de Projetos Ambientais"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "es"
            ? "Calendario y cronograma Gantt de actividades"
            : language === "en"
              ? "Calendar and Gantt chart of activities"
              : "Calendário e cronograma Gantt de atividades"}
        </p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1">
          <TabsTrigger value="calendar" className="min-h-[44px] text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            {language === "es" ? "Calendario" : language === "en" ? "Calendar" : "Calendário"}
          </TabsTrigger>
          <TabsTrigger value="gantt" className="min-h-[44px] text-sm">
            <GanttChart className="h-4 w-4 mr-2" />
            {language === "es" ? "Gantt" : language === "en" ? "Gantt" : "Gantt"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full h-12 text-base">
            <Plus className="h-4 w-4 mr-2" />
            {language === "es" ? "Nueva Actividad" : language === "en" ? "New Activity" : "Nova Atividade"}
          </Button>

          {showAddForm && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "es" ? "Agregar Actividad" : language === "en" ? "Add Activity" : "Adicionar Atividade"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addActivity} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {language === "es" ? "Título" : language === "en" ? "Title" : "Título"}
                    </Label>
                    <Input id="title" name="title" required className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {language === "es" ? "Descripción" : language === "en" ? "Description" : "Descrição"}
                    </Label>
                    <Textarea id="description" name="description" rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        {language === "es" ? "Fecha Inicio" : language === "en" ? "Start Date" : "Data Início"}
                      </Label>
                      <Input id="startDate" name="startDate" type="date" required className="h-12" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        {language === "es" ? "Fecha Fin" : language === "en" ? "End Date" : "Data Fim"}
                      </Label>
                      <Input id="endDate" name="endDate" type="date" required className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        {language === "es" ? "Categoría" : language === "en" ? "Category" : "Categoria"}
                      </Label>
                      <Select name="category" defaultValue="monitoring">
                        <SelectTrigger id="category" className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monitoring">
                            {language === "es" ? "Monitoreo" : language === "en" ? "Monitoring" : "Monitoramento"}
                          </SelectItem>
                          <SelectItem value="sampling">
                            {language === "es" ? "Muestreo" : language === "en" ? "Sampling" : "Amostragem"}
                          </SelectItem>
                          <SelectItem value="audit">
                            {language === "es" ? "Auditoría" : language === "en" ? "Audit" : "Auditoria"}
                          </SelectItem>
                          <SelectItem value="remediation">
                            {language === "es" ? "Remediación" : language === "en" ? "Remediation" : "Remediação"}
                          </SelectItem>
                          <SelectItem value="reporting">
                            {language === "es" ? "Reportes" : language === "en" ? "Reporting" : "Relatórios"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">
                        {language === "es" ? "Prioridad" : language === "en" ? "Priority" : "Prioridade"}
                      </Label>
                      <Select name="priority" defaultValue="medium">
                        <SelectTrigger id="priority" className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            {language === "es" ? "Baja" : language === "en" ? "Low" : "Baixa"}
                          </SelectItem>
                          <SelectItem value="medium">
                            {language === "es" ? "Media" : language === "en" ? "Medium" : "Média"}
                          </SelectItem>
                          <SelectItem value="high">
                            {language === "es" ? "Alta" : language === "en" ? "High" : "Alta"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 h-12"
                    >
                      {language === "es" ? "Cancelar" : language === "en" ? "Cancel" : "Cancelar"}
                    </Button>
                    <Button type="submit" className="flex-1 h-12">
                      {language === "es" ? "Guardar" : language === "en" ? "Save" : "Salvar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {activities.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {language === "es"
                    ? "No hay actividades programadas"
                    : language === "en"
                      ? "No activities scheduled"
                      : "Nenhuma atividade programada"}
                </CardContent>
              </Card>
            ) : (
              activities
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader className="px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-base">{activity.title}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant={getPriorityColor(activity.priority)} className="text-xs">
                              {activity.priority === "high"
                                ? language === "es"
                                  ? "Alta"
                                  : "High"
                                : activity.priority === "medium"
                                  ? language === "es"
                                    ? "Media"
                                    : "Medium"
                                  : language === "es"
                                    ? "Baja"
                                    : "Low"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteActivity(activity.id)}
                          className="h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(activity.startDate).toLocaleDateString()} -{" "}
                          {new Date(activity.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={activity.status === "pending" ? "default" : "outline"}
                          onClick={() => updateStatus(activity.id, "pending")}
                          className="flex-1 h-10"
                        >
                          {language === "es" ? "Pendiente" : language === "en" ? "Pending" : "Pendente"}
                        </Button>
                        <Button
                          size="sm"
                          variant={activity.status === "in-progress" ? "default" : "outline"}
                          onClick={() => updateStatus(activity.id, "in-progress")}
                          className="flex-1 h-10"
                        >
                          {language === "es" ? "En Progreso" : language === "en" ? "In Progress" : "Em Progresso"}
                        </Button>
                        <Button
                          size="sm"
                          variant={activity.status === "completed" ? "default" : "outline"}
                          onClick={() => updateStatus(activity.id, "completed")}
                          className="flex-1 h-10"
                        >
                          {language === "es" ? "Completado" : language === "en" ? "Completed" : "Concluído"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="gantt" className="space-y-4 mt-4">
          {activities.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {language === "es"
                  ? "Agrega actividades para ver el cronograma Gantt"
                  : language === "en"
                    ? "Add activities to see the Gantt chart"
                    : "Adicione atividades para ver o cronograma Gantt"}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "es" ? "Cronograma Gantt" : language === "en" ? "Gantt Chart" : "Cronograma Gantt"}
                </CardTitle>
                <CardDescription>
                  {language === "es"
                    ? "Visualización temporal de actividades"
                    : language === "en"
                      ? "Temporal visualization of activities"
                      : "Visualização temporal de atividades"}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[600px] space-y-2">
                  {activities
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .map((activity) => {
                      const position = calculateGanttPosition(activity)
                      return (
                        <div key={activity.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium w-32 truncate">{activity.title}</span>
                            <div className="flex-1 h-8 bg-muted rounded relative">
                              <div
                                className={`absolute h-full rounded ${getStatusColor(activity.status)} opacity-80`}
                                style={{
                                  left: `${position.left}%`,
                                  width: `${position.width}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-32">
                            <span>{new Date(activity.startDate).toLocaleDateString()}</span>
                            <span>→</span>
                            <span>{new Date(activity.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
