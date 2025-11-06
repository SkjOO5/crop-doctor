"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { HardDrive } from "lucide-react"

export default function StorageStats() {
  const [storageInfo, setStorageInfo] = useState<{ usage: number; quota: number } | null>(null)

  useEffect(() => {
    checkStorage()
  }, [])

  const checkStorage = async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        setStorageInfo({
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
        })
      } catch (error) {
        console.error("[v0] Storage estimate error:", error)
      }
    }
  }

  if (!storageInfo) {
    return null
  }

  const percentUsed = (storageInfo.usage / storageInfo.quota) * 100
  const usageMB = (storageInfo.usage / 1024 / 1024).toFixed(2)
  const quotaMB = (storageInfo.quota / 1024 / 1024).toFixed(2)

  return (
    <Card className="bg-white border-0 shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <HardDrive className="w-4 h-4 text-gray-600" />
        <span className="text-xs font-medium text-gray-700">Local Storage</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            percentUsed > 80 ? "bg-red-500" : percentUsed > 50 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {usageMB} MB / {quotaMB} MB
      </p>
    </Card>
  )
}
