"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  User,
  HardDrive,
  Download,
  Trash2,
  CheckCircle2,
  Globe2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStorage } from "@/lib/storage-context"

export function ProfileModule() {
  const { history, clearHistory } = useStorage()

  const [name, setName] = useState("Ingeniero Ambiental")
  const [license, setLicense] = useState("CIP 000000")
  const [organization, setOrganization] = useState("Consultoría Ambiental")
  const [countryStandard, setCountryStandard] = useState("PE")
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem("gol_prof_name")
    const savedLicense = localStorage.getItem("gol_prof_license")
    const savedOrg = localStorage.getItem("gol_prof_org")
    const savedCountry = localStorage.getItem("gol_prof_country")

    if (savedName) setName(savedName)
    if (savedLicense) setLicense(savedLicense)
    if (savedOrg) setOrganization(savedOrg)
    if (savedCountry) setCountryStandard(savedCountry)
  }, [])

  const handleSaveProfile = () => {
    localStorage.setItem("gol_prof_name", name)
    localStorage.setItem("gol_prof_license", license)
    localStorage.setItem("gol_prof_org", organization)
    localStorage.setItem("gol_prof_country", countryStandard)

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleExportBackup = () => {
    const exportData = {
      user: { name, license, organization, countryStandard },
      exportDate: new Date().toISOString(),
      app: "Laboratorio Ambiental by Green Owl Labs",
      version: "2.4.0",
      history,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `GreenOwl_Respaldo_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#103B3A] to-[#008F72] text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Green Owl Labs"
              width={54}
              height={54}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              {name || "Especialista Ambiental"}
            </h1>
            <p className="text-xs text-[#BCE8D9] font-mono mt-0.5">
              {license} · {organization}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-0 text-[10px] font-mono">
                Edición Profesional
              </Badge>
              <Badge className="bg-[#BCE8D9] text-[#103B3A] border-0 text-[10px] font-mono font-bold">
                Normativa Perú Activa
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Specialty Data Form */}
      <Card className="border-[#DCE7E1] dark:border-[#1E4644] shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[#253533] dark:text-[#EAF2EE] flex items-center gap-2">
            <User className="h-5 w-5 text-[#008F72]" />
            Identidad Profesional
          </CardTitle>
          <CardDescription className="text-xs text-[#647773] dark:text-[#8FA49F]">
            Estos datos se consignan en los informes y memorias de cálculo exportados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="prof-name" className="text-xs font-semibold">
              Nombre Completo del Especialista
            </Label>
            <Input
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ing. Carlos Mendoza"
              className="bg-[#F4F8F5] dark:bg-[#0B1C1B] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prof-license" className="text-xs font-semibold">
                Colegiatura / Matrícula (CIP)
              </Label>
              <Input
                id="prof-license"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="Ej. CIP 184520"
                className="bg-[#F4F8F5] dark:bg-[#0B1C1B] text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-org" className="text-xs font-semibold">
                Organización / Laboratorio
              </Label>
              <Input
                id="prof-org"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ej. Green Owl Labs S.A.C."
                className="bg-[#F4F8F5] dark:bg-[#0B1C1B] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="norm-standard" className="text-xs font-semibold flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-[#008F72]" />
              Marco Normativo Primario
            </Label>
            <Select value={countryStandard} onValueChange={setCountryStandard}>
              <SelectTrigger id="norm-standard" className="bg-[#F4F8F5] dark:bg-[#0B1C1B] text-sm">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PE">🇵🇪 Perú — MINAM / ANA / OEFA (Predeterminado)</SelectItem>
                <SelectItem value="CO">🇨🇴 Colombia — MinAmbiente / IDEAM</SelectItem>
                <SelectItem value="CL">🇨🇱 Chile — MMA / SMA / DGA</SelectItem>
                <SelectItem value="MX">🇲🇽 México — SEMARNAT / CONAGUA</SelectItem>
                <SelectItem value="US">🇺🇸 Estados Unidos — US EPA Clean Water & Air Act</SelectItem>
                <SelectItem value="EU">🇪🇺 Unión Europea — Directivas Ambientales CE</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-[#647773] dark:text-[#8FA49F]">
              Gobierna las referencias por defecto en los módulos de DBO, DQO, ICA, Gases y Suelos.
            </p>
          </div>

          <Button
            onClick={handleSaveProfile}
            className="w-full bg-[#008F72] hover:bg-[#103B3A] text-white font-semibold transition-colors"
          >
            {savedSuccess ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Datos guardados correctamente
              </span>
            ) : (
              "Guardar Configuración Profesional"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Offline Storage & History Management */}
      <Card className="border-[#DCE7E1] dark:border-[#1E4644] shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[#253533] dark:text-[#EAF2EE] flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[#008F72]" />
            Almacenamiento Local Offline
          </CardTitle>
          <CardDescription className="text-xs text-[#647773] dark:text-[#8FA49F]">
            Tus datos de cálculo y mediciones residen en tu navegador de forma privada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F5] dark:bg-[#0B1C1B] border border-[#DCE7E1] dark:border-[#1E4644]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#253533] dark:text-[#EAF2EE]">
                Cálculos Registrados
              </span>
              <p className="text-[11px] text-[#647773] dark:text-[#8FA49F]">
                Memoria de cálculos in-situ disponibles sin conexión.
              </p>
            </div>
            <span className="text-lg font-bold font-mono text-[#008F72]">
              {history.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              onClick={handleExportBackup}
              className="text-xs font-medium border-[#DCE7E1] dark:border-[#1E4644] flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4 text-[#008F72]" />
              Exportar Respaldo JSON
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm("¿Seguro que deseas vaciar el historial de cálculos? Esta acción no se puede deshacer.")) {
                  clearHistory()
                }
              }}
              className="text-xs font-medium border-[#DCE7E1] dark:border-[#1E4644] text-[#C53030] hover:bg-[#C53030]/10 flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Vaciar Historial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brand & Scientific Governance */}
      <Card className="border-[#DCE7E1] dark:border-[#1E4644] shadow-xs bg-[#F4F8F5]/60 dark:bg-[#0B1C1B]/60">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-xs flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Green Owl Labs"
                width={32}
                height={32}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#103B3A] dark:text-[#BCE8D9] leading-tight">
                Laboratorio Ambiental by GREEN OWL LABS
              </h2>
              <p className="text-[11px] text-[#647773] dark:text-[#8FA49F]">
                Versión 2.4.0 Professional Edition
              </p>
            </div>
          </div>

          <p className="text-xs text-[#647773] dark:text-[#8FA49F] leading-relaxed">
            Plataforma digital para ingenieros ambientales y científicos. Métodos analíticos basados en Standard Methods (23rd Ed.), US EPA Test Guidelines, y Decretos Supremos del Ministerio del Ambiente del Perú (MINAM).
          </p>

          <div className="pt-2 border-t border-[#DCE7E1] dark:border-[#1E4644] flex items-center justify-between text-[11px] text-[#008F72] font-semibold">
            <span>«La ciencia ambiental, en tu bolsillo»</span>
            <span className="font-mono text-[10px] text-[#647773]">Green Owl Labs © 2026</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
