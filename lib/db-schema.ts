// IndexedDB schema and initialization
export const DB_NAME = "CropDoctorDB"
export const DB_VERSION = 1

export interface DBStore {
  analysisHistory: string
  farmDiary: string
  syncQueue: string
  offlineCache: string
}

export const STORES: Record<keyof DBStore, string> = {
  analysisHistory: "analysisHistory",
  farmDiary: "farmDiary",
  syncQueue: "syncQueue",
  offlineCache: "offlineCache",
}

export async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      const db = request.result
      console.log("[v0] IndexedDB initialized successfully")
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create stores if they don't exist
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true })
          console.log(`[v0] Created store: ${storeName}`)
        }
      })
    }
  })
}

let dbInstance: IDBDatabase | null = null

export async function getDB(): Promise<IDBDatabase> {
  if (!dbInstance) {
    dbInstance = await initializeDB()
  }
  return dbInstance
}

export async function clearDB(): Promise<void> {
  const db = await getDB()
  Object.values(STORES).forEach((storeName) => {
    const request = db.transaction(storeName, "readwrite").objectStore(storeName).clear()
    request.onerror = () => console.error(`[v0] Error clearing ${storeName}`)
  })
}
