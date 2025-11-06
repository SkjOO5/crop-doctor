import { readdir, readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId") || "guest"

    const uploadsDir = join(process.cwd(), "public", "uploads")

    if (!existsSync(uploadsDir)) {
      return Response.json({ history: [] })
    }

    // Read all JSON files
    const files = await readdir(uploadsDir)
    const jsonFiles = files.filter(
      (f) => f.endsWith(".json") && f.includes(userId)
    )

    // Read and parse all detection records
    const history = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await readFile(join(uploadsDir, file), "utf-8")
        return JSON.parse(content)
      })
    )

    // Sort by timestamp (newest first)
    history.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return Response.json({ history })
  } catch (error: any) {
    console.error("Error getting history:", error)
    return Response.json(
      {
        error: "Failed to get history",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
