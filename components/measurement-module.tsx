"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wind, Droplet, ClipboardList, Info, BookOpen, CheckCircle2, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useI18n } from "@/lib/i18n-context"
import { regulationsByCountry } from "@/lib/regulations-data"

interface AirQualityData {
  pm25: number
  pm10: number
  co: number
  no2: number
  so2: number
}

interface WaterQualityData {
  ph: number
  turbidity: number
  dissolvedOxygen: number
  conductivity: number
}

export function MeasurementModule() {
  const { country, language } = useI18n()
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null)
  const [waterQuality, setWaterQuality] = useState<WaterQualityData | null>(null)
  const [fieldNotes, setFieldNotes] = useState<Array<{ date: string; note: string }>>([])

  const currentCountryNorms = regulationsByCountry[country] || regulationsByCountry.peru

  const analyzeAirQuality = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setAirQuality({
      pm25: Number.parseFloat(formData.get("pm25") as string),
      pm10: Number.parseFloat(formData.get("pm10") as string),
      co: Number.parseFloat(formData.get("co") as string),
      no2: Number.parseFloat(formData.get("no2") as string),
      so2: Number.parseFloat(formData.get("so2") as string),
    })
  }

  const analyzeWaterQuality = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setWaterQuality({
      ph: Number.parseFloat(formData.get("ph") as string),
      turbidity: Number.parseFloat(formData.get("turbidity") as string),
      dissolvedOxygen: Number.parseFloat(formData.get("dissolvedOxygen") as string),
      conductivity: Number.parseFloat(formData.get("conductivity") as string),
    })
  }

  const addFieldNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const note = formData.get("note") as string
    if (note.trim()) {
      setFieldNotes([{ date: new Date().toLocaleString("es-ES"), note }, ...fieldNotes])
      e.currentTarget.reset()
    }
  }

  // Evaluación de Aire según D.S. 003-2017-MINAM (o EPA NAAQS si es USA)
  const getAirCompliance = (param: "pm25" | "pm10" | "co" | "no2" | "so2", value: number) => {
    // Límites en µg/m³
    const limits: Record<string, { limit: number; norm: string; period: string }> = {
      pm25: { limit: country === "usa" ? 35 : 50, norm: country === "usa" ? "EPA NAAQS" : "D.S. N° 003-2017-MINAM", period: "24h" },
      pm10: { limit: country === "usa" ? 150 : 100, norm: country === "usa" ? "EPA NAAQS" : "D.S. N° 003-2017-MINAM", period: "24h" },
      co: { limit: 10000, norm: "D.S. N° 003-2017-MINAM", period: "8h" },
      no2: { limit: 200, norm: "D.S. N° 003-2017-MINAM", period: "1h" },
      so2: { limit: country === "usa" ? 196 : 250, norm: country === "usa" ? "EPA NAAQS" : "D.S. N° 003-2017-MINAM", period: "24h" },
    }

    const item = limits[param]
    const ratio = (value / item.limit) * 100
    const complies = value <= item.limit

    return {
      complies,
      limit: item.limit,
      norm: item.norm,
      period: item.period,
      ratio: Math.round(ratio),
      status: complies ? "CUMPLE ECA" : "SUPERA ECA",
      badgeColor: complies ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-red-100 text-red-800 border-red-300",
    }
  }

  // Evaluación de Agua según D.S. 004-2017-MINAM Cat 1-A2 (Potabilización convencional)
  const getWaterCompliance = (param: "ph" | "turbidity" | "od" | "conductivity", value: number) => {
    switch (param) {
      case "ph": {
        const complies = value >= 6.5 && value <= 8.5
        return {
          complies,
          limitText: "6.5 - 8.5 unidades",
          norm: "D.S. N° 004-2017-MINAM (Cat 1-A2)",
          status: complies ? "CUMPLE ECA" : "FUERA DE RANGO",
          badgeColor: complies ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
        }
      }
      case "turbidity": {
        const complies = value <= 5.0
        return {
          complies,
          limitText: "≤ 5.0 NTU",
          norm: "D.S. N° 004-2017-MINAM (Cat 1-A2)",
          status: complies ? "CUMPLE ECA" : "SUPERA ECA",
          badgeColor: complies ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
        }
      }
      case "od": {
        const complies = value >= 5.0
        return {
          complies,
          limitText: "≥ 5.0 mg/L",
          norm: "D.S. N° 004-2017-MINAM (Cat 1-A2)",
          status: complies ? "CUMPLE ECA" : "OXÍGENO INSUFICIENTE",
          badgeColor: complies ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
        }
      }
      case "conductivity": {
        const complies = value <= 1500
        return {
          complies,
          limitText: "≤ 1500 µS/cm",
          norm: "D.S. N° 004-2017-MINAM (Cat 1-A2)",
          status: complies ? "CUMPLE ECA" : "SUPERA ECA",
          badgeColor: complies ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
        }
      }
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-xl font-semibold text-foreground mb-2">Herramientas de Medición y Monitoreo</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Evaluación de parámetros fisicoquímicos en campo frente a los Estándares de Calidad Ambiental (ECA) de {currentCountryNorms.name}
        </p>
      </div>

      <Tabs defaultValue="air" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto gap-2 p-2">
          <TabsTrigger value="air" className="min-h-[44px] text-sm">
            <Wind className="h-4 w-4 mr-1" />
            Calidad del Aire
          </TabsTrigger>
          <TabsTrigger value="water" className="min-h-[44px] text-sm">
            <Droplet className="h-4 w-4 mr-1" />
            Calidad del Agua
          </TabsTrigger>
          <TabsTrigger value="field" className="min-h-[44px] text-sm">
            <ClipboardList className="h-4 w-4 mr-1" />
            Notas de Campo
          </TabsTrigger>
        </TabsList>

        {/* TAB AIRE */}
        <TabsContent value="air" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-lg">Monitor y Cotejo Normativo de Calidad del Aire</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Evaluación directa frente a los ECAs de Aire (D.S. N° 003-2017-MINAM / EPA 40 CFR 50)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800 space-y-1">
                  <p><strong>Métodos Oficiales de Monitoreo:</strong></p>
                  <p>• PM2.5 / PM10: Gravimetría de alto/bajo volumen con filtros de teflón o cuarzo (EPA 40 CFR 50 App. J/L).</p>
                  <p>• CO: Espectroscopía infrarroja no dispersiva (NDIR - EPA Method 10).</p>
                  <p>• NO₂: Quimioluminiscencia (EPA Method 7E) | SO₂: Fluorescencia UV (EPA Method 6C).</p>
                </AlertDescription>
              </Alert>

              <form onSubmit={analyzeAirQuality} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="pm25" className="text-xs font-semibold">PM2.5 (µg/m³)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">Límite 24h: 50 µg/m³ (D.S. 003-2017-MINAM)</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="pm25" name="pm25" type="number" step="0.1" placeholder="25.0" required className="h-10 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="pm10" className="text-xs font-semibold">PM10 (µg/m³)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">Límite 24h: 100 µg/m³ (D.S. 003-2017-MINAM)</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="pm10" name="pm10" type="number" step="0.1" placeholder="60.0" required className="h-10 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="co" className="text-xs font-semibold">CO (µg/m³)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">Límite 8h: 10,000 µg/m³ (~8.7 ppm)</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="co" name="co" type="number" step="1" placeholder="3500" required className="h-10 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="no2" className="text-xs font-semibold">NO₂ (µg/m³)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">Límite 1h: 200 µg/m³ (D.S. 003-2017-MINAM)</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="no2" name="no2" type="number" step="0.1" placeholder="45.0" required className="h-10 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="so2" className="text-xs font-semibold">SO₂ (µg/m³)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">Límite 24h: 250 µg/m³ (D.S. 003-2017-MINAM)</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="so2" name="so2" type="number" step="0.1" placeholder="30.0" required className="h-10 text-sm" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Evaluar Cumplimiento de Calidad del Aire
                </Button>

                {airQuality && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <p className="font-semibold text-sm">Dictamen de Monitoreo Ambiental:</p>
                      <Badge variant="outline" className="text-xs font-mono">{currentCountryNorms.name}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {(["pm25", "pm10", "co", "no2", "so2"] as const).map((key) => {
                        const val = airQuality[key]
                        const comp = getAirCompliance(key, val)
                        return (
                          <div key={key} className="p-3 bg-muted/60 rounded-lg border text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold uppercase text-foreground">{key}:</span>
                              <span className={`px-2 py-0.5 rounded font-bold text-[11px] border ${comp.badgeColor}`}>
                                {comp.status}
                              </span>
                            </div>
                            <p className="text-lg font-extrabold text-foreground">{val} µg/m³</p>
                            <p className="text-muted-foreground">
                              Límite: {comp.limit} µg/m³ ({comp.period}) — {comp.ratio}% del ECA
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB AGUA */}
        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <CardTitle className="text-lg">Monitor y Cotejo de Calidad del Agua en Campo</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Evaluación multiparamétrica frente a los Estándares de Calidad Ambiental para Agua (D.S. N° 004-2017-MINAM)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <form onSubmit={analyzeWaterQuality} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">pH (unidades)</Label>
                    <Input name="ph" type="number" step="0.01" placeholder="7.4" required className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Turbidez (NTU)</Label>
                    <Input name="turbidity" type="number" step="0.1" placeholder="3.5" required className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Oxígeno Disuelto (mg/L)</Label>
                    <Input name="dissolvedOxygen" type="number" step="0.1" placeholder="6.8" required className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Conductividad (µS/cm)</Label>
                    <Input name="conductivity" type="number" step="1" placeholder="450" required className="h-10 text-sm" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Evaluar Parámetros de Agua
                </Button>

                {waterQuality && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <p className="font-semibold text-sm">Evaluación frente a ECA Agua Cat 1-A2 (D.S. N° 004-2017-MINAM):</p>
                      <Badge variant="outline" className="text-xs">MINAM</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {/* pH */}
                      {(() => {
                        const c = getWaterCompliance("ph", waterQuality.ph)
                        return (
                          <div className="p-3 bg-muted/60 rounded-lg border space-y-1">
                            <span className="font-bold text-foreground">pH:</span>
                            <p className="text-lg font-bold">{waterQuality.ph}</p>
                            <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${c.badgeColor}`}>{c.status}</span>
                            <p className="text-muted-foreground text-[11px]">{c.limitText}</p>
                          </div>
                        )
                      })()}

                      {/* Turbidez */}
                      {(() => {
                        const c = getWaterCompliance("turbidity", waterQuality.turbidity)
                        return (
                          <div className="p-3 bg-muted/60 rounded-lg border space-y-1">
                            <span className="font-bold text-foreground">Turbidez:</span>
                            <p className="text-lg font-bold">{waterQuality.turbidity} NTU</p>
                            <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${c.badgeColor}`}>{c.status}</span>
                            <p className="text-muted-foreground text-[11px]">{c.limitText}</p>
                          </div>
                        )
                      })()}

                      {/* OD */}
                      {(() => {
                        const c = getWaterCompliance("od", waterQuality.dissolvedOxygen)
                        return (
                          <div className="p-3 bg-muted/60 rounded-lg border space-y-1">
                            <span className="font-bold text-foreground">Oxígeno Disuelto:</span>
                            <p className="text-lg font-bold">{waterQuality.dissolvedOxygen} mg/L</p>
                            <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${c.badgeColor}`}>{c.status}</span>
                            <p className="text-muted-foreground text-[11px]">{c.limitText}</p>
                          </div>
                        )
                      })()}

                      {/* Conductividad */}
                      {(() => {
                        const c = getWaterCompliance("conductivity", waterQuality.conductivity)
                        return (
                          <div className="p-3 bg-muted/60 rounded-lg border space-y-1">
                            <span className="font-bold text-foreground">Conductividad:</span>
                            <p className="text-lg font-bold">{waterQuality.conductivity} µS/cm</p>
                            <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${c.badgeColor}`}>{c.status}</span>
                            <p className="text-muted-foreground text-[11px]">{c.limitText}</p>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CAMPO */}
        <TabsContent value="field" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Bitácora de Campo y Cadena de Custodia</CardTitle>
              <CardDescription className="text-sm">
                Registro de condiciones in-situ, calibración de sondas multiparamétricas y observaciones según Protocolo Nacional de Monitoreo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <form onSubmit={addFieldNote} className="space-y-3">
                <Input name="note" placeholder="Ej: Calibración sonda multiparámetro en 2 puntos (pH 4.01 y 7.00). Clima despejado, viento 2.3 m/s NE..." required className="h-12 text-sm" />
                <Button type="submit" className="w-full">Registrar Anotación de Campo</Button>
              </form>

              <div className="space-y-2 pt-2">
                {fieldNotes.map((n, i) => (
                  <div key={i} className="p-3 bg-muted rounded-lg text-xs flex justify-between gap-4">
                    <span className="text-foreground">{n.note}</span>
                    <span className="text-muted-foreground font-mono whitespace-nowrap">{n.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
