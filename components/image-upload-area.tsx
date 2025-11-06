"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void
}

export default function ImageUploadArea({ onFileSelect }: ImageUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleCameraClick = async () => {
    try {
      // Request camera with fallback options
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setShowCamera(true)
      }
    } catch (error: any) {
      console.error("Camera error:", error)
      
      // Show user-friendly error message
      if (error.name === "NotReadableError") {
        toast.error("Camera is being used by another application. Please close other apps using the camera.")
      } else if (error.name === "NotAllowedError") {
        toast.error("Camera permission denied. Please allow camera access in your browser settings.")
      } else if (error.name === "NotFoundError") {
        toast.error("No camera found on this device.")
      } else {
        toast.error("Could not access camera. Using file upload instead.")
      }
      
      // Fallback to file input
      fileInputRef.current?.click()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const captureFromVideo = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `crop-${Date.now()}.jpg`, {
              type: "image/jpeg",
            })
            onFileSelect(file)
            stopCamera()
            toast.success("Photo captured successfully!")
          }
        }, "image/jpeg", 0.9)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileSelect(files[0])
      toast.success("Image uploaded successfully!")
    } else {
      toast.error("Please upload an image file")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size should be less than 10MB")
        return
      }
      onFileSelect(file)
      toast.success("Image selected successfully!")
    }
  }

  if (showCamera) {
    return (
      <Card className="bg-black p-4 relative">
        <Button
          onClick={stopCamera}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30"
        >
          <X className="w-5 h-5 text-white" />
        </Button>
        <video
          ref={videoRef}
          className="w-full rounded-lg"
          autoPlay
          playsInline
        />
        <Button
          onClick={captureFromVideo}
          className="w-full mt-4 bg-green-600 hover:bg-green-700"
        >
          <Camera className="w-5 h-5 mr-2" />
          Capture Photo
        </Button>
        <canvas ref={canvasRef} className="hidden" />
      </Card>
    )
  }

  return (
    <Card
      className="border-2 border-dashed border-green-300 bg-green-50 p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-100 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upload Crop Image</h3>
          <p className="text-sm text-gray-600 mt-1">Click to browse or drag & drop an image</p>
        </div>
        <div className="flex gap-3 mt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleCameraClick()
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Camera className="w-5 h-5 mr-2" />
            Open Camera
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            variant="outline"
          >
            <Upload className="w-5 h-5 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  )
}
