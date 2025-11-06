"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, RotateCw } from "lucide-react"

interface ImageCropperProps {
  image: string
  onCrop: (croppedImage: string) => void
  onCancel: () => void
}

export default function ImageCropper({ image, onCrop, onCancel }: ImageCropperProps) {
  const [rotation, setRotation] = useState(0)

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleCrop = () => {
    // For simplicity, return the image with rotation applied
    const canvas = document.createElement("canvas")
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const size = Math.max(img.width, img.height)
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.translate(size / 2, size / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader()
            reader.onload = (e) => {
              onCrop(e.target?.result as string)
            }
            reader.readAsDataURL(blob)
          }
        })
      }
    }
    img.src = image
  }

  return (
    <Card className="bg-white border-0 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Adjust Image</h2>
        <Button size="icon" variant="ghost" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-6 flex justify-center">
        <img
          src={image || "/placeholder.svg"}
          alt="preview"
          className="max-h-96 rounded-lg"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>

      <div className="space-y-4">
        <Button onClick={handleRotate} variant="outline" className="w-full bg-transparent">
          <RotateCw className="w-4 h-4 mr-2" />
          Rotate 90°
        </Button>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleCrop} className="flex-1 bg-green-600 hover:bg-green-700">
            Use This Image
          </Button>
        </div>
      </div>
    </Card>
  )
}
