"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  landSize: number
  landUnit: "acre" | "hectare" | "bigha"
  state: string
  district: string
  crops: string[]
  joinedDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("cropDoctorUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check localStorage for user
    const users = JSON.parse(localStorage.getItem("cropDoctorUsers") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("cropDoctorUser", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("cropDoctorUsers") || "[]")

    // Check if email exists
    if (users.some((u: any) => u.email === userData.email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      joinedDate: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("cropDoctorUsers", JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword as User)
    localStorage.setItem("cropDoctorUser", JSON.stringify(userWithoutPassword))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cropDoctorUser")
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("cropDoctorUser", JSON.stringify(updatedUser))

      // Update in users list
      const users = JSON.parse(localStorage.getItem("cropDoctorUsers") || "[]")
      const index = users.findIndex((u: any) => u.id === user.id)
      if (index !== -1) {
        users[index] = { ...users[index], ...data }
        localStorage.setItem("cropDoctorUsers", JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
