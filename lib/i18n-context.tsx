"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "es" | "en" | "pt"
type Country = "mexico" | "usa" | "europe" | "brazil" | "colombia" | "argentina" | "peru" | "ecuador" | "chile"

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
    "nav.resources": "Recursos",
    "nav.notes": "Notas",
    "nav.ai": "EcoIA",
    "nav.settings": "Configuración",

    // Calculator
    "calc.title": "Calculadora Ambiental",
    "calc.dbo": "DBO",
    "calc.dqo": "DQO",
    "calc.ica": "ICA",
    "calc.co2": "CO₂",
    "calc.carbon": "Huella de Carbono",
    "calc.water": "Huella Hídrica",

    // Settings
    "settings.language": "Idioma",
    "settings.country": "País/Región",
    "settings.theme": "Tema",
    "settings.notifications": "Notificaciones",

    // Countries
    "country.mexico": "México",
    "country.usa": "Estados Unidos",
    "country.europe": "Europa",
    "country.brazil": "Brasil",
    "country.colombia": "Colombia",
    "country.argentina": "Argentina",
    "country.peru": "Perú",
    "country.ecuador": "Ecuador",
    "country.chile": "Chile",

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
    "nav.resources": "Resources",
    "nav.notes": "Notes",
    "nav.ai": "EcoIA",
    "nav.settings": "Settings",

    // Calculator
    "calc.title": "Environmental Calculator",
    "calc.dbo": "BOD",
    "calc.dqo": "COD",
    "calc.ica": "WQI",
    "calc.co2": "CO₂",
    "calc.carbon": "Carbon Footprint",
    "calc.water": "Water Footprint",

    // Settings
    "settings.language": "Language",
    "settings.country": "Country/Region",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",

    // Countries
    "country.mexico": "Mexico",
    "country.usa": "United States",
    "country.europe": "Europe",
    "country.brazil": "Brazil",
    "country.colombia": "Colombia",
    "country.argentina": "Argentina",
    "country.peru": "Peru",
    "country.ecuador": "Ecuador",
    "country.chile": "Chile",

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
    "nav.resources": "Recursos",
    "nav.notes": "Notas",
    "nav.ai": "EcoIA",
    "nav.settings": "Configurações",

    // Calculator
    "calc.title": "Calculadora Ambiental",
    "calc.dbo": "DBO",
    "calc.dqo": "DQO",
    "calc.ica": "IQA",
    "calc.co2": "CO₂",
    "calc.carbon": "Pegada de Carbono",
    "calc.water": "Pegada Hídrica",

    // Settings
    "settings.language": "Idioma",
    "settings.country": "País/Região",
    "settings.theme": "Tema",
    "settings.notifications": "Notificações",

    // Countries
    "country.mexico": "México",
    "country.usa": "Estados Unidos",
    "country.europe": "Europa",
    "country.brazil": "Brasil",
    "country.colombia": "Colômbia",
    "country.argentina": "Argentina",
    "country.peru": "Peru",
    "country.ecuador": "Equador",
    "country.chile": "Chile",

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
  const [country, setCountryState] = useState<Country>("mexico")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("ecoingenio_language") as Language
    const savedCountry = localStorage.getItem("ecoingenio_country") as Country

    if (savedLanguage) setLanguageState(savedLanguage)
    if (savedCountry) setCountryState(savedCountry)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("ecoingenio_language", lang)
  }

  const setCountry = (c: Country) => {
    setCountryState(c)
    localStorage.setItem("ecoingenio_country", c)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["es"]] || key
  }

  return (
    <I18nContext.Provider value={{ language, country, setLanguage, setCountry, t }}>{children}</I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
