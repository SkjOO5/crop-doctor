"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus } from "lucide-react"
import type { CropRecord } from "@/lib/farm-diary-types"
import { getAllCrops, getCropStats, addCrop } from "@/lib/farm-storage"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"
import { syncFarmDiaryToIndexedDB } from "@/lib/hybrid-storage"
import CropForm from "./crop-form"
import CropDetails from "./crop-details"
import FarmStats from "./farm-stats"
import SyncStatus from "./sync-status"
import StorageStats from "./storage-stats"

interface FarmDiaryPageProps {
  onBack: () => void
  language: Language
}

export default function FarmDiaryPage({ onBack, language }: FarmDiaryPageProps) {
  const [crops, setCrops] = useState<CropRecord[]>([])
  const [selectedCrop, setSelectedCrop] = useState<CropRecord | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setCrops(getAllCrops())
    syncFarmDiaryToIndexedDB()
  }, [])

  const handleAddCrop = (cropData: any) => {
    const newCrop = addCrop(cropData)
    setCrops([...crops, newCrop])
    setShowForm(false)
    syncFarmDiaryToIndexedDB()
  }

  const activeCrops = crops.filter((c) => c.status !== "harvested")
  const completedCrops = crops.filter((c) => c.status === "harvested")

  const t = (key: string) => {
    const translations = farmTranslations[language as keyof typeof farmTranslations] || farmTranslations.en
    return (translations as any)[key] || key
  }

  if (selectedCrop) {
    return (
      <CropDetails
        crop={selectedCrop}
        language={language}
        onBack={() => setSelectedCrop(null)}
        onUpdate={(updated) => {
          setCrops(crops.map((c) => (c.id === updated.id ? updated : c)))
          setSelectedCrop(updated)
          syncFarmDiaryToIndexedDB()
        }}
      />
    )
  }

  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')

  if (showForm) {
    return (
      <div className={`min-h-screen pt-6 pb-12 px-4 ${isDarkMode
          ? 'agriculture-bg-dark agriculture-pattern-dark'
          : 'agriculture-bg-light agriculture-pattern'
        }`}>
        <div className="max-w-2xl mx-auto">
          <Button onClick={() => setShowForm(false)} variant="ghost" size="icon" className="mb-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CropForm language={language} onSubmit={handleAddCrop} />
        </div>
      </div>
    )
  }

  return (
    <main className={`min-h-screen pt-6 pb-12 px-4 ${isDarkMode
        ? 'agriculture-bg-dark agriculture-pattern-dark'
        : 'agriculture-bg-light agriculture-pattern'
      }`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t("farmDiary")}
          </h1>
        </div>

        <div className="space-y-3 mb-6">
          <SyncStatus />
          <StorageStats />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t("farmOverview")}</TabsTrigger>
            <TabsTrigger value="active">{t("activeCrops")}</TabsTrigger>
            <TabsTrigger value="completed">{t("completedCrops")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <FarmStats crops={crops} language={language} />
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-6">
            <Button onClick={() => setShowForm(true)} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              {t("addNewCrop")}
            </Button>
            {activeCrops.length === 0 ? (
              <Card className={`border-0 shadow-sm p-8 text-center ${isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-white'
                }`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {t("noCropsYet") || "No crops added yet"}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeCrops.map((crop) => (
                  <CropCard key={crop.id} crop={crop} language={language} onClick={() => setSelectedCrop(crop)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedCrops.length === 0 ? (
              <Card className={`border-0 shadow-sm p-8 text-center ${isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-white'
                }`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {t("noCompletedCrops") || "No completed crops yet"}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {completedCrops.map((crop) => (
                  <CropCard key={crop.id} crop={crop} language={language} onClick={() => setSelectedCrop(crop)} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

interface CropCardProps {
  crop: CropRecord
  language: Language
  onClick: () => void
}

function CropCard({ crop, language, onClick }: CropCardProps) {
  const stats = getCropStats(crop.id)
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const t = (key: string) => {
    const translations = farmTranslations[language as keyof typeof farmTranslations] || farmTranslations.en
    return (translations as any)[key] || key
  }

  return (
    <Card
      onClick={onClick}
      className={`border-0 shadow-md p-4 cursor-pointer hover:shadow-lg transition ${isDarkMode
          ? 'bg-green-900/30 border border-green-700/50 hover:bg-green-900/40'
          : 'bg-white hover:bg-gray-50'
        }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {crop.cropName}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {crop.fieldName}
          </p>
          <div className={`flex gap-4 mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            <span>{crop.variety}</span>
            <span>
              {crop.areaAcres} {t("areaAcres") || "acres"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode
              ? 'bg-green-700 text-white'
              : 'bg-green-100 text-green-800'
            }`}>
            {t(crop.status) || crop.status}
          </div>
          {stats.totalDiseases > 0 && (
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {stats.totalDiseases} {t("diseasesRecorded") || "diseases"}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
