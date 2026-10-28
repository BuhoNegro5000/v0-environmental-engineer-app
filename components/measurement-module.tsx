"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wind, Droplet, ClipboardList, Info, BookOpen } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null)
  const [waterQuality, setWaterQuality] = useState<WaterQualityData | null>(null)
  const [fieldNotes, setFieldNotes] = useState<Array<{ date: string; note: string }>>([])

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

  const getAirQualityStatus = (value: number, type: string) => {
    const limits: Record<string, number[]> = {
      pm25: [12, 35, 55],
      pm10: [54, 154, 254],
      co: [4.4, 9.4, 12.4],
      no2: [53, 100, 360],
      so2: [35, 75, 185],
    }

    const thresholds = limits[type]
    if (value <= thresholds[0]) return { status: "Buena", color: "bg-green-500" }
    if (value <= thresholds[1]) return { status: "Moderada", color: "bg-yellow-500" }
    if (value <= thresholds[2]) return { status: "Mala", color: "bg-orange-500" }
    return { status: "Muy Mala", color: "bg-red-500" }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-xl font-semibold text-foreground mb-2">Herramientas de Medición</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Monitoreo y análisis de calidad ambiental con metodologías validadas
        </p>
      </div>

      <Tabs defaultValue="air" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto gap-2 p-2">
          <TabsTrigger value="air" className="min-h-[44px] text-sm">
            <Wind className="h-4 w-4 mr-1" />
            Aire
          </TabsTrigger>
          <TabsTrigger value="water" className="min-h-[44px] text-sm">
            <Droplet className="h-4 w-4 mr-1" />
            Agua
          </TabsTrigger>
          <TabsTrigger value="field" className="min-h-[44px] text-sm">
            <ClipboardList className="h-4 w-4 mr-1" />
            Campo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="air" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-lg">Monitor de Calidad del Aire</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Analiza parámetros según EPA 40 CFR Part 50 y OMS Guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-blue-50 border-blue-200">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-blue-900 mb-2">Fundamento Científico:</p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>
                      <strong>Métodos de Medición:</strong>
                    </p>
                    <p>• PM2.5/PM10: Gravimetría (EPA Method 40 CFR Part 50, Appendix L)</p>
                    <p>• CO: Espectroscopía infrarroja no dispersiva (NDIR) - EPA Method 10</p>
                    <p>• NO₂: Quimioluminiscencia (EPA Method 7E)</p>
                    <p>• SO₂: Fluorescencia UV (EPA Method 6C)</p>
                    <p className="mt-2">
                      <strong>Índice de Calidad del Aire (ICA):</strong>
                    </p>
                    <p>ICA = (I_high - I_low) / (C_high - C_low) × (C - C_low) + I_low</p>
                    <p className="text-xs italic mt-1">Donde C es la concentración medida</p>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={analyzeAirQuality} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pm25" className="text-sm font-medium">
                        PM2.5 (µg/m³)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[320px]">
                            <div className="space-y-2 text-xs">
                              <p className="font-semibold">Material Particulado PM2.5</p>
                              <p>
                                <strong>Definición:</strong> Partículas ≤2.5 µm de diámetro aerodinámico
                              </p>
                              <p>
                                <strong>Método:</strong> Gravimetría con filtros de teflón (EPA 40 CFR 50 App L)
                              </p>
                              <p>
                                <strong>Límites OMS:</strong> 15 µg/m³ (24h), 5 µg/m³ (anual)
                              </p>
                              <p>
                                <strong>Efectos:</strong> Penetra alvéolos pulmonares, riesgo cardiovascular
                              </p>
                              <p>
                                <strong>Fuentes:</strong> Combustión, industria, vehículos diésel
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="pm25"
                      name="pm25"
                      type="number"
                      step="0.1"
                      placeholder="15.5"
                      required
                      className="h-12 text-base w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pm10" className="text-sm font-medium">
                        PM10 (µg/m³)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[320px]">
                            <div className="space-y-2 text-xs">
                              <p className="font-semibold">Material Particulado PM10</p>
                              <p>
                                <strong>Definición:</strong> Partículas ≤10 µm de diámetro aerodinámico
                              </p>
                              <p>
                                <strong>Método:</strong> Muestreador de alto volumen (EPA 40 CFR 50 App J)
                              </p>
                              <p>
                                <strong>Límites OMS:</strong> 45 µg/m³ (24h), 15 µg/m³ (anual)
                              </p>
                              <p>
                                <strong>Efectos:</strong> Irritación respiratoria, exacerbación de asma
                              </p>
                              <p>
                                <strong>Fuentes:</strong> Polvo, construcción, erosión, industria
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="pm10"
                      name="pm10"
                      type="number"
                      step="0.1"
                      placeholder="45.2"
                      required
                      className="h-12 text-base w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="co" className="text-sm font-medium">
                        CO (ppm)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[320px]">
                            <div className="space-y-2 text-xs">
                              <p className="font-semibold">Monóxido de Carbono (CO)</p>
                              <p>
                                <strong>Método:</strong> Espectroscopía NDIR (EPA Method 10)
                              </p>
                              <p>
                                <strong>Conversión:</strong> 1 ppm = 1.145 mg/m³ (25°C, 1 atm)
                              </p>
                              <p>
                                <strong>Límites OMS:</strong> 10 mg/m³ (8h), 35 mg/m³ (1h)
                              </p>
                              <p>
                                <strong>Mecanismo:</strong> Bloquea transporte de O₂ en hemoglobina (COHb)
                              </p>
                              <p>
                                <strong>Fuentes:</strong> Combustión incompleta de combustibles fósiles
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="co"
                      name="co"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      required
                      className="h-12 text-base w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="no2" className="text-sm font-medium">
                        NO₂ (ppb)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[320px]">
                            <div className="space-y-2 text-xs">
                              <p className="font-semibold">Dióxido de Nitrógeno (NO₂)</p>
                              <p>
                                <strong>Método:</strong> Quimioluminiscencia (EPA Method 7E)
                              </p>
                              <p>
                                <strong>Conversión:</strong> 1 ppb = 1.88 µg/m³ (25°C, 1 atm)
                              </p>
                              <p>
                                <strong>Límites OMS:</strong> 25 µg/m³ (24h), 10 µg/m³ (anual)
                              </p>
                              <p>
                                <strong>Efectos:</strong> Inflamación vías respiratorias, formación de ozono
                              </p>
                              <p>
                                <strong>Fuentes:</strong> Vehículos, plantas térmicas, procesos industriales
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="no2"
                      name="no2"
                      type="number"
                      step="0.1"
                      placeholder="35.0"
                      required
                      className="h-12 text-base w-full"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="so2" className="text-sm font-medium">
                        SO₂ (ppb)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[320px]">
                            <div className="space-y-2 text-xs">
                              <p className="font-semibold">Dióxido de Azufre (SO₂)</p>
                              <p>
                                <strong>Método:</strong> Fluorescencia UV (EPA Method 6C)
                              </p>
                              <p>
                                <strong>Conversión:</strong> 1 ppb = 2.62 µg/m³ (25°C, 1 atm)
                              </p>
                              <p>
                                <strong>Límites OMS:</strong> 40 µg/m³ (24h)
                              </p>
                              <p>
                                <strong>Efectos:</strong> Broncoconstricción, lluvia ácida (H₂SO₄)
                              </p>
                              <p>
                                <strong>Fuentes:</strong> Combustión de carbón/petróleo, fundiciones, refinerías
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="so2"
                      name="so2"
                      type="number"
                      step="0.1"
                      placeholder="20.0"
                      required
                      className="h-12 text-base w-full"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium rounded-lg">
                  Analizar Calidad del Aire
                </Button>
              </form>

              {airQuality && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-foreground text-base">Resultados del Análisis</h3>
                  {Object.entries(airQuality).map(([key, value]) => {
                    const { status, color } = getAirQualityStatus(value, key)
                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground text-base">
                            {key.toUpperCase().replace("PM", "PM")}
                          </p>
                          <p className="text-sm text-muted-foreground">{value.toFixed(1)}</p>
                        </div>
                        <Badge className={`${color} text-white border-0`}>{status}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-secondary flex-shrink-0" />
                <CardTitle className="text-lg">Análisis de Calidad del Agua</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Parámetros fisicoquímicos según Standard Methods 23rd Ed.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-cyan-50 border-cyan-200">
                <BookOpen className="h-4 w-4 text-cyan-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-cyan-900 mb-2">Fundamento Científico:</p>
                  <div className="text-xs text-cyan-700 space-y-1">
                    <p>
                      <strong>Métodos Analíticos (Standard Methods):</strong>
                    </p>
                    <p>• pH: Método electrométrico (SM 4500-H⁺ B)</p>
                    <p>• Turbidez: Nefelometría (SM 2130 B)</p>
                    <p>• OD: Método Winkler modificado o electrodo (SM 4500-O)</p>
                    <p>• Conductividad: Método electrométrico (SM 2510 B)</p>
                    <p className="mt-2">
                      <strong>Ecuación de Henderson-Hasselbalch (pH):</strong>
                    </p>
                    <p>pH = pKa + log([A⁻]/[HA])</p>
                    <p className="mt-2">
                      <strong>Ley de Henry (OD):</strong>
                    </p>
                    <p>C = k_H × P_O₂ (solubilidad del oxígeno)</p>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={analyzeWaterQuality} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ph" className="text-sm font-medium">
                      pH
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[320px]">
                          <div className="space-y-2 text-xs">
                            <p className="font-semibold">Potencial de Hidrógeno (pH)</p>
                            <p>
                              <strong>Definición:</strong> pH = -log[H⁺]
                            </p>
                            <p>
                              <strong>Método:</strong> Electrodo de vidrio (SM 4500-H⁺ B)
                            </p>
                            <p>
                              <strong>Calibración:</strong> Buffers pH 4.01, 7.00, 10.01 (25°C)
                            </p>
                            <p>
                              <strong>Rango óptimo:</strong> 6.5-8.5 (agua potable), 6.0-9.0 (vida acuática)
                            </p>
                            <p>
                              <strong>Importancia:</strong> Afecta solubilidad de metales, toxicidad, procesos
                              biológicos
                            </p>
                            <p>
                              <strong>Precisión:</strong> ±0.02 unidades de pH
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="ph"
                    name="ph"
                    type="number"
                    step="0.01"
                    placeholder="7.2"
                    min="0"
                    max="14"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="turbidity" className="text-sm font-medium">
                      Turbidez (NTU)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[320px]">
                          <div className="space-y-2 text-xs">
                            <p className="font-semibold">Turbidez</p>
                            <p>
                              <strong>Definición:</strong> Medida de dispersión de luz por partículas suspendidas
                            </p>
                            <p>
                              <strong>Método:</strong> Nefelometría a 90° (SM 2130 B)
                            </p>
                            <p>
                              <strong>Unidades:</strong> NTU (Nephelometric Turbidity Units)
                            </p>
                            <p>
                              <strong>Estándar:</strong> Formazina (4000 NTU stock)
                            </p>
                            <p>
                              <strong>Límites:</strong> {"<"}1 NTU (agua potable), {"<"}5 NTU (agua tratada)
                            </p>
                            <p>
                              <strong>Interferencias:</strong> Burbujas de aire, color verdadero, luz ambiental
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="turbidity"
                    name="turbidity"
                    type="number"
                    step="0.01"
                    placeholder="5.0"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="dissolvedOxygen" className="text-sm font-medium">
                      Oxígeno Disuelto (mg/L)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[320px]">
                          <div className="space-y-2 text-xs">
                            <p className="font-semibold">Oxígeno Disuelto (OD)</p>
                            <p>
                              <strong>Métodos:</strong> Winkler modificado (SM 4500-O B) o electrodo de membrana (SM
                              4500-O G)
                            </p>
                            <p>
                              <strong>Reacción Winkler:</strong> O₂ + 2Mn²⁺ + 4OH⁻ → 2MnO(OH)₂
                            </p>
                            <p>
                              <strong>Saturación:</strong> Depende de T y presión (9.1 mg/L a 20°C, 1 atm)
                            </p>
                            <p>
                              <strong>Criterios:</strong> {">"}6 mg/L (excelente), 4-6 mg/L (bueno), {"<"}4 mg/L
                              (estrés)
                            </p>
                            <p>
                              <strong>Importancia:</strong> Esencial para vida acuática aerobia
                            </p>
                            <p>
                              <strong>Precisión:</strong> ±0.2 mg/L (Winkler), ±0.5 mg/L (electrodo)
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="dissolvedOxygen"
                    name="dissolvedOxygen"
                    type="number"
                    step="0.01"
                    placeholder="7.5"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="conductivity" className="text-sm font-medium">
                      Conductividad (µS/cm)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[320px]">
                          <div className="space-y-2 text-xs">
                            <p className="font-semibold">Conductividad Eléctrica (CE)</p>
                            <p>
                              <strong>Definición:</strong> Capacidad de conducir corriente eléctrica por iones disueltos
                            </p>
                            <p>
                              <strong>Método:</strong> Celda de conductividad (SM 2510 B)
                            </p>
                            <p>
                              <strong>Unidades:</strong> µS/cm (microsiemens/cm) o mS/cm
                            </p>
                            <p>
                              <strong>Corrección T:</strong> CE₂₅ = CE_T / [1 + α(T - 25)], α ≈ 0.02/°C
                            </p>
                            <p>
                              <strong>Relación TDS:</strong> TDS (mg/L) ≈ CE (µS/cm) × 0.5-0.7
                            </p>
                            <p>
                              <strong>Rangos:</strong> {"<"}500 (agua dulce), 500-1500 (mineralizada), {">"}1500
                              (salobre)
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="conductivity"
                    name="conductivity"
                    type="number"
                    step="1"
                    placeholder="500"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium rounded-lg">
                  Analizar Calidad del Agua
                </Button>
              </form>

              {waterQuality && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-foreground text-base">Resultados del Análisis</h3>
                  <div className="grid gap-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium text-foreground text-base">pH</p>
                      <p className="text-2xl font-bold text-secondary">{waterQuality.ph.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">
                        {waterQuality.ph >= 6.5 && waterQuality.ph <= 8.5 ? "Dentro del rango" : "Fuera del rango"}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium text-foreground text-base">Turbidez</p>
                      <p className="text-2xl font-bold text-secondary">{waterQuality.turbidity.toFixed(1)} NTU</p>
                      <p className="text-sm text-muted-foreground">
                        {waterQuality.turbidity <= 5 ? "Excelente" : waterQuality.turbidity <= 10 ? "Buena" : "Alta"}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium text-foreground text-base">Oxígeno Disuelto</p>
                      <p className="text-2xl font-bold text-secondary">
                        {waterQuality.dissolvedOxygen.toFixed(1)} mg/L
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {waterQuality.dissolvedOxygen >= 6
                          ? "Excelente"
                          : waterQuality.dissolvedOxygen >= 4
                            ? "Buena"
                            : "Baja"}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium text-foreground text-base">Conductividad</p>
                      <p className="text-2xl font-bold text-secondary">{waterQuality.conductivity.toFixed(0)} µS/cm</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="field" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-accent flex-shrink-0" />
                <CardTitle className="text-lg">Registro de Datos de Campo</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Guarda observaciones y mediciones de campo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <form onSubmit={addFieldNote} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-sm font-medium">
                    Nota de Campo
                  </Label>
                  <textarea
                    id="note"
                    name="note"
                    className="w-full min-h-[120px] px-4 py-3 text-base rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Ej: Muestra tomada en río principal, coordenadas 19.4326° N, 99.1332° W. Temperatura ambiente 25°C, cielo despejado..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium rounded-lg">
                  Guardar Nota
                </Button>
              </form>

              {fieldNotes.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-foreground text-base">Notas Guardadas</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {fieldNotes.map((note, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">{note.date}</p>
                        <p className="text-sm text-foreground leading-relaxed">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
