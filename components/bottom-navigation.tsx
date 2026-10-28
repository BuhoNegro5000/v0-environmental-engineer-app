"use client"

import { Home, FlaskConical, Layers, ShieldCheck, User } from "lucide-react"

export type NavigationDestination = "home" | "lab" | "tools" | "regulations" | "profile"

interface BottomNavigationProps {
  currentDestination: NavigationDestination
  onSelectDestination: (dest: NavigationDestination) => void
  onOpenToolsSheet: () => void
}

export function BottomNavigation({
  currentDestination,
  onSelectDestination,
  onOpenToolsSheet,
}: BottomNavigationProps) {
  const items: {
    id: NavigationDestination
    label: string
    icon: typeof Home
    isTrigger?: boolean
  }[] = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "lab", label: "Laboratorio", icon: FlaskConical },
    { id: "tools", label: "Herramientas", icon: Layers, isTrigger: true },
    { id: "regulations", label: "Normativa", icon: ShieldCheck },
    { id: "profile", label: "Perfil", icon: User },
  ]

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0B1C1B]/95 backdrop-blur-md border-t border-[#DCE7E1] dark:border-[#1E4644] transition-colors"
      aria-label="Navegación principal"
    >
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around pb-safe">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = currentDestination === item.id && !item.isTrigger

          if (item.isTrigger) {
            return (
              <button
                key={item.id}
                onClick={onOpenToolsSheet}
                className="group flex flex-col items-center justify-center flex-1 min-h-[48px] px-1 py-1 rounded-xl transition-all"
                aria-label="Abrir catálogo de herramientas"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#008F72] text-white shadow-md shadow-[#008F72]/20 group-hover:bg-[#103B3A] group-hover:scale-105 active:scale-95 transition-all">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-[#103B3A] dark:text-[#BCE8D9] mt-0.5">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectDestination(item.id)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[48px] px-1 py-1 rounded-xl transition-all ${
                isActive
                  ? "text-[#008F72] dark:text-[#00A887]"
                  : "text-[#647773] dark:text-[#8FA49F] hover:text-[#253533] dark:hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                  isActive ? "bg-[#BCE8D9]/40 dark:bg-[#008F72]/20" : ""
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? "font-bold text-[#008F72] dark:text-[#00A887]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
