"use client"

import { useEffect, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // If user has visited in this session, skip or minimize splash
    const sessionSeen = sessionStorage.getItem("greenowl_splash_seen")
    if (sessionSeen) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashFinish = () => {
    sessionStorage.setItem("greenowl_splash_seen", "true")
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  return <MainApp />
}
