import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        tokenUsage: {
          create: {
            daily: 0,
            monthly: 0,
            dailyLimit: 1000,
            monthlyLimit: 10000,
          },
        },
      },
    })

    // Create session token
    const token = sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Sign up error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

