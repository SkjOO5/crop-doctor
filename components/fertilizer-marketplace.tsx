"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, TrendingUp, TrendingDown, MapPin, Building2 } from "lucide-react"
import { getMarketPrices, type FertilizerPrice } from "@/lib/fertilizer-service"

export default function FertilizerMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [fertilizers, setFertilizers] = useState<FertilizerPrice[]>([])
  const [filteredFertilizers, setFilteredFertilizers] = useState<FertilizerPrice[]>([])

  useEffect(() => {
    const prices = getMarketPrices()
    setFertilizers(prices)
    setFilteredFertilizers(prices)
  }, [])

  useEffect(() => {
    let filtered = fertilizers

    if (selectedType !== "all") {
      filtered = filtered.filter((f) => f.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.uses.some((use) => use.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredFertilizers(filtered)
  }, [searchQuery, selectedType, fertilizers])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fertilizer Marketplace</h1>
        <p className="text-gray-600">Live prices from government and market sources</p>
      </div>

      <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Government Subsidized Prices</p>
            <p className="text-sm text-blue-700">
              🏛️ = Government controlled | 📊 = Market price | Updated: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search fertilizers by name or use..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
          >
            All
          </Button>
          <Button
            variant={selectedType === "organic" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("organic")}
          >
            Organic
          </Button>
          <Button
            variant={selectedType === "chemical" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("chemical")}
          >
            Chemical
          </Button>
          <Button
            variant={selectedType === "bio" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("bio")}
          >
            Bio-Fertilizer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFertilizers.map((fertilizer) => (
          <Card key={fertilizer.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{fertilizer.name}</h3>
                {fertilizer.npk && <p className="text-sm text-gray-600">NPK: {fertilizer.npk}</p>}
              </div>
              <Badge
                variant={
                  fertilizer.type === "organic" ? "default" : fertilizer.type === "bio" ? "secondary" : "outline"
                }
              >
                {fertilizer.type}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs">{fertilizer.source === "government" ? "🏛️" : "📊"}</span>
                <span className="text-2xl font-bold text-green-600">₹{fertilizer.price}</span>
                <span className="text-sm text-gray-600">{fertilizer.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {fertilizer.priceChange > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">+{fertilizer.priceChange}%</span>
                  </>
                ) : fertilizer.priceChange < 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">{fertilizer.priceChange}%</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No change</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <Badge
                variant={
                  fertilizer.availability === "in-stock"
                    ? "default"
                    : fertilizer.availability === "low-stock"
                      ? "secondary"
                      : "destructive"
                }
                className="text-xs"
              >
                {fertilizer.availability === "in-stock"
                  ? "In Stock"
                  : fertilizer.availability === "low-stock"
                    ? "Low Stock"
                    : "Out of Stock"}
              </Badge>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Best for:</p>
              <div className="flex flex-wrap gap-1">
                {fertilizer.uses.slice(0, 2).map((use, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {use}
                  </span>
                ))}
              </div>
            </div>

            <Button className="w-full" size="sm" disabled={fertilizer.availability === "out-of-stock"}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Find Nearby Dealers
            </Button>
          </Card>
        ))}
      </div>

      {filteredFertilizers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No fertilizers found matching your search.</p>
        </div>
      )}

      <Card className="mt-6 p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Prices for your region</p>
            <p className="text-sm text-green-700">
              Prices may vary by dealer. Government subsidized fertilizers (🏛️) have controlled prices across India.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
