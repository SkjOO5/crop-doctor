import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch detection history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "50")
    const crop = searchParams.get("crop")
    const disease = searchParams.get("disease")

    const where: any = {}
    if (userId) where.userId = userId
    if (crop) where.crop = { contains: crop, mode: "insensitive" }
    if (disease) where.disease = { contains: disease, mode: "insensitive" }

    const detections = await prisma.detection.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Parse JSON fields
    const formattedDetections = detections.map((d: any) => ({
      ...d,
      symptoms: JSON.parse(d.symptoms),
      treatments: JSON.parse(d.treatments),
      prevention: JSON.parse(d.prevention),
      organicSolutions: JSON.parse(d.organicSolutions),
      fertilizers: JSON.parse(d.fertilizers),
    }))

    return Response.json({ detections: formattedDetections })
  } catch (error: any) {
    console.error("Error fetching detections:", error)
    return Response.json(
      {
        error: "Failed to fetch detections",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// POST - Create new detection
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const detection = await prisma.detection.create({
      data: {
        userId: data.userId || null,
        imagePath: data.imagePath,
        imageSize: data.imageSize,
        crop: data.crop,
        disease: data.disease,
        severity: data.severity,
        confidence: data.confidence,
        description: data.description,
        symptoms: JSON.stringify(data.symptoms || []),
        treatments: JSON.stringify(data.treatments || []),
        prevention: JSON.stringify(data.prevention || []),
        organicSolutions: JSON.stringify(data.organicSolutions || []),
        fertilizers: JSON.stringify(data.fertilizers || []),
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
        temperature: data.temperature,
        humidity: data.humidity,
        weatherCondition: data.weatherCondition,
      },
    })

    return Response.json({ detection })
  } catch (error: any) {
    console.error("Error creating detection:", error)
    return Response.json(
      {
        error: "Failed to create detection",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete detection
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return Response.json({ error: "Detection ID required" }, { status: 400 })
    }

    await prisma.detection.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting detection:", error)
    return Response.json(
      {
        error: "Failed to delete detection",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
