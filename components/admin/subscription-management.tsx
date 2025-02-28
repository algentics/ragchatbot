"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

export function SubscriptionManagement() {
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
        description: "Subscription settings have been updated successfully.",
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
    <Tabs defaultValue="plans">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
        <TabsTrigger value="limits">Token Limits</TabsTrigger>
      </TabsList>

      <TabsContent value="plans" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Basic access with limited features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="free-name">Plan Name</Label>
                <Input id="free-name" defaultValue="Free" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free-description">Description</Label>
                <Input id="free-description" defaultValue="Basic access with daily token limits" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free-features">Features (one per line)</Label>
                <textarea
                  id="free-features"
                  className="h-32 w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={`Basic chat functionality
Limited daily tokens
Access to basic models
Case management`}
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>Premium access with advanced features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pro-name">Plan Name</Label>
                <Input id="pro-name" defaultValue="Pro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro-description">Description</Label>
                <Input id="pro-description" defaultValue="Premium access with higher token limits" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro-price">Monthly Price ($)</Label>
                <Input id="pro-price" type="number" defaultValue="19.99" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro-features">Features (one per line)</Label>
                <textarea
                  id="pro-features"
                  className="h-32 w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={`Higher monthly token limits
Document upload for context
Export chat as PDF or DOCX
Access to all models
Priority support
Case management`}
                ></textarea>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Plan Settings"}
          {!isSaving && <Save className="ms-2 h-4 w-4" />}
        </Button>
      </TabsContent>

      <TabsContent value="limits" className="space-y-4">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Free Plan Limits</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="free-daily-tokens">Daily Token Limit</Label>
                <Input id="free-daily-tokens" type="number" defaultValue="1000" />
                <p className="text-xs text-muted-foreground">Maximum number of tokens a free user can use per day.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="free-monthly-tokens">Monthly Token Limit</Label>
                <Input id="free-monthly-tokens" type="number" defaultValue="10000" />
                <p className="text-xs text-muted-foreground">Maximum number of tokens a free user can use per month.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pro Plan Limits</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pro-daily-tokens">Daily Token Limit</Label>
                <Input id="pro-daily-tokens" type="number" defaultValue="10000" />
                <p className="text-xs text-muted-foreground">Maximum number of tokens a pro user can use per day.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro-monthly-tokens">Monthly Token Limit</Label>
                <Input id="pro-monthly-tokens" type="number" defaultValue="100000" />
                <p className="text-xs text-muted-foreground">Maximum number of tokens a pro user can use per month.</p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Token Limits"}
            {!isSaving && <Save className="ms-2 h-4 w-4" />}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

