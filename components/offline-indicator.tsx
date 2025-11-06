"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 shadow-lg z-50">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-900">Offline Mode</p>
        <p className="text-xs text-yellow-700">Changes will sync when online</p>
      </div>
    </div>
  )
}
