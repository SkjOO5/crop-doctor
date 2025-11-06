export interface CropRecord {
  id: string
  cropName: string
  fieldName: string
  plantedDate: number
  sowingDate?: number
  harvestDate?: number
  variety: string
  areaAcres: number
  sowingType: "direct" | "transplant"
  status: "planting" | "growing" | "ready-harvest" | "harvested"
  notes: string
  createdAt: number
  updatedAt: number
}

export interface DiseaseEntry {
  id: string
  cropId: string
  disease: string
  severity: "mild" | "moderate" | "severe"
  affectedArea: number
  treatmentApplied: string
  treatmentDate: number
  image: string
  notes: string
  createdAt: number
}

export interface ActivityLog {
  id: string
  cropId: string
  type: "planted" | "treated" | "sprayed" | "harvested" | "fertilized" | "irrigated" | "other"
  description: string
  date: number
  image?: string
  createdAt: number
}

export interface FarmDiary {
  crops: CropRecord[]
  diseases: DiseaseEntry[]
  activities: ActivityLog[]
}
