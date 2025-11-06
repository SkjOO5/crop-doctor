import { GoogleGenerativeAI } from "@google/generative-ai"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { getFertilizerRecommendations } from "@/lib/fertilizer-recommendation-service"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { image, userId, saveImage = true } = await req.json()

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("🔍 Starting analysis with Gemini...")

    // Extract base64 data and determine mime type
    let base64Data = image
    let mimeType = "image/jpeg"

    if (image.includes(",")) {
      const parts = image.split(",")
      base64Data = parts[1]
      // Extract mime type from data URL
      const mimeMatch = parts[0].match(/data:(image\/[^;]+)/)
      if (mimeMatch) {
        mimeType = mimeMatch[1]
      }
    }

    // Use gemini-2.5-flash - latest free model with excellent image recognition
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert agricultural pathologist. Analyze this crop/plant image carefully and identify any diseases, pests, or health issues.

Provide your analysis in this exact JSON format:
{
  "disease": "name of the disease or 'Healthy Plant' if no issues detected",
  "crop": "name of the crop/plant identified",
  "severity": "mild" or "moderate" or "severe" or "healthy",
  "confidence": "high" or "medium" or "low",
  "description": "detailed description of what you observe in the image",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "treatments": ["treatment method 1", "treatment method 2", "treatment method 3"],
  "prevention": ["prevention tip 1", "prevention tip 2", "prevention tip 3"],
  "organic_solutions": ["organic solution 1", "organic solution 2"]
}

Be specific and practical. Focus on solutions farmers can actually implement.`

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    }

    console.log("📤 Sending request to Gemini API...")
    const result = await model.generateContent([prompt, imagePart])
    const response = result.response
    const text = response.text()

    console.log("✅ Got response from Gemini")
    console.log("Response preview:", text.substring(0, 200))

    // Try to extract JSON from response
    let analysis

    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "")

    // Try to find JSON object
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        // Fallback response
        analysis = {
          disease: "Analysis Complete",
          crop: "Unknown",
          severity: "unknown",
          confidence: "low",
          description: text,
          symptoms: [],
          treatments: ["Please consult with a local agricultural expert"],
          prevention: [],
          organic_solutions: [],
        }
      }
    } else {
      // No JSON found, create structured response from text
      analysis = {
        disease: "Analysis Complete",
        crop: "Unknown",
        severity: "unknown",
        confidence: "medium",
        description: text,
        symptoms: [],
        treatments: ["Please consult with a local agricultural expert"],
        prevention: [],
        organic_solutions: [],
      }
    }

    // Get fertilizer recommendations based on crop and disease
    console.log("🌱 Fetching fertilizer recommendations...")
    const fertilizers = await getFertilizerRecommendations(
      analysis.crop,
      analysis.disease
    )
    console.log(`✅ Found ${fertilizers.length} fertilizer recommendations`)

    // Add fertilizers to analysis
    analysis.fertilizers = fertilizers

    // Save image and analysis if requested
    let savedImagePath = null
    if (saveImage) {
      try {
        const uploadsDir = join(process.cwd(), "public", "uploads")
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }

        const timestamp = Date.now()
        const filename = `detection_${userId || "guest"}_${timestamp}.jpg`
        const filepath = join(uploadsDir, filename)

        // Save image
        const buffer = Buffer.from(base64Data, "base64")
        await writeFile(filepath, buffer)

        // Save analysis
        const analysisFilename = `detection_${userId || "guest"}_${timestamp}.json`
        const analysisPath = join(uploadsDir, analysisFilename)
        await writeFile(
          analysisPath,
          JSON.stringify(
            {
              timestamp: new Date().toISOString(),
              userId: userId || "guest",
              imagePath: `/uploads/${filename}`,
              analysis,
            },
            null,
            2
          )
        )

        savedImagePath = `/uploads/${filename}`
        console.log("💾 Saved image and analysis:", savedImagePath)
      } catch (saveError) {
        console.error("⚠️ Failed to save image:", saveError)
        // Continue even if save fails
      }
    }

    return Response.json({
      ...analysis,
      savedImagePath,
    })
  } catch (error: any) {
    console.error("❌ Error in disease analysis:", error)
    console.error("Error details:", error.message)
    console.error("Error stack:", error.stack)

    return Response.json(
      {
        error: "Analysis failed",
        details: error.message,
        suggestion: "Please check your Google AI API key and ensure it has access to Gemini models",
      },
      { status: 500 }
    )
  }
}
