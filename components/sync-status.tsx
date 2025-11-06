"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { getSyncQueue, syncData } from "@/lib/offline-storage"

export default function SyncStatus() {
  const [pendingItems, setPendingItems] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    checkSyncStatus()
    const interval = setInterval(checkSyncStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkSyncStatus = async () => {
    const queue = await getSyncQueue()
    setPendingItems(queue.length)
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await syncData()
      setLastSyncTime(Date.now())
      await checkSyncStatus()
    } finally {
      setSyncing(false)
    }
  }

  if (pendingItems === 0 && !lastSyncTime) {
    return null
  }

  return (
    <Card className="bg-white border-0 shadow-sm p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {pendingItems > 0 ? (
          <>
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-gray-600">{pendingItems} pending sync</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">All synced</span>
          </>
        )}
      </div>
      <Button
        onClick={handleSync}
        disabled={syncing || pendingItems === 0}
        size="sm"
        variant="ghost"
        className="text-xs"
      >
        <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
      </Button>
    </Card>
  )
}
