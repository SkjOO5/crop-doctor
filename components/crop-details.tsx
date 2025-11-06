"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trash2 } from "lucide-react"
import type { CropRecord } from "@/lib/farm-diary-types"
import { updateCrop, deleteCrop, getCropStats, getDiseasesByCrop, getActivitiesByCrop } from "@/lib/farm-storage"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"
import DiseaseRecorder from "./disease-recorder"
import ActivityLogger from "./activity-logger"

interface CropDetailsProps {
  crop: CropRecord
  language: Language
  onBack: () => void
  onUpdate: (crop: CropRecord) => void
}

export default function CropDetails({ crop, language, onBack, onUpdate }: CropDetailsProps) {
  const stats = getCropStats(crop.id)
  const diseases = getDiseasesByCrop(crop.id)
  const activities = getActivitiesByCrop(crop.id)

  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const handleDelete = () => {
    if (confirm(t("confirmDelete") as any)) {
      deleteCrop(crop.id)
      onBack()
    }
  }

  const handleStatusChange = (newStatus: any) => {
    const updated = { ...crop, status: newStatus }
    updateCrop(crop.id, { status: newStatus })
    onUpdate(updated)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pt-6 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{crop.cropName}</h1>
            <p className="text-gray-600">{crop.fieldName}</p>
          </div>
          <Button onClick={handleDelete} variant="destructive" size="icon">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Crop Info Card */}
        <Card className="bg-white border-0 shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">{t("cropVariety")}</p>
              <p className="font-semibold">{crop.variety}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("areaAcres")}</p>
              <p className="font-semibold">{crop.areaAcres} acres</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("plantedDate")}</p>
              <p className="font-semibold">{new Date(crop.plantedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("cropStatus")}</p>
              <select
                value={crop.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm font-semibold px-2 py-1 border rounded"
              >
                <option value="planting">{t("planting")}</option>
                <option value="growing">{t("growing")}</option>
                <option value="ready-harvest">{t("readyHarvest")}</option>
                <option value="harvested">{t("harvested")}</option>
              </select>
            </div>
          </div>
          {crop.notes && (
            <div>
              <p className="text-sm text-gray-600 mb-1">{t("notes")}</p>
              <p className="text-gray-800">{crop.notes}</p>
            </div>
          )}
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-gray-600">{t("totalDiseases")}</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalDiseases}</p>
          </Card>
          <Card className="bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-gray-600">{t("severeIssues")}</p>
            <p className="text-2xl font-bold text-red-600">{stats.severeDiseases}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="diseases" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diseases">{t("diseasesRecorded")}</TabsTrigger>
            <TabsTrigger value="activities">{t("activityLog")}</TabsTrigger>
          </TabsList>

          <TabsContent value="diseases" className="space-y-4 mt-6">
            <DiseaseRecorder cropId={crop.id} language={language} />
            <div className="space-y-3">
              {diseases.map((disease) => (
                <Card key={disease.id} className="bg-white border-0 shadow-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{disease.disease}</h4>
                      <p className="text-sm text-gray-600">{new Date(disease.treatmentDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700 mt-2">{disease.treatmentApplied}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          disease.severity === "severe"
                            ? "bg-red-100 text-red-800"
                            : disease.severity === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {disease.severity.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-600 mt-2">
                        {disease.affectedArea}% {t("affectedArea")}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-6">
            <ActivityLogger cropId={crop.id} language={language} />
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="bg-white border-0 shadow-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{t(activity.type as any)}</h4>
                      <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
