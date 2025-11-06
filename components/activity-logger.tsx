"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addActivityLog } from "@/lib/farm-storage"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"

interface ActivityLoggerProps {
  cropId: string
  language: Language
}

export default function ActivityLogger({ cropId, language }: ActivityLoggerProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "other" as const,
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addActivityLog({
      cropId,
      type: formData.type,
      description: formData.description,
      date: new Date(formData.date).getTime(),
    })
    setFormData({ type: "other", description: "", date: new Date().toISOString().split("T")[0] })
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
        {t("addActivity")}
      </Button>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("activityType")}</label>
          <Select value={formData.type} onValueChange={(val: any) => setFormData({ ...formData, type: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planted">{t("planted")}</SelectItem>
              <SelectItem value="treated">{t("treated")}</SelectItem>
              <SelectItem value="sprayed">{t("sprayed")}</SelectItem>
              <SelectItem value="fertilized">{t("fertilized")}</SelectItem>
              <SelectItem value="irrigated">{t("irrigated")}</SelectItem>
              <SelectItem value="other">{t("other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("date")}</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">{t("description")}</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            {t("save")}
          </Button>
          <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="flex-1">
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
