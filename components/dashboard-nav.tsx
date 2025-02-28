"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { MessageSquare, FolderOpen, Settings, Database, Users, FileText, CreditCard, Home } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.role === "admin"

  const routes = [
    {
      href: "/dashboard",
      label: "Chat",
      icon: MessageSquare,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/cases",
      label: "Cases",
      icon: FolderOpen,
      active: pathname === "/dashboard/cases",
    },
    ...(isAdmin
      ? [
          {
            href: "/dashboard/admin/documents",
            label: "Documents",
            icon: FileText,
            active: pathname === "/dashboard/admin/documents",
          },
          {
            href: "/dashboard/admin/vector-db",
            label: "Vector Database",
            icon: Database,
            active: pathname === "/dashboard/admin/vector-db",
          },
          {
            href: "/dashboard/admin/users",
            label: "Users",
            icon: Users,
            active: pathname === "/dashboard/admin/users",
          },
          {
            href: "/dashboard/admin/subscriptions",
            label: "Subscriptions",
            icon: CreditCard,
            active: pathname === "/dashboard/admin/subscriptions",
          },
        ]
      : []),
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <nav className="grid items-start px-4 py-4">
      <div className="grid gap-1">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2 mb-2", pathname === "/dashboard" && "bg-secondary")}
          >
            <Home className="h-4 w-4 flip-x" />
            Return to Chat
          </Button>
        </Link>
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={route.active ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2", route.active ? "font-semibold" : "font-normal")}
            >
              <route.icon className="h-4 w-4 flip-x" />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}

