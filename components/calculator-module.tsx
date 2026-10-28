"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Droplets, Wind, TrendingDown, Waves, Info, AlertCircle, CheckCircle2 } from "lucide-react"
import type { HTMLFormElement } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStorage } from "@/lib/storage-context"

export function CalculatorModule() {
  const { addToHistory } = useStorage()

  const [dboResult, setDboResult] = useState<number | null>(null)
  const [dqoResult, setDqoResult] = useState<number | null>(null)
  const [icaResult, setIcaResult] = useState<number | null>(null)
  const [co2Result, setCo2Result] = useState<number | null>(null)

  const getResultQuality = (value: number, type: string) => {
    if (type === "dbo") {
      if (value <= 30)
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Excelente",
          icon: CheckCircle2,
        }
      if (value <= 75)
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "Aceptable",
          icon: AlertCircle,
        }
      return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Alto", icon: AlertCircle }
    }
    if (type === "dqo") {
      if (value <= 100)
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Excelente",
          icon: CheckCircle2,
        }
      if (value <= 200)
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "Aceptable",
          icon: AlertCircle,
        }
      return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Alto", icon: AlertCircle }
    }
    if (type === "ica") {
      if (value >= 80)
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Excelente",
          icon: CheckCircle2,
        }
      if (value >= 60)
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "Buena",
          icon: AlertCircle,
        }
      if (value >= 40)
        return {
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-200",
          label: "Regular",
          icon: AlertCircle,
        }
      return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Mala", icon: AlertCircle }
    }
    return { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "", icon: CheckCircle2 }
  }

  const calculateDBO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const v1 = Number.parseFloat(formData.get("v1") as string)
    const v2 = Number.parseFloat(formData.get("v2") as string)
    const volumen = Number.parseFloat(formData.get("volumen") as string)

    if (!isNaN(v1) && !isNaN(v2) && !isNaN(volumen) && volumen > 0) {
      const dbo = ((v1 - v2) / volumen) * 1000
      setDboResult(dbo)

      addToHistory({
        type: "DBO₅",
        inputs: { "OD Inicial": v1, "OD Final": v2, Volumen: volumen },
        result: `${dbo.toFixed(2)} mg/L`,
        module: "calculator",
      })
    }
  }

  const calculateDQO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const vBlanco = Number.parseFloat(formData.get("vBlanco") as string)
    const vMuestra = Number.parseFloat(formData.get("vMuestra") as string)
    const normalidad = Number.parseFloat(formData.get("normalidad") as string)
    const volumen = Number.parseFloat(formData.get("volumenMuestra") as string)

    if (!isNaN(vBlanco) && !isNaN(vMuestra) && !isNaN(normalidad) && !isNaN(volumen) && volumen > 0) {
      const dqo = ((vBlanco - vMuestra) * normalidad * 8000) / volumen
      setDqoResult(dqo)

      addToHistory({
        type: "DQO",
        inputs: { "V Blanco": vBlanco, "V Muestra": vMuestra, Normalidad: normalidad, Volumen: volumen },
        result: `${dqo.toFixed(2)} mg/L`,
        module: "calculator",
      })
    }
  }

  const calculateICA = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const od = Number.parseFloat(formData.get("od") as string)
    const ph = Number.parseFloat(formData.get("ph") as string)
    const turbidez = Number.parseFloat(formData.get("turbidez") as string)

    if (!isNaN(od) && !isNaN(ph) && !isNaN(turbidez)) {
      const odScore = Math.min(100, Math.max(0, (od / 9) * 100))
      const phScore = Math.max(0, 100 - Math.abs(7 - ph) * 15)
      const turbidezScore = Math.max(0, 100 - turbidez * 5)
      const ica = odScore * 0.4 + phScore * 0.3 + turbidezScore * 0.3
      setIcaResult(ica)

      addToHistory({
        type: "ICA",
        inputs: { OD: od, pH: ph, Turbidez: turbidez },
        result: `${ica.toFixed(1)} / 100`,
        module: "calculator",
      })
    }
  }

  const calculateCO2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const combustible = Number.parseFloat(formData.get("combustible") as string)
    const factorEmision = Number.parseFloat(formData.get("factorEmision") as string)

    if (!isNaN(combustible) && !isNaN(factorEmision)) {
      const co2 = combustible * factorEmision
      setCo2Result(co2)

      addToHistory({
        type: "Emisiones CO₂",
        inputs: { Combustible: combustible, "Factor Emisión": factorEmision },
        result: `${co2.toFixed(2)} kg CO₂`,
        module: "calculator",
      })
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Calculadora Ambiental</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Herramientas de cálculo para análisis ambiental</p>
      </div>

      <Tabs defaultValue="dbo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 p-2">
          <TabsTrigger value="dbo" className="min-h-[44px] text-sm">
            DBO
          </TabsTrigger>
          <TabsTrigger value="dqo" className="min-h-[44px] text-sm">
            DQO
          </TabsTrigger>
          <TabsTrigger value="ica" className="min-h-[44px] text-sm">
            ICA
          </TabsTrigger>
          <TabsTrigger value="co2" className="min-h-[44px] text-sm">
            CO₂
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dbo" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-lg">Demanda Bioquímica de Oxígeno (DBO₅)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Mide la cantidad de oxígeno consumido por microorganismos en 5 días a 20°C
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-blue-900 mb-2">Fórmula Estándar:</p>
                  <p className="font-mono text-blue-800 mb-3">DBO₅ = ((OD₁ - OD₂) / V) × 1000</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Donde:</strong>
                    <br />
                    OD₁ = Oxígeno disuelto inicial (mg/L)
                    <br />
                    OD₂ = Oxígeno disuelto final día 5 (mg/L)
                    <br />V = Volumen de muestra (L)
                    <br />
                    <strong>Método:</strong> Standard Methods 5210 B
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateDBO} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="v1" className="text-sm font-medium">
                      OD Inicial (mg/L)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px]">
                          <p className="text-sm">
                            Oxígeno disuelto al inicio del ensayo (día 0). Valor típico: 7-9 mg/L
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="v1"
                    name="v1"
                    type="number"
                    step="0.01"
                    placeholder="8.5"
                    required
                    className="h-12 text-base w-full"
                    aria-label="Oxígeno disuelto inicial"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="v2" className="text-sm font-medium">
                      OD Final (mg/L)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px]">
                          <p className="text-sm">
                            Oxígeno disuelto después de 5 días de incubación a 20°C en oscuridad
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="v2"
                    name="v2"
                    type="number"
                    step="0.01"
                    placeholder="3.2"
                    required
                    className="h-12 text-base w-full"
                    aria-label="Oxígeno disuelto final"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="volumen" className="text-sm font-medium">
                      Volumen de Muestra (L)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px]">
                          <p className="text-sm">
                            Volumen de la muestra de agua utilizada en el ensayo. Típicamente 0.3 L
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="volumen"
                    name="volumen"
                    type="number"
                    step="0.001"
                    placeholder="0.3"
                    required
                    className="h-12 text-base w-full"
                    aria-label="Volumen de muestra"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors"
                >
                  Calcular DBO
                </Button>
                {dboResult !== null && (
                  <div
                    className={`mt-4 p-4 rounded-lg border ${getResultQuality(dboResult, "dbo").bg} ${getResultQuality(dboResult, "dbo").border}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = getResultQuality(dboResult, "dbo").icon
                        return <Icon className={`h-5 w-5 ${getResultQuality(dboResult, "dbo").color}`} />
                      })()}
                      <p className={`text-sm font-semibold ${getResultQuality(dboResult, "dbo").color}`}>
                        {getResultQuality(dboResult, "dbo").label}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                    <p className={`text-2xl font-bold ${getResultQuality(dboResult, "dbo").color}`}>
                      {dboResult.toFixed(2)} mg/L
                    </p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Interpretación:</strong>{" "}
                        {dboResult <= 30
                          ? "Agua de excelente calidad con baja carga orgánica."
                          : dboResult <= 75
                            ? "Calidad aceptable. Requiere tratamiento básico."
                            : "Alta carga orgánica. Requiere tratamiento avanzado antes de descarga."}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dqo" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-secondary flex-shrink-0" />
                <CardTitle className="text-lg">Demanda Química de Oxígeno (DQO)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Mide la cantidad de oxígeno requerido para oxidar químicamente la materia orgánica
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-purple-50 border-purple-200">
                <Info className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-purple-900 mb-2">Fórmula Estándar:</p>
                  <p className="font-mono text-purple-800 mb-3">DQO = ((Vb - Vs) × N × 8000) / Vm</p>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    <strong>Donde:</strong>
                    <br />
                    Vb = Volumen FAS para blanco (mL)
                    <br />
                    Vs = Volumen FAS para muestra (mL)
                    <br />N = Normalidad del FAS
                    <br />
                    Vm = Volumen de muestra (mL)
                    <br />
                    8000 = Peso equivalente O₂ × 1000
                    <br />
                    <strong>Método:</strong> Standard Methods 5220 D (Reflujo cerrado)
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateDQO} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="vBlanco" className="text-sm font-medium">
                    Volumen Blanco (mL)
                  </Label>
                  <Input
                    id="vBlanco"
                    name="vBlanco"
                    type="number"
                    step="0.01"
                    placeholder="10.5"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vMuestra" className="text-sm font-medium">
                    Volumen Muestra (mL)
                  </Label>
                  <Input
                    id="vMuestra"
                    name="vMuestra"
                    type="number"
                    step="0.01"
                    placeholder="8.2"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="normalidad" className="text-sm font-medium">
                    Normalidad FAS
                  </Label>
                  <Input
                    id="normalidad"
                    name="normalidad"
                    type="number"
                    step="0.001"
                    placeholder="0.025"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumenMuestra" className="text-sm font-medium">
                    Volumen Muestra (mL)
                  </Label>
                  <Input
                    id="volumenMuestra"
                    name="volumenMuestra"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular DQO
                </Button>
                {dqoResult !== null && (
                  <div
                    className={`mt-4 p-4 rounded-lg border ${getResultQuality(dqoResult, "dqo").bg} ${getResultQuality(dqoResult, "dqo").border}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = getResultQuality(dqoResult, "dqo").icon
                        return <Icon className={`h-5 w-5 ${getResultQuality(dqoResult, "dqo").color}`} />
                      })()}
                      <p className={`text-sm font-semibold ${getResultQuality(dqoResult, "dqo").color}`}>
                        {getResultQuality(dqoResult, "dqo").label}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                    <p className={`text-2xl font-bold ${getResultQuality(dqoResult, "dqo").color}`}>
                      {dqoResult.toFixed(2)} mg/L
                    </p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Interpretación:</strong>{" "}
                        {dqoResult <= 100
                          ? "Agua de excelente calidad con baja carga orgánica."
                          : dqoResult <= 200
                            ? "Calidad aceptable. Requiere tratamiento básico."
                            : "Alta carga orgánica. Requiere tratamiento avanzado antes de descarga."}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ica" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-accent flex-shrink-0" />
                <CardTitle className="text-lg">Índice de Calidad del Agua (ICA)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Evaluación simplificada de calidad basada en parámetros clave
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-green-50 border-green-200">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-green-900 mb-2">Metodología NSF-WQI Simplificada:</p>
                  <p className="font-mono text-green-800 mb-3">ICA = Σ(Qi × Wi)</p>
                  <p className="text-xs text-green-700 leading-relaxed">
                    <strong>Ponderación:</strong>
                    <br />
                    Oxígeno Disuelto (40%): Óptimo 9-10 mg/L
                    <br />
                    pH (30%): Óptimo 7.0
                    <br />
                    Turbidez (30%): Óptimo 0 NTU
                    <br />
                    <strong>Escala:</strong> 0-100 (100 = Excelente)
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateICA} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="od" className="text-sm font-medium">
                    Oxígeno Disuelto (mg/L)
                  </Label>
                  <Input
                    id="od"
                    name="od"
                    type="number"
                    step="0.1"
                    placeholder="7.5"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph" className="text-sm font-medium">
                    pH
                  </Label>
                  <Input
                    id="ph"
                    name="ph"
                    type="number"
                    step="0.1"
                    placeholder="7.2"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turbidez" className="text-sm font-medium">
                    Turbidez (NTU)
                  </Label>
                  <Input
                    id="turbidez"
                    name="turbidez"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular ICA
                </Button>
                {icaResult !== null && (
                  <div
                    className={`mt-4 p-4 rounded-lg border ${getResultQuality(icaResult, "ica").bg} ${getResultQuality(icaResult, "ica").border}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = getResultQuality(icaResult, "ica").icon
                        return <Icon className={`h-5 w-5 ${getResultQuality(icaResult, "ica").color}`} />
                      })()}
                      <p className={`text-sm font-semibold ${getResultQuality(icaResult, "ica").color}`}>
                        {getResultQuality(icaResult, "ica").label}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                    <p className={`text-2xl font-bold ${getResultQuality(icaResult, "ica").color}`}>
                      {icaResult.toFixed(1)} / 100
                    </p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Interpretación:</strong>{" "}
                        {icaResult >= 80
                          ? "Excelente"
                          : icaResult >= 60
                            ? "Buena"
                            : icaResult >= 40
                              ? "Regular"
                              : "Mala"}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="co2" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <CardTitle className="text-lg">Emisiones de CO₂</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Calcula emisiones de dióxido de carbono por combustión
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-orange-900 mb-2">Fórmula:</p>
                  <p className="font-mono text-orange-800 mb-3">CO₂ = Combustible × Factor de Emisión</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    <strong>Factores de Emisión (kg CO₂/unidad):</strong>
                    <br />
                    Gasolina: 2.31 kg CO₂/L
                    <br />
                    Diésel: 2.68 kg CO₂/L
                    <br />
                    Gas Natural: 1.96 kg CO₂/m³
                    <br />
                    GLP: 1.51 kg CO₂/L
                    <br />
                    <strong>Fuente:</strong> IPCC Guidelines for GHG Inventories
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateCO2} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="combustible" className="text-sm font-medium">
                    Combustible Consumido (L o m³)
                  </Label>
                  <Input
                    id="combustible"
                    name="combustible"
                    type="number"
                    step="0.01"
                    placeholder="100"
                    required
                    className="h-12 text-base w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="factorEmision" className="text-sm font-medium">
                    Factor de Emisión (kg CO₂/unidad)
                  </Label>
                  <Input
                    id="factorEmision"
                    name="factorEmision"
                    type="number"
                    step="0.001"
                    placeholder="2.31"
                    required
                    className="h-12 text-base w-full"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Valores de referencia:</strong>
                    <br />
                    Gasolina: 2.31 | Diésel: 2.68 | Gas Natural: 1.96 | GLP: 1.51
                  </p>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular Emisiones
                </Button>
                {co2Result !== null && (
                  <div className="mt-4 p-4 rounded-lg border bg-primary/10 border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-primary">Resultado</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Emisiones Totales:</p>
                    <p className="text-2xl font-bold text-primary">{co2Result.toFixed(2)} kg CO₂</p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Equivalencias:</strong>
                        <br />• {(co2Result / 1000).toFixed(3)} toneladas CO₂
                        <br />• {(co2Result / 21.77).toFixed(1)} árboles necesarios para compensar (anual)
                        <br />• {(co2Result * 0.000293).toFixed(2)} MWh de energía equivalente
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
