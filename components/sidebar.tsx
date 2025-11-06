"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Menu,
  Home,
  Camera,
  BookOpen,
  Cloud,
  ShoppingCart,
  User,
  History,
  Moon,
  Sun,
  LogOut,
  Settings,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Sidebar({ currentView, onNavigate, darkMode, onToggleDarkMode }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "scan", label: "Scan Crop", icon: Camera },
    { id: "diary", label: "Farm Diary", icon: BookOpen },
    { id: "weather", label: "Weather & Mandi", icon: Cloud },
    { id: "fertilizers", label: "Fertilizers", icon: ShoppingCart },
    { id: "history", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ]

  const handleNavigate = (view: string) => {
    onNavigate(view)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌾</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">Crop Doctor</h2>
                <p className="text-sm text-gray-600">{user?.name || "Guest"}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
            </div>

            {/* Settings */}
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate("settings")}>
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
