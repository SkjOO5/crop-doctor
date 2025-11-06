export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  rainfall: number
  uvIndex: number
  condition: string
  timestamp: number
}

export interface WeatherForecast {
  date: number
  high: number
  low: number
  condition: string
  rainfall: number
  humidity: number
}

export interface MandiPrice {
  commodity: string
  market: string
  price: number
  unit: string
  date: number
  change: number
  trend: "up" | "down" | "stable"
}

export interface LocationData {
  latitude: number
  longitude: number
  city: string
  state: string
}
