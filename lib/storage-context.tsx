"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CalculationHistory {
  id: string
  type: string
  inputs: Record<string, number>
  result: number | string
  timestamp: number
  module: string
}

interface FavoriteCalculator {
  id: string
  name: string
  module: string
}

interface StorageContextType {
  history: CalculationHistory[]
  favorites: FavoriteCalculator[]
  addToHistory: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void
  clearHistory: () => void
  addFavorite: (calculator: FavoriteCalculator) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  getRecentCalculations: (module?: string, limit?: number) => CalculationHistory[]
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [favorites, setFavorites] = useState<FavoriteCalculator[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("gol_history") || localStorage.getItem("ecoai_history")
    const savedFavorites = localStorage.getItem("gol_favorites") || localStorage.getItem("ecoai_favorites")

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Error loading history:", e)
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Error loading favorites:", e)
      }
    }

    setIsLoaded(true)
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gol_history", JSON.stringify(history))
      localStorage.setItem("ecoai_history", JSON.stringify(history))
    }
  }, [history, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gol_favorites", JSON.stringify(favorites))
      localStorage.setItem("ecoai_favorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const addToHistory = (calculation: Omit<CalculationHistory, "id" | "timestamp">) => {
    const newCalculation: CalculationHistory = {
      ...calculation,
      id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    setHistory((prev) => [newCalculation, ...prev].slice(0, 100))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("gol_history")
    localStorage.removeItem("ecoai_history")
  }

  const addFavorite = (calculator: FavoriteCalculator) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === calculator.id)) return prev
      return [...prev, calculator]
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id)
  }

  const getRecentCalculations = (module?: string, limit = 5) => {
    let filtered = history
    if (module) {
      filtered = filtered.filter((h) => h.module === module)
    }
    return filtered.slice(0, limit)
  }

  return (
    <StorageContext.Provider
      value={{
        history,
        favorites,
        addToHistory,
        clearHistory,
        addFavorite,
        removeFavorite,
        isFavorite,
        getRecentCalculations,
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error("useStorage must be used within StorageProvider")
  }
  return context
}
