import { getDB, STORES } from "./db-schema"

interface SyncItem {
  id: string
  type: "crop" | "disease" | "activity"
  action: "create" | "update" | "delete"
  data: any
  timestamp: number
  synced: boolean
}

export async function saveToIndexedDB(storeName: string, data: any): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const db = await getDB()
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.put({
        ...data,
        id: data.id || Date.now().toString(),
        timestamp: Date.now(),
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        console.log(`[v0] Data saved to IndexedDB: ${storeName}`)
        resolve()
      }
    })
  } catch (error) {
    console.error("[v0] IndexedDB save error:", error)
  }
}

export async function getFromIndexedDB(storeName: string, key?: string): Promise<any> {
  if (typeof window === "undefined") return null

  try {
    const db = await getDB()
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = key ? store.get(key) : store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        console.log(`[v0] Data retrieved from IndexedDB: ${storeName}`)
        resolve(request.result)
      }
    })
  } catch (error) {
    console.error("[v0] IndexedDB get error:", error)
    return null
  }
}

export async function deleteFromIndexedDB(storeName: string, key: string): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const db = await getDB()
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        console.log(`[v0] Data deleted from IndexedDB: ${storeName}`)
        resolve()
      }
    })
  } catch (error) {
    console.error("[v0] IndexedDB delete error:", error)
  }
}

export async function addToSyncQueue(item: Omit<SyncItem, "id" | "timestamp">): Promise<void> {
  const syncItem: SyncItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    synced: false,
    ...item,
  }

  await saveToIndexedDB(STORES.syncQueue, syncItem)
  console.log("[v0] Item added to sync queue")
}

export async function getSyncQueue(): Promise<SyncItem[]> {
  const items = await getFromIndexedDB(STORES.syncQueue)
  return (Array.isArray(items) ? items : []).filter((item) => !item.synced)
}

export async function markAsSynced(syncItemId: string): Promise<void> {
  const items = await getFromIndexedDB(STORES.syncQueue)
  const item = (Array.isArray(items) ? items : []).find((i) => i.id === syncItemId)

  if (item) {
    await saveToIndexedDB(STORES.syncQueue, { ...item, synced: true })
    console.log("[v0] Sync item marked as synced")
  }
}

export async function syncData(): Promise<void> {
  if (!navigator.onLine) {
    console.log("[v0] Offline: Sync skipped")
    return
  }

  const syncQueue = await getSyncQueue()
  console.log(`[v0] Starting sync with ${syncQueue.length} pending items`)

  for (const item of syncQueue) {
    try {
      // In production, send to backend API
      console.log("[v0] Syncing item:", item)
      await markAsSynced(item.id)
    } catch (error) {
      console.error("[v0] Sync error:", error)
    }
  }
}

// Periodic sync
export function setupPeriodicSync(): void {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.sync.register("sync-data").catch((error) => {
        console.error("[v0] Sync registration error:", error)
      })
    })
  }

  // Fallback: sync when online
  window.addEventListener("online", syncData)
}

// Listen for online/offline changes
export function setupNetworkListener(): void {
  window.addEventListener("online", () => {
    console.log("[v0] Back online - syncing data")
    syncData()
  })

  window.addEventListener("offline", () => {
    console.log("[v0] Gone offline")
  })
}
