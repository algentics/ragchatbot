import { LLMSettings } from "@/components/llm-settings"

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <LLMSettings />
    </div>
  )
}

