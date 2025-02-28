"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Direction = "rtl" | "ltr"

interface DirectionContextType {
  direction: Direction
  setDirection: (direction: Direction) => void
  toggleDirection: () => void
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({
  children,
  defaultDirection = "rtl",
}: {
  children: React.ReactNode
  defaultDirection?: Direction
}) {
  const [direction, setDirection] = useState<Direction>(defaultDirection)

  useEffect(() => {
    const html = document.documentElement
    html.dir = direction
    html.lang = direction === "rtl" ? "ar" : "en"
  }, [direction])

  const toggleDirection = () => {
    setDirection((prev) => (prev === "rtl" ? "ltr" : "rtl"))
  }

  return (
    <DirectionContext.Provider value={{ direction, setDirection, toggleDirection }}>
      {children}
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (context === undefined) {
    throw new Error("useDirection must be used within a DirectionProvider")
  }
  return context
}

