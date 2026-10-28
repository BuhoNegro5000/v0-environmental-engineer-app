"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"
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
  const [influentBOD, setInfluentBOD] = useState("") // Corrected variable name
  const [reactorResults, setReactorResults] = useState<{
    volume: number
    hrt: number
    srt: number
    dimensions: { length: number; width: number; depth: number }
    formula: string
  } | null>(null)

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
          { item: "Instrumentación", percentage: 10 },
          { item: "Ingeniería y Supervisión", percentage: 15 },
        ],
        opexItems: [
          { item: "Energía Eléctrica", percentage: 40 },
          { item: "Personal", percentage: 30 },
          { item: "Químicos", percentage: 15 },
          { item: "Mantenimiento", percentage: 10 },
          { item: "Análisis de Laboratorio", percentage: 5 },
        ],
      },
      "wwtp-physical-chemical": {
        capexPerM3: 600,
        opexPerM3Day: 0.25,
        capexItems: [
          { item: "Construcción Civil", percentage: 30 },
          { item: "Equipos Mecánicos", percentage: 30 },
          { item: "Tanques y Reactores", percentage: 20 },
          { item: "Instrumentación", percentage: 10 },
          { item: "Ingeniería", percentage: 10 },
        ],
        opexItems: [
          { item: "Químicos (Coagulantes)", percentage: 45 },
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
          { item: "Equipos de Filtración", percentage: 25 },
          { item: "Sistema de Dosificación", percentage: 15 },
          { item: "Instrumentación", percentage: 10 },
          { item: "Ingeniería", percentage: 10 },
        ],
        opexItems: [
          { item: "Químicos (Cloro, Alumbre)", percentage: 35 },
          { item: "Energía Eléctrica", percentage: 30 },
          { item: "Personal", percentage: 25 },
          { item: "Mantenimiento", percentage: 7 },
          { item: "Análisis", percentage: 3 },
        ],
      },
      "mbr-system": {
        capexPerM3: 1200,
        opexPerM3Day: 0.3,
        capexItems: [
          { item: "Membranas", percentage: 35 },
          { item: "Construcción Civil", percentage: 25 },
          { item: "Equipos Mecánicos", percentage: 20 },
          { item: "Instrumentación", percentage: 12 },
          { item: "Ingeniería", percentage: 8 },
        ],
        opexItems: [
          { item: "Energía Eléctrica", percentage: 45 },
          { item: "Reemplazo de Membranas", percentage: 25 },
          { item: "Personal", percentage: 15 },
          { item: "Químicos de Limpieza", percentage: 10 },
          { item: "Mantenimiento", percentage: 5 },
        ],
      },
    }

    const system = systems[treatmentSystem]
    const dailyFlow = flow * 24 // m³/day
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
    const flow = Number.parseFloat(designFlow)
    const bod = Number.parseFloat(influentBOD)
    if (isNaN(flow) || isNaN(bod)) return

    const reactorData: Record<
      string,
      {
        hrt: number
        srt: number
        volumetricLoading: number
        depthRange: [number, number]
        formula: string
      }
    > = {
      "activated-sludge": {
        hrt: 8,
        srt: 15,
        volumetricLoading: 0.4,
        depthRange: [4, 5],
        formula: "V = Q × HRT, donde HRT = 6-8 horas para carga media",
      },
      "extended-aeration": {
        hrt: 24,
        srt: 25,
        volumetricLoading: 0.15,
        depthRange: [4, 5],
        formula: "V = Q × HRT, donde HRT = 18-36 horas",
      },
      uasb: {
        hrt: 8,
        srt: 30,
        volumetricLoading: 4.0,
        depthRange: [4, 6],
        formula: "V = Q × HRT, COV = 4-6 kg DQO/m³·día",
      },
      "trickling-filter": {
        hrt: 0.5,
        srt: 0,
        volumetricLoading: 0.8,
        depthRange: [1.8, 2.5],
        formula: "V = Q × BOD / Carga Volumétrica, CV = 0.4-1.0 kg BOD/m³·día",
      },
      lagoon: {
        hrt: 480,
        srt: 20,
        volumetricLoading: 0.05,
        depthRange: [1.5, 2.0],
        formula: "V = Q × HRT, donde HRT = 20-40 días, profundidad 1.5-2.0 m",
      },
    }

    const data = reactorData[reactorType]
    const volume = flow * data.hrt // m³
    const depth = (data.depthRange[0] + data.depthRange[1]) / 2
    const area = volume / depth
    const length = Math.sqrt(area * 2)
    const width = area / length

    setReactorResults({
      volume,
      hrt: data.hrt,
      srt: data.srt,
      dimensions: { length, width, depth },
      formula: data.formula,
    })
  }

  const calculateSolarPanels = () => {
    const consumption = Number.parseFloat(energyConsumption)
    const hours = Number.parseFloat(sunHours)
    if (isNaN(consumption) || isNaN(hours)) return

    const panelWattage = 400 // W per panel (modern panels)
    const systemEfficiency = 0.8 // 80% efficiency
    const dailyProduction = panelWattage * hours * systemEfficiency // Wh per panel per day
    const monthlyConsumption = consumption // kWh/month
    const dailyConsumption = (monthlyConsumption * 1000) / 30 // Wh/day

    const panelsNeeded = Math.ceil(dailyConsumption / dailyProduction)
    const systemCapacity = (panelsNeeded * panelWattage) / 1000 // kW
    const panelArea = 2.0 // m² per 400W panel
    const totalArea = panelsNeeded * panelArea

    const costPerWatt = 1.5 // USD per watt installed
    const totalCost = systemCapacity * 1000 * costPerWatt

    const electricityRate = 0.12 // USD per kWh
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
        formula: "Masa (kg) = (V × C) / (Pureza × 1000), donde C en mg/L",
      },
      alum: {
        density: 1.33,
        purity: 0.17,
        formula: "Masa (kg) = (V × C) / 1000, Volumen (L) = Masa / Densidad",
      },
      polymer: {
        density: 1.0,
        purity: 0.5,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000)",
      },
      lime: {
        density: 2.2,
        purity: 0.9,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000)",
      },
      "ferric-chloride": {
        density: 1.42,
        purity: 0.4,
        formula: "Masa (kg) = (V × C) / (Pureza × 1000)",
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
          {language === "es"
            ? "Herramientas Prácticas"
            : language === "en"
              ? "Practical Tools"
              : "Ferramentas Práticas"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "es"
            ? "Calculadoras profesionales con fórmulas validadas"
            : language === "en"
              ? "Professional calculators with validated formulas"
              : "Calculadoras profissionais com fórmulas validadas"}
        </p>
      </div>

      <Tabs defaultValue="treatment-costs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1 h-auto p-1">
          <TabsTrigger value="treatment-costs" className="min-h-[44px] text-xs">
            <Calculator className="h-4 w-4 mr-1" />
            {language === "es" ? "Costos" : "Costs"}
          </TabsTrigger>
          <TabsTrigger value="reactor" className="min-h-[44px] text-xs">
            <Beaker className="h-4 w-4 mr-1" />
            {language === "es" ? "Reactores" : "Reactors"}
          </TabsTrigger>
          <TabsTrigger value="solar" className="min-h-[44px] text-xs">
            <Sun className="h-4 w-4 mr-1" />
            {language === "es" ? "Solar" : "Solar"}
          </TabsTrigger>
          <TabsTrigger value="dosing" className="min-h-[44px] text-xs">
            <Droplets className="h-4 w-4 mr-1" />
            {language === "es" ? "Dosificación" : "Dosing"}
          </TabsTrigger>
          <TabsTrigger value="methodologies" className="min-h-[44px] text-xs">
            <Leaf className="h-4 w-4 mr-1" />
            {language === "es" ? "Metodologías" : "Methods"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treatment-costs">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "es"
                  ? "Calculadora de Costos de Tratamiento (CAPEX/OPEX)"
                  : "Treatment Cost Calculator (CAPEX/OPEX)"}
              </CardTitle>
              <CardDescription>
                {language === "es"
                  ? "Estima costos de inversión (CAPEX) y operación (OPEX) de sistemas de tratamiento"
                  : "Estimate capital (CAPEX) and operating (OPEX) costs of treatment systems"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Definiciones:</p>
                  <p className="text-xs text-blue-700">
                    <strong>CAPEX:</strong> Gastos de capital (inversión inicial en construcción y equipos)
                    <br />
                    <strong>OPEX:</strong> Gastos operativos (costos anuales de operación y mantenimiento)
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="treatment-system">
                  {language === "es" ? "Sistema de Tratamiento" : "Treatment System"}
                </Label>
                <Select value={treatmentSystem} onValueChange={setTreatmentSystem}>
                  <SelectTrigger id="treatment-system" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wwtp-biological">
                      {language === "es" ? "PTAR Biológica (Lodos Activados)" : "WWTP Biological (Activated Sludge)"}
                    </SelectItem>
                    <SelectItem value="wwtp-physical-chemical">
                      {language === "es" ? "PTAR Físico-Química" : "WWTP Physical-Chemical"}
                    </SelectItem>
                    <SelectItem value="dwtp-conventional">
                      {language === "es" ? "PTAP Convencional" : "DWTP Conventional"}
                    </SelectItem>
                    <SelectItem value="mbr-system">
                      {language === "es" ? "Sistema MBR (Biorreactor de Membrana)" : "MBR System (Membrane Bioreactor)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow-rate">
                  {language === "es" ? "Caudal de Diseño (m³/h)" : "Design Flow (m³/h)"}
                </Label>
                <Input
                  id="flow-rate"
                  type="number"
                  step="0.1"
                  placeholder="10"
                  value={flowRate}
                  onChange={(e) => {
                    setFlowRate(e.target.value)
                    setTreatmentCosts(null)
                  }}
                  className="h-12"
                />
              </div>

              <Button onClick={calculateTreatmentCosts} className="w-full h-12">
                {language === "es" ? "Calcular Costos" : "Calculate Costs"}
              </Button>

              {treatmentCosts && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">CAPEX (Inversión Inicial):</p>
                      <p className="text-2xl font-bold text-green-700">${treatmentCosts.capex.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-muted-foreground mb-1">OPEX (Anual):</p>
                      <p className="text-2xl font-bold text-orange-700">${treatmentCosts.opex.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Desglose CAPEX:</h4>
                      {treatmentCosts.capexBreakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.item}:</span>
                          <span className="font-medium">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Desglose OPEX (Anual):</h4>
                      {treatmentCosts.opexBreakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.item}:</span>
                          <span className="font-medium">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reactor">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "es" ? "Dimensionamiento de Reactores Biológicos" : "Biological Reactor Sizing"}
              </CardTitle>
              <CardDescription>
                {language === "es"
                  ? "Calcula dimensiones usando fórmulas de ingeniería validadas"
                  : "Calculate dimensions using validated engineering formulas"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reactor-type">{language === "es" ? "Tipo de Reactor" : "Reactor Type"}</Label>
                <Select value={reactorType} onValueChange={setReactorType}>
                  <SelectTrigger id="reactor-type" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activated-sludge">
                      {language === "es" ? "Lodos Activados (Convencional)" : "Activated Sludge (Conventional)"}
                    </SelectItem>
                    <SelectItem value="extended-aeration">
                      {language === "es" ? "Aireación Extendida" : "Extended Aeration"}
                    </SelectItem>
                    <SelectItem value="uasb">UASB (Anaerobio)</SelectItem>
                    <SelectItem value="trickling-filter">
                      {language === "es" ? "Filtro Percolador" : "Trickling Filter"}
                    </SelectItem>
                    <SelectItem value="lagoon">
                      {language === "es" ? "Laguna de Estabilización" : "Stabilization Lagoon"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="design-flow">
                  {language === "es" ? "Caudal de Diseño (m³/h)" : "Design Flow (m³/h)"}
                </Label>
                <Input
                  id="design-flow"
                  type="number"
                  step="0.1"
                  placeholder="10"
                  value={designFlow}
                  onChange={(e) => {
                    setDesignFlow(e.target.value)
                    setReactorResults(null)
                  }}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="influent-bod">
                  {language === "es" ? "DBO Afluente (mg/L)" : "Influent BOD (mg/L)"}
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
                  }}
                  className="h-12"
                />
              </div>

              <Button onClick={calculateReactorSize} className="w-full h-12">
                {language === "es" ? "Calcular Dimensiones" : "Calculate Dimensions"}
              </Button>

              {reactorResults && (
                <div className="space-y-4 mt-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Fórmula Utilizada:</p>
                      <p className="text-xs text-blue-700 font-mono">{reactorResults.formula}</p>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Volumen Total:</p>
                      <p className="text-2xl font-bold text-primary">{reactorResults.volume.toFixed(1)} m³</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <p className="text-sm text-muted-foreground mb-1">TRH (Tiempo Retención Hidráulica):</p>
                      <p className="text-2xl font-bold text-secondary">{reactorResults.hrt.toFixed(1)} h</p>
                    </div>
                  </div>

                  {reactorResults.srt > 0 && (
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm text-muted-foreground mb-1">TRS (Tiempo Retención de Sólidos):</p>
                      <p className="text-xl font-bold text-accent">{reactorResults.srt.toFixed(1)} días</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Dimensiones Recomendadas:</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-3 bg-muted rounded">
                        <p className="text-muted-foreground text-xs">Largo:</p>
                        <p className="font-semibold">{reactorResults.dimensions.length.toFixed(1)} m</p>
                      </div>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-muted-foreground text-xs">Ancho:</p>
                        <p className="font-semibold">{reactorResults.dimensions.width.toFixed(1)} m</p>
                      </div>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-muted-foreground text-xs">Profundidad:</p>
                        <p className="font-semibold">{reactorResults.dimensions.depth.toFixed(1)} m</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solar">
          <Card>
            <CardHeader>
              <CardTitle>{language === "es" ? "Calculadora de Paneles Solares" : "Solar Panel Calculator"}</CardTitle>
              <CardDescription>
                {language === "es"
                  ? "Dimensiona sistemas fotovoltaicos para instalaciones ambientales"
                  : "Size photovoltaic systems for environmental facilities"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-50 border-yellow-200">
                <Sun className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold text-yellow-900 mb-1">Fórmula:</p>
                  <p className="text-xs text-yellow-700 font-mono">
                    N° Paneles = (Consumo Diario Wh) / (Potencia Panel × Horas Sol × Eficiencia)
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="energy-consumption">
                  {language === "es" ? "Consumo Mensual (kWh/mes)" : "Monthly Consumption (kWh/month)"}
                </Label>
                <Input
                  id="energy-consumption"
                  type="number"
                  step="1"
                  placeholder="500"
                  value={energyConsumption}
                  onChange={(e) => {
                    setEnergyConsumption(e.target.value)
                    setSolarResults(null)
                  }}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sun-hours">
                  {language === "es" ? "Horas Sol Pico (HSP/día)" : "Peak Sun Hours (PSH/day)"}
                </Label>
                <Input
                  id="sun-hours"
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  value={sunHours}
                  onChange={(e) => {
                    setSunHours(e.target.value)
                    setSolarResults(null)
                  }}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  {language === "es"
                    ? "Perú: 4.5-6.5 HSP | México: 5.0-6.0 HSP | Colombia: 4.0-5.0 HSP"
                    : "Peru: 4.5-6.5 PSH | Mexico: 5.0-6.0 PSH | Colombia: 4.0-5.0 PSH"}
                </p>
              </div>

              <Button onClick={calculateSolarPanels} className="w-full h-12">
                {language === "es" ? "Calcular Sistema Solar" : "Calculate Solar System"}
              </Button>

              {solarResults && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-muted-foreground mb-1">Paneles Necesarios:</p>
                      <p className="text-2xl font-bold text-yellow-700">{solarResults.panels} unidades</p>
                      <p className="text-xs text-muted-foreground mt-1">Paneles de 400W</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-muted-foreground mb-1">Capacidad Total:</p>
                      <p className="text-2xl font-bold text-orange-700">{solarResults.capacity.toFixed(2)} kW</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">Área Requerida:</p>
                      <p className="text-xl font-bold text-green-700">{solarResults.area.toFixed(1)} m²</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-muted-foreground mb-1">Inversión Estimada:</p>
                      <p className="text-xl font-bold text-blue-700">${solarResults.cost.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ahorro Anual Estimado:</p>
                    <p className="text-2xl font-bold text-primary">${solarResults.savings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Retorno de Inversión: {(solarResults.cost / solarResults.savings).toFixed(1)} años
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dosing">
          <Card>
            <CardHeader>
              <CardTitle>{language === "es" ? "Cálculo de Dosis de Químicos" : "Chemical Dosing Calculator"}</CardTitle>
              <CardDescription>
                {language === "es"
                  ? "Calcula dosis precisas de químicos para tratamiento"
                  : "Calculate precise chemical doses for treatment"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chemical-type">{language === "es" ? "Tipo de Químico" : "Chemical Type"}</Label>
                <Select value={chemicalType} onValueChange={setChemicalType}>
                  <SelectTrigger id="chemical-type" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chlorine">
                      {language === "es" ? "Cloro (Hipoclorito)" : "Chlorine (Hypochlorite)"}
                    </SelectItem>
                    <SelectItem value="alum">
                      {language === "es" ? "Alumbre (Sulfato de Aluminio)" : "Alum (Aluminum Sulfate)"}
                    </SelectItem>
                    <SelectItem value="polymer">
                      {language === "es" ? "Polímero (Floculante)" : "Polymer (Flocculant)"}
                    </SelectItem>
                    <SelectItem value="lime">
                      {language === "es" ? "Cal (Hidróxido de Calcio)" : "Lime (Calcium Hydroxide)"}
                    </SelectItem>
                    <SelectItem value="ferric-chloride">
                      {language === "es" ? "Cloruro Férrico" : "Ferric Chloride"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="water-volume">{language === "es" ? "Volumen de Agua (m³)" : "Water Volume (m³)"}</Label>
                <Input
                  id="water-volume"
                  type="number"
                  step="0.1"
                  placeholder="1000"
                  value={waterVolume}
                  onChange={(e) => {
                    setWaterVolume(e.target.value)
                    setChemicalDose(null)
                  }}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-concentration">
                  {language === "es" ? "Concentración Objetivo (mg/L)" : "Target Concentration (mg/L)"}
                </Label>
                <Input
                  id="target-concentration"
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  value={targetConcentration}
                  onChange={(e) => {
                    setTargetConcentration(e.target.value)
                    setChemicalDose(null)
                  }}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  {language === "es"
                    ? "Cloro: 1-3 mg/L | Alumbre: 20-50 mg/L | Polímero: 0.5-2 mg/L"
                    : "Chlorine: 1-3 mg/L | Alum: 20-50 mg/L | Polymer: 0.5-2 mg/L"}
                </p>
              </div>

              <Button onClick={calculateChemicalDosing} className="w-full h-12">
                {language === "es" ? "Calcular Dosis" : "Calculate Dose"}
              </Button>

              {chemicalDose && (
                <div className="space-y-4 mt-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Fórmula Utilizada:</p>
                      <p className="text-xs text-blue-700 font-mono">{chemicalDose.formula}</p>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Masa Requerida:</p>
                      <p className="text-2xl font-bold text-primary">{chemicalDose.mass.toFixed(2)} kg</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <p className="text-sm text-muted-foreground mb-1">Volumen de Solución:</p>
                      <p className="text-2xl font-bold text-secondary">{chemicalDose.volume.toFixed(2)} L</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methodologies">
          <MethodologiesModule />
        </TabsContent>
      </Tabs>
    </div>
  )
}
