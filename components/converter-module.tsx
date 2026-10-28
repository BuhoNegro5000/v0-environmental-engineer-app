"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  const [flowValue, setFlowValue] = useState("")
  const [flowFrom, setFlowFrom] = useState("m3s")
  const [flowTo, setFlowTo] = useState("ls")
  const [flowResult, setFlowResult] = useState<number | null>(null)

  const [conductivityValue, setConductivityValue] = useState("")
  const [conductivityFrom, setConductivityFrom] = useState("uscm")
  const [conductivityTo, setConductivityTo] = useState("mscm")
  const [conductivityResult, setConductivityResult] = useState<number | null>(null)

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
    }

    const liters = value * toL[volumeFrom]
    const result = liters / toL[volumeTo]
    setVolumeResult(result)
  }

  const convertWaterQuality = () => {
    const value = Number.parseFloat(waterValue)
    if (isNaN(value)) return

    const toMgL: Record<string, number> = {
      mgl: 1,
      ppm: 1, // mg/L ≈ ppm for water
      ugl: 0.001,
      ppb: 0.001, // µg/L ≈ ppb for water
      ntu: 1, // NTU to FNU is approximately 1:1
      fnu: 1,
    }

    const mgL = value * toMgL[waterFrom]
    const result = mgL / toMgL[waterTo]
    setWaterResult(result)
  }

  const convertFlow = () => {
    const value = Number.parseFloat(flowValue)
    if (isNaN(value)) return

    const toM3S: Record<string, number> = {
      m3s: 1,
      m3h: 1 / 3600,
      ls: 0.001,
      lmin: 0.001 / 60,
      gpm: 0.0000631,
      mgd: 0.0438,
    }

    const m3s = value * toM3S[flowFrom]
    const result = m3s / toM3S[flowTo]
    setFlowResult(result)
  }

  const convertConductivity = () => {
    const value = Number.parseFloat(conductivityValue)
    if (isNaN(value)) return

    const toUSCm: Record<string, number> = {
      uscm: 1,
      mscm: 1000,
      ppt: 1560, // approximate conversion
      psu: 1560, // approximate conversion
    }

    const usCm = value * toUSCm[conductivityFrom]
    const result = usCm / toUSCm[conductivityTo]
    setConductivityResult(result)
  }

  return (
    <div className="space-y-4 px-1">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Conversor de Unidades</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Convierte entre diferentes unidades de medida</p>
      </div>

      <Tabs defaultValue="temperature" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full h-auto gap-2 p-2">
            <TabsTrigger value="temperature" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Temperatura
            </TabsTrigger>
            <TabsTrigger value="pressure" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Presión
            </TabsTrigger>
            <TabsTrigger value="volume" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Volumen
            </TabsTrigger>
            <TabsTrigger value="water" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Calidad Agua
            </TabsTrigger>
            <TabsTrigger value="flow" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Caudal
            </TabsTrigger>
            <TabsTrigger value="conductivity" className="min-h-[44px] text-sm whitespace-nowrap px-4">
              Conductividad
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="temperature" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Conversión de Temperatura</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p className="text-sm font-semibold mb-2">Fórmulas:</p>
                      <p className="text-xs mb-1">°F = (°C × 9/5) + 32</p>
                      <p className="text-xs mb-1">K = °C + 273.15</p>
                      <p className="text-xs">°C = (°F - 32) × 5/9</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Convierte entre Celsius, Fahrenheit y Kelvin
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="temp-value" className="text-sm font-medium">
                    Valor
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px]">
                        <p className="text-sm">Ingresa el valor de temperatura que deseas convertir</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="temp-value"
                  type="number"
                  step="0.01"
                  placeholder="25"
                  value={tempValue}
                  onChange={(e) => {
                    setTempValue(e.target.value)
                    setTempResult(null)
                  }}
                  className="h-12 text-base w-full"
                  aria-label="Valor de temperatura"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="temp-from" className="text-sm font-medium">
                    De
                  </Label>
                  <Select value={tempFrom} onValueChange={setTempFrom}>
                    <SelectTrigger id="temp-from" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp-to" className="text-sm font-medium">
                    A
                  </Label>
                  <Select value={tempTo} onValueChange={setTempTo}>
                    <SelectTrigger id="temp-to" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={convertTemperature}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 h-12 px-4 py-2 rounded-md font-medium transition-colors text-base"
              >
                Convertir
              </button>
              {tempResult !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">
                    {tempResult.toFixed(2)} {tempTo === "celsius" ? "°C" : tempTo === "fahrenheit" ? "°F" : "K"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pressure" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversión de Presión</CardTitle>
              <CardDescription className="text-sm leading-relaxed">Convierte entre Pa, bar, psi y atm</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="pressure-value" className="text-sm font-medium">
                  Valor
                </Label>
                <Input
                  id="pressure-value"
                  type="number"
                  step="0.01"
                  placeholder="101325"
                  value={pressureValue}
                  onChange={(e) => {
                    setPressureValue(e.target.value)
                    setPressureResult(null)
                  }}
                  className="h-12 text-base w-full"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pressure-from" className="text-sm font-medium">
                    De
                  </Label>
                  <Select value={pressureFrom} onValueChange={setPressureFrom}>
                    <SelectTrigger id="pressure-from" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pa">Pascal (Pa)</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="psi">PSI</SelectItem>
                      <SelectItem value="atm">Atmósfera (atm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pressure-to" className="text-sm font-medium">
                    A
                  </Label>
                  <Select value={pressureTo} onValueChange={setPressureTo}>
                    <SelectTrigger id="pressure-to" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pa">Pascal (Pa)</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="psi">PSI</SelectItem>
                      <SelectItem value="atm">Atmósfera (atm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={convertPressure}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 h-12 px-4 py-2 rounded-md font-medium transition-colors text-base"
              >
                Convertir
              </button>
              {pressureResult !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">
                    {pressureResult.toFixed(4)} {pressureTo.toUpperCase()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversión de Volumen</CardTitle>
              <CardDescription className="text-sm leading-relaxed">Convierte entre L, m³, gal y ft³</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="volume-value" className="text-sm font-medium">
                  Valor
                </Label>
                <Input
                  id="volume-value"
                  type="number"
                  step="0.01"
                  placeholder="1000"
                  value={volumeValue}
                  onChange={(e) => {
                    setVolumeValue(e.target.value)
                    setVolumeResult(null)
                  }}
                  className="h-12 text-base w-full"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="volume-from" className="text-sm font-medium">
                    De
                  </Label>
                  <Select value={volumeFrom} onValueChange={setVolumeFrom}>
                    <SelectTrigger id="volume-from" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l">Litros (L)</SelectItem>
                      <SelectItem value="m3">Metros cúbicos (m³)</SelectItem>
                      <SelectItem value="gal">Galones (gal)</SelectItem>
                      <SelectItem value="ft3">Pies cúbicos (ft³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume-to" className="text-sm font-medium">
                    A
                  </Label>
                  <Select value={volumeTo} onValueChange={setVolumeTo}>
                    <SelectTrigger id="volume-to" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l">Litros (L)</SelectItem>
                      <SelectItem value="m3">Metros cúbicos (m³)</SelectItem>
                      <SelectItem value="gal">Galones (gal)</SelectItem>
                      <SelectItem value="ft3">Pies cúbicos (ft³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={convertVolume}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 h-12 px-4 py-2 rounded-md font-medium transition-colors text-base"
              >
                Convertir
              </button>
              {volumeResult !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">
                    {volumeResult.toFixed(4)}{" "}
                    {volumeTo === "l" ? "L" : volumeTo === "m3" ? "m³" : volumeTo === "gal" ? "gal" : "ft³"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversión de Calidad de Agua</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Convierte entre mg/L, ppm, µg/L, ppb, NTU y FNU
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="water-value" className="text-sm font-medium">
                  Valor
                </Label>
                <Input
                  id="water-value"
                  type="number"
                  step="0.01"
                  placeholder="10"
                  value={waterValue}
                  onChange={(e) => {
                    setWaterValue(e.target.value)
                    setWaterResult(null)
                  }}
                  className="h-12 text-base w-full"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="water-from" className="text-sm font-medium">
                    De
                  </Label>
                  <Select value={waterFrom} onValueChange={setWaterFrom}>
                    <SelectTrigger id="water-from" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mgl">mg/L</SelectItem>
                      <SelectItem value="ppm">ppm</SelectItem>
                      <SelectItem value="ugl">µg/L</SelectItem>
                      <SelectItem value="ppb">ppb</SelectItem>
                      <SelectItem value="ntu">NTU</SelectItem>
                      <SelectItem value="fnu">FNU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-to" className="text-sm font-medium">
                    A
                  </Label>
                  <Select value={waterTo} onValueChange={setWaterTo}>
                    <SelectTrigger id="water-to" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mgl">mg/L</SelectItem>
                      <SelectItem value="ppm">ppm</SelectItem>
                      <SelectItem value="ugl">µg/L</SelectItem>
                      <SelectItem value="ppb">ppb</SelectItem>
                      <SelectItem value="ntu">NTU</SelectItem>
                      <SelectItem value="fnu">FNU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={convertWaterQuality}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 h-12 px-4 py-2 rounded-md font-medium transition-colors text-base"
              >
                Convertir
              </button>
              {waterResult !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">
                    {waterResult.toFixed(4)} {waterTo.toUpperCase()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversión de Caudal</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Convierte entre m³/s, m³/h, L/s, L/min, GPM y MGD
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="flow-value" className="text-sm font-medium">
                  Valor
                </Label>
                <Input
                  id="flow-value"
                  type="number"
                  step="0.01"
                  placeholder="1"
                  value={flowValue}
                  onChange={(e) => {
                    setFlowValue(e.target.value)
                    setFlowResult(null)
                  }}
                  className="h-12 text-base w-full"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flow-from" className="text-sm font-medium">
                    De
                  </Label>
                  <Select value={flowFrom} onValueChange={setFlowFrom}>
                    <SelectTrigger id="flow-from" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m3s">m³/s</SelectItem>
                      <SelectItem value="m3h">m³/h</SelectItem>
                      <SelectItem value="ls">L/s</SelectItem>
                      <SelectItem value="lmin">L/min</SelectItem>
                      <SelectItem value="gpm">GPM</SelectItem>
                      <SelectItem value="mgd">MGD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flow-to" className="text-sm font-medium">
                    A
                  </Label>
                  <Select value={flowTo} onValueChange={setFlowTo}>
                    <SelectTrigger id="flow-to" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m3s">m³/s</SelectItem>
                      <SelectItem value="m3h">m³/h</SelectItem>
                      <SelectItem value="ls">L/s</SelectItem>
                      <SelectItem value="lmin">L/min</SelectItem>
                      <SelectItem value="gpm">GPM</SelectItem>
                      <SelectItem value="mgd">MGD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={convertFlow}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 h-12 px-4 py-2 rounded-md font-medium transition-colors text-base"
              >
                Convertir
              </button>
              {flowResult !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">
                    {flowResult.toFixed(6)} {flowTo.toUpperCase()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conductivity" className="mt-4">
          <Card>
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversión de Conductividad</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Convierte entre µS/cm, mS/cm, ppt y PSU
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="conductivity-value" className="text-sm font-medium">
                  Valor
                </Label>
                <Input
                  id="conductivity-value"
                  type="number"
                  step="0.01"
                  placeholder="1000"
                  value={conductivityValue}
                  onChange={(e) => {
                    setConductivityValue(e.target.value)
                    setConductivityResult(null)
                  }}
                  className="h-12 text-base w-full"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conductivity-from" className="text-sm font-medium">
                    De
                  </Label>
                  <Select value={conductivityFrom} onValueChange={setConductivityFrom}>
                    <SelectTrigger id="conductivity-from" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uscm">µS/cm</SelectItem>
                      <SelectItem value="mscm">mS/cm</SelectItem>
                      <SelectItem value="ppt">ppt</SelectItem>
                      <SelectItem value="psu">PSU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conductivity-to" className="text-sm font-medium">
                    A
                  </Label>
                  <Select value={conductivityTo} onValueChange={setConductivityTo}>
                    <SelectTrigger id="conductivity-to" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uscm">µS/cm</SelectItem>
                      <SelectItem value="mscm">mS/cm</SelectItem>
                      <SelectItem value="ppt">ppt</SelectItem>
                      <SelectItem value="psu">PSU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={convertConductivity}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 h-12 px-4 py-2 rounded-md font-medium transition-colors text-base"
              >
                Convertir
              </button>
              {conductivityResult !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
                  <p className="text-2xl font-bold text-primary">
                    {conductivityResult.toFixed(4)} {conductivityTo.toUpperCase()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
