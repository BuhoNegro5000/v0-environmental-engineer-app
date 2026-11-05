"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useStorage } from "@/lib/storage-context"
import { areaVelocityCurrentMeter, floatVelocity, manning, rectangularWeirFrancis, triangularWeir90, MANNING_ROUGHNESS, type ManningSection } from "@/lib/calc-engine"

function NumberField({ label, unit, value, onChange }: { label: string; unit: string; value: string; onChange: (value: string) => void }) {
  return <div className="flex flex-col gap-1.5"><Label>{label} <span className="font-mono text-muted-foreground">[{unit}]</span></Label><Input inputMode="decimal" type="number" step="any" value={value} onChange={(event) => onChange(event.target.value)} /></div>
}

function Outcome({ result }: { result: { ok: boolean; value: unknown; errors: string[]; warnings: string[]; meta: { formula: string; source: string } } | null }) {
  if (!result) return null
  return <div className="flex flex-col gap-3" role="status">
    {result.errors.map((error) => <Alert key={error} variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
    {result.warnings.map((warning) => <Alert key={warning}><AlertDescription>{warning}</AlertDescription></Alert>)}
    {result.ok && <div className="rounded-xl border border-primary/30 bg-primary/5 p-4"><p className="font-mono text-2xl font-bold text-primary">{JSON.stringify(result.value)}</p><p className="mt-2 text-xs text-muted-foreground">{result.meta.formula}</p><p className="text-xs text-muted-foreground">Fuente: {result.meta.source}</p></div>}
  </div>
}

export function FlowMeasurementModule() {
  const { addToHistory } = useStorage()
  const [tab, setTab] = useState("triangular")
  const [triangularH, setTriangularH] = useState("0.12")
  const [rectL, setRectL] = useState("1")
  const [rectH, setRectH] = useState("0.1")
  const [rectN, setRectN] = useState("1")
  const [section, setSection] = useState<ManningSection>("rectangular")
  const [manningFields, setManningFields] = useState({ n: "0.013", slope: "0.001", width: "1", depth: "0.3", side: "1", diameter: "0.5", filling: "0.6" })
  const [distance, setDistance] = useState("10")
  const [time, setTime] = useState("20")
  const [factor, setFactor] = useState("0.85")
  const [verticals, setVerticals] = useState([{ distance: "1", depth: "0.3", velocity: "0.4" }, { distance: "1", depth: "0.3", velocity: "0.4" }])
  const [result, setResult] = useState<any>(null)
  const [manningResult, setManningResult] = useState<ReturnType<typeof manning> | null>(null)
  const [areaResult, setAreaResult] = useState<ReturnType<typeof areaVelocityCurrentMeter> | null>(null)

  const save = (type: string, value: number | string, inputs: Record<string, number>) => addToHistory({ type, result: value, inputs, module: "flow_measurement" })
  const manningInput = useMemo(() => ({ section, roughnessN: Number(manningFields.n), slope: Number(manningFields.slope), widthM: Number(manningFields.width), depthM: Number(manningFields.depth), sideSlope: Number(manningFields.side), diameterM: Number(manningFields.diameter), fillingRatio: Number(manningFields.filling) }), [section, manningFields])

  const renderResult = result || manningResult || areaResult
  return <section className="flex flex-col gap-4">
    <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Aforo y medición de caudales</CardTitle><CardDescription>Métodos hidráulicos para trabajo de campo. Cada resultado se guarda en el historial.</CardDescription></div><Badge variant="outline">USB﻿R / Manning</Badge></div></CardHeader></Card>
    <Tabs value={tab} onValueChange={(value) => { setTab(value); setResult(null); setManningResult(null); setAreaResult(null) }}>
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5"><TabsTrigger value="triangular">Thomson 90°</TabsTrigger><TabsTrigger value="rectangular">Rectangular</TabsTrigger><TabsTrigger value="manning">Manning</TabsTrigger><TabsTrigger value="float">Flotadores</TabsTrigger><TabsTrigger value="area">Velocidad-área</TabsTrigger></TabsList>
      <TabsContent value="triangular"><Card><CardHeader><CardTitle>Vertedero triangular 90°</CardTitle><CardDescription>Q = 1.4 × H²·⁵</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><NumberField label="Carga sobre la cresta H" unit="m" value={triangularH} onChange={setTriangularH}/><Button onClick={() => { const r = triangularWeir90({ headM: Number(triangularH) }); setResult(r); if (r.ok && r.value) save("Vertedero triangular 90°", r.value.flowM3s, { headM: Number(triangularH) }) }}>Calcular y guardar</Button><Outcome result={result}/></CardContent></Card></TabsContent>
      <TabsContent value="rectangular"><Card><CardHeader><CardTitle>Vertedero rectangular</CardTitle><CardDescription>Francis con contracciones</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><NumberField label="Longitud L" unit="m" value={rectL} onChange={setRectL}/><NumberField label="Carga H" unit="m" value={rectH} onChange={setRectH}/><NumberField label="Contracciones n" unit="—" value={rectN} onChange={setRectN}/><Button className="sm:col-span-3" onClick={() => { const r = rectangularWeirFrancis({ lengthM: Number(rectL), headM: Number(rectH), contractions: Number(rectN) }); setResult(r); if (r.ok && r.value) save("Vertedero rectangular Francis", r.value.flowM3s, { lengthM: Number(rectL), headM: Number(rectH), contractions: Number(rectN) }) }}>Calcular y guardar</Button><div className="sm:col-span-3"><Outcome result={result}/></div></CardContent></Card></TabsContent>
      <TabsContent value="manning"><Card><CardHeader><CardTitle>Caudal por Manning</CardTitle><CardDescription>Selecciona la geometría de la sección y el coeficiente n.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex flex-wrap gap-2">{(["rectangular", "trapezoidal", "circular"] as ManningSection[]).map((item) => <Button key={item} variant={section === item ? "default" : "outline"} onClick={() => setSection(item)}>{item}</Button>)}</div><div className="grid gap-4 sm:grid-cols-3"><NumberField label="Rugosidad n" unit="—" value={manningFields.n} onChange={(value) => setManningFields({ ...manningFields, n: value })}/><NumberField label="Pendiente S" unit="m/m" value={manningFields.slope} onChange={(value) => setManningFields({ ...manningFields, slope: value })}/>{section === "circular" ? <><NumberField label="Diámetro" unit="m" value={manningFields.diameter} onChange={(value) => setManningFields({ ...manningFields, diameter: value })}/><NumberField label="Llenado" unit="0–1" value={manningFields.filling} onChange={(value) => setManningFields({ ...manningFields, filling: value })}/></> : <><NumberField label="Ancho de solera B" unit="m" value={manningFields.width} onChange={(value) => setManningFields({ ...manningFields, width: value })}/><NumberField label="Profundidad y" unit="m" value={manningFields.depth} onChange={(value) => setManningFields({ ...manningFields, depth: value })}/>{section === "trapezoidal" && <NumberField label="Talud z" unit="H:V" value={manningFields.side} onChange={(value) => setManningFields({ ...manningFields, side: value })}/>}</>}</div><p className="text-xs text-muted-foreground">Tabla sugerida: hormigón {MANNING_ROUGHNESS.hormigon}, tierra {MANNING_ROUGHNESS.tierra}, grava {MANNING_ROUGHNESS.grava}, natural {MANNING_ROUGHNESS.natural}.</p><Button onClick={() => { const r = manning(manningInput); setManningResult(r); if (r.ok && r.value) save("Manning", r.value.flowM3s, { roughnessN: manningInput.roughnessN, slope: manningInput.slope }) }}>Calcular y guardar</Button><Outcome result={manningResult}/></CardContent></Card></TabsContent>
      <TabsContent value="float"><Card><CardHeader><CardTitle>Método de flotadores</CardTitle><CardDescription>La velocidad superficial se corrige con un factor editable.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><NumberField label="Distancia" unit="m" value={distance} onChange={setDistance}/><NumberField label="Tiempo" unit="s" value={time} onChange={setTime}/><NumberField label="Factor" unit="—" value={factor} onChange={setFactor}/><Button className="sm:col-span-3" onClick={() => { const r = floatVelocity({ distanceM: Number(distance), timeS: Number(time), correctionFactor: Number(factor) }); setResult(r); if (r.ok && r.value) save("Flotadores", r.value.velocityMs, { distanceM: Number(distance), timeS: Number(time), correctionFactor: Number(factor) }) }}>Calcular y guardar</Button><div className="sm:col-span-3"><Outcome result={result}/></div></CardContent></Card></TabsContent>
      <TabsContent value="area"><Card><CardHeader><CardTitle>Velocidad-área con correntómetro</CardTitle><CardDescription>Registra una fila por vertical; la suma calcula el caudal.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{verticals.map((vertical, index) => <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-3" key={index}><NumberField label={`Ancho sección ${index + 1}`} unit="m" value={vertical.distance} onChange={(value) => setVerticals(verticals.map((item, i) => i === index ? { ...item, distance: value } : item))}/><NumberField label="Profundidad" unit="m" value={vertical.depth} onChange={(value) => setVerticals(verticals.map((item, i) => i === index ? { ...item, depth: value } : item))}/><NumberField label="Velocidad media" unit="m/s" value={vertical.velocity} onChange={(value) => setVerticals(verticals.map((item, i) => i === index ? { ...item, velocity: value } : item))}/></div>)}<div className="flex gap-2"><Button variant="outline" onClick={() => setVerticals([...verticals, { distance: "1", depth: "0.3", velocity: "0.4" }])}>Añadir vertical</Button><Button onClick={() => { const r = areaVelocityCurrentMeter({ verticals: verticals.map((v) => ({ distanceM: Number(v.distance), depthM: Number(v.depth), velocityMs: Number(v.velocity) })) }); setAreaResult(r); if (r.ok && r.value) save("Velocidad-área", r.value.flowM3s, {}) }}>Calcular y guardar</Button></div><Outcome result={areaResult}/></CardContent></Card></TabsContent>
    </Tabs>
  </section>
}
