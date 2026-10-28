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
    exportToCSV(csvData, `ecoai_historial_${Date.now()}`)
  }

  const handleExportJSON = () => {
    exportToJSON(history, `ecoai_historial_${Date.now()}`)
  }

  const handlePrintReport = () => {
    const reportData = {
      type: "Historial de Cálculos",
      calculations: history,
    }
    const htmlContent = generatePDFReport(reportData, "Historial de Cálculos - EcoAI")
    printReport(htmlContent)
  }

  const handleShare = () => {
    const reportData = {
      calculations: history.slice(0, 5),
    }
    shareReport(reportData, "Historial de Cálculos - EcoAI")
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg md:text-xl font-semibold">{t("history", "Historial", "History", "Histórico")}</h2>
        </div>
        {history.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-9 bg-transparent"
              title="Exportar a CSV"
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintReport}
              className="h-9 bg-transparent"
              title="Imprimir reporte"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="h-9 bg-transparent" title="Compartir">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="h-9 bg-transparent"
              title="Limpiar historial"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t("noHistory", "No hay cálculos guardados", "No saved calculations", "Sem cálculos salvos")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Card key={item.id} className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getModuleIcon(item.module)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{item.type}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(item.inputs).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="truncate">{key}:</span>
                          <span className="font-mono ml-2">{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold text-foreground pt-1 border-t">
                        <span>{t("result", "Resultado", "Result", "Resultado")}:</span>
                        <span className="font-mono ml-2">{item.result}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
