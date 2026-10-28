"use client"

import { useStorage } from "@/lib/storage-context"
import { useI18n } from "@/lib/i18n-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, BarChart3, Activity, Download } from "lucide-react"
import { useMemo } from "react"

export function ChartsPanel() {
  const { history } = useStorage()
  const { t, language } = useI18n()

  const chartData = useMemo(() => {
    const dboData = history
      .filter((item) => item.type === "DBO₅")
      .slice(0, 10)
      .reverse()
      .map((item, index) => ({
        name: `#${index + 1}`,
        valor: typeof item.result === "string" ? Number.parseFloat(item.result) : item.result,
        fecha: new Date(item.timestamp).toLocaleDateString(),
      }))

    const dqoData = history
      .filter((item) => item.type === "DQO")
      .slice(0, 10)
      .reverse()
      .map((item, index) => ({
        name: `#${index + 1}`,
        valor: typeof item.result === "string" ? Number.parseFloat(item.result) : item.result,
        fecha: new Date(item.timestamp).toLocaleDateString(),
      }))

    const icaData = history
      .filter((item) => item.type === "ICA")
      .slice(0, 10)
      .reverse()
      .map((item, index) => ({
        name: `#${index + 1}`,
        valor: typeof item.result === "string" ? Number.parseFloat(item.result) : item.result,
        fecha: new Date(item.timestamp).toLocaleDateString(),
      }))

    const co2Data = history
      .filter((item) => item.type === "Emisiones CO₂")
      .slice(0, 10)
      .reverse()
      .map((item, index) => ({
        name: `#${index + 1}`,
        valor: typeof item.result === "string" ? Number.parseFloat(item.result) : item.result,
        fecha: new Date(item.timestamp).toLocaleDateString(),
      }))

    return { dboData, dqoData, icaData, co2Data }
  }, [history])

  const hasData = history.length > 0

  const exportToCSV = (data: Array<{ name: string; valor: number; fecha: string }>, filename: string) => {
    const headers = ["Medición", "Valor", "Fecha"]
    const csvContent = [headers.join(","), ...data.map((row) => `${row.name},${row.valor},${row.fecha}`)].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = (data: Array<{ name: string; valor: number; fecha: string }>, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="px-3">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {language === "es"
            ? "Gráficos y Tendencias"
            : language === "en"
              ? "Charts and Trends"
              : "Gráficos e Tendências"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "es"
            ? "Visualiza tus datos históricos y analiza tendencias"
            : language === "en"
              ? "Visualize your historical data and analyze trends"
              : "Visualize seus dados históricos e analise tendências"}
        </p>
      </div>

      {!hasData ? (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {language === "es"
                ? "No hay datos para visualizar"
                : language === "en"
                  ? "No data to visualize"
                  : "Sem dados para visualizar"}
            </p>
            <p className="text-sm">
              {language === "es"
                ? "Realiza algunos cálculos para ver gráficos y tendencias"
                : language === "en"
                  ? "Perform some calculations to see charts and trends"
                  : "Realize alguns cálculos para ver gráficos e tendências"}
            </p>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="dbo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 p-2">
            <TabsTrigger value="dbo" className="min-h-[44px]" disabled={chartData.dboData.length === 0}>
              DBO
            </TabsTrigger>
            <TabsTrigger value="dqo" className="min-h-[44px]" disabled={chartData.dqoData.length === 0}>
              DQO
            </TabsTrigger>
            <TabsTrigger value="ica" className="min-h-[44px]" disabled={chartData.icaData.length === 0}>
              ICA
            </TabsTrigger>
            <TabsTrigger value="co2" className="min-h-[44px]" disabled={chartData.co2Data.length === 0}>
              CO₂
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dbo" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle>Tendencia DBO₅</CardTitle>
                    </div>
                    <CardDescription>Últimos {chartData.dboData.length} cálculos de DBO</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(chartData.dboData, "dbo-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToJSON(chartData.dboData, "dbo-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.dboData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.fecha}</p>
                              <p className="text-sm text-primary font-semibold">{payload[0].value?.toFixed(2)} mg/L</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dqo" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <CardTitle>Tendencia DQO</CardTitle>
                    </div>
                    <CardDescription>Últimos {chartData.dqoData.length} cálculos de DQO</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(chartData.dqoData, "dqo-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToJSON(chartData.dqoData, "dqo-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.dqoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.fecha}</p>
                              <p className="text-sm text-blue-600 font-semibold">{payload[0].value?.toFixed(2)} mg/L</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="valor" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ica" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-yellow-600" />
                      <CardTitle>Tendencia ICA</CardTitle>
                    </div>
                    <CardDescription>Últimos {chartData.icaData.length} cálculos de ICA</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(chartData.icaData, "ica-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToJSON(chartData.icaData, "ica-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.icaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.fecha}</p>
                              <p className="text-sm text-yellow-600 font-semibold">
                                {payload[0].value?.toFixed(1)} / 100
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line type="monotone" dataKey="valor" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="co2" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                      <CardTitle>Tendencia Emisiones CO₂</CardTitle>
                    </div>
                    <CardDescription>Últimos {chartData.co2Data.length} cálculos de emisiones</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(chartData.co2Data, "co2-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToJSON(chartData.co2Data, "co2-data")}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.co2Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.fecha}</p>
                              <p className="text-sm text-red-600 font-semibold">
                                {payload[0].value?.toFixed(2)} kg CO₂
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
