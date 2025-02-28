"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, TestTube } from "lucide-react"

const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    models: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
    fields: [{ name: "apiKey", label: "API Key", type: "password" }],
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    models: ["gpt-4", "gpt-35-turbo"],
    fields: [
      { name: "apiKey", label: "API Key", type: "password" },
      { name: "endpoint", label: "Endpoint URL", type: "text" },
      { name: "deploymentName", label: "Deployment Name", type: "text" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: ["claude-3-opus", "claude-3-sonnet", "claude-2"],
    fields: [{ name: "apiKey", label: "API Key", type: "password" }],
  },
  {
    id: "bedrock",
    name: "Amazon Bedrock",
    models: ["anthropic.claude-v2", "ai21.j2-ultra", "cohere.command-text-v14"],
    fields: [
      { name: "accessKeyId", label: "AWS Access Key ID", type: "password" },
      { name: "secretAccessKey", label: "AWS Secret Access Key", type: "password" },
      { name: "region", label: "AWS Region", type: "text" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: ["deepseek-chat", "deepseek-coder"],
    fields: [{ name: "apiKey", label: "API Key", type: "password" }],
  },
  {
    id: "ollama",
    name: "Ollama",
    models: ["llama2", "mistral", "vicuna"],
    fields: [{ name: "endpoint", label: "Ollama Endpoint", type: "text" }],
  },
]

export function LLMSettings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0])
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleProviderChange = (providerId: string) => {
    const provider = PROVIDERS.find((p) => p.id === providerId)
    if (provider) {
      setSelectedProvider(provider)
      setFormData({})
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTest = async () => {
    setIsTesting(true)
    try {
      const response = await fetch("/api/admin/test-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider.id,
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Test failed")

      toast({
        title: "Test successful",
        description: "The LLM provider is configured correctly.",
      })
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Failed to connect to the LLM provider. Please check your settings.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/save-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider.id,
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      toast({
        title: "Settings saved",
        description: "LLM provider settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save LLM provider settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Tabs defaultValue={PROVIDERS[0].id}>
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        {PROVIDERS.map((provider) => (
          <TabsTrigger key={provider.id} value={provider.id} onClick={() => handleProviderChange(provider.id)}>
            {provider.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {PROVIDERS.map((provider) => (
        <TabsContent key={provider.id} value={provider.id}>
          <Card>
            <CardHeader>
              <CardTitle>{provider.name} Configuration</CardTitle>
              <CardDescription>
                Configure your {provider.name} API settings and select the default model.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {provider.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Default Model</Label>
                <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {provider.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTest} disabled={isTesting}>
                  {isTesting ? "Testing..." : "Test Connection"}
                  {!isTesting && <TestTube className="ml-2 h-4 w-4" />}
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                  {!isSaving && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}

