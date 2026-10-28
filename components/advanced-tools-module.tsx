"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n-context"
import { Leaf, Droplets, AlertTriangle, ShieldCheck, BookOpen, CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  calculateCarbonFootprint,
  type CarbonFootprintValue,
  type GridRegion,
  GRID_EMISSION_FACTORS,
  calculateWaterFootprint,
  type WaterFootprintValue,
  calculateSoilRemediation,
  type SoilRemediationValue,
  type RemediationTechnology,
  REMEDIATION_PROFILES,
} from "@/lib/calc-engine"

export function AdvancedToolsModule() {
  const { language } = useI18n()

  // 1. Huella de Carbono
  const [gridRegion, setGridRegion] = useState<GridRegion>("peru_sein")
  const [carbonResult, setCarbonResult] = useState<CarbonFootprintValue | null>(null)

  // 2. Huella Hídrica (WFN)
  const [waterResult, setWaterResult] = useState<WaterFootprintValue | null>(null)
  const [waterError, setWaterError] = useState<string | null>(null)

  // 3. Impacto Ambiental
  const [impactResult, setImpactResult] = useState<{ score: number; level: string; color: string } | null>(null)

  // 4. Remediación de Suelo
  const [remediationTech, setRemediationTech] = useState<RemediationTechnology>("biopiles")
  const [remediationResult, setRemediationResult] = useState<SoilRemediationValue | null>(null)
  const [remediationError, setRemediationError] = useState<string | null>(null)

  const handleCalculateCarbon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const naturalGasM3 = Number.parseFloat(formData.get("naturalGas") as string) || 0
    const dieselGal = Number.parseFloat(formData.get("diesel") as string) || 0
    const gasolineGal = Number.parseFloat(formData.get("gasoline") as string) || 0
    const lpgKg = Number.parseFloat(formData.get("lpg") as string) || 0
    const electricityKwh = Number.parseFloat(formData.get("electricity") as string) || 0
    const vehicleKm = Number.parseFloat(formData.get("transport") as string) || 0
    const wasteLandfillKg = Number.parseFloat(formData.get("waste") as string) || 0

    const r = calculateCarbonFootprint({
      naturalGasM3,
      dieselGal,
      gasolineGal,
      lpgKg,
      electricityKwh,
      gridRegion,
      vehicleKm,
      wasteLandfillKg,
    })

    if (r.ok && r.value) {
      setCarbonResult(r.value)
    }
  }

  const handleCalculateWater = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const surface = Number.parseFloat(formData.get("surface") as string) || 0
    const ground = Number.parseFloat(formData.get("ground") as string) || 0
    const green = Number.parseFloat(formData.get("green") as string) || 0
    const effluentQ = Number.parseFloat(formData.get("effluentQ") as string) || 0
    const effluentC = Number.parseFloat(formData.get("effluentC") as string) || 0
    const ecaLimit = Number.parseFloat(formData.get("ecaLimit") as string) || 0
    const naturalBg = Number.parseFloat(formData.get("naturalBg") as string) || 0

    const r = calculateWaterFootprint({
      surfaceWaterConsumedM3: surface,
      groundwaterConsumedM3: ground,
      rainwaterEvapotranspiredM3: green,
      effluentDischargeM3: effluentQ,
      effluentConcentrationMgL: effluentC,
      standardLimitMgL: ecaLimit,
      naturalBackgroundMgL: naturalBg,
    })

    if (r.ok && r.value) {
      setWaterResult(r.value)
      setWaterError(null)
    } else {
      setWaterError(r.errors[0] || "Error en el cálculo")
      setWaterResult(null)
    }
  }

  const handleAnalyzeImpact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const water = Number.parseInt(formData.get("waterPollution") as string) || 0
    const air = Number.parseInt(formData.get("airPollution") as string) || 0
    const soil = Number.parseInt(formData.get("soilContamination") as string) || 0
    const waste = Number.parseInt(formData.get("wasteGeneration") as string) || 0
    const biodiversity = Number.parseInt(formData.get("biodiversityImpact") as string) || 0

    const score = (water + air + soil + waste + biodiversity) / 5
    let level = "Bajo"
    let color = "text-green-600"

    if (score <= 3) {
      level = language === "es" ? "Bajo (Impacto Compatible)" : "Low (Compatible Impact)"
      color = "text-green-600"
    } else if (score <= 6) {
      level = language === "es" ? "Moderado (Impacto Mitigable)" : "Moderate (Mitigable Impact)"
      color = "text-yellow-600"
    } else {
      level = language === "es" ? "Severo / Crítico (Requiere EIA detallado)" : "Severe / Critical (Requires full EIA)"
      color = "text-red-600"
    }

    setImpactResult({ score, level, color })
  }

  const handleCalculateRemediation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const area = Number.parseFloat(formData.get("area") as string) || 0
    const depth = Number.parseFloat(formData.get("depth") as string) || 0
    const density = Number.parseFloat(formData.get("density") as string) || 1.6
    const c0 = Number.parseFloat(formData.get("initialConc") as string) || 0
    const cf = Number.parseFloat(formData.get("targetConc") as string) || 0

    const r = calculateSoilRemediation({
      technology: remediationTech,
      areaM2: area,
      depthM: depth,
      soilDensityTonM3: density,
      initialConcentrationMgKg: c0,
      targetConcentrationMgKg: cf,
    })

    if (r.ok && r.value) {
      setRemediationResult(r.value)
      setRemediationError(null)
    } else {
      setRemediationError(r.errors[0] || "Error en el cálculo")
      setRemediationResult(null)
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {language === "es" ? "Herramientas Avanzadas" : "Advanced Tools"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "es"
            ? "Modelación ambiental según GHG Protocol, Water Footprint Network y guías de remediación de suelos"
            : "Environmental modeling under GHG Protocol, Water Footprint Network, and remediation engineering"}
        </p>
      </div>

      <Tabs defaultValue="carbon" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto gap-2 p-2">
          <TabsTrigger value="carbon" className="min-h-[44px] text-sm">
            <Leaf className="h-4 w-4 mr-1" />
            Huella CO₂e
          </TabsTrigger>
          <TabsTrigger value="water" className="min-h-[44px] text-sm">
            <Droplets className="h-4 w-4 mr-1" />
            Huella Hídrica
          </TabsTrigger>
          <TabsTrigger value="remediation" className="min-h-[44px] text-sm">
            <ShieldCheck className="h-4 w-4 mr-1" />
            Remediación
          </TabsTrigger>
          <TabsTrigger value="impact" className="min-h-[44px] text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Impacto EIA
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HUELLA DE CARBONO */}
        <TabsContent value="carbon" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-lg">Calculadora de Huella de Carbono Corporativa</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Desglose estricto por Alcances 1, 2 y 3 según GHG Protocol Corporate Standard y factores oficiales SEIN Perú / IPCC
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <Alert className="bg-emerald-50 border-emerald-200">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs text-emerald-800 space-y-1">
                  <p><strong>Alcance 1:</strong> Emisiones directas por combustión fija (gas natural) y móvil (diésel, gasolina).</p>
                  <p><strong>Alcance 2:</strong> Emisiones indirectas por consumo eléctrico de la red (factor SEIN Perú: 0.212 kg CO₂e/kWh).</p>
                  <p><strong>Alcance 3:</strong> Emisiones indirectas por movilidad del personal y disposición de residuos sólidos.</p>
                </AlertDescription>
              </Alert>

              <form onSubmit={handleCalculateCarbon} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Red Eléctrica para Alcance 2:</Label>
                  <Select value={gridRegion} onValueChange={(v: GridRegion) => setGridRegion(v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(GRID_EMISSION_FACTORS).map(([key, item]) => (
                        <SelectItem key={key} value={key}>{item.name} ({item.factorKgKwh} kg CO₂e/kWh)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-muted/40 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase">Alcance 1 — Combustibles Directos</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Gas Natural (m³)</Label>
                      <Input name="naturalGas" type="number" step="0.1" placeholder="0" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Diésel (galones)</Label>
                      <Input name="diesel" type="number" step="0.1" placeholder="0" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Gasolina (galones)</Label>
                      <Input name="gasoline" type="number" step="0.1" placeholder="0" className="h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase">Alcance 2 — Energía Eléctrica</p>
                  <div className="space-y-1">
                    <Label className="text-xs">Consumo de Electricidad (kWh)</Label>
                    <Input name="electricity" type="number" step="1" placeholder="1000" className="h-10 text-sm" />
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase">Alcance 3 — Otras Emisiones Indirectas</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Transporte de personal en auto/van (km)</Label>
                      <Input name="transport" type="number" step="1" placeholder="0" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Residuos a Relleno Sanitario (kg)</Label>
                      <Input name="waste" type="number" step="1" placeholder="0" className="h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular Huella de Carbono (GHG Protocol)
                </Button>

                {carbonResult && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Emisiones Totales Anuales:</p>
                        <p className="text-3xl font-extrabold text-foreground">
                          {carbonResult.totalTonCo2e} <span className="text-base font-normal text-muted-foreground">tCO₂e</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{carbonResult.totalKgCo2e.toLocaleString()} kg CO₂e</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          ~{carbonResult.treesNeededOffset} árboles/año para compensar
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">Alcance 1 (Directas):</p>
                        <p className="text-lg font-bold text-primary">{carbonResult.scope1Kg.toFixed(1)} kg</p>
                        <p className="text-muted-foreground">{carbonResult.percentages.scope1}% del total</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">Alcance 2 (Electricidad):</p>
                        <p className="text-lg font-bold text-primary">{carbonResult.scope2Kg.toFixed(1)} kg</p>
                        <p className="text-muted-foreground">{carbonResult.percentages.scope2}% del total</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">Alcance 3 (Otras Indirectas):</p>
                        <p className="text-lg font-bold text-primary">{carbonResult.scope3Kg.toFixed(1)} kg</p>
                        <p className="text-muted-foreground">{carbonResult.percentages.scope3}% del total</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: HUELLA HIDRICA */}
        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <CardTitle className="text-lg">Calculadora de Huella Hídrica (Metodología WFN / Hoekstra)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Cuantificación de Huella Azul, Verde y Huella Gris (volumen de asimilación de carga contaminante en cuerpo receptor)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800 space-y-1">
                  <p><strong>Huella Azul:</strong> Consumo neto de agua dulce superficial o subterránea evaporada o incorporada.</p>
                  <p><strong>Huella Verde:</strong> Volumen de agua de lluvia evapotranspirada por vegetación/cultivos.</p>
                  <p><strong>Huella Gris:</strong> $V_{'{'}gris{'}'} = Q_{'{'}efl{'}'} \times (C_{'{'}efl{'}'} - C_{'{'}nat{'}'}) / (C_{'{'}máx{'}'} - C_{'{'}nat{'}'})$ según estándar ECA de la cuenca receptora.</p>
                </AlertDescription>
              </Alert>

              <form onSubmit={handleCalculateWater} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Agua Superficial Consumida (m³)</Label>
                    <Input name="surface" type="number" step="0.1" placeholder="500" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Agua Subterránea Consumida (m³)</Label>
                    <Input name="ground" type="number" step="0.1" placeholder="200" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Agua Verde / Lluvia (m³)</Label>
                    <Input name="green" type="number" step="0.1" placeholder="100" className="h-10 text-sm" />
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-blue-600 uppercase">Cálculo de Huella Gris (Vertimiento de Efluente)</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Caudal Vertido (m³)</Label>
                      <Input name="effluentQ" type="number" step="0.1" placeholder="1000" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Conc. Efluente (mg/L)</Label>
                      <Input name="effluentC" type="number" step="0.1" placeholder="40" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Límite ECA Receptor (mg/L)</Label>
                      <Input name="ecaLimit" type="number" step="0.1" placeholder="10" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Fondo Natural (mg/L)</Label>
                      <Input name="naturalBg" type="number" step="0.1" defaultValue="0" className="h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular Huella Hídrica Total
                </Button>

                {waterError && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{waterError}</AlertDescription>
                  </Alert>
                )}

                {waterResult && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Huella Hídrica Total:</p>
                        <p className="text-3xl font-extrabold text-blue-700">{waterResult.totalM3.toLocaleString()} <span className="text-base font-normal text-muted-foreground">m³</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-semibold text-blue-900">Huella Azul (Consuntiva):</p>
                        <p className="text-xl font-bold text-blue-800">{waterResult.blueM3.toLocaleString()} m³</p>
                        <p className="text-blue-600">{waterResult.percentages.blue}% del total</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-semibold text-green-900">Huella Verde (Lluvia/Suelo):</p>
                        <p className="text-xl font-bold text-green-800">{waterResult.greenM3.toLocaleString()} m³</p>
                        <p className="text-green-600">{waterResult.percentages.green}% del total</p>
                      </div>
                      <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg">
                        <p className="font-semibold text-slate-900">Huella Gris (Dilución):</p>
                        <p className="text-xl font-bold text-slate-800">{waterResult.greyM3.toLocaleString()} m³</p>
                        <p className="text-slate-600">{waterResult.percentages.grey}% del total</p>
                        {waterResult.greyWaterDetails && (
                          <p className="text-[11px] text-muted-foreground mt-1">Carga crítica: {waterResult.greyWaterDetails.criticalLoadKg} kg</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: REMEDIACION DE SUELOS */}
        <TabsContent value="remediation" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <CardTitle className="text-lg">Ingeniería y Costos de Remediación de Suelos</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Dimensionamiento técnico de masa, esponjamiento, costos CAPEX/OPEX y requerimiento de nutrientes C:N:P según ECA Suelo D.S. 011-2017-MINAM
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <form onSubmit={handleCalculateRemediation} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tecnología de Remediación Aplicable:</Label>
                  <Select value={remediationTech} onValueChange={(v: RemediationTechnology) => setRemediationTech(v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(REMEDIATION_PROFILES).map(([key, item]) => (
                        <SelectItem key={key} value={key}>{item.name} (~${item.typicalCostPerTonUsd}/ton)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{REMEDIATION_PROFILES[remediationTech].notes}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Área Afectada (m²)</Label>
                    <Input name="area" type="number" step="1" placeholder="500" required className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Profundidad Media (m)</Label>
                    <Input name="depth" type="number" step="0.1" placeholder="1.5" required className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Densidad Suelo (t/m³)</Label>
                    <Input name="density" type="number" step="0.05" defaultValue="1.6" className="h-10 text-sm" />
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase">Concentraciones (según ECA Suelo D.S. 011-2017-MINAM)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Concentración Inicial en Sitio (mg/kg)</Label>
                      <Input name="initialConc" type="number" step="1" placeholder="4500" className="h-10 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Concentración Objetivo ECA (mg/kg)</Label>
                      <Input name="targetConc" type="number" step="1" placeholder="500" className="h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Calcular Dimensionamiento y Costos de Remediación
                </Button>

                {remediationError && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{remediationError}</AlertDescription>
                  </Alert>
                )}

                {remediationResult && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Costo Total Estimado:</p>
                        <p className="text-3xl font-extrabold text-foreground">
                          ${remediationResult.costs.totalEstimatedUsd.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">USD</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rango estimado: ${remediationResult.costs.minCostUsd.toLocaleString()} - ${remediationResult.costs.maxCostUsd.toLocaleString()} USD
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                          Plazo estimado: ~{remediationResult.technology.durationMonths} meses
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">${remediationResult.costs.costPerM3Usd} USD/m³ in-situ</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">Volumen y Masa:</p>
                        <p className="text-sm font-bold text-primary">{remediationResult.inSituVolumeM3} m³ in-situ</p>
                        <p className="text-muted-foreground">{remediationResult.exSituVolumeM3} m³ esponjado</p>
                        <p className="font-bold text-foreground mt-1">{remediationResult.soilMassTonnes} Toneladas</p>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">Desglose Económico:</p>
                        <p className="text-muted-foreground">CAPEX: ${remediationResult.costs.capexUsd.toLocaleString()} USD ({remediationResult.technology.capexPercent}%)</p>
                        <p className="text-muted-foreground">OPEX: ${remediationResult.costs.opexUsd.toLocaleString()} USD ({remediationResult.technology.opexPercent}%)</p>
                        {remediationResult.requiredEfficiencyPercent && (
                          <p className="font-bold text-foreground mt-1">Eficiencia requerida: {remediationResult.requiredEfficiencyPercent.toFixed(1)}%</p>
                        )}
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">Nutrientes / Contaminante:</p>
                        {remediationResult.contaminantRemovedKg !== null ? (
                          <p className="text-muted-foreground">Masa a remover: {remediationResult.contaminantRemovedKg.toLocaleString()} kg</p>
                        ) : (
                          <p className="text-muted-foreground">Sin concentración ingresada</p>
                        )}
                        {remediationResult.nutrientRequirementsKg && (
                          <div className="mt-1 pt-1 border-t text-[11px] text-muted-foreground">
                            <span>Nitrógeno (Urea): ~{remediationResult.nutrientRequirementsKg.nitrogenKg} kg</span>
                            <br />
                            <span>Fósforo (DAP): ~{remediationResult.nutrientRequirementsKg.phosphorusKg} kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: IMPACTO AMBIENTAL EIA */}
        <TabsContent value="impact" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <CardTitle className="text-lg">Evaluación Preliminar de Impacto Ambiental (Matriz Causal)</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Clasificación de significancia ambiental según criterios de la Ley del SEIA (Ley N° 27446) y Guías del SENACE
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <form onSubmit={handleAnalyzeImpact} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">1. Impacto en Calidad de Agua (0 = nulo, 10 = crítico)</Label>
                    <Input name="waterPollution" type="number" min="0" max="10" defaultValue="3" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">2. Emisiones a la Atmósfera y Ruido (0 a 10)</Label>
                    <Input name="airPollution" type="number" min="0" max="10" defaultValue="4" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">3. Afectación de Suelos y Topografía (0 a 10)</Label>
                    <Input name="soilContamination" type="number" min="0" max="10" defaultValue="3" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">4. Generación de Residuos Peligrosos (0 a 10)</Label>
                    <Input name="wasteGeneration" type="number" min="0" max="10" defaultValue="2" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold">5. Presión sobre Flora, Fauna y Ecosistemas Frágiles (0 a 10)</Label>
                    <Input name="biodiversityImpact" type="number" min="0" max="10" defaultValue="4" className="h-10 text-sm" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Evaluar Significancia Ambiental
                </Button>

                {impactResult && (
                  <div className="mt-4 p-4 rounded-lg border bg-card space-y-2">
                    <p className="text-xs text-muted-foreground">Resultado de Calificación:</p>
                    <p className={`text-2xl font-bold ${impactResult.color}`}>
                      Índice: {impactResult.score.toFixed(1)} / 10 — {impactResult.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Conforme al Sistema Nacional de Evaluación de Impacto Ambiental (SEIA), valores superiores a 6.0 sugieren categoría II (EIA-sd) o categoría III (EIA-d) ante SENACE o ministerios sectoriales.
                    </p>
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
