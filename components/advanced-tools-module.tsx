"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Leaf, Droplets, AlertTriangle, Recycle, BookOpen, Info } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AdvancedToolsModule() {
  const { language } = useI18n()
  const [carbonResult, setCarbonResult] = useState<number | null>(null)
  const [waterResult, setWaterResult] = useState<number | null>(null)
  const [impactResult, setImpactResult] = useState<{ score: number; level: string } | null>(null)
  const [remediationResult, setRemediationResult] = useState<{ method: string; cost: number; time: string } | null>(
    null,
  )

  const calculateCarbonFootprint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const electricity = Number.parseFloat(formData.get("electricity") as string) || 0
    const gas = Number.parseFloat(formData.get("gas") as string) || 0
    const transport = Number.parseFloat(formData.get("transport") as string) || 0
    const waste = Number.parseFloat(formData.get("waste") as string) || 0

    // Emission factors (kg CO2e) - IPCC 2021 Guidelines
    const electricityFactor = 0.475 // kg CO2e per kWh (global grid average)
    const gasFactor = 2.03 // kg CO2e per m³ natural gas (combustion + upstream)
    const transportFactor = 0.192 // kg CO2e per km (average passenger vehicle)
    const wasteFactor = 0.46 // kg CO2e per kg waste (landfill with methane capture)

    const total = electricity * electricityFactor + gas * gasFactor + transport * transportFactor + waste * wasteFactor

    setCarbonResult(total)
  }

  const calculateWaterFootprint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const domestic = Number.parseFloat(formData.get("domestic") as string) || 0
    const industrial = Number.parseFloat(formData.get("industrial") as string) || 0
    const agricultural = Number.parseFloat(formData.get("agricultural") as string) || 0

    const total = domestic + industrial + agricultural

    setWaterResult(total)
  }

  const analyzeEnvironmentalImpact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const waterPollution = Number.parseInt(formData.get("waterPollution") as string) || 0
    const airPollution = Number.parseInt(formData.get("airPollution") as string) || 0
    const soilContamination = Number.parseInt(formData.get("soilContamination") as string) || 0
    const wasteGeneration = Number.parseInt(formData.get("wasteGeneration") as string) || 0
    const biodiversityImpact = Number.parseInt(formData.get("biodiversityImpact") as string) || 0

    const score = (waterPollution + airPollution + soilContamination + wasteGeneration + biodiversityImpact) / 5

    let level = ""
    if (score <= 3) level = language === "es" ? "Bajo" : language === "en" ? "Low" : "Baixo"
    else if (score <= 6) level = language === "es" ? "Moderado" : language === "en" ? "Moderate" : "Moderado"
    else level = language === "es" ? "Alto" : language === "en" ? "High" : "Alto"

    setImpactResult({ score, level })
  }

  const calculateSoilRemediation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const contaminant = formData.get("contaminant") as string
    const area = Number.parseFloat(formData.get("area") as string) || 0
    const depth = Number.parseFloat(formData.get("depth") as string) || 0

    const volume = area * depth

    let method = ""
    let costPerM3 = 0
    let timeMonths = 0

    switch (contaminant) {
      case "hydrocarbons":
        method = language === "es" ? "Biorremediación" : language === "en" ? "Bioremediation" : "Biorremediação"
        costPerM3 = 150
        timeMonths = 6
        break
      case "heavy_metals":
        method = language === "es" ? "Fitorremediación" : language === "en" ? "Phytoremediation" : "Fitorremediação"
        costPerM3 = 200
        timeMonths = 12
        break
      case "pesticides":
        method = language === "es" ? "Oxidación Química" : language === "en" ? "Chemical Oxidation" : "Oxidação Química"
        costPerM3 = 250
        timeMonths = 4
        break
      default:
        method =
          language === "es"
            ? "Excavación y Disposición"
            : language === "en"
              ? "Excavation and Disposal"
              : "Escavação e Disposição"
        costPerM3 = 300
        timeMonths = 2
    }

    const totalCost = volume * costPerM3

    setRemediationResult({
      method,
      cost: totalCost,
      time: `${timeMonths} ${language === "es" ? "meses" : language === "en" ? "months" : "meses"}`,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {language === "es"
            ? "Herramientas Avanzadas"
            : language === "en"
              ? "Advanced Tools"
              : "Ferramentas Avançadas"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "es"
            ? "Análisis y cálculos especializados"
            : language === "en"
              ? "Specialized analysis and calculations"
              : "Análises e cálculos especializados"}
        </p>
      </div>

      <Tabs defaultValue="carbon" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="carbon">
            {language === "es" ? "Huella CO₂" : language === "en" ? "Carbon" : "Carbono"}
          </TabsTrigger>
          <TabsTrigger value="water">
            {language === "es" ? "Huella H₂O" : language === "en" ? "Water" : "Água"}
          </TabsTrigger>
          <TabsTrigger value="impact">
            {language === "es" ? "Impacto" : language === "en" ? "Impact" : "Impacto"}
          </TabsTrigger>
          <TabsTrigger value="remediation">
            {language === "es" ? "Remediación" : language === "en" ? "Remediation" : "Remediação"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carbon">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <CardTitle>
                  {language === "es"
                    ? "Calculadora de Huella de Carbono"
                    : language === "en"
                      ? "Carbon Footprint Calculator"
                      : "Calculadora de Pegada de Carbono"}
                </CardTitle>
              </div>
              <CardDescription>
                {language === "es"
                  ? "Metodología IPCC 2021 Guidelines for National GHG Inventories"
                  : language === "en"
                    ? "IPCC 2021 Guidelines for National GHG Inventories Methodology"
                    : "Metodologia IPCC 2021 Guidelines for National GHG Inventories"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-5 bg-green-50 border-green-200">
                <BookOpen className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-green-900 mb-2">Fundamento Científico:</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>
                      <strong>Protocolo:</strong> IPCC 2021 Guidelines, GHG Protocol Corporate Standard
                    </p>
                    <p>
                      <strong>Fórmula General:</strong>
                    </p>
                    <p className="font-mono">CO₂e = Σ(Actividad_i × Factor_Emisión_i × GWP_i)</p>
                    <p className="mt-2">
                      <strong>Factores de Emisión Validados:</strong>
                    </p>
                    <p>• Electricidad: 0.475 kg CO₂e/kWh (IEA 2021, grid mix global)</p>
                    <p>• Gas Natural: 2.03 kg CO₂e/m³ (combustión + upstream CH₄ leaks)</p>
                    <p>• Transporte: 0.192 kg CO₂e/km (vehículo promedio, EPA 2021)</p>
                    <p>• Residuos: 0.46 kg CO₂e/kg (relleno sanitario con captura CH₄)</p>
                    <p className="mt-2">
                      <strong>GWP (Global Warming Potential, 100 años):</strong>
                    </p>
                    <p>CO₂ = 1, CH₄ = 28, N₂O = 265 (IPCC AR6)</p>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateCarbonFootprint} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="electricity">
                      {language === "es"
                        ? "Consumo Eléctrico (kWh/mes)"
                        : language === "en"
                          ? "Electricity Consumption (kWh/month)"
                          : "Consumo Elétrico (kWh/mês)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="electricity" name="electricity" type="number" step="0.01" placeholder="500" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gas">
                      {language === "es"
                        ? "Consumo de Gas (m³/mes)"
                        : language === "en"
                          ? "Gas Consumption (m³/month)"
                          : "Consumo de Gás (m³/mês)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="gas" name="gas" type="number" step="0.01" placeholder="50" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="transport">
                      {language === "es"
                        ? "Transporte (km/mes)"
                        : language === "en"
                          ? "Transport (km/month)"
                          : "Transporte (km/mês)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="transport" name="transport" type="number" step="0.01" placeholder="1000" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="waste">
                      {language === "es"
                        ? "Residuos Generados (kg/mes)"
                        : language === "en"
                          ? "Waste Generated (kg/month)"
                          : "Resíduos Gerados (kg/mês)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="waste" name="waste" type="number" step="0.01" placeholder="100" />
                </div>

                <Button type="submit" className="w-full">
                  {language === "es"
                    ? "Calcular Huella"
                    : language === "en"
                      ? "Calculate Footprint"
                      : "Calcular Pegada"}
                </Button>

                {carbonResult !== null && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "es"
                        ? "Huella de Carbono Mensual:"
                        : language === "en"
                          ? "Monthly Carbon Footprint:"
                          : "Pegada de Carbono Mensal:"}
                    </p>
                    <p className="text-2xl font-bold text-primary">{carbonResult.toFixed(2)} kg CO₂e</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === "es" ? "Anual:" : language === "en" ? "Annual:" : "Anual:"}{" "}
                      {(carbonResult * 12).toFixed(2)} kg CO₂e ({((carbonResult * 12) / 1000).toFixed(2)} ton CO₂e)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Equivalente a {((carbonResult * 12) / 411).toFixed(1)} árboles necesarios para compensar (1 árbol
                      absorbe ~411 kg CO₂/año)
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-secondary" />
                <CardTitle>
                  {language === "es"
                    ? "Calculadora de Huella Hídrica"
                    : language === "en"
                      ? "Water Footprint Calculator"
                      : "Calculadora de Pegada Hídrica"}
                </CardTitle>
              </div>
              <CardDescription>
                {language === "es"
                  ? "Calcula el consumo de agua total"
                  : language === "en"
                    ? "Calculate total water consumption"
                    : "Calcule o consumo total de água"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-5 bg-green-50 border-green-200">
                <BookOpen className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-green-900 mb-2">Fundamento Científico:</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>
                      <strong>Protocolo:</strong> IPCC 2021 Guidelines, GHG Protocol Corporate Standard
                    </p>
                    <p>
                      <strong>Fórmula General:</strong>
                    </p>
                    <p className="font-mono">CO₂e = Σ(Actividad_i × Factor_Emisión_i × GWP_i)</p>
                    <p className="mt-2">
                      <strong>Factores de Emisión Validados:</strong>
                    </p>
                    <p>• Electricidad: 0.475 kg CO₂e/kWh (IEA 2021, grid mix global)</p>
                    <p>• Gas Natural: 2.03 kg CO₂e/m³ (combustión + upstream CH₄ leaks)</p>
                    <p>• Transporte: 0.192 kg CO₂e/km (vehículo promedio, EPA 2021)</p>
                    <p>• Residuos: 0.46 kg CO₂e/kg (relleno sanitario con captura CH₄)</p>
                    <p className="mt-2">
                      <strong>GWP (Global Warming Potential, 100 años):</strong>
                    </p>
                    <p>CO₂ = 1, CH₄ = 28, N₂O = 265 (IPCC AR6)</p>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateWaterFootprint} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="domestic">
                      {language === "es"
                        ? "Uso Doméstico (L/día)"
                        : language === "en"
                          ? "Domestic Use (L/day)"
                          : "Uso Doméstico (L/día)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="domestic" name="domestic" type="number" step="0.01" placeholder="200" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="industrial">
                      {language === "es"
                        ? "Uso Industrial (L/día)"
                        : language === "en"
                          ? "Industrial Use (L/day)"
                          : "Uso Industrial (L/día)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="industrial" name="industrial" type="number" step="0.01" placeholder="1000" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="agricultural">
                      {language === "es"
                        ? "Uso Agrícola (L/día)"
                        : language === "en"
                          ? "Agricultural Use (L/day)"
                          : "Uso Agrícola (L/día)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="agricultural" name="agricultural" type="number" step="0.01" placeholder="500" />
                </div>

                <Button type="submit" className="w-full">
                  {language === "es"
                    ? "Calcular Huella"
                    : language === "en"
                      ? "Calculate Footprint"
                      : "Calcular Pegada"}
                </Button>

                {waterResult !== null && (
                  <div className="mt-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "es"
                        ? "Huella Hídrica Diaria:"
                        : language === "en"
                          ? "Daily Water Footprint:"
                          : "Pegada Hídrica Diária:"}
                    </p>
                    <p className="text-2xl font-bold text-secondary">{waterResult.toFixed(2)} L</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === "es" ? "Mensual:" : language === "en" ? "Monthly:" : "Mensal:"}{" "}
                      {(waterResult * 30).toFixed(2)} L
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <CardTitle>
                  {language === "es"
                    ? "Análisis de Impacto Ambiental"
                    : language === "en"
                      ? "Environmental Impact Analysis"
                      : "Análise de Impacto Ambiental"}
                </CardTitle>
              </div>
              <CardDescription>
                {language === "es"
                  ? "Evalúa el impacto ambiental de un proyecto"
                  : language === "en"
                    ? "Evaluate environmental impact of a project"
                    : "Avalie o impacto ambiental de um projeto"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-5 bg-green-50 border-green-200">
                <BookOpen className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-green-900 mb-2">Fundamento Científico:</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>
                      <strong>Protocolo:</strong> IPCC 2021 Guidelines, GHG Protocol Corporate Standard
                    </p>
                    <p>
                      <strong>Fórmula General:</strong>
                    </p>
                    <p className="font-mono">CO₂e = Σ(Actividad_i × Factor_Emisión_i × GWP_i)</p>
                    <p className="mt-2">
                      <strong>Factores de Emisión Validados:</strong>
                    </p>
                    <p>• Electricidad: 0.475 kg CO₂e/kWh (IEA 2021, grid mix global)</p>
                    <p>• Gas Natural: 2.03 kg CO₂e/m³ (combustión + upstream CH₄ leaks)</p>
                    <p>• Transporte: 0.192 kg CO₂e/km (vehículo promedio, EPA 2021)</p>
                    <p>• Residuos: 0.46 kg CO₂e/kg (relleno sanitario con captura CH₄)</p>
                    <p className="mt-2">
                      <strong>GWP (Global Warming Potential, 100 años):</strong>
                    </p>
                    <p>CO₂ = 1, CH₄ = 28, N₂O = 265 (IPCC AR6)</p>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={analyzeEnvironmentalImpact} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="waterPollution">
                      {language === "es"
                        ? "Contaminación del Agua (1-10)"
                        : language === "en"
                          ? "Water Pollution (1-10)"
                          : "Poluição da Água (1-10)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="waterPollution" name="waterPollution" type="number" min="1" max="10" placeholder="5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="airPollution">
                      {language === "es"
                        ? "Contaminación del Aire (1-10)"
                        : language === "en"
                          ? "Air Pollution (1-10)"
                          : "Poluição do Ar (1-10)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="airPollution" name="airPollution" type="number" min="1" max="10" placeholder="5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="soilContamination">
                      {language === "es"
                        ? "Contaminación del Suelo (1-10)"
                        : language === "en"
                          ? "Soil Contamination (1-10)"
                          : "Contaminação do Solo (1-10)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="soilContamination"
                    name="soilContamination"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="wasteGeneration">
                      {language === "es"
                        ? "Generación de Residuos (1-10)"
                        : language === "en"
                          ? "Waste Generation (1-10)"
                          : "Geração de Resíduos (1-10)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="wasteGeneration" name="wasteGeneration" type="number" min="1" max="10" placeholder="5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="biodiversityImpact">
                      {language === "es"
                        ? "Impacto en Biodiversidad (1-10)"
                        : language === "en"
                          ? "Biodiversity Impact (1-10)"
                          : "Impacto na Biodiversidade (1-10)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="biodiversityImpact"
                    name="biodiversityImpact"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="5"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {language === "es" ? "Analizar Impacto" : language === "en" ? "Analyze Impact" : "Analisar Impacto"}
                </Button>

                {impactResult !== null && (
                  <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "es"
                        ? "Nivel de Impacto:"
                        : language === "en"
                          ? "Impact Level:"
                          : "Nível de Impacto:"}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-accent">{impactResult.score.toFixed(1)} / 10</p>
                      <Badge
                        variant={
                          impactResult.score <= 3 ? "default" : impactResult.score <= 6 ? "secondary" : "destructive"
                        }
                      >
                        {impactResult.level}
                      </Badge>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-chart-1" />
                <CardTitle>
                  {language === "es"
                    ? "Calculadora de Remediación de Suelos"
                    : language === "en"
                      ? "Soil Remediation Calculator"
                      : "Calculadora de Remediação de Solos"}
                </CardTitle>
              </div>
              <CardDescription>
                {language === "es"
                  ? "Estima costos y tiempos de remediación"
                  : language === "en"
                    ? "Estimate remediation costs and times"
                    : "Estime custos e tempos de remediação"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-5 bg-green-50 border-green-200">
                <BookOpen className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-green-900 mb-2">Fundamento Científico:</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>
                      <strong>Protocolo:</strong> IPCC 2021 Guidelines, GHG Protocol Corporate Standard
                    </p>
                    <p>
                      <strong>Fórmula General:</strong>
                    </p>
                    <p className="font-mono">CO₂e = Σ(Actividad_i × Factor_Emisión_i × GWP_i)</p>
                    <p className="mt-2">
                      <strong>Factores de Emisión Validados:</strong>
                    </p>
                    <p>• Electricidad: 0.475 kg CO₂e/kWh (IEA 2021, grid mix global)</p>
                    <p>• Gas Natural: 2.03 kg CO₂e/m³ (combustión + upstream CH₄ leaks)</p>
                    <p>• Transporte: 0.192 kg CO₂e/km (vehículo promedio, EPA 2021)</p>
                    <p>• Residuos: 0.46 kg CO₂e/kg (relleno sanitario con captura CH₄)</p>
                    <p className="mt-2">
                      <strong>GWP (Global Warming Potential, 100 años):</strong>
                    </p>
                    <p>CO₂ = 1, CH₄ = 28, N₂O = 265 (IPCC AR6)</p>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={calculateSoilRemediation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contaminant">
                    {language === "es"
                      ? "Tipo de Contaminante"
                      : language === "en"
                        ? "Contaminant Type"
                        : "Tipo de Contaminante"}
                  </Label>
                  <Select name="contaminant" defaultValue="hydrocarbons">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hydrocarbons">
                        {language === "es" ? "Hidrocarburos" : language === "en" ? "Hydrocarbons" : "Hidrocarbonetos"}
                      </SelectItem>
                      <SelectItem value="heavy_metals">
                        {language === "es" ? "Metales Pesados" : language === "en" ? "Heavy Metals" : "Metais Pesados"}
                      </SelectItem>
                      <SelectItem value="pesticides">
                        {language === "es" ? "Pesticidas" : language === "en" ? "Pesticides" : "Pesticidas"}
                      </SelectItem>
                      <SelectItem value="other">
                        {language === "es" ? "Otros" : language === "en" ? "Other" : "Outros"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="area">
                      {language === "es"
                        ? "Área Afectada (m²)"
                        : language === "en"
                          ? "Affected Area (m²)"
                          : "Área Afetada (m²)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="area" name="area" type="number" step="0.01" placeholder="100" required />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="depth">
                      {language === "es"
                        ? "Profundidad de Contaminación (m)"
                        : language === "en"
                          ? "Contamination Depth (m)"
                          : "Profundidade de Contaminação (m)"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-xs">
                            Factor de emisión varía por país según mix energético. Perú: 0.29 kg CO₂e/kWh (alta
                            hidroeléctrica), México: 0.52 kg CO₂e/kWh (carbón/gas)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="depth" name="depth" type="number" step="0.01" placeholder="1.5" required />
                </div>

                <Button type="submit" className="w-full">
                  {language === "es"
                    ? "Calcular Remediación"
                    : language === "en"
                      ? "Calculate Remediation"
                      : "Calcular Remediação"}
                </Button>

                {remediationResult !== null && (
                  <div className="mt-4 p-4 bg-chart-1/10 rounded-lg border border-chart-1/20 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {language === "es"
                          ? "Método Recomendado:"
                          : language === "en"
                            ? "Recommended Method:"
                            : "Método Recomendado:"}
                      </p>
                      <p className="text-lg font-semibold text-foreground">{remediationResult.method}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === "es"
                            ? "Costo Estimado:"
                            : language === "en"
                              ? "Estimated Cost:"
                              : "Custo Estimado:"}
                        </p>
                        <p className="text-xl font-bold text-chart-1">${remediationResult.cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === "es"
                            ? "Tiempo Estimado:"
                            : language === "en"
                              ? "Estimated Time:"
                              : "Tempo Estimado:"}
                        </p>
                        <p className="text-xl font-bold text-chart-1">{remediationResult.time}</p>
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
