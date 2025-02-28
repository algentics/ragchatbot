import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { provider, model, ...config } = data

    // Update or create provider settings
    const llmProvider = await prisma.lLMProvider.upsert({
      where: { name: provider },
      update: {
        apiKey: config.apiKey,
        isActive: true,
        models: {
          upsert: {
            where: {
              providerId_name: {
                providerId: provider,
                name: model,
              },
            },
            create: {
              name: model,
              isDefault: true,
            },
            update: {
              isDefault: true,
            },
          },
        },
      },
      create: {
        name: provider,
        apiKey: config.apiKey,
        isActive: true,
        models: {
          create: {
            name: model,
            isDefault: true,
          },
        },
      },
    })

    return new Response(JSON.stringify({ success: true, provider: llmProvider }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error saving LLM settings:", error)
    return new Response(JSON.stringify({ error: "Failed to save LLM settings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

