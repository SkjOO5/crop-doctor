"use client"

import { Card } from "@/components/ui/card"
import type { CropRecord } from "@/lib/farm-diary-types"
import { getCropStats } from "@/lib/farm-storage"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"

interface FarmStatsProps {
  crops: CropRecord[]
  language: Language
}

export default function FarmStats({ crops, language }: FarmStatsProps) {
  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const activeCrops = crops.filter((c) => c.status !== "harvested")
  const totalDiseases = crops.reduce((sum, crop) => {
    const stats = getCropStats(crop.id)
    return sum + stats.totalDiseases
  }, 0)
  const severeDiseases = crops.reduce((sum, crop) => {
    const stats = getCropStats(crop.id)
    return sum + stats.severeDiseases
  }, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-gray-600">{t("totalCrops")}</p>
          <p className="text-3xl font-bold text-green-600">{crops.length}</p>
        </Card>
        <Card className="bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-gray-600">{t("activeCropsCount")}</p>
          <p className="text-3xl font-bold text-blue-600">{activeCrops.length}</p>
        </Card>
        <Card className="bg-orange-50 border border-orange-200 p-4">
          <p className="text-sm text-gray-600">{t("totalDiseases")}</p>
          <p className="text-3xl font-bold text-orange-600">{totalDiseases}</p>
        </Card>
        <Card className="bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-gray-600">{t("severeIssues")}</p>
          <p className="text-3xl font-bold text-red-600">{severeDiseases}</p>
        </Card>
      </div>
    </div>
  )
}
