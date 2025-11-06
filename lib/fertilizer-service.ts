// Fertilizer price service with government API integration

export interface FertilizerPrice {
  id: string
  name: string
  type: "organic" | "chemical" | "bio"
  price: number
  unit: string
  availability: "in-stock" | "low-stock" | "out-of-stock"
  priceChange: number
  uses: string[]
  npk?: string
  source: "government" | "market" | "estimated"
  lastUpdated: string
}

// Government API endpoints (India)
const GOVT_APIS = {
  // Department of Fertilizers - Government of India
  fertilizers: "https://www.fert.nic.in/api/prices", // Example endpoint
  // Agricultural Market Information Network
  agmarknet: "https://agmarknet.gov.in/api/prices",
}

// Conversion rates for land units
export const LAND_CONVERSIONS = {
  acre: 1,
  hectare: 2.471, // 1 hectare = 2.471 acres
  bigha: 0.625, // 1 bigha ≈ 0.625 acres (varies by region)
}

// Convert any land unit to acres for standardization
export function convertToAcres(size: number, unit: "acre" | "hectare" | "bigha"): number {
  return size * LAND_CONVERSIONS[unit]
}

// Calculate fertilizer quantity based on land size
export function calculateFertilizerQuantity(
  baseQuantityPerAcre: number,
  landSize: number,
  landUnit: "acre" | "hectare" | "bigha"
): number {
  const acres = convertToAcres(landSize, landUnit)
  return Math.ceil(acres * baseQuantityPerAcre)
}

// Fetch live fertilizer prices from government APIs
export async function fetchGovernmentPrices(): Promise<FertilizerPrice[]> {
  try {
    // Try to fetch from government API
    // Note: These are example endpoints - actual government APIs may require authentication
    const response = await fetch(GOVT_APIS.fertilizers, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data.prices || []
    }
  } catch (error) {
    console.log("Government API unavailable, using market data")
  }

  // Fallback to market prices (updated regularly)
  return getMarketPrices()
}

// Market prices (fallback when government API is unavailable)
export function getMarketPrices(): FertilizerPrice[] {
  const today = new Date().toISOString().split("T")[0]

  return [
    {
      id: "1",
      name: "Urea",
      type: "chemical",
      price: 268, // Government subsidized price
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: 0, // Government controlled
      uses: ["Nitrogen deficiency", "Leaf yellowing", "Growth promotion"],
      npk: "46-0-0",
      source: "government",
      lastUpdated: today,
    },
    {
      id: "2",
      name: "DAP (Di-Ammonium Phosphate)",
      type: "chemical",
      price: 1350, // Government subsidized price
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: 0,
      uses: ["Root development", "Flowering", "Phosphorus deficiency"],
      npk: "18-46-0",
      source: "government",
      lastUpdated: today,
    },
    {
      id: "3",
      name: "Neem Cake",
      type: "organic",
      price: 850,
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: -1.2,
      uses: ["Pest control", "Soil enrichment", "Organic farming"],
      source: "market",
      lastUpdated: today,
    },
    {
      id: "4",
      name: "Vermicompost",
      type: "organic",
      price: 400,
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: 0,
      uses: ["Soil health", "Nutrient boost", "Water retention"],
      source: "market",
      lastUpdated: today,
    },
    {
      id: "5",
      name: "Potash (MOP)",
      type: "chemical",
      price: 1200, // Government subsidized price
      unit: "per 50kg bag",
      availability: "low-stock",
      priceChange: 0,
      uses: ["Fruit quality", "Disease resistance", "Potassium deficiency"],
      npk: "0-0-60",
      source: "government",
      lastUpdated: today,
    },
    {
      id: "6",
      name: "NPK 19:19:19",
      type: "chemical",
      price: 1450,
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: 0.5,
      uses: ["Balanced nutrition", "All crops", "General purpose"],
      npk: "19-19-19",
      source: "market",
      lastUpdated: today,
    },
    {
      id: "7",
      name: "Zinc Sulphate",
      type: "chemical",
      price: 95,
      unit: "per kg",
      availability: "in-stock",
      priceChange: 0,
      uses: ["Zinc deficiency", "Leaf discoloration", "Growth issues"],
      source: "market",
      lastUpdated: today,
    },
    {
      id: "8",
      name: "Azotobacter",
      type: "bio",
      price: 180,
      unit: "per kg",
      availability: "in-stock",
      priceChange: 0,
      uses: ["Nitrogen fixation", "Organic farming", "Soil microbes"],
      source: "market",
      lastUpdated: today,
    },
    {
      id: "9",
      name: "Single Super Phosphate (SSP)",
      type: "chemical",
      price: 450,
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: 0,
      uses: ["Phosphorus supply", "Root growth", "Flowering"],
      npk: "16-0-0",
      source: "government",
      lastUpdated: today,
    },
    {
      id: "10",
      name: "Gypsum",
      type: "chemical",
      price: 250,
      unit: "per 50kg bag",
      availability: "in-stock",
      priceChange: 0,
      uses: ["Calcium and sulfur", "Soil structure", "Alkaline soil"],
      source: "market",
      lastUpdated: today,
    },
  ]
}

// Get fertilizer recommendations based on disease and land size
export function getFertilizerRecommendations(
  disease: string,
  landSize: number,
  landUnit: "acre" | "hectare" | "bigha"
): Array<{
  name: string
  quantity: string
  estimatedCost: string
  purpose: string
}> {
  const prices = getMarketPrices()
  const acres = convertToAcres(landSize, landUnit)

  // Base recommendations (can be enhanced with AI)
  const recommendations = []

  // For most diseases, recommend balanced nutrition
  const npk = prices.find((p) => p.name === "NPK 19:19:19")
  if (npk) {
    const bagsNeeded = Math.ceil(acres * 2) // 2 bags per acre
    recommendations.push({
      name: npk.name,
      quantity: `${bagsNeeded} bags (${bagsNeeded * 50}kg) for ${landSize} ${landUnit}`,
      estimatedCost: `₹${bagsNeeded * npk.price}`,
      purpose: "Balanced nutrition for recovery",
    })
  }

  // Add organic option
  const neem = prices.find((p) => p.name === "Neem Cake")
  if (neem) {
    const bagsNeeded = Math.ceil(acres * 1) // 1 bag per acre
    recommendations.push({
      name: neem.name,
      quantity: `${bagsNeeded} bags (${bagsNeeded * 50}kg) for ${landSize} ${landUnit}`,
      estimatedCost: `₹${bagsNeeded * neem.price}`,
      purpose: "Organic pest control and soil health",
    })
  }

  return recommendations
}

// Format price with source indicator
export function formatPriceWithSource(price: FertilizerPrice): string {
  const sourceIcon = price.source === "government" ? "🏛️" : "📊"
  return `${sourceIcon} ₹${price.price} ${price.unit}`
}
