"use client"

import React, { useState } from "react"
import {
  Camera,
  FileText,
  Activity,
  Calculator,
  X,
  Plus,
  Sparkles,
} from "lucide-react"

interface FieldActionDockProps {
  isOpen: boolean
  onClose: () => void
  onOpenPhotoCamera: () => void
  onOpenQuickNote: () => void
  onOpenQuickInsitu: () => void
  onOpenCalculators: () => void
}

export function FieldActionDock({
  isOpen,
  onClose,
  onOpenPhotoCamera,
  onOpenQuickNote,
  onOpenQuickInsitu,
  onOpenCalculators,
}: FieldActionDockProps) {
  if (!isOpen) return null

  const actions = [
    {
      id: "photo",
      title: "CÁMARA CON SELLO",
      sub: "Foto con GPS, fecha y estación",
      icon: Camera,
      color: "bg-[#00FFB2] text-[#070B0A] shadow-[#00FFB2]/30",
      textColor: "text-[#00FFB2]",
      onClick: () => {
        onClose()
        onOpenPhotoCamera()
      },
    },
    {
      id: "note",
      title: "NOTA RÁPIDA",
      sub: "Voz o texto con coordenadas",
      icon: FileText,
      color: "bg-[#00E5FF] text-[#070B0A] shadow-[#00E5FF]/30",
      textColor: "text-[#00E5FF]",
      onClick: () => {
        onClose()
        onOpenQuickNote()
      },
    },
    {
      id: "insitu",
      title: "TEST IN-SITU",
      sub: "pH, OD, CE vs límites ECA",
      icon: Activity,
      color: "bg-[#FFB800] text-[#070B0A] shadow-[#FFB800]/30",
      textColor: "text-[#FFB800]",
      onClick: () => {
        onClose()
        onOpenQuickInsitu()
      },
    },
    {
      id: "calc",
      title: "CÁLCULOS EXPRESS",
      sub: "Aforos, DBO, dilución, lodos",
      icon: Calculator,
      color: "bg-[#BCE8D9] text-[#103B3A] shadow-[#BCE8D9]/20",
      textColor: "text-[#BCE8D9]",
      onClick: () => {
        onClose()
        onOpenCalculators()
      },
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-xs p-4 pb-24 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#0F1A17] border-2 border-[#00FFB2]/40 rounded-3xl p-5 text-white shadow-2xl space-y-4">
        {/* Header Táctico */}
        <div className="flex items-center justify-between border-b border-[#1B332D] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00FFB2] animate-ping" />
            <h3 className="font-mono text-xs font-bold text-[#00FFB2] tracking-wider uppercase">
              ACCIONES DE CAMPO // 1-TAP
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-[#142622] text-[#A3B8B2] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Grid (Botones Grandes de Pulgar) */}
        <div className="grid grid-cols-1 gap-2.5">
          {actions.map((act) => {
            const Icon = act.icon
            return (
              <button
                key={act.id}
                onClick={act.onClick}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#070B0A] hover:bg-[#142622] border border-[#1B332D] hover:border-[#00FFB2]/50 transition-all text-left group active:scale-98"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${act.color} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-mono text-xs font-bold tracking-wider leading-tight ${act.textColor}`}>
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-[#A3B8B2] truncate mt-0.5 font-mono">
                    {act.sub}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-[10px] font-mono text-center text-[#647773]">
          Laboratorio Ambiental • Green Owl Labs
        </p>
      </div>
    </div>
  )
}
