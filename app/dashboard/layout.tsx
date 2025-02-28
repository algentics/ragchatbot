import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { DirectionToggle } from "@/components/direction-toggle"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="hidden sm:inline-block">RAG Chatbot</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="flex items-center gap-2">
              <DirectionToggle />
              <ThemeToggle />
            </div>
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-e bg-background lg:block">
          <DashboardNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

