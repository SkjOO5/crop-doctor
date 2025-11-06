"use client"
import { Card } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react"
import type { WeatherData } from "@/lib/weather-types"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"

interface WeatherWidgetProps {
  weatherData: WeatherData | null
  loading: boolean
  language: Language
}

export default function WeatherWidget({ weatherData, loading, language }: WeatherWidgetProps) {
  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Cloud")) return <Cloud className="w-8 h-8 text-gray-500" />
    if (condition.includes("Rain")) return <CloudRain className="w-8 h-8 text-blue-500" />
    return <Sun className="w-8 h-8 text-yellow-500" />
  }

  if (loading) {
    return <Card className="bg-white border-0 shadow-md p-4 animate-pulse h-32" />
  }

  if (!weatherData) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-md p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Weather</p>
          <h3 className="text-3xl font-bold text-gray-900">{weatherData.temperature}°C</h3>
          <p className="text-sm text-gray-700">{weatherData.condition}</p>
        </div>
        <div>{getWeatherIcon(weatherData.condition)}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-gray-600">Humidity</p>
            <p className="font-semibold">{weatherData.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-gray-600">Wind</p>
            <p className="font-semibold">{weatherData.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-cyan-600" />
          <div>
            <p className="text-gray-600">Rainfall</p>
            <p className="font-semibold">{weatherData.rainfall} mm</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-gray-600">UV Index</p>
          <p className="font-semibold">{weatherData.uvIndex}</p>
        </div>
      </div>
    </Card>
  )
}
