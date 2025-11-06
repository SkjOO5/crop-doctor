"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TextToSpeech from "./text-to-speech"
import type { Language } from "@/lib/translations"
import { getTranslation } from "@/lib/translations"

interface TreatmentCardProps {
  treatment: {
    type: string
    method: string
    dosage: string
    application: string
  }
  index: number
  language: Language
}

export default function TreatmentCard({ treatment, index, language }: TreatmentCardProps) {
  const treatmentText = `${treatment.method}. ${getTranslation(language, "dosage")}: ${treatment.dosage}. ${getTranslation(language, "application")}: ${treatment.application}`

  return (
    <Card className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={treatment.type === "organic" ? "secondary" : "default"}>
              {treatment.type === "organic" ? "🌿 Organic" : "⚗️ Chemical"}
            </Badge>
          </div>
          <h4 className="font-semibold text-gray-900">{treatment.method}</h4>
        </div>
        <TextToSpeech text={treatmentText} language={language} />
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div>
          <span className="font-medium">{getTranslation(language, "dosage")}:</span>
          <p className="text-gray-600">{treatment.dosage}</p>
        </div>
        <div>
          <span className="font-medium">{getTranslation(language, "application")}:</span>
          <p className="text-gray-600">{treatment.application}</p>
        </div>
      </div>
    </Card>
  )
}
