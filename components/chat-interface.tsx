"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ChatMessage } from "@/components/chat-message"
import { DocumentUpload } from "@/components/document-upload"
import { ExportChat } from "@/components/export-chat"
import { Send, Paperclip } from "lucide-react"

// Add these imports at the top
import { useChat } from "ai/react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
}

type Citation = {
  id: string
  text: string
  document: {
    id: string
    title: string
    source: string
  }
}

// Update the ChatInterface component
export function ChatInterface() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showUpload, setShowUpload] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isPro = user?.subscription === "pro"

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/chat",
  })

  // Transform AI SDK messages to our message format
  const transformedMessages = aiMessages.map(
    (msg): Message => ({
      id: msg.id,
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
      // You would add citations here in a real implementation
      citations:
        msg.role === "assistant"
          ? [
              {
                id: "cit-1",
                text: "Sample citation from the knowledge base",
                document: {
                  id: "doc-1",
                  title: "Knowledge Base Document",
                  source: "Internal Documentation",
                },
              },
            ]
          : undefined,
    }),
  )

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUploadToggle = () => {
    if (!isPro) {
      toast({
        title: "Pro feature",
        description: "Document upload is only available for Pro users. Please upgrade your plan.",
        variant: "default",
      })
      return
    }

    setShowUpload(!showUpload)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {transformedMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Welcome to RAG Chatbot</h2>
                <p className="text-muted-foreground">
                  Ask a question to get started. The chatbot will provide answers based on the knowledge base.
                </p>
              </div>
            </div>
          ) : (
            transformedMessages.map((message) => <ChatMessage key={message.id} message={message} isPro={isPro} />)
          )}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary"></div>
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showUpload && isPro && (
        <div className="border-t bg-muted p-4">
          <DocumentUpload onClose={() => setShowUpload(false)} />
        </div>
      )}

      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="min-h-[60px] flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleUploadToggle}
                title={isPro ? "Upload document" : "Pro feature"}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {isPro && transformedMessages.length > 0 && (
            <div className="mt-2 flex justify-end">
              <ExportChat messages={transformedMessages} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

