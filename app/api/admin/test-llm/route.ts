import { openai } from "@ai-sdk/openai"
import { azure } from "@ai-sdk/azure"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { provider, ...config } = data

    let model
    switch (provider) {
      case "openai":
        model = openai(config.model, { apiKey: config.apiKey })
        break
      case "azure":
        model = azure(config.deploymentName, {
          apiKey: config.apiKey,
          baseURL: config.endpoint,
        })
        break
      case "anthropic":
        model = anthropic(config.model, { apiKey: config.apiKey })
        break
      default:
        throw new Error("Unsupported provider")
    }

    // Test the model with a simple prompt
    const result = await streamText({
      model,
      messages: [{ role: "user", content: "Hello, are you working?" }],
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error testing LLM:", error)
    return new Response(JSON.stringify({ error: "Failed to test LLM connection" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

