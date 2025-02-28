"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileDown } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: {
    id: string
    text: string
    document: {
      id: string
      title: string
      source: string
    }
  }[]
}

export function ExportChat({ messages }: { messages: Message[] }) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "pdf" | "docx") => {
    setIsExporting(true)

    try {
      // In a real app, you would call your API to generate the document
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Chat exported",
        description: `Your chat has been exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Error exporting chat:", error)
      toast({
        title: "Export failed",
        description: "Failed to export chat. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? "Exporting..." : "Export"}
          <FileDown className="ms-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("docx")}>
          <Download className="mr-2 h-4 w-4" />
          Export as DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

