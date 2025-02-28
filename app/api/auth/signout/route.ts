import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the token cookie
    cookies().delete("token")

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Sign out error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

