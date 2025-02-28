import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

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
    console.error("Sign in error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

