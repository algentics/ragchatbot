import { prisma } from "@/lib/db"
import { openai } from "@ai-sdk/openai"
import { azure } from "@ai-sdk/azure"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export const maxDuration = 30

const systemPrompt = `You are a helpful AI assistant with access to a knowledge base through RAG (Retrieval-Augmented Generation).
Your responses should be well-structured using markdown formatting and include citations to the source documents.
Always format your responses with appropriate headers, lists, and tables when applicable.
When citing information, use inline citations like [1] and include a citations section at the end.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get active LLM provider
    const activeProvider = await prisma.lLMProvider.findFirst({
      where: { isActive: true },
      include: {
        models: {
          where: { isDefault: true },
        },
      },
    })

    if (!activeProvider || !activeProvider.models[0]) {
      return new Response(
        JSON.stringify({
          error: "No active LLM provider configured",
          notification: {
            title: "LLM Configuration Required",
            message: "Please configure an LLM provider in the admin settings.",
          },
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    // Initialize the model based on the provider
    let model
    switch (activeProvider.name) {
      case "openai":
        model = openai(activeProvider.models[0].name, {
          apiKey: activeProvider.apiKey,
        })
        break
      case "azure":
        model = azure(activeProvider.models[0].name, {
          apiKey: activeProvider.apiKey,
        })
        break
      case "anthropic":
        model = anthropic(activeProvider.models[0].name, {
          apiKey: activeProvider.apiKey,
        })
        break
      default:
        throw new Error("Unsupported provider")
    }

    const result = await streamText({
      model,
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
    console.error("Error in chat route:", error)
    return new Response(
      JSON.stringify({
        error: "Error processing your request",
        notification: {
          title: "Chat Error",
          message: "There was an error processing your request. Please try again.",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

