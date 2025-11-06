"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { MandiPrice } from "@/lib/weather-types"
import type { Language } from "@/lib/translations"
import { farmTranslations } from "@/lib/farm-translations"

interface MandiPricesProps {
  prices: MandiPrice[]
  language: Language
}

export default function MandiPricesComponent({ prices, language }: MandiPricesProps) {
  const [expandedCommodity, setExpandedCommodity] = useState<string | null>(null)

  const t = (key: keyof typeof farmTranslations.en) => farmTranslations[language]?.[key as any] || key

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "bg-green-50 border-green-200"
    if (trend === "down") return "bg-red-50 border-red-200"
    return "bg-gray-50 border-gray-200"
  }

  return (
    <Card className="bg-white border-0 shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Mandi Prices Today</h3>
      <div className="space-y-2">
        {prices.map((price) => (
          <div
            key={`${price.commodity}-${price.market}`}
            onClick={() => setExpandedCommodity(expandedCommodity === price.commodity ? null : price.commodity)}
            className={`border rounded-lg p-3 cursor-pointer transition ${getTrendColor(price.trend)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{price.commodity}</h4>
                <p className="text-xs text-gray-600">{price.market}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ₹{price.price}/{price.unit}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {getTrendIcon(price.trend)}
                  <span
                    className={`text-xs font-medium ${
                      price.trend === "up"
                        ? "text-green-600"
                        : price.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {price.change > 0 ? "+" : ""}
                    {price.change}
                  </span>
                </div>
              </div>
            </div>

            {expandedCommodity === price.commodity && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Market</p>
                    <p className="font-medium">{price.market}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Unit</p>
                    <p className="font-medium">{price.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Updated</p>
                    <p className="font-medium">{new Date(price.date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Trend</p>
                    <p className="font-medium capitalize">{price.trend}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
