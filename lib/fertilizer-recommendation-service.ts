// Fertilizer Recommendation Service
// Provides fertilizer suggestions based on crop disease

interface FertilizerRecommendation {
  name: string
  type: "organic" | "chemical" | "bio-fertilizer"
  npkRatio?: string
  dosage: string
  applicationMethod: string
  frequency: string
  price: {
    government?: number
    market: number
    unit: string
  }
  benefits: string[]
  precautions: string[]
  availability: "high" | "medium" | "low"
}

interface DiseaseSpecificFertilizer {
  disease: string
  crop: string
  fertilizers: FertilizerRecommendation[]
}

// Comprehensive fertilizer database for Indian crops
const FERTILIZER_DATABASE: Record<string, DiseaseSpecificFertilizer> = {
  // Tomato Diseases
  "tomato_early_blight": {
    disease: "Early Blight",
    crop: "Tomato",
    fertilizers: [
      {
        name: "Potassium Sulphate",
        type: "chemical",
        npkRatio: "0-0-50",
        dosage: "25-30 kg/acre",
        applicationMethod: "Soil application",
        frequency: "Once every 15 days",
        price: { government: 850, market: 1200, unit: "per 50kg bag" },
        benefits: [
          "Increases disease resistance",
          "Improves fruit quality",
          "Strengthens plant immunity",
        ],
        precautions: ["Avoid over-application", "Mix with organic matter"],
        availability: "high",
      },
      {
        name: "Neem Cake",
        type: "organic",
        dosage: "200-250 kg/acre",
        applicationMethod: "Soil incorporation",
        frequency: "Once at planting, once after 30 days",
        price: { government: 600, market: 800, unit: "per 50kg bag" },
        benefits: [
          "Natural fungicide properties",
          "Improves soil health",
          "Slow-release nitrogen",
        ],
        precautions: ["Mix well with soil", "Water after application"],
        availability: "high",
      },
      {
        name: "Trichoderma Bio-fertilizer",
        type: "bio-fertilizer",
        dosage: "2.5 kg/acre",
        applicationMethod: "Soil drench or seed treatment",
        frequency: "Once at planting",
        price: { market: 400, unit: "per kg" },
        benefits: [
          "Biological disease control",
          "Promotes root growth",
          "Eco-friendly",
        ],
        precautions: ["Store in cool place", "Use within expiry date"],
        availability: "medium",
      },
    ],
  },
  "tomato_late_blight": {
    disease: "Late Blight",
    crop: "Tomato",
    fertilizers: [
      {
        name: "Calcium Nitrate",
        type: "chemical",
        npkRatio: "15.5-0-0 + 19% Ca",
        dosage: "20-25 kg/acre",
        applicationMethod: "Foliar spray or fertigation",
        frequency: "Every 10 days",
        price: { government: 950, market: 1300, unit: "per 50kg bag" },
        benefits: [
          "Strengthens cell walls",
          "Reduces disease susceptibility",
          "Improves fruit firmness",
        ],
        precautions: ["Don't mix with phosphate fertilizers", "Apply in evening"],
        availability: "high",
      },
      {
        name: "Seaweed Extract",
        type: "organic",
        dosage: "2-3 liters/acre",
        applicationMethod: "Foliar spray",
        frequency: "Every 15 days",
        price: { market: 600, unit: "per liter" },
        benefits: [
          "Boosts plant immunity",
          "Rich in micronutrients",
          "Stress tolerance",
        ],
        precautions: ["Dilute as per instructions", "Spray in morning/evening"],
        availability: "medium",
      },
    ],
  },
  // Potato Diseases
  "potato_early_blight": {
    disease: "Early Blight",
    crop: "Potato",
    fertilizers: [
      {
        name: "NPK 19:19:19",
        type: "chemical",
        npkRatio: "19-19-19",
        dosage: "50 kg/acre",
        applicationMethod: "Soil application + foliar spray",
        frequency: "Split doses - 3 times",
        price: { government: 1100, market: 1500, unit: "per 50kg bag" },
        benefits: [
          "Balanced nutrition",
          "Improves disease resistance",
          "Better tuber development",
        ],
        precautions: ["Apply with adequate moisture", "Avoid leaf burn"],
        availability: "high",
      },
      {
        name: "Vermicompost",
        type: "organic",
        dosage: "2-3 tons/acre",
        applicationMethod: "Soil incorporation",
        frequency: "Once at planting",
        price: { government: 400, market: 600, unit: "per 50kg bag" },
        benefits: [
          "Improves soil structure",
          "Slow-release nutrients",
          "Beneficial microorganisms",
        ],
        precautions: ["Well-decomposed only", "Mix thoroughly"],
        availability: "high",
      },
    ],
  },
  // Rice Diseases
  "rice_blast": {
    disease: "Blast Disease",
    crop: "Rice",
    fertilizers: [
      {
        name: "Potash (MOP)",
        type: "chemical",
        npkRatio: "0-0-60",
        dosage: "30-40 kg/acre",
        applicationMethod: "Soil application",
        frequency: "Split application - tillering and panicle stage",
        price: { government: 700, market: 950, unit: "per 50kg bag" },
        benefits: [
          "Increases disease resistance",
          "Strengthens stems",
          "Better grain filling",
        ],
        precautions: ["Apply in moist soil", "Don't apply during drought"],
        availability: "high",
      },
      {
        name: "Zinc Sulphate",
        type: "chemical",
        npkRatio: "21% Zn",
        dosage: "10 kg/acre",
        applicationMethod: "Soil application or foliar spray",
        frequency: "Once at transplanting",
        price: { government: 450, market: 600, unit: "per 25kg bag" },
        benefits: [
          "Corrects zinc deficiency",
          "Improves disease resistance",
          "Better tillering",
        ],
        precautions: ["Don't overdose", "Mix with sand for uniform application"],
        availability: "high",
      },
    ],
  },
  // Wheat Diseases
  "wheat_rust": {
    disease: "Rust",
    crop: "Wheat",
    fertilizers: [
      {
        name: "Urea",
        type: "chemical",
        npkRatio: "46-0-0",
        dosage: "60-80 kg/acre (split doses)",
        applicationMethod: "Soil application",
        frequency: "3 split doses",
        price: { government: 266, market: 350, unit: "per 50kg bag" },
        benefits: [
          "Promotes vegetative growth",
          "Improves grain protein",
          "Quick nitrogen source",
        ],
        precautions: [
          "Avoid excess nitrogen",
          "Apply with irrigation",
          "Don't apply during flowering",
        ],
        availability: "high",
      },
      {
        name: "DAP (Di-Ammonium Phosphate)",
        type: "chemical",
        npkRatio: "18-46-0",
        dosage: "50 kg/acre",
        applicationMethod: "Basal application",
        frequency: "Once at sowing",
        price: { government: 1350, market: 1800, unit: "per 50kg bag" },
        benefits: [
          "Strong root development",
          "Better disease tolerance",
          "Improved tillering",
        ],
        precautions: ["Apply at sowing time", "Mix with soil"],
        availability: "high",
      },
    ],
  },
  // Default/General recommendations
  default: {
    disease: "General",
    crop: "All Crops",
    fertilizers: [
      {
        name: "NPK 10:26:26",
        type: "chemical",
        npkRatio: "10-26-26",
        dosage: "50-75 kg/acre",
        applicationMethod: "Soil application",
        frequency: "As per crop requirement",
        price: { government: 1200, market: 1600, unit: "per 50kg bag" },
        benefits: [
          "Balanced nutrition",
          "Improves overall plant health",
          "Better disease resistance",
        ],
        precautions: ["Follow crop-specific dosage", "Apply with moisture"],
        availability: "high",
      },
      {
        name: "Compost",
        type: "organic",
        dosage: "5-10 tons/acre",
        applicationMethod: "Soil incorporation",
        frequency: "Once per season",
        price: { government: 300, market: 500, unit: "per 50kg bag" },
        benefits: [
          "Improves soil health",
          "Slow-release nutrients",
          "Enhances microbial activity",
        ],
        precautions: ["Use well-decomposed compost", "Mix thoroughly with soil"],
        availability: "high",
      },
      {
        name: "Azospirillum Bio-fertilizer",
        type: "bio-fertilizer",
        dosage: "2 kg/acre",
        applicationMethod: "Seed treatment or soil application",
        frequency: "Once at planting",
        price: { market: 350, unit: "per kg" },
        benefits: [
          "Nitrogen fixation",
          "Promotes root growth",
          "Eco-friendly",
        ],
        precautions: ["Store in cool place", "Don't expose to sunlight"],
        availability: "medium",
      },
    ],
  },
}

export async function getFertilizerRecommendations(
  crop: string,
  disease: string
): Promise<FertilizerRecommendation[]> {
  // Normalize inputs
  const normalizedCrop = crop.toLowerCase().trim()
  const normalizedDisease = disease.toLowerCase().trim()

  // Create search key
  const searchKey = `${normalizedCrop}_${normalizedDisease.replace(/\s+/g, "_")}`

  // Try to find exact match
  if (FERTILIZER_DATABASE[searchKey]) {
    return FERTILIZER_DATABASE[searchKey].fertilizers
  }

  // Try partial matches
  for (const key in FERTILIZER_DATABASE) {
    if (
      key.includes(normalizedCrop) ||
      key.includes(normalizedDisease.split(" ")[0])
    ) {
      return FERTILIZER_DATABASE[key].fertilizers
    }
  }

  // Return default recommendations
  return FERTILIZER_DATABASE.default.fertilizers
}

// Get fertilizer by disease category
export async function getFertilizersByCategory(
  category: "fungal" | "bacterial" | "viral" | "nutrient_deficiency"
): Promise<FertilizerRecommendation[]> {
  const recommendations: FertilizerRecommendation[] = []

  switch (category) {
    case "fungal":
      recommendations.push(
        {
          name: "Potassium Sulphate",
          type: "chemical",
          npkRatio: "0-0-50",
          dosage: "25-30 kg/acre",
          applicationMethod: "Soil application",
          frequency: "Every 15 days",
          price: { government: 850, market: 1200, unit: "per 50kg bag" },
          benefits: ["Increases fungal disease resistance", "Improves plant immunity"],
          precautions: ["Avoid over-application"],
          availability: "high",
        },
        {
          name: "Neem Cake",
          type: "organic",
          dosage: "200-250 kg/acre",
          applicationMethod: "Soil incorporation",
          frequency: "Once every 30 days",
          price: { government: 600, market: 800, unit: "per 50kg bag" },
          benefits: ["Natural antifungal properties", "Improves soil health"],
          precautions: ["Mix well with soil"],
          availability: "high",
        }
      )
      break

    case "bacterial":
      recommendations.push(
        {
          name: "Calcium Nitrate",
          type: "chemical",
          npkRatio: "15.5-0-0 + 19% Ca",
          dosage: "20-25 kg/acre",
          applicationMethod: "Foliar spray",
          frequency: "Every 10 days",
          price: { government: 950, market: 1300, unit: "per 50kg bag" },
          benefits: ["Strengthens cell walls", "Reduces bacterial infection"],
          precautions: ["Apply in evening"],
          availability: "high",
        }
      )
      break

    case "nutrient_deficiency":
      recommendations.push(
        {
          name: "Micronutrient Mix",
          type: "chemical",
          dosage: "5 kg/acre",
          applicationMethod: "Foliar spray",
          frequency: "Every 15 days",
          price: { market: 800, unit: "per 5kg pack" },
          benefits: ["Corrects deficiencies", "Improves overall health"],
          precautions: ["Follow dilution instructions"],
          availability: "high",
        }
      )
      break

    default:
      return FERTILIZER_DATABASE.default.fertilizers
  }

  return recommendations
}

// Search fertilizers by name or type
export async function searchFertilizers(
  query: string
): Promise<FertilizerRecommendation[]> {
  const results: FertilizerRecommendation[] = []
  const normalizedQuery = query.toLowerCase()

  for (const key in FERTILIZER_DATABASE) {
    const entry = FERTILIZER_DATABASE[key]
    for (const fertilizer of entry.fertilizers) {
      if (
        fertilizer.name.toLowerCase().includes(normalizedQuery) ||
        fertilizer.type.includes(normalizedQuery)
      ) {
        results.push(fertilizer)
      }
    }
  }

  return results
}
