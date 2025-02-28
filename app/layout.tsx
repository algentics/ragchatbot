import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/direction-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RAG Chatbot",
  description: "A chatbot with RAG capabilities and subscription plans",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <DirectionProvider defaultDirection="rtl">
              {children}
              <Toaster />
            </DirectionProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'