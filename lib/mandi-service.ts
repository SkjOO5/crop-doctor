import type { MandiPrice } from "./weather-types"

// Mock Mandi prices - In production, fetch from real agricultural market APIs
const mockMandiPrices: MandiPrice[] = [
  {
    commodity: "Rice",
    market: "Indore Mandi",
    price: 2100,
    unit: "quintal",
    date: Date.now(),
    change: 50,
    trend: "up",
  },
  {
    commodity: "Wheat",
    market: "Delhi Mandi",
    price: 2050,
    unit: "quintal",
    date: Date.now(),
    change: -30,
    trend: "down",
  },
  {
    commodity: "Cotton",
    market: "Jaipur Mandi",
    price: 5200,
    unit: "quintal",
    date: Date.now(),
    change: 100,
    trend: "up",
  },
  {
    commodity: "Tomato",
    market: "Mumbai Mandi",
    price: 1800,
    unit: "quintal",
    date: Date.now(),
    change: -200,
    trend: "down",
  },
  {
    commodity: "Onion",
    market: "Nashik Mandi",
    price: 2200,
    unit: "quintal",
    date: Date.now(),
    change: 0,
    trend: "stable",
  },
  {
    commodity: "Potato",
    market: "Pune Mandi",
    price: 1500,
    unit: "quintal",
    date: Date.now(),
    change: 150,
    trend: "up",
  },
]

export async function getMandiPrices(): Promise<MandiPrice[]> {
  // In production, fetch from APIs like:
  // - eNAM (e-National Agriculture Market)
  // - AGMARKNET
  // - State-specific mandi APIs

  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockMandiPrices
}

export async function getPriceHistory(commodity: string): Promise<{ date: number; price: number }[]> {
  // Generate mock price history
  const basePrice = mockMandiPrices.find((p) => p.commodity === commodity)?.price || 2000
  const history = []

  for (let i = 30; i >= 0; i--) {
    history.push({
      date: Date.now() - i * 86400000,
      price: basePrice + Math.random() * 200 - 100,
    })
  }

  return history
}

export function getCommodityForCrop(cropName: string): string {
  const cropToCommMap: Record<string, string> = {
    rice: "Rice",
    wheat: "Wheat",
    cotton: "Cotton",
    tomato: "Tomato",
    onion: "Onion",
    potato: "Potato",
  }
  return cropToCommMap[cropName.toLowerCase()] || "Rice"
}
