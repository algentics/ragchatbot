import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { azure } from "@ai-sdk/azure"
import { anthropic } from "@ai-sdk/anthropic"
import { amazonBedrock } from "@ai-sdk/amazon-bedrock"
import { deepseek } from "@ai-sdk/deepseek"
import { createOllama } from "ollama-ai-provider"

type AIProvider = "openai" | "azure" | "anthropic" | "bedrock" | "deepseek" | "ollama"

export async function generateResponse(messages: any[], systemPrompt: string, provider: AIProvider, model: string) {
  try {
    let aiModel

    switch (provider) {
      case "openai":
        aiModel = openai(model)
        break
      case "azure":
        aiModel = azure(model)
        break
      case "anthropic":
        aiModel = anthropic(model)
        break
      case "bedrock":
        aiModel = amazonBedrock(model)
        break
      case "deepseek":
        aiModel = deepseek(model)
        break
      case "ollama":
        aiModel = createOllama()(model)
        break
      default:
        throw new Error("Unsupported AI provider")
    }

    const result = await streamText({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating response:", error)
    throw error
  }
}

