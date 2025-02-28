"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

export function LLMSettings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, you would save the settings to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings saved",
        description: "LLM settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Failed to save settings",
        description: "An error occurred while saving settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">LLM Configuration</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="model-name">Model Name</Label>
            <Input id="model-name" type="text" defaultValue="gpt-3.5-turbo" />
            <p className="text-xs text-muted-foreground">The name of the language model to use.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input id="temperature" type="number" defaultValue="0.7" step="0.1" min="0" max="1" />
            <p className="text-xs text-muted-foreground">
              Controls the randomness of the output. Higher values (e.g., 0.7) make the output more random, while lower
              values (e.g., 0.2) make it more deterministic.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">API Keys</h3>
        <div className="space-y-2">
          <Label htmlFor="openai-api-key">OpenAI API Key</Label>
          <Input id="openai-api-key" type="password" placeholder="Enter your OpenAI API key" />
          <p className="text-xs text-muted-foreground">Your OpenAI API key is required to use the language model.</p>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Settings"}
        {!isSaving && <Save className="ms-2 h-4 w-4" />}
      </Button>
    </form>
  )
}

