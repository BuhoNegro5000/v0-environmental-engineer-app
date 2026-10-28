"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Globe, Languages, Moon, Sun } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useTheme } from "next-themes"

export function SettingsDialog() {
  const { language, country, setLanguage, setCountry, t } = useI18n()
  const { theme, setTheme } = useTheme()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("nav.settings")}</DialogTitle>
          <DialogDescription>Configure su idioma, región y preferencias de la aplicación</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t("settings.language")}
            </Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country/Region Selection */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("settings.country")}
            </Label>
            <Select value={country} onValueChange={(value) => setCountry(value as any)}>
              <SelectTrigger id="country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mexico">{t("country.mexico")}</SelectItem>
                <SelectItem value="usa">{t("country.usa")}</SelectItem>
                <SelectItem value="europe">{t("country.europe")}</SelectItem>
                <SelectItem value="brazil">{t("country.brazil")}</SelectItem>
                <SelectItem value="colombia">{t("country.colombia")}</SelectItem>
                <SelectItem value="argentina">{t("country.argentina")}</SelectItem>
                <SelectItem value="peru">{t("country.peru")}</SelectItem>
                <SelectItem value="ecuador">{t("country.ecuador")}</SelectItem>
                <SelectItem value="chile">{t("country.chile")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Las normativas y límites se ajustarán según su región</p>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <Label htmlFor="theme" className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {t("settings.theme")}
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  {language === "es" ? "Claro" : language === "en" ? "Light" : "Claro"}
                </SelectItem>
                <SelectItem value="dark">
                  {language === "es" ? "Oscuro" : language === "en" ? "Dark" : "Escuro"}
                </SelectItem>
                <SelectItem value="system">
                  {language === "es" ? "Sistema" : language === "en" ? "System" : "Sistema"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
