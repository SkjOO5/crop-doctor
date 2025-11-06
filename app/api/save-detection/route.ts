import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: Request) {
  try {
    const { image, analysis, userId } = await req.json()

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `detection_${userId || "guest"}_${timestamp}.jpg`
    const filepath = join(uploadsDir, filename)

    // Extract base64 data
    const base64Data = image.includes(",") ? image.split(",")[1] : image
    const buffer = Buffer.from(base64Data, "base64")

    // Save image
    await writeFile(filepath, buffer)

    // Save analysis data as JSON
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

    return Response.json({
      success: true,
      imagePath: `/uploads/${filename}`,
      analysisPath: `/uploads/${analysisFilename}`,
    })
  } catch (error: any) {
    console.error("Error saving detection:", error)
    return Response.json(
      {
        error: "Failed to save detection",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
