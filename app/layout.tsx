import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n-context"
import { ThemeProvider } from "@/components/theme-provider"
import { StorageProvider } from "@/lib/storage-context"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Laboratorio Ambiental by GREEN OWL LABS",
  description:
    "Laboratorio ambiental digital para profesionales. La ciencia ambiental, en tu bolsillo. Calculadoras científicas, métodos, normativa e informes.",
  generator: "Green Owl Labs",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased selection:bg-[#BCE8D9] selection:text-[#103B3A]`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <StorageProvider>
              <TooltipProvider delayDuration={150}>
                <Suspense fallback={null}>{children}</Suspense>
              </TooltipProvider>
              <Analytics />
            </StorageProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
