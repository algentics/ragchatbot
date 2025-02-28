import { LLMSettings } from "@/components/admin/llm-settings"

export default function LLMSettingsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">LLM Provider Settings</h1>
      <LLMSettings />
    </div>
  )
}

