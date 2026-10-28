"use client"
import { useEffect, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { WelcomeScreen } from "@/components/welcome-screen"
import { OnboardingTour } from "@/components/onboarding-tour"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [appState, setAppState] = useState<"splash" | "welcome" | "onboarding" | "app">("splash")

  useEffect(() => {
    const timer = setTimeout(() => setAppState("welcome"), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleWelcomeComplete = () => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem("ecoingenio_onboarding_complete")

    if (hasCompletedOnboarding === "true") {
      // Skip onboarding if already completed
      setAppState("app")
    } else {
      setAppState("onboarding")
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("ecoingenio_onboarding_complete", "true")
    setAppState("app")
  }

  const handleSkipOnboarding = () => {
    localStorage.setItem("ecoingenio_onboarding_complete", "true")
    setAppState("app")
  }

  if (appState === "splash") {
    return <SplashScreen />
  }

  if (appState === "welcome") {
    return <WelcomeScreen onContinue={handleWelcomeComplete} />
  }

  if (appState === "onboarding") {
    return <OnboardingTour onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />
  }

  return <MainApp />
}
