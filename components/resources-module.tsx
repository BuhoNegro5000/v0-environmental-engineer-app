"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, FlaskConical, ShieldAlert, Volume2 } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { regulationsByCountry } from "@/lib/regulations-data"

export function ResourcesModule() {
  const { country, language } = useI18n()

  const countryData = regulationsByCountry[country] || regulationsByCountry.peru

  const samplingProtocols = [
    {
      title:
        language === "es"
          ? "Muestreo de Agua Superficial y Subterránea"
          : language === "en"
            ? "Surface and Groundwater Sampling"
            : "Amostragem de Água Superficial",
      steps:
        language === "es"
          ? [
              "Identificar puntos de monitoreo representativos georreferenciados (WGS84)",
              "Purgar pozos (3 a 5 volúmenes de pozo) o tomar a contracorriente en ríos",
              "Enjuagar el recipiente 3 veces con agua del cuerpo receptor (excepto para microbiología y grasas)",
              "Llenar el frasco sin burbujas de aire para parámetros volátiles y DBO",
              "Preservar en frío a 4 °C en conservadora con refrigerante y adición de preservantes químicos según parámetro",
              "Completar la Cadena de Custodia con fecha, hora, coordenadas y firma del muestreador",
            ]
          : [
              "Identify representative georeferenced monitoring points (WGS84)",
              "Purge wells (3 to 5 casing volumes) or sample against current in rivers",
              "Rinse container 3 times with site water (except for microbiology and oil & grease)",
              "Fill container without headspace for volatile compounds and BOD",
              "Preserve cold at 4 °C with ice packs and chemical preservatives according to method",
              "Complete Chain of Custody with date, time, coordinates, and sampler signature",
            ],
    },
    {
      title:
        language === "es"
          ? "Muestreo de Calidad del Aire (Partículas y Gases)"
          : language === "en"
            ? "Air Quality Sampling (PM & Gases)"
            : "Amostragem de Ar",
      steps:
        language === "es"
          ? [
              "Calibrar el tren de muestreo y verificar flujo con calibrador trazable NIST",
              "Instalar la cabeza selectora de PM10 / PM2.5 a altura de respiración (1.5 - 2.0 m sobre el suelo)",
              "Monitorear y registrar variables meteorológicas concurrentes (temperatura, presión, viento)",
              "Operar durante el período normativo especificado (típicamente 24 horas continuas para PM)",
              "Acondicionar y pesar filtros en ambiente controlado (20-23 °C, 30-40% HR) antes y después",
              "Almacenar filtros en cajas petri selladas y refrigeradas a 4 °C",
            ]
          : [
              "Calibrate sampling train and verify flow with NIST-traceable calibrator",
              "Position PM10/PM2.5 inlet at breathing height (1.5 - 2.0 m above ground)",
              "Record concurrent meteorological parameters (temperature, pressure, wind velocity)",
              "Run for the designated statutory period (typically 24 continuous hours for PM)",
              "Condition and weigh filters in controlled environment before and after sampling",
              "Store filters in sealed petri dishes at 4 °C",
            ],
    },
    {
      title:
        language === "es"
          ? "Muestreo de Suelos Contaminados"
          : language === "en"
            ? "Contaminated Soil Sampling"
            : "Amostragem de Solo",
      steps:
        language === "es"
          ? [
              "Delimitar el área de potencial interés (API) según Guía para el Muestreo de Suelos (MINAM)",
              "Retirar la capa de materia orgánica superficial no consolidada",
              "Tomar muestras compuestas o discretas (para VOCs siempre discretas sin cuartear)",
              "Descontaminar equipos de muestreo con detergente libre de fosfatos y agua desionizada",
              "Envasar en frascos de vidrio ámbar con tapa de teflón para hidrocarburos y metales",
              "Mantener en cadena de frío a ≤ 6 °C y enviar al laboratorio acreditado dentro del tiempo de retención",
            ]
          : [
              "Delineate Area of Potential Concern (AOC) according to technical sampling guides",
              "Clear unconsolidated superficial organic layer",
              "Collect discrete samples for VOCs and composite for metals/heavy hydrocarbons",
              "Decontaminate tools between boreholes using phosphate-free detergent and DI water",
              "Pack in amber glass containers with Teflon-lined caps for organics",
              "Maintain cold storage at ≤ 6 °C and deliver to certified laboratory within holding times",
            ],
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">
          {language === "es" ? "Recursos Normativos y Protocolos" : "Regulatory Resources and Protocols"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {countryData.name} — Límites máximos permisibles (LMP), Estándares de Calidad Ambiental (ECA) y protocolos oficiales
        </p>
      </div>

      <Tabs defaultValue="limits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="limits">
            {language === "es" ? "Límites y Estándares" : "Limits and Standards"}
          </TabsTrigger>
          <TabsTrigger value="regulations">
            {language === "es" ? "Marco Legal Citado" : "Legal Framework"}
          </TabsTrigger>
          <TabsTrigger value="protocols">
            {language === "es" ? "Protocolos de Muestreo" : "Sampling Protocols"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limits">
          <div className="space-y-4">
            {/* AGUA */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">
                    Calidad del Agua y Efluentes Líquidos
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">{countryData.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  {countryData.waterQuality.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">{item.parameter}</p>
                          {item.category && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Límite: <strong className="text-foreground">{item.limit}</strong> {item.unit}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs font-mono">
                        {item.standard}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AIRE */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-base">
                    Calidad del Aire Ambiente
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">{countryData.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  {countryData.airQuality.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{item.parameter}</p>
                        <p className="text-xs text-muted-foreground">
                          Límite: <strong className="text-foreground">{item.limit}</strong> {item.unit}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs font-mono">
                        {item.standard}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SUELO SI EXISTE */}
            {countryData.soilQuality && countryData.soilQuality.length > 0 && (
              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-base">
                      Estándares de Calidad Ambiental para Suelo (ECA Suelo)
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">{countryData.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    {countryData.soilQuality.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.parameter}</p>
                          <p className="text-xs text-muted-foreground">
                            Límite: <strong className="text-foreground">{item.limit}</strong> {item.unit}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs font-mono">
                          {item.standard}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RUIDO SI EXISTE */}
            {countryData.noiseLimits && countryData.noiseLimits.length > 0 && (
              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-base">
                      Estándares de Calidad Ambiental para Ruido (ECA Ruido)
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">{countryData.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    {countryData.noiseLimits.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.parameter}</p>
                          <p className="text-xs text-muted-foreground">
                            Niveles sonoros máximos: <strong className="text-foreground">{item.limit}</strong> {item.unit}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs font-mono">
                          {item.standard}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* MARCO LEGAL */}
        <TabsContent value="regulations">
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                <CardTitle className="text-base">Marco Normativo Ambiental Oficial</CardTitle>
              </div>
              <CardDescription className="text-xs">{countryData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(
                  new Set([
                    ...countryData.waterQuality.map((item) => item.standard),
                    ...countryData.airQuality.map((item) => item.standard),
                    ...(countryData.soilQuality ? countryData.soilQuality.map((item) => item.standard) : []),
                    ...(countryData.noiseLimits ? countryData.noiseLimits.map((item) => item.standard) : []),
                  ]),
                ).map((std, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg border space-y-1">
                    <p className="font-bold text-sm text-foreground">{std}</p>
                    <p className="text-xs text-muted-foreground">
                      Instrumento técnico-legal vinculante para monitoreos, evaluaciones de impacto ambiental (EIA) e instrumentos de gestión ambiental en {countryData.name}.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROTOCOLOS */}
        <TabsContent value="protocols">
          <div className="space-y-4">
            {samplingProtocols.map((protocol, index) => (
              <Card key={index}>
                <CardHeader className="py-4">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-accent" />
                    <CardTitle className="text-base">{protocol.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Procedimientos operativos estandarizados de aseguramiento y control de calidad (QA/QC)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-xs">
                    {protocol.steps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                          {sIdx + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
