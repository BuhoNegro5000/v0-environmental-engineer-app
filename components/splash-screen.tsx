"use client"

import Image from "next/image"
import { Droplets, Wind } from "lucide-react"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                <Image
                  src="/logo.png"
                  alt="EcoAI Logo"
                  width={120}
                  height={120}
                  className="animate-bounce"
                  style={{ animationDuration: "2s", width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Floating environmental icons */}
          <div className="absolute -top-4 -left-12 animate-float" style={{ animationDelay: "0.5s" }}>
            <Droplets className="h-8 w-8 text-white/60" />
          </div>
          <div className="absolute -top-4 -right-12 animate-float" style={{ animationDelay: "1s" }}>
            <Wind className="h-8 w-8 text-white/60" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-2xl text-white/90 font-medium">Tu Laboratorio Ambiental</p>
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center pt-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
