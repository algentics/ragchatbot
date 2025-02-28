import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateResponse(messages: any[], systemPrompt: string) {
  try {
    const result = await streamText({
      model: openai("gpt-4-turbo"),
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

