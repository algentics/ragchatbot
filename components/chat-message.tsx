"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Download, FileDown, User, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { exportToPDF, exportToDOCX, downloadBlob } from "@/lib/document-export"
import type { Message, Citation } from "@/types/chat"

type CitationCardProps = {
  citation: Citation
  onClose: () => void
}

function CitationCard({ citation, onClose }: CitationCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{citation.document.title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{citation.text}</p>
        <p className="mt-2 text-xs text-muted-foreground">Source: {citation.document.source}</p>
      </CardContent>
    </Card>
  )
}

export function ChatMessage({ message, isPro = false }: { message: Message; isPro?: boolean }) {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null)
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation)
  }

  const handleCloseCitation = () => {
    setActiveCitation(null)
  }

  const handleExport = async (format: "pdf" | "docx") => {
    if (!isPro) {
      toast({
        title: "Pro feature",
        description: "Exporting messages is only available for Pro users.",
        variant: "default",
      })
      return
    }

    setIsExporting(true)

    try {
      let blob: Blob
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `rag-chatbot-response-${timestamp}.${format}`

      if (format === "pdf") {
        blob = await exportToPDF(message)
      } else {
        blob = await exportToDOCX(message)
      }

      downloadBlob(blob, filename)

      toast({
        title: "Message exported",
        description: `Your message has been exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Error exporting message:", error)
      toast({
        title: "Export failed",
        description: "Failed to export message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div
            className={`rounded-lg p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            {message.role === "assistant" ? (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <SyntaxHighlighter {...props} style={vscDarkPlus} language={match[1]} PreTag="div">
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    },
                    table: ({ node, ...props }) => (
                      <div className="overflow-auto">
                        <table className="border-collapse border border-border" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-border bg-muted p-2 text-left" {...props} />
                    ),
                    td: ({ node, ...props }) => <td className="border border-border p-2" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}

            {message.citations && message.citations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {message.citations.map((citation) => (
                  <Button
                    key={citation.id}
                    variant="secondary"
                    size="sm"
                    className="h-6 rounded-full text-xs"
                    onClick={() => handleCitationClick(citation)}
                  >
                    {citation.document.title}
                  </Button>
                ))}
              </div>
            )}

            {message.role === "assistant" && isPro && (
              <div className="mt-2 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" disabled={isExporting}>
                      {isExporting ? "Exporting..." : "Export"}
                      <FileDown className="ml-2 h-4 w-4" />
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
              </div>
            )}
          </div>

          {activeCitation && <CitationCard citation={activeCitation} onClose={handleCloseCitation} />}
        </div>
      </div>
    </div>
  )
}

