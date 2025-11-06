import type { WeatherData, WeatherForecast, LocationData } from "./weather-types"

// Mock weather data for demo - In production, use OpenWeatherMap or similar API
const mockWeatherData: Record<string, WeatherData> = {
  default: {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 2,
    uvIndex: 6,
    condition: "Partly Cloudy",
    timestamp: Date.now(),
  },
}

const mockForecasts: WeatherForecast[] = [
  { date: Date.now() + 86400000, high: 32, low: 24, condition: "Sunny", rainfall: 0, humidity: 60 },
  { date: Date.now() + 172800000, high: 30, low: 22, condition: "Partly Cloudy", rainfall: 1, humidity: 65 },
  { date: Date.now() + 259200000, high: 28, low: 20, condition: "Rainy", rainfall: 10, humidity: 80 },
  { date: Date.now() + 345600000, high: 29, low: 21, condition: "Cloudy", rainfall: 3, humidity: 70 },
  { date: Date.now() + 432000000, high: 31, low: 23, condition: "Sunny", rainfall: 0, humidity: 55 },
]

export async function getWeatherData(location: LocationData): Promise<WeatherData> {
  try {
    // Using Open-Meteo API (free, no API key required!)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=auto`
    )

    if (!response.ok) throw new Error("Weather API failed")

    const data = await response.json()
    const current = data.current

    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      rainfall: current.precipitation || 0,
      uvIndex: 5, // Open-Meteo doesn't provide UV in free tier
      condition: getWeatherCondition(current.weather_code),
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("Weather fetch error:", error)
    // Fallback to mock data
    return mockWeatherData["default"]
  }
}

function getWeatherCondition(code: number): string {
  // WMO Weather interpretation codes
  if (code === 0) return "Clear Sky"
  if (code <= 3) return "Partly Cloudy"
  if (code <= 48) return "Foggy"
  if (code <= 67) return "Rainy"
  if (code <= 77) return "Snowy"
  if (code <= 82) return "Rain Showers"
  if (code <= 86) return "Snow Showers"
  if (code <= 99) return "Thunderstorm"
  return "Unknown"
}

export async function getWeatherForecast(location: LocationData): Promise<WeatherForecast[]> {
  // In production, call actual weather API
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockForecasts
}

export async function getLocationFromCoordinates(latitude: number, longitude: number): Promise<LocationData> {
  try {
    // Using Nominatim (OpenStreetMap) - free reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
    )

    if (!response.ok) throw new Error("Geocoding failed")

    const data = await response.json()
    const address = data.address || {}

    return {
      latitude,
      longitude,
      city: address.city || address.town || address.village || "Unknown City",
      state: address.state || "Unknown State",
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return {
      latitude,
      longitude,
      city: "Your Location",
      state: "India",
    }
  }
}

export function getCurrentLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
      {
        enableHighAccuracy: false,
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // 5 minutes cache
      }
    )
  })
}
