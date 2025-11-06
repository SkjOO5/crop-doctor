"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"

interface CropFormProps {
  language: Language
  onSubmit: (data: any) => void
}

export default function CropForm({ language, onSubmit }: CropFormProps) {
  const [formData, setFormData] = useState({
    cropName: "",
    fieldName: "",
    variety: "",
    areaAcres: "",
    sowingType: "direct" as const,
    plantedDate: new Date().toISOString().split("T")[0],
    status: "planting" as const,
    notes: "",
  })

  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      areaAcres: Number.parseFloat(formData.areaAcres),
      plantedDate: new Date(formData.plantedDate).getTime(),
    })
  }

  return (
    <Card className="bg-white border-0 shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("cropName")}</label>
          <Input
            type="text"
            value={formData.cropName}
            onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
            placeholder="e.g., Rice, Wheat, Cotton"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("fieldName")}</label>
          <Input
            type="text"
            value={formData.fieldName}
            onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
            placeholder="e.g., North Field, Field A"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("cropVariety")}</label>
          <Input
            type="text"
            value={formData.variety}
            onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
            placeholder="e.g., BAS-370, PB-1121"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("areaAcres")}</label>
          <Input
            type="number"
            step="0.1"
            value={formData.areaAcres}
            onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
            placeholder="e.g., 2.5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("sowingType")}</label>
          <Select
            value={formData.sowingType}
            onValueChange={(val: any) => setFormData({ ...formData, sowingType: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">{t("direct")}</SelectItem>
              <SelectItem value="transplant">{t("transplant")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("plantedDate")}</label>
          <Input
            type="date"
            value={formData.plantedDate}
            onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("cropStatus")}</label>
          <Select value={formData.status} onValueChange={(val: any) => setFormData({ ...formData, status: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planting">{t("planting")}</SelectItem>
              <SelectItem value="growing">{t("growing")}</SelectItem>
              <SelectItem value="ready-harvest">{t("readyHarvest")}</SelectItem>
              <SelectItem value="harvested">{t("harvested")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("notes")}</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes..."
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            {t("save")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
