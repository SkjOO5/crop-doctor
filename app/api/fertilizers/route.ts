import { NextRequest } from "next/server"
import {
  getFertilizerRecommendations,
  getFertilizersByCategory,
  searchFertilizers,
} from "@/lib/fertilizer-recommendation-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const crop = searchParams.get("crop")
    const disease = searchParams.get("disease")
    const category = searchParams.get("category")
    const query = searchParams.get("query")

    // Search by crop and disease
    if (crop && disease) {
      const fertilizers = await getFertilizerRecommendations(crop, disease)
      return Response.json({ fertilizers })
    }

    // Search by category
    if (category) {
      const fertilizers = await getFertilizersByCategory(
        category as "fungal" | "bacterial" | "viral" | "nutrient_deficiency"
      )
      return Response.json({ fertilizers })
    }

    // Search by query
    if (query) {
      const fertilizers = await searchFertilizers(query)
      return Response.json({ fertilizers })
    }

    return Response.json(
      { error: "Please provide crop+disease, category, or query parameter" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Error fetching fertilizers:", error)
    return Response.json(
      {
        error: "Failed to fetch fertilizers",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
