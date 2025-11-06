"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Cloud } from "lucide-react"
import type { WeatherData, WeatherForecast, MandiPrice } from "@/lib/weather-types"
import {
  getWeatherData,
  getWeatherForecast,
  getLocationFromCoordinates,
  getCurrentLocation,
} from "@/lib/weather-service"
import { getMandiPrices } from "@/lib/mandi-service"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"
import WeatherWidget from "./weather-widget"
import WeatherForecastComponent from "./weather-forecast"
import MandiPricesComponent from "./mandi-prices"

interface WeatherMandiDashboardProps {
  onBack: () => void
  language: Language
}

export default function WeatherMandiDashboard({ onBack, language }: WeatherMandiDashboardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([])
  const [prices, setPrices] = useState<MandiPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get weather data
      try {
        const coords = await getCurrentLocation()
        const location = await getLocationFromCoordinates(coords.latitude, coords.longitude)
        const weather = await getWeatherData(location)
        const forecast = await getWeatherForecast(location)
        setWeatherData(weather)
        setForecasts(forecast)
      } catch (weatherError) {
        console.error("Weather fetch error:", weatherError)
        // Use default location if geolocation fails
        const defaultLocation = {
          latitude: 28.7041,
          longitude: 77.1025,
          city: "Delhi",
          state: "Delhi",
        }
        const weather = await getWeatherData(defaultLocation)
        const forecast = await getWeatherForecast(defaultLocation)
        setWeatherData(weather)
        setForecasts(forecast)
      }

      // Get mandi prices
      const mandiPrices = await getMandiPrices()
      setPrices(mandiPrices)
    } catch (err) {
      console.error("Data loading error:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pt-6 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Weather & Market</h1>
        </div>

        {error && (
          <Card className="bg-red-50 border border-red-200 shadow-md p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
            <Button onClick={loadData} className="mt-2 text-sm">
              Retry
            </Button>
          </Card>
        )}

        {loading ? (
          <div className="space-y-4">
            <Card className="bg-white border-0 shadow-md p-8 text-center">
              <Cloud className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">Loading weather and market data...</p>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <WeatherWidget weatherData={weatherData} loading={false} language={language} />
            <WeatherForecastComponent forecasts={forecasts} language={language} />
            <MandiPricesComponent prices={prices} language={language} />
          </div>
        )}
      </div>
    </main>
  )
}
