"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Droplets, Leaf, Loader2, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import LanguageSelector from "./language-selector"
import TextToSpeech from "./text-to-speech"
import TreatmentCard from "./treatment-card"
import { getTranslation, type Language, DEFAULT_LANGUAGE } from "@/lib/translations"

interface DiseaseAnalysisProps {
  image: string
  analysis: any
  loading: boolean
  onReset: () => void
  onSaveToHistory?: (analysis: any, image: string) => void
}

export default function DiseaseAnalysis({ image, analysis, loading, onReset, onSaveToHistory }: DiseaseAnalysisProps) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "bg-green-50 border-green-200"
      case "moderate":
        return "bg-yellow-50 border-yellow-200"
      case "severe":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "severe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSaveToDiary = () => {
    if (onSaveToHistory) {
      onSaveToHistory(analysis, image)
    }
  }

  return (
    <main className={`min-h-screen pt-6 pb-12 px-4 ${isDarkMode
      ? 'agriculture-bg-dark agriculture-pattern-dark'
      : 'agriculture-bg-light agriculture-pattern'
      }`}>
      <div className="max-w-2xl mx-auto">
        {/* Language Selector */}
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

        {/* Header */}
        <div className="flex items-center mb-6">
          <Button onClick={onReset} variant="ghost" size="icon" className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{getTranslation(language, "analysisResult")}</h1>
        </div>

        {/* Image Display */}
        <Card className="bg-white border-0 shadow-md mb-6 overflow-hidden">
          <div className="relative w-full aspect-square">
            <img src={image || "/placeholder.svg"} alt="Crop analysis" className="w-full h-full object-cover" />
          </div>
        </Card>

        {loading ? (
          <Card className="bg-white border-0 shadow-md p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600 mb-4" />
            <p className="text-lg font-medium text-gray-900">{getTranslation(language, "analyzing")}</p>
            <p className="text-sm text-gray-600 mt-2">{getTranslation(language, "analyzingDesc")}</p>
          </Card>
        ) : analysis?.error ? (
          <Card className="bg-red-50 border border-red-200 shadow-md p-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900">{getTranslation(language, "analysisFailed")}</h3>
                <p className="text-sm text-red-700 mt-1">{analysis.error}</p>
              </div>
            </div>
          </Card>
        ) : analysis ? (
          <div className="space-y-4">
            {analysis.confidence && (
              <Card className="bg-blue-50 border border-blue-200 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{getTranslation(language, "confidence")}</p>
                  <span className="text-sm font-bold text-blue-600">{(analysis.confidence * 100).toFixed(0)}%</span>
                </div>
                <Progress value={analysis.confidence * 100} className="h-2" />
              </Card>
            )}

            {/* Disease Detection with Voice */}
            <Card className={`border shadow-md p-6 ${getSeverityColor(analysis.severity)}`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{analysis.disease || "Unknown Disease"}</h3>
                    {analysis.severity && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityBadgeColor(analysis.severity)}`}
                      >
                        {analysis.severity.toUpperCase()}
                      </span>
                    )}
                    <TextToSpeech text={analysis.disease} language={language as any} />
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {analysis.description || "Detailed analysis of your crop condition"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Recommended Treatments */}
            {analysis.treatments && (
              <Card className={`border-0 shadow-md p-6 ${isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-white'
                }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  <Droplets className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  {getTranslation(language, "recommendedTreatment")}
                </h3>
                <div className="space-y-4">
                  {analysis.treatments.map((treatment: any, idx: number) => (
                    <TreatmentCard key={idx} treatment={treatment} index={idx} language={language} />
                  ))}
                </div>
              </Card>
            )}

            {/* Prevention Tips with Voice */}
            {analysis.prevention && (
              <Card className={`shadow-md p-6 ${isDarkMode
                ? 'bg-green-900/40 border border-green-700/50'
                : 'bg-green-50 border border-green-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getTranslation(language, "preventionMeasures")}
                  </h3>
                  <TextToSpeech text={analysis.prevention.join(". ")} language={language as any} />
                </div>
                <ul className="space-y-2">
                  {analysis.prevention.map((tip: string, idx: number) => (
                    <li key={idx} className={`flex gap-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={isDarkMode ? 'text-green-400 font-bold' : 'text-green-600 font-bold'}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Fertilizer Recommendations */}
            {analysis.fertilizers && analysis.fertilizers.length > 0 && (
              <Card className={`shadow-md p-6 ${isDarkMode
                ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-700/50'
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
                }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  <Leaf className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  Recommended Fertilizers
                </h3>
                <div className="space-y-4">
                  {analysis.fertilizers.map((fertilizer: any, idx: number) => (
                    <Card key={idx} className={`p-4 ${isDarkMode
                      ? 'bg-green-900/40 border border-amber-700/30'
                      : 'bg-white border border-amber-100'
                      }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {fertilizer.name}
                          </h4>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800 mt-1">
                            {fertilizer.type}
                          </span>
                          {fertilizer.npkRatio && (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 mt-1 ml-2">
                              NPK: {fertilizer.npkRatio}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${fertilizer.availability === 'high' ? 'bg-green-100 text-green-800' :
                          fertilizer.availability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {fertilizer.availability} availability
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 my-3 text-sm">
                        <div>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Dosage</p>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {fertilizer.dosage}
                          </p>
                        </div>
                        <div>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Frequency</p>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {fertilizer.frequency}
                          </p>
                        </div>
                      </div>

                      <div className={`rounded p-3 mb-3 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                        }`}>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Pricing
                        </p>
                        <div className="flex items-center gap-4">
                          {fertilizer.price.government && (
                            <div>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Govt Price
                              </p>
                              <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                ₹{fertilizer.price.government}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Market Price
                            </p>
                            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              ₹{fertilizer.price.market}
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {fertilizer.price.unit}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Application Method
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {fertilizer.applicationMethod}
                        </p>
                      </div>

                      {fertilizer.benefits && fertilizer.benefits.length > 0 && (
                        <div className="mb-3">
                          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Benefits
                          </p>
                          <ul className="space-y-1">
                            {fertilizer.benefits.map((benefit: string, i: number) => (
                              <li key={i} className={`text-sm flex gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {fertilizer.precautions && fertilizer.precautions.length > 0 && (
                        <div>
                          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Precautions
                          </p>
                          <ul className="space-y-1">
                            {fertilizer.precautions.map((precaution: string, i: number) => (
                              <li key={i} className={`text-sm flex gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className={isDarkMode ? 'text-amber-400' : 'text-amber-600'}>⚠</span>
                                {precaution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={onReset} variant="outline" className="flex-1 h-12 bg-transparent">
                {getTranslation(language, "analyzeAnother")}
              </Button>
              <Button onClick={handleSaveToDiary} className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                {getTranslation(language, "saveToDiary")}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
