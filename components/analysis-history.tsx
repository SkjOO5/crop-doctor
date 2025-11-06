"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Eye } from "lucide-react"
import { useState, useEffect } from "react"

interface AnalysisRecord {
  id: string
  image: string
  disease: string
  severity: string
  timestamp: number
}

interface AnalysisHistoryProps {
  onSelectAnalysis: (analysis: AnalysisRecord) => void
}

export default function AnalysisHistory({ onSelectAnalysis }: AnalysisHistoryProps) {
  const [history, setHistory] = useState<AnalysisRecord[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("analysisHistory")
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((h) => h.id !== id)
    setHistory(updated)
    localStorage.setItem("analysisHistory", JSON.stringify(updated))
  }

  if (history.length === 0) {
    return null
  }

  return (
    <Card className="bg-white border-0 shadow-sm p-6 mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Analysis</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {history.slice(-6).map((record) => (
          <div key={record.id} className="relative group">
            <img
              src={record.image || "/placeholder.svg"}
              alt={record.disease}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
              onClick={() => onSelectAnalysis(record)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition flex items-center justify-center">
              <Button
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => onSelectAnalysis(record)}
              >
                <Eye className="w-4 h-4 text-white" />
              </Button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 h-6 w-6"
              onClick={() => deleteAnalysis(record.id)}
            >
              <Trash2 className="w-3 h-3 text-white" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
