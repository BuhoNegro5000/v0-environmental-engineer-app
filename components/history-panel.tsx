"use client"

import { useStorage } from "@/lib/storage-context"
import { useI18n } from "@/lib/i18n-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Trash2, Calculator, Beaker, FileText, Share2, FileSpreadsheet, Printer } from "lucide-react"
import { exportToCSV, exportToJSON, generatePDFReport, printReport, shareReport } from "@/lib/export-utils"

export function HistoryPanel() {
  const { history, clearHistory } = useStorage()
  const { t } = useI18n()

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "calculator":
        return <Calculator className="h-4 w-4" />
      case "converter":
        return <Beaker className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleExportCSV = () => {
    const csvData = history.map((item) => ({
      Tipo: item.type,
      ...item.inputs,
      Resultado: item.result,
      Fecha: formatDate(item.timestamp),
      Módulo: item.module,
    }))
    exportToCSV(csvData, `laboratorio_ambiental_historial_${Date.now()}`)
  }

  const handleExportJSON = () => {
    exportToJSON(history, `laboratorio_ambiental_historial_${Date.now()}`)
  }

  const handlePrintReport = () => {
    const reportData = {
      type: "Historial de Cálculos",
      calculations: history,
    }
    const htmlContent = generatePDFReport(reportData, "Historial de Cálculos — Laboratorio Ambiental")
    printReport(htmlContent)
  }

  const handleShare = () => {
    const reportData = {
      calculations: history.slice(0, 5),
    }
    shareReport(reportData, "Historial de Cálculos — Laboratorio Ambiental")
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg md:text-xl font-semibold">Historial de Cálculos</h2>
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleExportCSV} title="Exportar CSV">
                <FileSpreadsheet className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">CSV</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON} title="Exportar JSON">
                <FileText className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">JSON</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintReport} title="Imprimir Reporte">
                <Printer className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Imprimir</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} title="Compartir">
                <Share2 className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Compartir</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={clearHistory} title="Borrar Todo">
                <Trash2 className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Borrar</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No hay cálculos en el historial</p>
          <p className="text-sm">Los cálculos realizados aparecerán aquí automáticamente</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">{getModuleIcon(item.module)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm capitalize truncate">{item.type}</h4>
                      <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1 mb-2">
                      {Object.entries(item.inputs).map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm font-bold text-primary">Resultado: {item.result}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  )
}
