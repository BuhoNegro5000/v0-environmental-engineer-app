"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface SplashScreenProps {
  onFinish?: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        onFinish?.()
      }, 350)
    }, 1800)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div
      onClick={() => {
        setFading(true)
        setTimeout(() => onFinish?.(), 150)
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#103B3A] text-white select-none cursor-pointer transition-opacity duration-300 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="banner"
      aria-label="Laboratorio Ambiental - Pantalla de inicio"
    >
      {/* Subtle scientific topographic / coordinate vector pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="scientific-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#BCE8D9" strokeWidth="0.5" strokeDasharray="2,2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#scientific-grid)" />
        <ellipse cx="400" cy="400" rx="350" ry="250" fill="none" stroke="#BCE8D9" strokeWidth="1" />
        <ellipse cx="400" cy="400" rx="280" ry="190" fill="none" stroke="#BCE8D9" strokeWidth="1" />
        <ellipse cx="400" cy="400" rx="200" ry="130" fill="none" stroke="#BCE8D9" strokeWidth="0.75" />
        <ellipse cx="400" cy="400" rx="120" ry="70" fill="none" stroke="#BCE8D9" strokeWidth="0.5" />
        <line x1="0" y1="400" x2="800" y2="400" stroke="#BCE8D9" strokeWidth="0.5" strokeDasharray="4,4" />
        <line x1="400" y1="0" x2="400" y2="800" stroke="#BCE8D9" strokeWidth="0.5" strokeDasharray="4,4" />
      </svg>

      {/* Main Brand Container */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm mx-auto">
        {/* Emblem Container with subtle glow */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 rounded-2xl bg-[#008F72]/30 blur-lg transition-all" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-white p-2.5 shadow-2xl border border-[#BCE8D9]/40">
            <Image
              src="/logo.png"
              alt="Green Owl Labs"
              width={88}
              height={88}
              priority
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        {/* Product Identity */}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Laboratorio Ambiental
        </h1>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#BCE8D9] font-medium">
            by GREEN OWL LABS
          </span>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
          Laboratorio ambiental digital para profesionales
        </p>

        <p className="mt-1 text-[11px] text-[#BCE8D9]/70 italic">
          «La ciencia ambiental, en tu bolsillo»
        </p>

        {/* Subtle instrument progress bar */}
        <div className="mt-8 w-44 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#008F72] via-[#BCE8D9] to-[#008F72] rounded-full animate-pulse" />
        </div>

        <span className="mt-3 text-[10px] text-white/40 font-mono tracking-wider">
          CALIBRANDO INSTRUMENTAL
        </span>
      </div>
    </div>
  )
}
