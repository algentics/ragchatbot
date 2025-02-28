import { prisma } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get("token")?.value

    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tokenUsage: true,
      },
    })

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Transform user object to include token limits
    const userWithLimits = {
      ...user,
      tokenLimits: {
        daily: user.tokenUsage?.dailyLimit || 1000,
        monthly: user.tokenUsage?.monthlyLimit || 10000,
      },
      tokenUsage: {
        daily: user.tokenUsage?.daily || 0,
        monthly: user.tokenUsage?.monthly || 0,
      },
      password: undefined,
    }

    return new Response(JSON.stringify({ user: userWithLimits }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }
}

