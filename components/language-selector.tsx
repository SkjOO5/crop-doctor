"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Languages } from "lucide-react"
import type { Language } from "@/lib/translations"

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (lang: Language) => void
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: Language; name: string; native: string }[] = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
    { code: "as", name: "Assamese", native: "অসমীয়া" },
    { code: "ur", name: "Urdu", native: "اردو" },
    { code: "ks", name: "Kashmiri", native: "कॉशुर" },
    { code: "sd", name: "Sindhi", native: "سنڌي" },
    { code: "sa", name: "Sanskrit", native: "संस्कृत" },
    { code: "ne", name: "Nepali", native: "नेपाली" },
    { code: "kok", name: "Konkani", native: "कोंकणी" },
    { code: "mni", name: "Manipuri", native: "মৈতৈলোন্" },
    { code: "doi", name: "Dogri", native: "डोगरी" },
    { code: "mai", name: "Maithili", native: "मैथिली" },
    { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { code: "bh", name: "Bhojpuri", native: "भोजपुरी" },
  ]

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0]

  return (
    <div className="flex items-center justify-center gap-2 mb-4 px-4">
      <Languages className="w-5 h-5 text-gray-600" />
      <Select value={currentLanguage} onValueChange={(value) => onLanguageChange(value as Language)}>
        <SelectTrigger className="w-[280px]">
          <SelectValue>
            {currentLang.native} ({currentLang.name})
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.native} ({lang.name})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
