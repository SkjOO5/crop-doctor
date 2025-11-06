"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, Leaf, AlertCircle, CheckCircle } from "lucide-react"

interface DetectionRecord {
  timestamp: string
  userId: string
  imagePath: string
  analysis: {
    disease: string
    crop: string
    severity: string
    confidence: string
    description: string
    symptoms: string[]
    treatments: string[]
    prevention: string[]
    organic_solutions: string[]
  }
}

export function DetectionHistory({ userId = "guest" }: { userId?: string }) {
  const [history, setHistory] = useState<DetectionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<DetectionRecord | null>(null)

  useEffect(() => {
    loadHistory()
  }, [userId])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/get-history?userId=${userId}`)
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe":
        return "destructive"
      case "moderate":
        return "default"
      case "mild":
        return "secondary"
      case "healthy":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "moderate":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "mild":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Leaf className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No detection history yet. Upload an image to get started!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Detection History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {history.map((record, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <img
                        src={record.imagePath}
                        alt="Detection"
                        className="w-20 h-20 object-cover rounded"
                      />

                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{record.analysis.crop}</h4>
                          {getSeverityIcon(record.analysis.severity)}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {record.analysis.disease}
                        </p>

                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(record.analysis.severity)}>
                            {record.analysis.severity}
                          </Badge>
                          <Badge variant="outline">{record.analysis.confidence}</Badge>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Selected Record Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRecord ? (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* Image */}
                <img
                  src={selectedRecord.imagePath}
                  alt="Detection"
                  className="w-full rounded-lg"
                />

                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{selectedRecord.analysis.crop}</h3>
                  <p className="text-lg">{selectedRecord.analysis.disease}</p>
                  <div className="flex gap-2">
                    <Badge variant={getSeverityColor(selectedRecord.analysis.severity)}>
                      {selectedRecord.analysis.severity}
                    </Badge>
                    <Badge variant="outline">{selectedRecord.analysis.confidence}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRecord.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.analysis.description}
                  </p>
                </div>

                {/* Symptoms */}
                {selectedRecord.analysis.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Symptoms</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedRecord.analysis.symptoms.map((symptom, i) => (
                        <li key={i}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatments */}
                {selectedRecord.analysis.treatments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Treatments</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedRecord.analysis.treatments.map((treatment, i) => (
                        <li key={i}>{treatment}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prevention */}
                {selectedRecord.analysis.prevention.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Prevention</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedRecord.analysis.prevention.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Organic Solutions */}
                {selectedRecord.analysis.organic_solutions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Organic Solutions</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedRecord.analysis.organic_solutions.map((solution, i) => (
                        <li key={i}>{solution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Select a detection from the list to view details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
