"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "es" | "en" | "pt"
type Country = "peru" | "mexico" | "usa" | "europe" | "brazil" | "colombia" | "chile"

interface I18nContextType {
  language: Language
  country: Country
  setLanguage: (lang: Language) => void
  setCountry: (country: Country) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  es: {
    // Navigation
    "nav.calculator": "Calculadora",
    "nav.converter": "Conversor",
    "nav.measurement": "Medición",
    "nav.resources": "Normativas",
    "nav.notes": "Notas",
    "nav.ai": "Asistente IA",
    "nav.settings": "Configuración",

    // Calculator
    "calc.title": "Laboratorio Ambiental",
    "calc.dbo": "DBO₅",
    "calc.dqo": "DQO",
    "calc.ica": "ICA-NSF",
    "calc.co2": "CO₂",
    "calc.carbon": "Huella de Carbono",
    "calc.water": "Huella Hídrica",

    // Settings
    "settings.language": "Idioma",
    "settings.country": "País / Normativa Rectora",
    "settings.theme": "Tema",
    "settings.notifications": "Notificaciones",

    // Countries
    "country.peru": "🇵🇪 Perú (MINAM / ANA / OEFA)",
    "country.colombia": "🇨🇴 Colombia (MinAmbiente / IDEAM)",
    "country.chile": "🇨🇱 Chile (MMA / SMA)",
    "country.mexico": "🇲🇽 México (SEMARNAT / CONAGUA)",
    "country.usa": "🇺🇸 Estados Unidos (US EPA)",
    "country.europe": "🇪🇺 Unión Europea (Directivas CE)",
    "country.brazil": "🇧🇷 Brasil (CONAMA / IBAMA)",

    // Common
    "common.calculate": "Calcular",
    "common.result": "Resultado",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.export": "Exportar",
    "common.share": "Compartir",
  },
  en: {
    // Navigation
    "nav.calculator": "Calculator",
    "nav.converter": "Converter",
    "nav.measurement": "Measurement",
    "nav.resources": "Regulations",
    "nav.notes": "Notes",
    "nav.ai": "AI Assistant",
    "nav.settings": "Settings",

    // Calculator
    "calc.title": "Environmental Laboratory",
    "calc.dbo": "BOD₅",
    "calc.dqo": "COD",
    "calc.ica": "WQI-NSF",
    "calc.co2": "CO₂",
    "calc.carbon": "Carbon Footprint",
    "calc.water": "Water Footprint",

    // Settings
    "settings.language": "Language",
    "settings.country": "Country / Legal Framework",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",

    // Countries
    "country.peru": "🇵🇪 Peru (MINAM / ANA / OEFA)",
    "country.colombia": "🇨🇴 Colombia (MinAmbiente / IDEAM)",
    "country.chile": "🇨🇱 Chile (MMA / SMA)",
    "country.mexico": "🇲🇽 Mexico (SEMARNAT / CONAGUA)",
    "country.usa": "🇺🇸 United States (US EPA)",
    "country.europe": "🇪🇺 European Union (Directives)",
    "country.brazil": "🇧🇷 Brazil (CONAMA / IBAMA)",

    // Common
    "common.calculate": "Calculate",
    "common.result": "Result",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.export": "Export",
    "common.share": "Share",
  },
  pt: {
    // Navigation
    "nav.calculator": "Calculadora",
    "nav.converter": "Conversor",
    "nav.measurement": "Medição",
    "nav.resources": "Normas",
    "nav.notes": "Notas",
    "nav.ai": "Assistente IA",
    "nav.settings": "Configurações",

    // Calculator
    "calc.title": "Laboratório Ambiental",
    "calc.dbo": "DBO₅",
    "calc.dqo": "DQO",
    "calc.ica": "IQA-NSF",
    "calc.co2": "CO₂",
    "calc.carbon": "Pegada de Carbono",
    "calc.water": "Pegada Hídrica",

    // Settings
    "settings.language": "Idioma",
    "settings.country": "País / Marco Regulatório",
    "settings.theme": "Tema",
    "settings.notifications": "Notificações",

    // Countries
    "country.peru": "🇵🇪 Peru (MINAM / ANA / OEFA)",
    "country.colombia": "🇨🇴 Colômbia (MinAmbiente / IDEAM)",
    "country.chile": "🇨🇱 Chile (MMA / SMA)",
    "country.mexico": "🇲🇽 México (SEMARNAT / CONAGUA)",
    "country.usa": "🇺🇸 Estados Unidos (US EPA)",
    "country.europe": "🇪🇺 União Europeia (Diretivas)",
    "country.brazil": "🇧🇷 Brasil (CONAMA / IBAMA)",

    // Common
    "common.calculate": "Calcular",
    "common.result": "Resultado",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.export": "Exportar",
    "common.share": "Compartilhar",
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")
  const [country, setCountryState] = useState<Country>("peru")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("gol_language") as Language
    const savedCountry = localStorage.getItem("gol_country") as Country

    if (savedLanguage) setLanguageState(savedLanguage)
    if (savedCountry) setCountryState(savedCountry)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("gol_language", lang)
  }

  const setCountry = (c: Country) => {
    setCountryState(c)
    localStorage.setItem("gol_country", c)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["es"]] || key
  }

  return (
    <I18nContext.Provider value={{ language, country, setLanguage, setCountry, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
