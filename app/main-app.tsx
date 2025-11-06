"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import LoginPage from "@/components/login-page"
import SignupPage from "@/components/signup-page"
import Sidebar from "@/components/sidebar"
import LocationWeatherBanner from "@/components/location-weather-banner"
import LanguageSelector from "@/components/language-selector"
import ImageUploadArea from "@/components/image-upload-area"
import DiseaseAnalysis from "@/components/disease-analysis"
import FarmDiaryPage from "@/components/farm-diary-page"
import WeatherMandiDashboard from "@/components/weather-mandi-dashboard"
import FertilizerMarketplace from "@/components/fertilizer-marketplace"
import AnalysisHistory from "@/components/analysis-history"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, BookOpen, Cloud } from "lucide-react"
import { getTranslation, DEFAULT_LANGUAGE, type Language } from "@/lib/translations"

export default function MainApp() {
  const { isAuthenticated, user } = useAuth()
  const [authView, setAuthView] = useState<"login" | "signup">("login")
  const [currentView, setCurrentView] = useState("home")
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleImageCapture = async (file: File) => {
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setImage(base64)
    }
    reader.readAsDataURL(file)

    // Upload and analyze using FormData (like Fasal-Mitra)
    analyzeDisease(file)
  }

  const analyzeDisease = async (imageFile: File) => {
    setLoading(true)
    setAnalysis(null)

    try {
      // Use FormData for proper file upload (like Fasal-Mitra)
      const formData = new FormData()
      formData.append("image", imageFile)
      formData.append("userId", user?.id || "guest")
      formData.append("language", language)

      console.log("📤 Uploading image:", imageFile.name, imageFile.size, "bytes")

      const response = await fetch("/api/upload-and-analyze", {
        method: "POST",
        body: formData, // Send FormData directly (no Content-Type header needed)
      })

      const result = await response.json()
      
      if (result.error) {
        console.error("Analysis error:", result.error)
        setAnalysis({
          error: result.error || "Failed to analyze crop. Please try again.",
        })
      } else {
        setAnalysis(result)
        console.log("✅ Analysis complete!")
        console.log("📸 Image saved to:", result.savedImagePath)
        console.log("🌱 Fertilizers:", result.fertilizers?.length || 0)
        console.log("💾 Detection ID:", result.detectionId)
      }
    } catch (error) {
      console.error("Error analyzing disease:", error)
      setAnalysis({
        error: "Failed to analyze crop. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToFarmDiary = async (analysisData: any, imageData: string) => {
    try {
      // Detection is already saved in database during analysis!
      // Just navigate to farm diary
      console.log("✅ Detection already saved with ID:", analysisData.detectionId)
      console.log("📸 Image path:", analysisData.savedImagePath)
      
      // Show success message
      if (typeof window !== "undefined") {
        const toast = (window as any).toast
        if (toast) {
          toast.success("Saved to Farm Diary!")
        }
      }
      
      // Navigate to farm diary
      setCurrentView("diary")
      resetAnalysis()
    } catch (error) {
      console.error("Error navigating to farm diary:", error)
    }
  }

  const resetAnalysis = () => {
    setImage(null)
    setAnalysis(null)
    setCurrentView("home")
  }

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <LoginPage
          onSwitchToSignup={() => setAuthView("signup")}
          onLoginSuccess={() => setCurrentView("home")}
        />
      )
    } else {
      return (
        <SignupPage
          onSwitchToLogin={() => setAuthView("login")}
          onSignupSuccess={() => setCurrentView("home")}
        />
      )
    }
  }

  // Show disease analysis if image is being analyzed
  if (image && (loading || analysis)) {
    return (
      <>
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <DiseaseAnalysis
          image={image}
          analysis={analysis}
          loading={loading}
          onReset={resetAnalysis}
          onSaveToHistory={handleSaveToFarmDiary}
        />
      </>
    )
  }

  // Render different views based on currentView
  return (
    <>
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className={`min-h-screen pt-6 pb-12 px-4 pl-16 ${
        darkMode 
          ? 'agriculture-bg-dark agriculture-pattern-dark leaf-pattern-dark' 
          : 'agriculture-bg-light agriculture-pattern leaf-pattern'
      }`}>
        <div className="max-w-2xl mx-auto">
          {currentView === "home" && (
            <>
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              <LocationWeatherBanner />

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                    darkMode ? 'bg-green-700' : 'bg-green-600'
                  }`}>
                    🌱
                  </div>
                </div>
                <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getTranslation(language, "appName")}
                </h1>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getTranslation(language, "appSubtitle")}
                </p>
                <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Welcome, {user?.name}! 👨‍🌾
                </p>
              </div>

              <div className="space-y-4">
                <ImageUploadArea onFileSelect={handleImageCapture} />

                <div className="grid grid-cols-3 gap-3">
                  <Button onClick={() => setCurrentView("diary")} variant="outline" className="h-12 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Farm Diary</span>
                  </Button>
                  <Button onClick={() => setCurrentView("weather")} variant="outline" className="h-12 text-sm">
                    <Cloud className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Weather</span>
                  </Button>
                  <Button onClick={() => setCurrentView("fertilizers")} variant="outline" className="h-12 text-sm">
                    <Upload className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Fertilizers</span>
                  </Button>
                </div>

                <AnalysisHistory onSelectAnalysis={() => {}} />

                <Card className={`border-0 shadow-lg p-6 mt-8 backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-green-900/30 border border-green-700/50' 
                    : 'bg-white/80'
                }`}>
                  <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getTranslation(language, "whatYouGet")}
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        darkMode ? 'bg-green-700' : 'bg-green-100'
                      }`}>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-green-700'}`}>✓</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {getTranslation(language, "diseaseIdentification")}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {getTranslation(language, "diseaseIdentificationDesc")}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        darkMode ? 'bg-green-700' : 'bg-green-100'
                      }`}>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-green-700'}`}>✓</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {getTranslation(language, "treatmentPlans")}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {getTranslation(language, "treatmentPlansDesc")}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        darkMode ? 'bg-green-700' : 'bg-green-100'
                      }`}>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-green-700'}`}>✓</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {getTranslation(language, "multiLanguage")}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {getTranslation(language, "multiLanguageDesc")}
                        </p>
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>
            </>
          )}

          {currentView === "scan" && <ImageUploadArea onFileSelect={handleImageCapture} />}
          {currentView === "diary" && <FarmDiaryPage onBack={() => setCurrentView("home")} language={language} />}
          {currentView === "weather" && (
            <WeatherMandiDashboard onBack={() => setCurrentView("home")} language={language} />
          )}
          {currentView === "fertilizers" && <FertilizerMarketplace />}
          {currentView === "history" && <AnalysisHistory onSelectAnalysis={() => {}} />}
        </div>
      </main>
    </>
  )
}
