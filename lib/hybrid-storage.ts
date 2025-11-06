import { getFarmDiary, saveFarmDiary } from "./farm-storage"
import { saveToIndexedDB, getFromIndexedDB, addToSyncQueue } from "./offline-storage"
import { STORES } from "./db-schema"

// Hybrid storage: localStorage for fast access + IndexedDB for reliability
export async function hybridSave(key: string, data: any): Promise<void> {
  // Save to localStorage for quick access
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Save to IndexedDB for offline persistence
  await saveToIndexedDB(STORES.offlineCache, {
    key,
    data,
    id: key,
  })

  // Queue for sync if needed
  await addToSyncQueue({
    type: "crop",
    action: "create",
    data: { key, data },
  })

  console.log(`[v0] Data saved to hybrid storage: ${key}`)
}

export async function hybridRead(key: string): Promise<any> {
  // Try localStorage first (fastest)
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(key)
    if (local) {
      console.log(`[v0] Data retrieved from localStorage: ${key}`)
      return JSON.parse(local)
    }
  }

  // Fallback to IndexedDB
  const cached = await getFromIndexedDB(STORES.offlineCache, key)
  if (cached) {
    console.log(`[v0] Data retrieved from IndexedDB: ${key}`)
    return cached.data
  }

  return null
}

export async function syncFarmDiaryToIndexedDB(): Promise<void> {
  const diary = getFarmDiary()
  await saveToIndexedDB(STORES.farmDiary, {
    id: "farmDiary",
    data: diary,
    timestamp: Date.now(),
  })
  console.log("[v0] Farm diary synced to IndexedDB")
}

export async function restoreFarmDiaryFromIndexedDB(): Promise<void> {
  const cached = await getFromIndexedDB(STORES.farmDiary, "farmDiary")
  if (cached && cached.data) {
    saveFarmDiary(cached.data)
    console.log("[v0] Farm diary restored from IndexedDB")
  }
}
