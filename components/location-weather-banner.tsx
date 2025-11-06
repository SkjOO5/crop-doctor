"use client"

import { useEffect, useState } from "react"
import { MapPin, Cloud, Droplets, Wind, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getCurrentLocation, getLocationFromCoordinates, getWeatherData } from "@/lib/weather-service"
import type { LocationData, WeatherData } from "@/lib/weather-types"

export default function LocationWeatherBanner() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLocationAndWeather()
  }, [])

  const fetchLocationAndWeather = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get user's current location
      const coords = await getCurrentLocation()
      
      // Get location details (city, state)
      const locationData = await getLocationFromCoordinates(coords.latitude, coords.longitude)
      setLocation(locationData)

      // Store location globally for use in disease analysis
      if (typeof window !== "undefined") {
        (window as any).__userLocation = locationData
      }

      // Get weather data
      const weatherData = await getWeatherData(locationData)
      setWeather(weatherData)
    } catch (err: any) {
      console.error("Location/Weather error:", err)
      
      // Provide specific error messages
      if (err.code === 1) {
        setError("Location access denied. Please allow location in browser settings.")
      } else if (err.code === 2) {
        setError("Location unavailable. Check your GPS/network.")
      } else if (err.code === 3) {
        setError("Location request timeout. Please try again.")
      } else {
        setError("Unable to get location. Click 'Try Again' to retry.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Getting your location...</span>
        </div>
      </Card>
    )
  }

  if (error || !location || !weather) {
    return (
      <Card className="bg-gradient-to-r from-gray-400 to-gray-500 text-white p-4 mb-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{error || "Location unavailable"}</span>
          </div>
          <button
            onClick={fetchLocationAndWeather}
            className="text-xs underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">{location.city}</p>
            <p className="text-xs opacity-90">{location.state}</p>
          </div>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Cloud className="w-4 h-4" />
            <span className="text-sm font-medium">{weather.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-xs opacity-90">{weather.condition}</p>
      </div>
    </Card>
  )
}
