"use client"

import { Button } from "@/components/ui/button"
import { useDirection } from "@/components/direction-provider"
import { Languages } from "lucide-react"

export function DirectionToggle() {
  const { direction, toggleDirection } = useDirection()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDirection}
      title={`Switch to ${direction === "rtl" ? "LTR" : "RTL"}`}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">Toggle direction</span>
    </Button>
  )
}

