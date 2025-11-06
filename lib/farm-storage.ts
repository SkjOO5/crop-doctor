import type { CropRecord, DiseaseEntry, ActivityLog, FarmDiary } from "./farm-diary-types"

const STORAGE_KEY = "farmDiary"

export function getFarmDiary(): FarmDiary {
  if (typeof window === "undefined") {
    return { crops: [], diseases: [], activities: [] }
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : { crops: [], diseases: [], activities: [] }
}

export function saveFarmDiary(diary: FarmDiary): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diary))
}

export function addCrop(crop: Omit<CropRecord, "id" | "createdAt" | "updatedAt">): CropRecord {
  const diary = getFarmDiary()
  const newCrop: CropRecord = {
    ...crop,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  diary.crops.push(newCrop)
  saveFarmDiary(diary)
  return newCrop
}

export function updateCrop(id: string, updates: Partial<CropRecord>): void {
  const diary = getFarmDiary()
  const cropIndex = diary.crops.findIndex((c) => c.id === id)
  if (cropIndex !== -1) {
    diary.crops[cropIndex] = {
      ...diary.crops[cropIndex],
      ...updates,
      updatedAt: Date.now(),
    }
    saveFarmDiary(diary)
  }
}

export function deleteCrop(id: string): void {
  const diary = getFarmDiary()
  diary.crops = diary.crops.filter((c) => c.id !== id)
  diary.diseases = diary.diseases.filter((d) => d.cropId !== id)
  diary.activities = diary.activities.filter((a) => a.cropId !== id)
  saveFarmDiary(diary)
}

export function getCrop(id: string): CropRecord | undefined {
  const diary = getFarmDiary()
  return diary.crops.find((c) => c.id === id)
}

export function getAllCrops(): CropRecord[] {
  return getFarmDiary().crops
}

export function addDiseaseEntry(entry: Omit<DiseaseEntry, "id" | "createdAt">): DiseaseEntry {
  const diary = getFarmDiary()
  const newEntry: DiseaseEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: Date.now(),
  }
  diary.diseases.push(newEntry)
  saveFarmDiary(diary)
  return newEntry
}

export function getDiseasesByCrop(cropId: string): DiseaseEntry[] {
  const diary = getFarmDiary()
  return diary.diseases.filter((d) => d.cropId === cropId)
}

export function addActivityLog(activity: Omit<ActivityLog, "id" | "createdAt">): ActivityLog {
  const diary = getFarmDiary()
  const newActivity: ActivityLog = {
    ...activity,
    id: Date.now().toString(),
    createdAt: Date.now(),
  }
  diary.activities.push(newActivity)
  saveFarmDiary(diary)
  return newActivity
}

export function getActivitiesByCrop(cropId: string): ActivityLog[] {
  const diary = getFarmDiary()
  return diary.activities.filter((a) => a.cropId === cropId).sort((a, b) => b.date - a.date)
}

export function getCropStats(cropId: string) {
  const diseases = getDiseasesByCrop(cropId)
  const activities = getActivitiesByCrop(cropId)

  return {
    totalDiseases: diseases.length,
    severeDiseases: diseases.filter((d) => d.severity === "severe").length,
    totalActivities: activities.length,
    lastActivity: activities[0]?.date,
  }
}
