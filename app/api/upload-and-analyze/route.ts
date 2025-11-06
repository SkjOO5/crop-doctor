import { NextRequest } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getFertilizerRecommendations } from "@/lib/fertilizer-recommendation-service"
import { prisma } from "@/lib/prisma"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    // Parse FormData (like Fasal-Mitra does)
    const formData = await req.formData()
    const imageFile = formData.get("image") as File
    const userId = formData.get("userId") as string || "guest"
    const language = formData.get("language") as string || "en"

    if (!imageFile) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("📸 Image received:", imageFile.name, imageFile.size, "bytes")

    // Create uploads directory
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = imageFile.name.split(".").pop() || "jpg"
    const filename = `detection_${userId}_${timestamp}.${ext}`
    const filepath = join(uploadsDir, filename)
    const publicPath = `/uploads/${filename}`

    // Convert File to Buffer and save
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)
    console.log("💾 Image saved to:", publicPath)

    // Convert to base64 for Gemini
    const base64Data = buffer.toString("base64")
    const mimeType = imageFile.type || "image/jpeg"

    console.log("🔍 Starting Gemini analysis...")

    // Analyze with Gemini
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

    const result = await model.generateContent([prompt, imagePart])
    const response = result.response
    const text = response.text()

    console.log("✅ Gemini analysis complete")

    // Parse JSON response
    let analysis
    let cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
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

    // Get fertilizer recommendations
    console.log("🌱 Fetching fertilizer recommendations...")
    const fertilizers = await getFertilizerRecommendations(
      analysis.crop,
      analysis.disease
    )
    analysis.fertilizers = fertilizers
    console.log(`✅ Found ${fertilizers.length} fertilizer recommendations`)

    // Save to database
    try {
      const detection = await prisma.detection.create({
        data: {
          userId: userId === "guest" ? null : userId,
          imagePath: publicPath,
          imageSize: buffer.length,
          crop: analysis.crop,
          disease: analysis.disease,
          severity: analysis.severity,
          confidence: analysis.confidence,
          description: analysis.description,
          symptoms: JSON.stringify(analysis.symptoms || []),
          treatments: JSON.stringify(analysis.treatments || []),
          prevention: JSON.stringify(analysis.prevention || []),
          organicSolutions: JSON.stringify(analysis.organic_solutions || []),
          fertilizers: JSON.stringify(fertilizers || []),
        },
      })
      console.log("💾 Detection saved to database:", detection.id)
      analysis.detectionId = detection.id
    } catch (dbError) {
      console.error("⚠️ Database save failed:", dbError)
      // Continue even if database save fails
    }

    // Save analysis JSON file (like Fasal-Mitra)
    const analysisFilename = `detection_${userId}_${timestamp}.json`
    const analysisPath = join(uploadsDir, analysisFilename)
    await writeFile(
      analysisPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          userId: userId,
          imagePath: publicPath,
          analysis,
        },
        null,
        2
      )
    )
    console.log("💾 Analysis JSON saved")

    // Return complete response
    return Response.json({
      success: true,
      ...analysis,
      savedImagePath: publicPath,
      imageSize: buffer.length,
    })
  } catch (error: any) {
    console.error("❌ Error in upload and analyze:", error)
    return Response.json(
      {
        error: "Analysis failed",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
