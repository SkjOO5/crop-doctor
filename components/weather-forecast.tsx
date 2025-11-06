"use client"

import { Card } from "@/components/ui/card"
import type { WeatherForecast } from "@/lib/weather-types"
import { Cloud, CloudRain, Sun } from "lucide-react"
import type { Language } from "@/lib/translations"

interface WeatherForecastProps {
  forecasts: WeatherForecast[]
  language: Language
}

export default function WeatherForecastComponent({ forecasts, language }: WeatherForecastProps) {
  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Cloud")) return <Cloud className="w-6 h-6 text-gray-500" />
    if (condition.includes("Rain")) return <CloudRain className="w-6 h-6 text-blue-500" />
    return <Sun className="w-6 h-6 text-yellow-500" />
  }

  return (
    <Card className="bg-white border-0 shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-4">5-Day Forecast</h3>
      <div className="space-y-2">
        {forecasts.map((forecast, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(forecast.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-600">{forecast.condition}</p>
            </div>
            <div className="flex items-center gap-4">
              {getWeatherIcon(forecast.condition)}
              <div className="text-right">
                <p className="text-sm font-semibold">{forecast.high}°C</p>
                <p className="text-xs text-gray-600">{forecast.low}°C</p>
              </div>
              {forecast.rainfall > 0 && (
                <div className="text-right">
                  <p className="text-xs text-blue-600 font-medium">{forecast.rainfall}mm</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
