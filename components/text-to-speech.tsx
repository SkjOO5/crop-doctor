"use client"

import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { useState } from "react"

interface TextToSpeechProps {
  text: string
  language: "en" | "hi" | "bh"
}

export default function TextToSpeech({ text, language }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = () => {
    // Cancel any ongoing speech
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    // Set language for speech
    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      bh: "hi-IN", // Bhojpuri uses Hindi voice
    }

    utterance.lang = langMap[language]
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  return (
    <Button onClick={handleSpeak} variant="outline" size="sm" className={isSpeaking ? "bg-green-50" : ""}>
      <Volume2 className="w-4 h-4 mr-2" />
      {isSpeaking ? "Stop" : "Speak"}
    </Button>
  )
}
