"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Info, Wind } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { convertGasConcentration, STANDARD_GASES } from "@/lib/calc-engine"

export function ConverterModule() {
  const [tempValue, setTempValue] = useState("")
  const [tempFrom, setTempFrom] = useState("celsius")
  const [tempTo, setTempTo] = useState("fahrenheit")
  const [tempResult, setTempResult] = useState<number | null>(null)

  const [pressureValue, setPressureValue] = useState("")
  const [pressureFrom, setPressureFrom] = useState("pa")
  const [pressureTo, setPressureTo] = useState("bar")
  const [pressureResult, setPressureResult] = useState<number | null>(null)

  const [volumeValue, setVolumeValue] = useState("")
  const [volumeFrom, setVolumeFrom] = useState("l")
  const [volumeTo, setVolumeTo] = useState("m3")
  const [volumeResult, setVolumeResult] = useState<number | null>(null)

  const [waterValue, setWaterValue] = useState("")
  const [waterFrom, setWaterFrom] = useState("mgl")
  const [waterTo, setWaterTo] = useState("ppm")
  const [waterResult, setWaterResult] = useState<number | null>(null)

  const [turbidityValue, setTurbidityValue] = useState("")
  const [turbidityFrom, setTurbidityFrom] = useState("ntu")
  const [turbidityTo, setTurbidityTo] = useState("fnu")
  const [turbidityResult, setTurbidityResult] = useState<number | null>(null)

  const [flowValue, setFlowValue] = useState("")
  const [flowFrom, setFlowFrom] = useState("m3s")
  const [flowTo, setFlowTo] = useState("ls")
  const [flowResult, setFlowResult] = useState<number | null>(null)

  const [conductivityValue, setConductivityValue] = useState("")
  const [conductivityFrom, setConductivityFrom] = useState("uscm")
  const [conductivityTo, setConductivityTo] = useState("mscm")
  const [conductivityResult, setConductivityResult] = useState<number | null>(null)

  // Gases del aire (ppm <-> mg/m3)
  const [gasValue, setGasValue] = useState("")
  const [gasKey, setGasKey] = useState("co")
  const [gasFrom, setGasFrom] = useState<"ppm" | "ppb" | "mg_m3" | "ug_m3">("ppm")
  const [gasTo, setGasTo] = useState<"ppm" | "ppb" | "mg_m3" | "ug_m3">("mg_m3")
  const [gasTemp, setGasTemp] = useState("25")
  const [gasPressure, setGasPressure] = useState("1.0")
  const [customMw, setCustomMw] = useState("28.01")
  const [gasResult, setGasResult] = useState<{ result: number; molarVolumeL: number } | null>(null)

  const convertTemperature = () => {
    const value = Number.parseFloat(tempValue)
    if (isNaN(value)) return

    let celsius = value
    if (tempFrom === "fahrenheit") celsius = ((value - 32) * 5) / 9
    if (tempFrom === "kelvin") celsius = value - 273.15

    let result = celsius
    if (tempTo === "fahrenheit") result = (celsius * 9) / 5 + 32
    if (tempTo === "kelvin") result = celsius + 273.15

    setTempResult(result)
  }

  const convertPressure = () => {
    const value = Number.parseFloat(pressureValue)
    if (isNaN(value)) return

    const toPa: Record<string, number> = {
      pa: 1,
      bar: 100000,
      psi: 6894.76,
      atm: 101325,
      mmhg: 133.322,
    }

    const pascals = value * toPa[pressureFrom]
    const result = pascals / toPa[pressureTo]
    setPressureResult(result)
  }

  const convertVolume = () => {
    const value = Number.parseFloat(volumeValue)
    if (isNaN(value)) return

    const toL: Record<string, number> = {
      l: 1,
      m3: 1000,
      gal: 3.78541,
      ft3: 28.3168,
      barrel: 158.987, // Barril de petróleo estándar
    }

    const liters = value * toL[volumeFrom]
    const result = liters / toL[volumeTo]
    setVolumeResult(result)
  }

  const convertWaterQuality = () => {
    const value = Number.parseFloat(waterValue)
    if (isNaN(value)) return

    // Unidades exclusivamente de concentración de masa en disolución acuosa
    const toMgL: Record<string, number> = {
      mgl: 1,
      ppm: 1, // 1 mg/L ≈ 1 ppm para agua con densidad 1 g/cm³
      ugl: 0.001,
      ppb: 0.001, // 1 µg/L ≈ 1 ppb para agua
      gl: 1000, // g/L
      mol_l: 1, // se asume mg/L si no hay PM
    }

    const mgL = value * toMgL[waterFrom]
    const result = mgL / toMgL[waterTo]
    setWaterResult(result)
  }

  const convertTurbidity = () => {
    const value = Number.parseFloat(turbidityValue)
    if (isNaN(value)) return

    // Unidades de turbidez óptica (dispersión nephelométrica)
    // 1 NTU = 1 FNU = 1 FTU = 0.25 EBC
    const toNtu: Record<string, number> = {
      ntu: 1,
      fnu: 1,
      ftu: 1,
      ebc: 4, // 1 EBC = 4 NTU
    }

    const ntu = value * toNtu[turbidityFrom]
    const result = ntu / toNtu[turbidityTo]
    setTurbidityResult(result)
  }

  const convertFlow = () => {
    const value = Number.parseFloat(flowValue)
    if (isNaN(value)) return

    const toM3S: Record<string, number> = {
      m3s: 1,
      m3h: 1 / 3600,
      m3d: 1 / 86400,
      ls: 0.001,
      lmin: 0.001 / 60,
      gpm: 0.00006309,
      mgd: 0.0438126,
    }

    const m3s = value * toM3S[flowFrom]
    const result = m3s / toM3S[flowTo]
    setFlowResult(result)
  }

  const convertConductivity = () => {
    const value = Number.parseFloat(conductivityValue)
    if (isNaN(value)) return

    // 1 mS/cm = 1000 µS/cm = 1 dS/m
    // TDS estimado: TDS (mg/L) ≈ CE (µS/cm) × 0.64 (factor estándar para aguas continentales)
    const toUSCm: Record<string, number> = {
      uscm: 1,
      mscm: 1000,
      dsm: 1000,
      tds_mgl: 1 / 0.64, // si está en TDS, convertir a µS/cm
    }

    const usCm = value * toUSCm[conductivityFrom]
    const result = conductivityTo === "tds_mgl" ? usCm * 0.64 : usCm / toUSCm[conductivityTo]
    setConductivityResult(result)
  }

  const convertGas = () => {
    const val = Number.parseFloat(gasValue)
    if (isNaN(val)) return

    const t = Number.parseFloat(gasTemp) || 25
    const p = Number.parseFloat(gasPressure) || 1.0
    const mw = Number.parseFloat(customMw) || 28.01

    const r = convertGasConcentration({
      value: val,
      fromUnit: gasFrom,
      toUnit: gasTo,
      gasKey,
      customMolecularWeight: mw,
      temperatureC: t,
      pressureAtm: p,
    })

    if (r.ok && r.value) {
      setGasResult(r.value)
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-xl font-semibold text-foreground mb-2">Conversor de Unidades Ambientales</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Conversiones fisicoquímicas validadas: gases según ley de gases ideales, concentraciones de agua, turbidez y caudales
        </p>
      </div>

      <Tabs defaultValue="gases" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full justify-start h-auto gap-2 p-2">
            <TabsTrigger value="gases" className="min-h-[44px] text-sm whitespace-nowrap px-4 font-semibold text-primary">
              <Wind className="h-4 w-4 mr-1" />
              Gases del Aire (ppm ⟷ mg/m³)
            </TabsTrigger>
            <TabsTrigger value="water" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Concentración Agua
            </TabsTrigger>
            <TabsTrigger value="turbidity" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Turbidez (NTU/FNU)
            </TabsTrigger>
            <TabsTrigger value="flow" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Caudal
            </TabsTrigger>
            <TabsTrigger value="conductivity" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Conductividad y TDS
            </TabsTrigger>
            <TabsTrigger value="volume" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Volumen
            </TabsTrigger>
            <TabsTrigger value="pressure" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Presión
            </TabsTrigger>
            <TabsTrigger value="temperature" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Temperatura
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB GASES DEL AIRE */}
        <TabsContent value="gases" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversor de Gases de Calidad del Aire (Ley de Gases Ideales)</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Convierte entre ppm, ppb, mg/m³ y µg/m³ corrigiendo por temperatura y presión atmosférica según EPA 40 CFR 50
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                <strong>Ecuación Físicoquímica:</strong> C(mg/m³) = [ppm × Peso_Molecular] / V_molar
                <br />
                A 25 °C y 1 atm, el volumen molar de un gas ideal es <strong>24.465 L/mol</strong>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contaminante / Gas</Label>
                  <Select value={gasKey} onValueChange={(v) => { setGasKey(v); setGasResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(STANDARD_GASES).map((g) => (
                        <SelectItem key={g.id} value={g.id}>{g.name} ({g.molecularWeight} g/mol)</SelectItem>
                      ))}
                      <SelectItem value="custom">Personalizado (Ingresar peso molecular)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Temperatura (°C)</Label>
                  <Input type="number" step="0.1" value={gasTemp} onChange={(e) => { setGasTemp(e.target.value); setGasResult(null); }} className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Presión (atm)</Label>
                  <Input type="number" step="0.01" value={gasPressure} onChange={(e) => { setGasPressure(e.target.value); setGasResult(null); }} className="h-12" />
                </div>
              </div>

              {gasKey === "custom" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Peso Molecular del Gas (g/mol)</Label>
                  <Input type="number" step="0.01" value={customMw} onChange={(e) => { setCustomMw(e.target.value); setGasResult(null); }} className="h-12" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor a Convertir</Label>
                  <Input type="number" step="any" placeholder="100" value={gasValue} onChange={(e) => { setGasValue(e.target.value); setGasResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De Unidad</Label>
                  <Select value={gasFrom} onValueChange={(v: any) => { setGasFrom(v); setGasResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ppm">Partes por millón (ppm)</SelectItem>
                      <SelectItem value="ppb">Partes por billón (ppb)</SelectItem>
                      <SelectItem value="mg_m3">Miligramos por metro cúbico (mg/m³)</SelectItem>
                      <SelectItem value="ug_m3">Microgramos por metro cúbico (µg/m³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A Unidad</Label>
                  <Select value={gasTo} onValueChange={(v: any) => { setGasTo(v); setGasResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ppm">Partes por millón (ppm)</SelectItem>
                      <SelectItem value="ppb">Partes por billón (ppb)</SelectItem>
                      <SelectItem value="mg_m3">Miligramos por metro cúbico (mg/m³)</SelectItem>
                      <SelectItem value="ug_m3">Microgramos por metro cúbico (µg/m³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertGas} className="w-full h-12 text-base font-medium">
                Calcular Conversión de Gas
              </Button>

              {gasResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                  <p className="text-sm text-muted-foreground">Resultado Exacto:</p>
                  <p className="text-2xl font-bold text-primary">
                    {gasResult.result < 0.001 ? gasResult.result.toExponential(4) : gasResult.result.toFixed(4)} {gasTo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Volumen molar aplicado: {gasResult.molarVolumeL.toFixed(3)} L/mol a {gasTemp} °C y {gasPressure} atm
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CONCENTRACION AGUA */}
        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Concentración en Agua (Masa / Volumen)</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Conversiones de concentración química acuosa pura (sin mezclar con turbidez)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor</Label>
                  <Input type="number" step="any" placeholder="10" value={waterValue} onChange={(e) => { setWaterValue(e.target.value); setWaterResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De</Label>
                  <Select value={waterFrom} onValueChange={(v) => { setWaterFrom(v); setWaterResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mgl">mg/L (Miligramos por Litro)</SelectItem>
                      <SelectItem value="ppm">ppm (Partes por Millón acuoso)</SelectItem>
                      <SelectItem value="ugl">µg/L (Microgramos por Litro)</SelectItem>
                      <SelectItem value="ppb">ppb (Partes por Billón acuoso)</SelectItem>
                      <SelectItem value="gl">g/L (Gramos por Litro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A</Label>
                  <Select value={waterTo} onValueChange={(v) => { setWaterTo(v); setWaterResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mgl">mg/L (Miligramos por Litro)</SelectItem>
                      <SelectItem value="ppm">ppm (Partes por Millón acuoso)</SelectItem>
                      <SelectItem value="ugl">µg/L (Microgramos por Litro)</SelectItem>
                      <SelectItem value="ppb">ppb (Partes por Billón acuoso)</SelectItem>
                      <SelectItem value="gl">g/L (Gramos por Litro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertWaterQuality} className="w-full h-12 text-base font-medium">
                Convertir Concentración
              </Button>

              {waterResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{waterResult} {waterTo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB TURBIDEZ */}
        <TabsContent value="turbidity" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Turbidez Óptica del Agua</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Unidades ópticas estandarizadas según ISO 7027 y EPA 180.1 (NTU, FNU, FTU, EBC)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor de Turbidez</Label>
                  <Input type="number" step="any" placeholder="5" value={turbidityValue} onChange={(e) => { setTurbidityValue(e.target.value); setTurbidityResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De Unidad</Label>
                  <Select value={turbidityFrom} onValueChange={(v) => { setTurbidityFrom(v); setTurbidityResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ntu">NTU (Nephelometric Turbidity Unit - EPA 180.1)</SelectItem>
                      <SelectItem value="fnu">FNU (Formazin Nephelometric Unit - ISO 7027)</SelectItem>
                      <SelectItem value="ftu">FTU (Formazin Turbidity Unit)</SelectItem>
                      <SelectItem value="ebc">EBC (European Brewery Convention)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A Unidad</Label>
                  <Select value={turbidityTo} onValueChange={(v) => { setTurbidityTo(v); setTurbidityResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ntu">NTU (Nephelometric Turbidity Unit)</SelectItem>
                      <SelectItem value="fnu">FNU (Formazin Nephelometric Unit)</SelectItem>
                      <SelectItem value="ftu">FTU (Formazin Turbidity Unit)</SelectItem>
                      <SelectItem value="ebc">EBC (European Brewery Convention)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertTurbidity} className="w-full h-12 text-base font-medium">
                Convertir Turbidez
              </Button>

              {turbidityResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{turbidityResult.toFixed(2)} {turbidityTo.toUpperCase()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CONDUCTIVIDAD Y TDS */}
        <TabsContent value="conductivity" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conductividad Eléctrica y Estimación de TDS</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Convierte entre µS/cm, mS/cm, dS/m y calcula Sólidos Disueltos Totales (TDS mg/L)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor</Label>
                  <Input type="number" step="any" placeholder="1000" value={conductivityValue} onChange={(e) => { setConductivityValue(e.target.value); setConductivityResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De</Label>
                  <Select value={conductivityFrom} onValueChange={(v) => { setConductivityFrom(v); setConductivityResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uscm">µS/cm (MicroSiemens por centímetro)</SelectItem>
                      <SelectItem value="mscm">mS/cm (MiliSiemens por centímetro)</SelectItem>
                      <SelectItem value="dsm">dS/m (DeciSiemens por metro)</SelectItem>
                      <SelectItem value="tds_mgl">TDS estimado (mg/L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A</Label>
                  <Select value={conductivityTo} onValueChange={(v) => { setConductivityTo(v); setConductivityResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uscm">µS/cm (MicroSiemens por centímetro)</SelectItem>
                      <SelectItem value="mscm">mS/cm (MiliSiemens por centímetro)</SelectItem>
                      <SelectItem value="dsm">dS/m (DeciSiemens por metro)</SelectItem>
                      <SelectItem value="tds_mgl">TDS estimado (mg/L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertConductivity} className="w-full h-12 text-base font-medium">
                Calcular
              </Button>

              {conductivityResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-1">
                  <p className="text-sm text-muted-foreground">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{conductivityResult.toFixed(2)} {conductivityTo}</p>
                  <p className="text-xs text-muted-foreground pt-1">
                    Nota: La estimación estándar para aguas naturales asume TDS (mg/L) ≈ CE (µS/cm) × 0.64.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CAUDAL */}
        <TabsContent value="flow" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Caudal Volumétrico</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor</Label>
                  <Input type="number" step="any" placeholder="10" value={flowValue} onChange={(e) => { setFlowValue(e.target.value); setFlowResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De</Label>
                  <Select value={flowFrom} onValueChange={(v) => { setFlowFrom(v); setFlowResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m3s">m³/s (Metros cúbicos por segundo)</SelectItem>
                      <SelectItem value="m3h">m³/h (Metros cúbicos por hora)</SelectItem>
                      <SelectItem value="m3d">m³/d (Metros cúbicos por día)</SelectItem>
                      <SelectItem value="ls">L/s (Litros por segundo)</SelectItem>
                      <SelectItem value="lmin">L/min (Litros por minuto)</SelectItem>
                      <SelectItem value="gpm">GPM (Galones por minuto)</SelectItem>
                      <SelectItem value="mgd">MGD (Millones de galones por día)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A</Label>
                  <Select value={flowTo} onValueChange={(v) => { setFlowTo(v); setFlowResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m3s">m³/s (Metros cúbicos por segundo)</SelectItem>
                      <SelectItem value="m3h">m³/h (Metros cúbicos por hora)</SelectItem>
                      <SelectItem value="m3d">m³/d (Metros cúbicos por día)</SelectItem>
                      <SelectItem value="ls">L/s (Litros por segundo)</SelectItem>
                      <SelectItem value="lmin">L/min (Litros por minuto)</SelectItem>
                      <SelectItem value="gpm">GPM (Galones por minuto)</SelectItem>
                      <SelectItem value="mgd">MGD (Millones de galones por día)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertFlow} className="w-full h-12 text-base font-medium">
                Convertir Caudal
              </Button>

              {flowResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{flowResult < 0.001 ? flowResult.toExponential(4) : flowResult.toFixed(4)} {flowTo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB VOLUMEN */}
        <TabsContent value="volume" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Volumen</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor</Label>
                  <Input type="number" step="any" placeholder="1000" value={volumeValue} onChange={(e) => { setVolumeValue(e.target.value); setVolumeResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De</Label>
                  <Select value={volumeFrom} onValueChange={(v) => { setVolumeFrom(v); setVolumeResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l">Litros (L)</SelectItem>
                      <SelectItem value="m3">Metros Cúbicos (m³)</SelectItem>
                      <SelectItem value="gal">Galones US (gal)</SelectItem>
                      <SelectItem value="ft3">Pies Cúbicos (ft³)</SelectItem>
                      <SelectItem value="barrel">Barril estándar (bbl)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A</Label>
                  <Select value={volumeTo} onValueChange={(v) => { setVolumeTo(v); setVolumeResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l">Litros (L)</SelectItem>
                      <SelectItem value="m3">Metros Cúbicos (m³)</SelectItem>
                      <SelectItem value="gal">Galones US (gal)</SelectItem>
                      <SelectItem value="ft3">Pies Cúbicos (ft³)</SelectItem>
                      <SelectItem value="barrel">Barril estándar (bbl)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertVolume} className="w-full h-12 text-base font-medium">
                Convertir Volumen
              </Button>

              {volumeResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{volumeResult.toFixed(4)} {volumeTo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB PRESION */}
        <TabsContent value="pressure" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Presión</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor</Label>
                  <Input type="number" step="any" placeholder="101325" value={pressureValue} onChange={(e) => { setPressureValue(e.target.value); setPressureResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De</Label>
                  <Select value={pressureFrom} onValueChange={(v) => { setPressureFrom(v); setPressureResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pa">Pascales (Pa)</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="atm">Atmósferas (atm)</SelectItem>
                      <SelectItem value="psi">PSI (lb/in²)</SelectItem>
                      <SelectItem value="mmhg">mmHg (Torr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A</Label>
                  <Select value={pressureTo} onValueChange={(v) => { setPressureTo(v); setPressureResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pa">Pascales (Pa)</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="atm">Atmósferas (atm)</SelectItem>
                      <SelectItem value="psi">PSI (lb/in²)</SelectItem>
                      <SelectItem value="mmhg">mmHg (Torr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertPressure} className="w-full h-12 text-base font-medium">
                Convertir Presión
              </Button>

              {pressureResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{pressureResult < 0.01 ? pressureResult.toExponential(4) : pressureResult.toFixed(4)} {pressureTo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB TEMPERATURA */}
        <TabsContent value="temperature" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Temperatura</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valor</Label>
                  <Input type="number" step="any" placeholder="25" value={tempValue} onChange={(e) => { setTempValue(e.target.value); setTempResult(null); }} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">De</Label>
                  <Select value={tempFrom} onValueChange={(v) => { setTempFrom(v); setTempResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">A</Label>
                  <Select value={tempTo} onValueChange={(v) => { setTempTo(v); setTempResult(null); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertTemperature} className="w-full h-12 text-base font-medium">
                Convertir Temperatura
              </Button>

              {tempResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">{tempResult.toFixed(2)} °{tempTo.charAt(0).toUpperCase()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
