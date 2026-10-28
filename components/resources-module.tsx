"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, FlaskConical } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { regulationsByCountry } from "@/lib/regulations-data"

export function ResourcesModule() {
  const { country, language } = useI18n()

  const countryData = regulationsByCountry[country]

  const samplingProtocols = [
    {
      title:
        language === "es"
          ? "Muestreo de Agua Superficial"
          : language === "en"
            ? "Surface Water Sampling"
            : "Amostragem de Água Superficial",
      steps:
        language === "es"
          ? [
              "Identificar puntos de muestreo representativos",
              "Enjuagar el recipiente 3 veces con agua del sitio",
              "Tomar la muestra a contracorriente",
              "Llenar el recipiente sin dejar cámara de aire",
              "Etiquetar con fecha, hora y ubicación",
              "Preservar a 4°C hasta análisis",
            ]
          : language === "en"
            ? [
                "Identify representative sampling points",
                "Rinse container 3 times with site water",
                "Take sample against current",
                "Fill container without leaving air space",
                "Label with date, time and location",
                "Preserve at 4°C until analysis",
              ]
            : [
                "Identificar pontos de amostragem representativos",
                "Enxaguar o recipiente 3 vezes com água do local",
                "Coletar a amostra contra a corrente",
                "Encher o recipiente sem deixar câmara de ar",
                "Etiquetar com data, hora e localização",
                "Preservar a 4°C até análise",
              ],
    },
    {
      title: language === "es" ? "Muestreo de Aire" : language === "en" ? "Air Sampling" : "Amostragem de Ar",
      steps:
        language === "es"
          ? [
              "Calibrar el equipo de muestreo",
              "Ubicar el muestreador a altura respiratoria (1.5-2m)",
              "Registrar condiciones meteorológicas",
              "Operar según tiempo especificado en norma",
              "Registrar volumen de aire muestreado",
              "Almacenar filtros en condiciones controladas",
            ]
          : language === "en"
            ? [
                "Calibrate sampling equipment",
                "Position sampler at breathing height (1.5-2m)",
                "Record meteorological conditions",
                "Operate according to standard specified time",
                "Record volume of air sampled",
                "Store filters under controlled conditions",
              ]
            : [
                "Calibrar o equipamento de amostragem",
                "Posicionar o amostrador à altura respiratória (1.5-2m)",
                "Registrar condições meteorológicas",
                "Operar conforme tempo especificado na norma",
                "Registrar volume de ar amostrado",
                "Armazenar filtros em condições controladas",
              ],
    },
    {
      title: language === "es" ? "Muestreo de Suelo" : language === "en" ? "Soil Sampling" : "Amostragem de Solo",
      steps:
        language === "es"
          ? [
              "Delimitar el área de estudio",
              "Remover vegetación superficial",
              "Tomar muestra compuesta de varios puntos",
              "Usar herramientas limpias y descontaminadas",
              "Almacenar en recipientes apropiados",
              "Mantener cadena de custodia",
            ]
          : language === "en"
            ? [
                "Delimit study area",
                "Remove surface vegetation",
                "Take composite sample from multiple points",
                "Use clean and decontaminated tools",
                "Store in appropriate containers",
                "Maintain chain of custody",
              ]
            : [
                "Delimitar a área de estudo",
                "Remover vegetação superficial",
                "Coletar amostra composta de vários pontos",
                "Usar ferramentas limpas e descontaminadas",
                "Armazenar em recipientes apropriados",
                "Manter cadeia de custódia",
              ],
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {language === "es" ? "Recursos y Guías" : language === "en" ? "Resources and Guides" : "Recursos e Guias"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {countryData.name} -{" "}
          {language === "es"
            ? "Referencias normativas y protocolos"
            : language === "en"
              ? "Regulatory references and protocols"
              : "Referências normativas e protocolos"}
        </p>
      </div>

      <Tabs defaultValue="limits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="limits">
            {language === "es" ? "Límites" : language === "en" ? "Limits" : "Limites"}
          </TabsTrigger>
          <TabsTrigger value="regulations">
            {language === "es" ? "Normativas" : language === "en" ? "Regulations" : "Normativas"}
          </TabsTrigger>
          <TabsTrigger value="protocols">
            {language === "es" ? "Protocolos" : language === "en" ? "Protocols" : "Protocolos"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limits">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <CardTitle>
                    {language === "es" ? "Calidad del Agua" : language === "en" ? "Water Quality" : "Qualidade da Água"}
                  </CardTitle>
                </div>
                <CardDescription>{countryData.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countryData.waterQuality.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.parameter}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.limit} {item.unit}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.standard}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-secondary" />
                  <CardTitle>
                    {language === "es" ? "Calidad del Aire" : language === "en" ? "Air Quality" : "Qualidade do Ar"}
                  </CardTitle>
                </div>
                <CardDescription>{countryData.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countryData.airQuality.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.parameter}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.limit} {item.unit}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.standard}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regulations">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                <CardTitle>
                  {language === "es"
                    ? "Normativas Ambientales"
                    : language === "en"
                      ? "Environmental Regulations"
                      : "Normativas Ambientais"}
                </CardTitle>
              </div>
              <CardDescription>{countryData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(
                  new Set([
                    ...countryData.waterQuality.map((item) => item.standard),
                    ...countryData.airQuality.map((item) => item.standard),
                  ]),
                ).map((standard, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{standard}</h3>
                      <Badge variant="secondary" className="shrink-0">
                        {countryData.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === "es"
                        ? "Normativa oficial para parámetros ambientales"
                        : language === "en"
                          ? "Official standard for environmental parameters"
                          : "Normativa oficial para parâmetros ambientais"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-accent" />
                <CardTitle>
                  {language === "es"
                    ? "Protocolos de Muestreo"
                    : language === "en"
                      ? "Sampling Protocols"
                      : "Protocolos de Amostragem"}
                </CardTitle>
              </div>
              <CardDescription>
                {language === "es"
                  ? "Guías paso a paso para muestreo en campo"
                  : language === "en"
                    ? "Step-by-step guides for field sampling"
                    : "Guias passo a passo para amostragem em campo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {samplingProtocols.map((protocol, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-3">{protocol.title}</h3>
                    <ol className="space-y-2">
                      {protocol.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs">
                            {stepIndex + 1}
                          </span>
                          <span className="pt-0.5 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
