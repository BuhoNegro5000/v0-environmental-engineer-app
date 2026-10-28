"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Droplet, Flame, TrendingDown, Wind, Info, AlertCircle, CheckCircle2 } from "lucide-react"
import type { HTMLFormElement } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStorage } from "@/lib/storage-context"
import { dbo5, dqoTitration, calculateWqi, type WqiValue } from "@/lib/calc-engine"

function CalcMessages({ errors, warnings }: { errors: string[]; warnings: string[] }) {
  if (!errors.length && !warnings.length) return null
  return (
    <div className="mt-4 space-y-2" role="alert">
      {errors.map((m) => (
        <Alert key={m} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{m}</AlertDescription>
        </Alert>
      ))}
      {warnings.map((m) => (
        <Alert key={m} className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-sm text-yellow-900">{m}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

export function CalculatorModule() {
  const { addToHistory } = useStorage()
  const [dboResult, setDboResult] = useState<number | null>(null)
  const [dqoResult, setDqoResult] = useState<number | null>(null)
  const [wqiResult, setWqiResult] = useState<WqiValue | null>(null)
  const [co2Result, setCo2Result] = useState<number | null>(null)

  const [dboMessages, setDboMessages] = useState<{ errors: string[]; warnings: string[] }>({ errors: [], warnings: [] })
  const [dqoMessages, setDqoMessages] = useState<{ errors: string[]; warnings: string[] }>({ errors: [], warnings: [] })
  const [wqiMessages, setWqiMessages] = useState<{ errors: string[]; warnings: string[] }>({ errors: [], warnings: [] })

  const [fuelType, setFuelType] = useState<string>("gasolina")
  const [fuelQuantity, setFuelQuantity] = useState<string>("")
  const [emissionFactor, setEmissionFactor] = useState<string>("2.31")

  const handleFuelChange = (type: string) => {
    setFuelType(type)
    switch (type) {
      case "gasolina":
        setEmissionFactor("2.31") // kg CO2e / L
        break
      case "diesel":
        setEmissionFactor("2.68") // kg CO2e / L
        break
      case "gas_natural":
        setEmissionFactor("2.03") // kg CO2e / m3
        break
      case "glp":
        setEmissionFactor("2.98") // kg CO2e / kg
        break
      case "electricidad_peru":
        setEmissionFactor("0.212") // kg CO2e / kWh (SEIN)
        break
      default:
        break
    }
  }

  const getResultQuality = (value: number, type: string) => {
    if (type === "dbo") {
      if (value <= 3) return { label: "Excelente (Agua muy limpia)", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 }
      if (value <= 5) return { label: "Buena (Apta potabilización convencional ECA Cat 1-A2)", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle2 }
      if (value <= 15) return { label: "Moderada (Apta riego de vegetales ECA Cat 3)", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: AlertCircle }
      if (value <= 100) return { label: "Carga residual (Dentro de LMP PTAR D.S. 003-2010-MINAM)", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: AlertCircle }
      return { label: "Severamente contaminada (Supera LMP)", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle }
    }
    if (type === "dqo") {
      if (value <= 10) return { label: "Excelente (Baja carga orgánica)", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 }
      if (value <= 40) return { label: "Buena / Aceptable (ECA Cat 3)", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle2 }
      if (value <= 200) return { label: "Residual tratada (LMP PTAR Doméstica)", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: AlertCircle }
      return { label: "Alta carga orgánica industrial / cruda", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle }
    }
    return { label: "Normal", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", icon: CheckCircle2 }
  }

  const calculateDBO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const v1 = Number.parseFloat(formData.get("v1") as string)
    const v2 = Number.parseFloat(formData.get("v2") as string)
    const sampleMl = Number.parseFloat(formData.get("volumen") as string)
    const bottleMl = Number.parseFloat(formData.get("botella") as string)
    const seedRaw = (formData.get("semilla") as string) ?? ""
    const seed = seedRaw.trim() === "" ? 0 : Number.parseFloat(seedRaw)

    const r = dbo5({ do1: v1, do2: v2, sampleMl, bottleMl, seedCorrectionMgL: seed })
    setDboMessages({ errors: r.errors, warnings: r.warnings })
    if (!r.ok || !r.value) {
      setDboResult(null)
      return
    }
    setDboResult(r.value.dbo)

    addToHistory({
      type: "DBO₅",
      inputs: {
        "OD Inicial (mg/L)": v1,
        "OD Final d5 (mg/L)": v2,
        "Volumen muestra (mL)": sampleMl,
        "Volumen botella (mL)": bottleMl,
        "Corrección semilla (mg/L)": seed,
      },
      result: `${r.value.dbo.toFixed(2)} mg/L${r.value.valid ? "" : " (No válido SM 5210 B)"}`,
      module: "calculator",
    })
  }

  const calculateDQO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const vBlanco = Number.parseFloat(formData.get("vBlanco") as string)
    const vMuestra = Number.parseFloat(formData.get("vMuestra") as string)
    const normalidad = Number.parseFloat(formData.get("normalidad") as string)
    const volumen = Number.parseFloat(formData.get("volumenMuestra") as string)

    const r = dqoTitration({
      blankMl: vBlanco,
      sampleTitrantMl: vMuestra,
      molarityFas: normalidad,
      sampleMl: volumen,
    })
    setDqoMessages({ errors: r.errors, warnings: r.warnings })
    if (!r.ok || !r.value) {
      setDqoResult(null)
      return
    }
    setDqoResult(r.value.dqo)

    addToHistory({
      type: "DQO",
      inputs: {
        "FAS Blanco (mL)": vBlanco,
        "FAS Muestra (mL)": vMuestra,
        "Molaridad FAS": normalidad,
        "Volumen muestra (mL)": volumen,
      },
      result: `${r.value.dqo.toFixed(2)} mg/L`,
      module: "calculator",
    })
  }

  const calculateICA = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const od = Number.parseFloat(formData.get("od") as string)
    const ph = Number.parseFloat(formData.get("ph") as string)
    const turbidez = Number.parseFloat(formData.get("turbidez") as string)
    const bodRaw = formData.get("bod") as string
    const coliformsRaw = formData.get("coliforms") as string
    const tdsRaw = formData.get("tds") as string

    const bod = bodRaw && bodRaw.trim() !== "" ? Number.parseFloat(bodRaw) : undefined
    const coliforms = coliformsRaw && coliformsRaw.trim() !== "" ? Number.parseFloat(coliformsRaw) : undefined
    const tds = tdsRaw && tdsRaw.trim() !== "" ? Number.parseFloat(tdsRaw) : undefined

    const r = calculateWqi({
      doMgL: od,
      ph,
      turbidityNtu: turbidez,
      bod5MgL: bod,
      fecalColiformsNmp: coliforms,
      tdsMgL: tds,
    })

    setWqiMessages({ errors: r.errors, warnings: r.warnings })
    if (!r.ok || !r.value) {
      setWqiResult(null)
      return
    }
    setWqiResult(r.value)

    addToHistory({
      type: "ICA-NSF",
      inputs: { "OD (mg/L)": od, pH: ph, "Turbidez (NTU)": turbidez },
      result: `${r.value.score} / 100 (${r.value.classification})`,
      module: "calculator",
    })
  }

  const calculateCO2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const combustible = Number.parseFloat(fuelQuantity)
    const factor = Number.parseFloat(emissionFactor)

    if (!isNaN(combustible) && !isNaN(factor) && combustible >= 0 && factor >= 0) {
      const co2 = combustible * factor
      setCo2Result(co2)

      addToHistory({
        type: "Emisiones CO₂",
        inputs: { Combustible: `${combustible} (${fuelType})`, "Factor Emisión": factor },
        result: `${co2.toFixed(2)} kg CO₂e`,
        module: "calculator",
      })
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-xl font-semibold text-foreground mb-2">Calculadora Ambiental</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cálculos fisicoquímicos rigurosos según Standard Methods, NSF WQI y normas ambientales del MINAM
        </p>
      </div>

      <Tabs defaultValue="dbo" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto gap-2 p-2">
          <TabsTrigger value="dbo" className="min-h-[44px] text-sm">
            <Droplet className="h-4 w-4 mr-1" />
            DBO₅
          </TabsTrigger>
          <TabsTrigger value="dqo" className="min-h-[44px] text-sm">
            <Flame className="h-4 w-4 mr-1" />
            DQO
          </TabsTrigger>
          <TabsTrigger value="ica" className="min-h-[44px] text-sm">
            <TrendingDown className="h-4 w-4 mr-1" />
            ICA
          </TabsTrigger>
          <TabsTrigger value="co2" className="min-h-[44px] text-sm">
            <Wind className="h-4 w-4 mr-1" />
            CO₂
          </TabsTrigger>
        </TabsList>

        {/* TAB DBO5 */}
        <TabsContent value="dbo" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-lg">Demanda Bioquímica de Oxígeno (DBO₅)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Método de incubación a 20 °C por 5 días según Standard Methods 5210 B
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-blue-900 mb-2">Fórmula Estándar 5210 B:</p>
                  <p className="font-mono text-blue-800 mb-2">DBO₅ = [(OD₁ − OD₂) − corrección_semilla] / P</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Donde:</strong>
                    <br />
                    OD₁ = Oxígeno disuelto inicial en botella de DBO (mg/L)
                    <br />
                    OD₂ = Oxígeno disuelto final al día 5 (mg/L)
                    <br />
                    P = Fracción de dilución (V_muestra / V_botella)
                    <br />
                    <strong>Criterios de validez SM 5210 B:</strong> Consumo de OD ≥ 2.0 mg/L y OD residual ≥ 1.0 mg/L.
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateDBO} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="v1" className="text-sm font-medium">OD Inicial — Día 0 (mg/L)</Label>
                    <Input id="v1" name="v1" type="number" step="0.01" placeholder="8.5" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="v2" className="text-sm font-medium">OD Final — Día 5 (mg/L)</Label>
                    <Input id="v2" name="v2" type="number" step="0.01" placeholder="3.2" required className="h-12 text-base" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="volumen" className="text-sm font-medium">Volumen Muestra (mL)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px]">
                          <p className="text-xs">Volumen de muestra pura colocado en la botella. Ej: 3 a 10 mL para agua residual cruda, 30 a 100 mL para agua tratada.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="volumen" name="volumen" type="number" step="0.01" placeholder="5" required className="h-12 text-base" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="botella" className="text-sm font-medium">Volumen Botella (mL)</Label>
                    <Input id="botella" name="botella" type="number" step="1" defaultValue={300} required className="h-12 text-base" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semilla" className="text-sm font-medium">Corrección Semilla (mg/L)</Label>
                    <Input id="semilla" name="semilla" type="number" step="0.01" placeholder="0" className="h-12 text-base" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular DBO₅
                </Button>

                <CalcMessages errors={dboMessages.errors} warnings={dboMessages.warnings} />

                {dboResult !== null && (
                  <div className={`mt-4 p-4 rounded-lg border ${getResultQuality(dboResult, "dbo").bg} ${getResultQuality(dboResult, "dbo").border}`}>
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
                    <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground leading-relaxed">
                      <strong>Cotejo Normativo Perú:</strong>
                      <br />• D.S. N° 004-2017-MINAM (ECA Agua Cat 1-A2 Potabilización): Límite ≤ 5 mg/L
                      <br />• D.S. N° 004-2017-MINAM (ECA Agua Cat 3 Riego vegetales): Límite ≤ 15 mg/L
                      <br />• D.S. N° 003-2010-MINAM (LMP Efluentes PTAR Doméstica): Límite ≤ 100 mg/L
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB DQO */}
        <TabsContent value="dqo" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-secondary flex-shrink-0" />
                <CardTitle className="text-lg">Demanda Química de Oxígeno (DQO)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Reflujo cerrado y titulación con Sulfato Ferroso Amónico (FAS) según Standard Methods 5220 C
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-orange-900 mb-2">Fórmula Estándar 5220 C:</p>
                  <p className="font-mono text-orange-800 mb-2">DQO = [(V_blanco − V_muestra) × M_FAS × 8000] / V_muestra</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Donde 8000 es el peso equivalente de oxígeno (8 mg/meq × 1000 mL/L).
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateDQO} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vBlanco" className="text-sm font-medium">Volumen FAS en Blanco (mL)</Label>
                    <Input id="vBlanco" name="vBlanco" type="number" step="0.01" placeholder="10.5" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vMuestra" className="text-sm font-medium">Volumen FAS en Muestra (mL)</Label>
                    <Input id="vMuestra" name="vMuestra" type="number" step="0.01" placeholder="6.2" required className="h-12 text-base" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="normalidad" className="text-sm font-medium">Molaridad FAS (mol/L)</Label>
                    <Input id="normalidad" name="normalidad" type="number" step="0.001" placeholder="0.100" defaultValue="0.100" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volumenMuestra" className="text-sm font-medium">Alícuota Muestra (mL)</Label>
                    <Input id="volumenMuestra" name="volumenMuestra" type="number" step="0.1" placeholder="2.5" defaultValue="2.5" required className="h-12 text-base" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular DQO
                </Button>

                <CalcMessages errors={dqoMessages.errors} warnings={dqoMessages.warnings} />

                {dqoResult !== null && (
                  <div className={`mt-4 p-4 rounded-lg border ${getResultQuality(dqoResult, "dqo").bg} ${getResultQuality(dqoResult, "dqo").border}`}>
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
                    <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground leading-relaxed">
                      <strong>Cotejo Normativo Perú:</strong>
                      <br />• D.S. N° 004-2017-MINAM (ECA Cat 1-A2 Potabilización): Límite ≤ 10 mg/L
                      <br />• D.S. N° 004-2017-MINAM (ECA Cat 3 Riego): Límite ≤ 40 mg/L
                      <br />• D.S. N° 003-2010-MINAM (LMP Efluentes PTAR Doméstica): Límite ≤ 200 mg/L
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB ICA */}
        <TabsContent value="ica" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-accent flex-shrink-0" />
                <CardTitle className="text-lg">Índice de Calidad del Agua (ICA-NSF / ICA-PE)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Evaluación multicriterio según curvas de subíndice validadas por NSF y Autoridad Nacional del Agua (ANA)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-green-50 border-green-200">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-green-900 mb-1">Metodología Estandarizada NSF / ANA (R.J. 056-2018-ANA):</p>
                  <p className="text-xs text-green-800 leading-relaxed">
                    Calcula subíndices de calidad ($q_i \in [0, 100]$) mediante curvas de ponderación analítica. Permite evaluar desde 3 parámetros clave hasta el panel completo.
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateICA} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="od" className="text-sm font-medium">Oxígeno Disuelto (mg/L) *</Label>
                    <Input id="od" name="od" type="number" step="0.1" placeholder="7.5" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph" className="text-sm font-medium">pH (unidades) *</Label>
                    <Input id="ph" name="ph" type="number" step="0.1" placeholder="7.2" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="turbidez" className="text-sm font-medium">Turbidez (NTU) *</Label>
                    <Input id="turbidez" name="turbidez" type="number" step="0.1" placeholder="4.0" required className="h-12 text-base" />
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parámetros Adicionales (Opcionales para mayor precisión):</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bod" className="text-xs font-medium">DBO₅ (mg/L)</Label>
                      <Input id="bod" name="bod" type="number" step="0.1" placeholder="2.0" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coliforms" className="text-xs font-medium">Coliformes Fecales (NMP/100 mL)</Label>
                      <Input id="coliforms" name="coliforms" type="number" step="1" placeholder="50" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tds" className="text-xs font-medium">Sólidos Disueltos TDS (mg/L)</Label>
                      <Input id="tds" name="tds" type="number" step="1" placeholder="150" className="h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular ICA Científico
                </Button>

                <CalcMessages errors={wqiMessages.errors} warnings={wqiMessages.warnings} />

                {wqiResult && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Puntuación ICA Global:</p>
                        <p className="text-3xl font-extrabold text-foreground">{wqiResult.score} <span className="text-sm font-normal text-muted-foreground">/ 100</span></p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${wqiResult.color} bg-muted`}>
                          Calidad {wqiResult.classification}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{wqiResult.parametersEvaluated} parámetros ponderados</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Desglose de Subíndices Evaluados ($q_i$):</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {wqiResult.breakdown.map((b) => (
                          <div key={b.id} className="p-2 bg-muted/60 rounded text-xs flex justify-between items-center">
                            <span className="font-medium text-foreground">{b.name}:</span>
                            <span className="font-mono text-primary font-semibold">{Math.round(b.subindex)} pts ({Math.round(b.normalizedWeight * 100)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CO2 */}
        <TabsContent value="co2" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <CardTitle className="text-lg">Emisiones de Gases de Efecto Invernadero (CO₂e)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Estimación de emisiones directas por combustión y energía según factores IPCC y MINAM
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <Alert className="mb-5 bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-orange-900 mb-1">Cálculo según GHG Protocol:</p>
                  <p className="font-mono text-orange-800 mb-1">Emisiones = Consumo × Factor de Emisión (kg CO₂e/unidad)</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Valores oficiales del IPCC 2021 y factor del Sistema Eléctrico Interconectado Nacional (SEIN Perú: 0.212 kg CO₂e/kWh).
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateCO2} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fuel-type" className="text-sm font-medium">Tipo de Fuente o Combustible</Label>
                  <select
                    id="fuel-type"
                    value={fuelType}
                    onChange={(e) => handleFuelChange(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="gasolina">Gasolina de motor (L) — Factor 2.31 kg CO₂e/L</option>
                    <option value="diesel">Diésel B5 / D2 (L) — Factor 2.68 kg CO₂e/L</option>
                    <option value="gas_natural">Gas Natural Seco (m³) — Factor 2.03 kg CO₂e/m³</option>
                    <option value="glp">Gas Licuado de Petróleo GLP (kg) — Factor 2.98 kg CO₂e/kg</option>
                    <option value="electricidad_peru">Electricidad Red Perú SEIN (kWh) — Factor 0.212 kg CO₂e/kWh</option>
                    <option value="custom">Factor Personalizado</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="combustible" className="text-sm font-medium">Cantidad Consumida</Label>
                    <Input
                      id="combustible"
                      name="combustible"
                      type="number"
                      step="0.01"
                      placeholder="100"
                      value={fuelQuantity}
                      onChange={(e) => setFuelQuantity(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="factorEmision" className="text-sm font-medium">Factor de Emisión (kg CO₂e/unidad)</Label>
                    <Input
                      id="factorEmision"
                      name="factorEmision"
                      type="number"
                      step="0.001"
                      value={emissionFactor}
                      onChange={(e) => setEmissionFactor(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular Emisiones CO₂e
                </Button>

                {co2Result !== null && (
                  <div className="mt-4 p-4 rounded-lg border bg-primary/10 border-primary/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-primary">Resultado de Emisiones</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Emisiones Totales:</p>
                      <p className="text-3xl font-bold text-primary">{co2Result.toFixed(2)} kg CO₂e</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                      <div className="p-2 bg-background/50 rounded">
                        <span className="font-semibold block">Toneladas CO₂e:</span>
                        {(co2Result / 1000).toFixed(4)} tCO₂e
                      </div>
                      <div className="p-2 bg-background/50 rounded">
                        <span className="font-semibold block">Árboles a compensar:</span>
                        ~{Math.ceil(co2Result / 22)} árboles/año
                      </div>
                      <div className="p-2 bg-background/50 rounded">
                        <span className="font-semibold block">Energía Equivalente:</span>
                        ~{(co2Result * 0.000293).toFixed(3)} MWh
                      </div>
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
