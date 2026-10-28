"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"
import { reactorSizing, type ReactorType } from "@/lib/calc-engine"
import { Calculator, Beaker, Sun, Leaf, Droplets, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MethodologiesModule } from "@/components/methodologies-module"

export function PracticalToolsModule() {
  const { language } = useI18n()

  const [treatmentSystem, setTreatmentSystem] = useState("wwtp-biological")
  const [flowRate, setFlowRate] = useState("")
  const [treatmentCosts, setTreatmentCosts] = useState<{
    capex: number
    opex: number
    capexBreakdown: { item: string; cost: number }[]
    opexBreakdown: { item: string; cost: number }[]
  } | null>(null)

  const [reactorType, setReactorType] = useState("activated-sludge")
  const [designFlow, setDesignFlow] = useState("")
  const [influentBOD, setInfluentBOD] = useState("")
  const [reactorResults, setReactorResults] = useState<{
    volume: number
    hrt: number
    srt: number
    dimensions: { length: number; width: number; depth: number }
    formula: string
    governing: string
    loadKgPerDay: number
    appliedLoadKgM3d: number
    warnings: string[]
  } | null>(null)
  const [reactorErrors, setReactorErrors] = useState<string[]>([])

  const [energyConsumption, setEnergyConsumption] = useState("")
  const [sunHours, setSunHours] = useState("")
  const [solarResults, setSolarResults] = useState<{
    panels: number
    capacity: number
    area: number
    cost: number
    savings: number
  } | null>(null)

  const [chemicalType, setChemicalType] = useState("chlorine")
  const [waterVolume, setWaterVolume] = useState("")
  const [targetConcentration, setTargetConcentration] = useState("")
  const [chemicalDose, setChemicalDose] = useState<{ mass: number; volume: number; formula: string } | null>(null)

  const calculateTreatmentCosts = () => {
    const flow = Number.parseFloat(flowRate)
    if (isNaN(flow)) return

    const systems: Record<
      string,
      {
        capexPerM3: number
        opexPerM3Day: number
        capexItems: { item: string; percentage: number }[]
        opexItems: { item: string; percentage: number }[]
      }
    > = {
      "wwtp-biological": {
        capexPerM3: 800,
        opexPerM3Day: 0.15,
        capexItems: [
          { item: "Construcción Civil", percentage: 35 },
          { item: "Equipos Mecánicos", percentage: 25 },
          { item: "Equipos Eléctricos", percentage: 15 },
          { item: "Instrumentación y Control", percentage: 10 },
          { item: "Ingeniería y Supervisión", percentage: 15 },
        ],
        opexItems: [
          { item: "Energía Eléctrica (Sopladores)", percentage: 40 },
          { item: "Personal de Operación", percentage: 30 },
          { item: "Químicos y Desinfección", percentage: 15 },
          { item: "Mantenimiento Electromecánico", percentage: 10 },
          { item: "Análisis de Laboratorio", percentage: 5 },
        ],
      },
      "wwtp-physical-chemical": {
        capexPerM3: 600,
        opexPerM3Day: 0.25,
        capexItems: [
          { item: "Construcción Civil", percentage: 30 },
          { item: "Equipos Mecánicos (Floculadores, Clarificadores)", percentage: 30 },
          { item: "Tanques y Reactores", percentage: 20 },
          { item: "Instrumentación", percentage: 10 },
          { item: "Ingeniería", percentage: 10 },
        ],
        opexItems: [
          { item: "Químicos (Coagulantes y Polímeros)", percentage: 45 },
          { item: "Energía Eléctrica", percentage: 25 },
          { item: "Personal", percentage: 20 },
          { item: "Mantenimiento", percentage: 7 },
          { item: "Disposición de Lodos", percentage: 3 },
        ],
      },
      "dwtp-conventional": {
        capexPerM3: 500,
        opexPerM3Day: 0.12,
        capexItems: [
          { item: "Construcción Civil", percentage: 40 },
          { item: "Equipos de Filtración y Sedimentación", percentage: 25 },
          { item: "Sistema de Dosificación Química", percentage: 15 },
          { item: "Instrumentación y Telemetría", percentage: 10 },
          { item: "Ingeniería", percentage: 10 },
        ],
        opexItems: [
          { item: "Químicos (Cloro, Sulfato de Aluminio)", percentage: 35 },
          { item: "Energía Eléctrica (Bombeo)", percentage: 30 },
          { item: "Personal", percentage: 25 },
          { item: "Mantenimiento Preventivo", percentage: 7 },
          { item: "Análisis de Calidad de Agua", percentage: 3 },
        ],
      },
      "mbr-system": {
        capexPerM3: 1200,
        opexPerM3Day: 0.3,
        capexItems: [
          { item: "Membranas de Ultrafiltración", percentage: 35 },
          { item: "Construcción Civil", percentage: 25 },
          { item: "Equipos Mecánicos y Bombas de Succión", percentage: 20 },
          { item: "Instrumentación y PLC", percentage: 12 },
          { item: "Ingeniería", percentage: 8 },
        ],
        opexItems: [
          { item: "Energía Eléctrica (Aireación de Membrana)", percentage: 45 },
          { item: "Amortización y Reemplazo de Membranas", percentage: 25 },
          { item: "Personal", percentage: 15 },
          { item: "Químicos de Limpieza CIP (Ácido / Hipoclorito)", percentage: 10 },
          { item: "Mantenimiento", percentage: 5 },
        ],
      },
    }

    const system = systems[treatmentSystem]
    const dailyFlow = flow * 24 // m³/día
    const capex = dailyFlow * system.capexPerM3
    const opexDaily = dailyFlow * system.opexPerM3Day
    const opexAnnual = opexDaily * 365

    const capexBreakdown = system.capexItems.map((item) => ({
      item: item.item,
      cost: (capex * item.percentage) / 100,
    }))

    const opexBreakdown = system.opexItems.map((item) => ({
      item: item.item,
      cost: (opexAnnual * item.percentage) / 100,
    }))

    setTreatmentCosts({
      capex,
      opex: opexAnnual,
      capexBreakdown,
      opexBreakdown,
    })
  }

  const calculateReactorSize = () => {
    const r = reactorSizing({
      type: reactorType as ReactorType,
      flowM3h: Number.parseFloat(designFlow),
      influentMgL: Number.parseFloat(influentBOD),
    })
    setReactorErrors(r.errors)
    if (!r.ok || !r.value) {
      setReactorResults(null)
      return
    }
    setReactorResults({
      volume: r.value.volume,
      hrt: r.value.hrt,
      srt: r.value.srt,
      dimensions: r.value.dimensions,
      formula: r.value.formula,
      governing: r.value.governing,
      loadKgPerDay: r.value.loadKgPerDay,
      appliedLoadKgM3d: r.value.appliedLoadKgM3d,
      warnings: r.warnings,
    })
  }

  const calculateSolarPanels = () => {
    const consumption = Number.parseFloat(energyConsumption)
    const hours = Number.parseFloat(sunHours)
    if (isNaN(consumption) || isNaN(hours)) return

    const panelWattage = 400 // W por panel monocristalino moderno
    const systemEfficiency = 0.8 // 80% rendimiento global (PR)
    const dailyProduction = panelWattage * hours * systemEfficiency // Wh por panel al día
    const monthlyConsumption = consumption // kWh/mes
    const dailyConsumption = (monthlyConsumption * 1000) / 30 // Wh/día

    const panelsNeeded = Math.ceil(dailyConsumption / dailyProduction)
    const systemCapacity = (panelsNeeded * panelWattage) / 1000 // kWp
    const panelArea = 2.0 // m² por panel de 400W
    const totalArea = panelsNeeded * panelArea

    const costPerWatt = 1.35 // USD por vatio instalado promedio
    const totalCost = systemCapacity * 1000 * costPerWatt

    const electricityRate = 0.18 // USD por kWh (tarifa promedio industrial/comercial)
    const annualSavings = monthlyConsumption * 12 * electricityRate

    setSolarResults({
      panels: panelsNeeded,
      capacity: systemCapacity,
      area: totalArea,
      cost: totalCost,
      savings: annualSavings,
    })
  }

  const calculateChemicalDosing = () => {
    const volume = Number.parseFloat(waterVolume)
    const concentration = Number.parseFloat(targetConcentration)
    if (isNaN(volume) || isNaN(concentration)) return

    const chemicals: Record<string, { density: number; purity: number; formula: string }> = {
      chlorine: {
        density: 1.0,
        purity: 0.12,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000) ; Hipoclorito de Sodio 12%",
      },
      alum: {
        density: 1.33,
        purity: 0.48, // Alumbre líquido comercial ~48% o sulfato de aluminio
        formula: "Masa (kg) = (V × C) / (Pureza × 1000) ; V_solución (L) = Masa / Densidad",
      },
      polymer: {
        density: 1.0,
        purity: 0.5,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000) ; Polímero floculante",
      },
      lime: {
        density: 2.2,
        purity: 0.9,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000) ; Cal hidratada Ca(OH)₂",
      },
      "ferric-chloride": {
        density: 1.42,
        purity: 0.4,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000) ; Cloruro férrico 40%",
      },
    }

    const chemical = chemicals[chemicalType]
    const massKg = (volume * concentration) / (chemical.purity * 1000)
    const volumeL = massKg / chemical.density

    setChemicalDose({
      mass: massKg,
      volume: volumeL,
      formula: chemical.formula,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {language === "es" ? "Herramientas Prácticas de Ingeniería" : "Practical Engineering Tools"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "es"
            ? "Dimensionamiento de reactores, estimación de costos CAPEX/OPEX, energía solar y dosificación química"
            : "Reactor sizing, CAPEX/OPEX cost estimation, solar energy, and chemical dosing"}
        </p>
      </div>

      <Tabs defaultValue="treatment-costs" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto gap-1 p-1">
          <TabsTrigger value="treatment-costs" className="min-h-[44px] text-xs">
            <Calculator className="h-4 w-4 mr-1" />
            Costos Planta
          </TabsTrigger>
          <TabsTrigger value="reactor" className="min-h-[44px] text-xs">
            <Beaker className="h-4 w-4 mr-1" />
            Reactores
          </TabsTrigger>
          <TabsTrigger value="solar" className="min-h-[44px] text-xs">
            <Sun className="h-4 w-4 mr-1" />
            Solar
          </TabsTrigger>
          <TabsTrigger value="dosing" className="min-h-[44px] text-xs">
            <Droplets className="h-4 w-4 mr-1" />
            Dosificación
          </TabsTrigger>
          <TabsTrigger value="methodologies" className="min-h-[44px] text-xs">
            <Leaf className="h-4 w-4 mr-1" />
            Metodologías
          </TabsTrigger>
        </TabsList>

        {/* TAB COSTOS */}
        <TabsContent value="treatment-costs">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de Costos de Tratamiento de Aguas (CAPEX / OPEX)</CardTitle>
              <CardDescription>
                Estima costos de inversión inicial (CAPEX) y operación y mantenimiento anual (OPEX) según capacidad instalada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-900">
                  <strong>CAPEX:</strong> Gasto de capital en obra civil, electromecánica y puesta en marcha por m³/día de capacidad instalada.
                  <br />
                  <strong>OPEX:</strong> Costo operativo anualizado (energía, reactivos químicos, personal y lodos).
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="treatment-system">Sistema de Tratamiento</Label>
                <Select value={treatmentSystem} onValueChange={setTreatmentSystem}>
                  <SelectTrigger id="treatment-system" className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wwtp-biological">PTAR Biológica (Lodos Activados Convencionales)</SelectItem>
                    <SelectItem value="wwtp-physical-chemical">PTAR Físico-Química (Coagulación / Floculación)</SelectItem>
                    <SelectItem value="dwtp-conventional">PTAP Convencional (Agua Potable)</SelectItem>
                    <SelectItem value="mbr-system">Sistema MBR (Biorreactor de Membranas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow-rate">Caudal de Diseño Horario (m³/h)</Label>
                <Input
                  id="flow-rate"
                  type="number"
                  step="0.1"
                  placeholder="20"
                  value={flowRate}
                  onChange={(e) => {
                    setFlowRate(e.target.value)
                    setTreatmentCosts(null)
                  }}
                  className="h-12"
                />
              </div>

              <Button onClick={calculateTreatmentCosts} className="w-full h-12">Calcular Costos de Tratamiento</Button>

              {treatmentCosts && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-muted-foreground mb-1">CAPEX (Inversión Inicial Estimada):</p>
                      <p className="text-2xl font-bold text-green-700">${treatmentCosts.capex.toLocaleString()} USD</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs text-muted-foreground mb-1">OPEX (Operación Anual):</p>
                      <p className="text-2xl font-bold text-orange-700">${treatmentCosts.opex.toLocaleString()} USD/año</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold">Desglose CAPEX:</h4>
                      {treatmentCosts.capexBreakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground">{item.item}:</span>
                          <span className="font-medium">${Math.round(item.cost).toLocaleString()} USD</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold">Desglose OPEX Anual:</h4>
                      {treatmentCosts.opexBreakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground">{item.item}:</span>
                          <span className="font-medium">${Math.round(item.cost).toLocaleString()} USD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB REACTORES */}
        <TabsContent value="reactor">
          <Card>
            <CardHeader>
              <CardTitle>Dimensionamiento Preliminar de Reactores Biológicos</CardTitle>
              <CardDescription>
                Cálculo de volumen y dimensiones gobernado por Tiempo de Retención Hidráulico (TRH) o Carga Orgánica Volumétrica (COV)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reactor-type">Tipo de Biorreactor</Label>
                <Select value={reactorType} onValueChange={setReactorType}>
                  <SelectTrigger id="reactor-type" className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activated-sludge">Lodos Activados Convencionales (Carga Media)</SelectItem>
                    <SelectItem value="extended-aeration">Aireación Extendida</SelectItem>
                    <SelectItem value="uasb">Reactor Anaerobio UASB (Flujo Ascendente)</SelectItem>
                    <SelectItem value="trickling-filter">Filtro Percolador</SelectItem>
                    <SelectItem value="lagoon">Laguna Facultativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="design-flow">Caudal de Diseño (m³/h)</Label>
                  <Input
                    id="design-flow"
                    type="number"
                    step="0.1"
                    placeholder="10"
                    value={designFlow}
                    onChange={(e) => {
                      setDesignFlow(e.target.value)
                      setReactorResults(null)
                      setReactorErrors([])
                    }}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="influent-bod">
                    {reactorType === "uasb" ? "DQO Afluente (mg/L)" : "DBO₅ Afluente (mg/L)"}
                  </Label>
                  <Input
                    id="influent-bod"
                    type="number"
                    step="1"
                    placeholder="250"
                    value={influentBOD}
                    onChange={(e) => {
                      setInfluentBOD(e.target.value)
                      setReactorResults(null)
                      setReactorErrors([])
                    }}
                    className="h-12"
                  />
                </div>
              </div>

              <Button onClick={calculateReactorSize} className="w-full h-12">Calcular Dimensiones de Biorreactor</Button>

              {reactorErrors.length > 0 && (
                <div className="space-y-2 mt-4" role="alert">
                  {reactorErrors.map((m) => (
                    <Alert key={m} variant="destructive">
                      <AlertDescription className="text-sm">{m}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {reactorResults && (
                <div className="space-y-4 mt-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-900">
                      <strong>Criterio de Dimensionamiento:</strong> {reactorResults.formula}
                    </AlertDescription>
                  </Alert>

                  <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                    <p><strong>Criterio gobernante:</strong> {reactorResults.governing.toUpperCase()}</p>
                    <p><strong>Carga orgánica afluente:</strong> {reactorResults.loadKgPerDay.toFixed(1)} kg/día</p>
                    <p><strong>Carga volumétrica aplicada:</strong> {reactorResults.appliedLoadKgM3d.toFixed(2)} kg/m³·d</p>
                  </div>

                  {reactorResults.warnings.map((w) => (
                    <Alert key={w} className="bg-yellow-50 border-yellow-200">
                      <AlertDescription className="text-xs text-yellow-900">{w}</AlertDescription>
                    </Alert>
                  ))}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">Volumen Total:</p>
                      <p className="text-xl font-bold text-primary">{Math.round(reactorResults.volume)} m³</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">TRH Efectivo:</p>
                      <p className="text-xl font-bold text-primary">{reactorResults.hrt.toFixed(1)} horas</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">Edad de Lodo (SRT):</p>
                      <p className="text-xl font-bold text-primary">{reactorResults.srt} días</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/60 rounded-lg border space-y-2">
                    <h4 className="font-semibold text-sm">Dimensiones Geométricas Sugeridas (L:W ≈ 2:1):</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-background rounded">
                        <span className="text-muted-foreground block">Largo:</span>
                        <span className="font-bold text-base">{reactorResults.dimensions.length.toFixed(1)} m</span>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <span className="text-muted-foreground block">Ancho:</span>
                        <span className="font-bold text-base">{reactorResults.dimensions.width.toFixed(1)} m</span>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <span className="text-muted-foreground block">Profundidad:</span>
                        <span className="font-bold text-base">{reactorResults.dimensions.depth.toFixed(1)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB SOLAR */}
        <TabsContent value="solar">
          <Card>
            <CardHeader>
              <CardTitle>Estimación de Energía Solar Fotovoltaica</CardTitle>
              <CardDescription>Dimensionamiento de paneles solares fotovoltaicos para electrificación de plantas y bombeo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="energy-consumption">Consumo Mensual de Energía (kWh/mes)</Label>
                  <Input
                    id="energy-consumption"
                    type="number"
                    step="1"
                    placeholder="1500"
                    value={energyConsumption}
                    onChange={(e) => setEnergyConsumption(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sun-hours">Horas Sol Pico (HSP promedio diario)</Label>
                  <Input
                    id="sun-hours"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={sunHours}
                    onChange={(e) => setSunHours(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <Button onClick={calculateSolarPanels} className="w-full h-12">Calcular Sistema Solar</Button>

              {solarResults && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-muted-foreground">Paneles (400W):</p>
                    <p className="text-2xl font-bold text-yellow-800">{solarResults.panels}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-muted-foreground">Potencia Pico:</p>
                    <p className="text-2xl font-bold text-yellow-800">{solarResults.capacity.toFixed(1)} kWp</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-muted-foreground">Área Requerida:</p>
                    <p className="text-2xl font-bold text-yellow-800">{solarResults.area.toFixed(0)} m²</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-muted-foreground">Ahorro Anual Estimado:</p>
                    <p className="text-2xl font-bold text-yellow-800">${Math.round(solarResults.savings).toLocaleString()} USD</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB DOSIFICACION */}
        <TabsContent value="dosing">
          <Card>
            <CardHeader>
              <CardTitle>Dosificación de Reactivos Químicos</CardTitle>
              <CardDescription>Cálculo de masa y volumen de dosificación para coagulantes, floculantes, cal y desinfectantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chemical-type">Reactivo Químico</Label>
                <Select value={chemicalType} onValueChange={setChemicalType}>
                  <SelectTrigger id="chemical-type" className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chlorine">Hipoclorito de Sodio (NaOCl ~12%)</SelectItem>
                    <SelectItem value="alum">Sulfato de Aluminio Líquido (~48%)</SelectItem>
                    <SelectItem value="polymer">Polímero Floculante Catiónico/Aniónico (50%)</SelectItem>
                    <SelectItem value="lime">Cal Hidratada Ca(OH)₂ (90%)</SelectItem>
                    <SelectItem value="ferric-chloride">Cloruro Férrico FeCl₃ (40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="water-volume">Volumen o Caudal a Tratar (m³)</Label>
                  <Input
                    id="water-volume"
                    type="number"
                    step="0.1"
                    placeholder="1000"
                    value={waterVolume}
                    onChange={(e) => setWaterVolume(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-concentration">Dosis Objetivo del Reactivo (mg/L o ppm)</Label>
                  <Input
                    id="target-concentration"
                    type="number"
                    step="0.1"
                    placeholder="25"
                    value={targetConcentration}
                    onChange={(e) => setTargetConcentration(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <Button onClick={calculateChemicalDosing} className="w-full h-12">Calcular Dosificación Requerida</Button>

              {chemicalDose && (
                <div className="p-4 bg-muted/60 rounded-lg border space-y-2 mt-4 text-xs">
                  <p className="font-semibold text-sm">Resultado de Dosificación:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-background rounded border">
                      <span className="text-muted-foreground block">Masa de producto comercial:</span>
                      <span className="text-2xl font-bold text-primary">{chemicalDose.mass.toFixed(2)} kg</span>
                    </div>
                    <div className="p-3 bg-background rounded border">
                      <span className="text-muted-foreground block">Volumen comercial:</span>
                      <span className="text-2xl font-bold text-primary">{chemicalDose.volume.toFixed(2)} Litros</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-1 font-mono">Fórmula: {chemicalDose.formula}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB METODOLOGIAS */}
        <TabsContent value="methodologies">
          <MethodologiesModule />
        </TabsContent>
      </Tabs>
    </div>
  )
}
