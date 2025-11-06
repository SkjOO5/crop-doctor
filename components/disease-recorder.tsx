"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDiseaseEntry } from "@/lib/farm-storage"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"

interface DiseaseRecorderProps {
  cropId: string
  language: Language
}

export default function DiseaseRecorder({ cropId, language }: DiseaseRecorderProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    disease: "",
    severity: "mild" as const,
    affectedArea: "",
    treatmentApplied: "",
    notes: "",
  })

  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addDiseaseEntry({
      cropId,
      disease: formData.disease,
      severity: formData.severity,
      affectedArea: Number.parseFloat(formData.affectedArea),
      treatmentApplied: formData.treatmentApplied,
      treatmentDate: Date.now(),
      image: "",
      notes: formData.notes,
    })
    setFormData({ disease: "", severity: "mild", affectedArea: "", treatmentApplied: "", notes: "" })
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full bg-orange-600 hover:bg-orange-700">
        {t("recordDisease")}
      </Button>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("diseaseName")}</label>
          <Input
            type="text"
            value={formData.disease}
            onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("severity")}</label>
          <Select value={formData.severity} onValueChange={(val: any) => setFormData({ ...formData, severity: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("affectedArea")}</label>
          <Input
            type="number"
            min="0"
            max="100"
            step="1"
            value={formData.affectedArea}
            onChange={(e) => setFormData({ ...formData, affectedArea: e.target.value })}
            placeholder="0-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("treatmentApplied")}</label>
          <Textarea
            value={formData.treatmentApplied}
            onChange={(e) => setFormData({ ...formData, treatmentApplied: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            {t("save")}
          </Button>
          <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="flex-1">
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
