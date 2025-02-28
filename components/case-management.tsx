"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { FolderPlus, MessageSquare, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Case = {
  id: string
  name: string
  createdAt: string
  threads: Thread[]
}

type Thread = {
  id: string
  name: string
  createdAt: string
  messageCount: number
}

export function CaseManagement() {
  const { toast } = useToast()
  const [cases, setCases] = useState<Case[]>([
    {
      id: "case-1",
      name: "Project Alpha",
      createdAt: "2023-07-15",
      threads: [
        {
          id: "thread-1",
          name: "Initial Requirements",
          createdAt: "2023-07-15",
          messageCount: 12,
        },
        {
          id: "thread-2",
          name: "Technical Specifications",
          createdAt: "2023-07-16",
          messageCount: 8,
        },
      ],
    },
    {
      id: "case-2",
      name: "Client Onboarding",
      createdAt: "2023-08-20",
      threads: [
        {
          id: "thread-3",
          name: "Welcome Package",
          createdAt: "2023-08-20",
          messageCount: 5,
        },
      ],
    },
  ])
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false)
  const [isAddThreadDialogOpen, setIsAddThreadDialogOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newCase: Case = {
      id: `case-${Date.now()}`,
      name: formData.get("name") as string,
      createdAt: new Date().toISOString().split("T")[0],
      threads: [],
    }

    setCases([...cases, newCase])
    setIsAddCaseDialogOpen(false)

    toast({
      title: "Case created",
      description: `Case "${newCase.name}" has been created successfully.`,
    })
  }

  const handleAddThread = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCase) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      name: formData.get("name") as string,
      createdAt: new Date().toISOString().split("T")[0],
      messageCount: 0,
    }

    const updatedCases = cases.map((c) => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          threads: [...c.threads, newThread],
        }
      }
      return c
    })

    setCases(updatedCases)
    setIsAddThreadDialogOpen(false)
    setSelectedCase(null)

    toast({
      title: "Thread created",
      description: `Thread "${newThread.name}" has been created successfully.`,
    })
  }

  const handleDeleteCase = (caseId: string) => {
    setCases(cases.filter((c) => c.id !== caseId))

    toast({
      title: "Case deleted",
      description: "The case has been deleted successfully.",
    })
  }

  const handleDeleteThread = (caseId: string, threadId: string) => {
    const updatedCases = cases.map((c) => {
      if (c.id === caseId) {
        return {
          ...c,
          threads: c.threads.filter((t) => t.id !== threadId),
        }
      }
      return c
    })

    setCases(updatedCases)

    toast({
      title: "Thread deleted",
      description: "The thread has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Input placeholder="Search cases..." className="max-w-sm" />
        <Dialog open={isAddCaseDialogOpen} onOpenChange={setIsAddCaseDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>Create a new case to organize your chat threads.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCase} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="case-name">Case Name</Label>
                <Input id="case-name" name="name" required />
              </div>
              <DialogFooter>
                <Button type="submit">Create Case</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-semibold">{caseItem.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCase(caseItem)
                      setIsAddThreadDialogOpen(true)
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Thread
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteCase(caseItem.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Case
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">Created: {caseItem.createdAt}</p>
              <div className="mt-4 space-y-2">
                {caseItem.threads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No threads yet. Create a new thread to get started.</p>
                ) : (
                  caseItem.threads.map((thread) => (
                    <div key={thread.id} className="flex items-center justify-between rounded-md border p-2">
                      <div>
                        <p className="font-medium">{thread.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{thread.createdAt}</span>
                          <span>•</span>
                          <span>{thread.messageCount} messages</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              // In a real app, you would navigate to the thread
                            }}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Open Thread
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteThread(caseItem.id, thread.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Thread
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddThreadDialogOpen} onOpenChange={setIsAddThreadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogDescription>Create a new thread in the case "{selectedCase?.name}".</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddThread} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thread-name">Thread Name</Label>
              <Input id="thread-name" name="name" required />
            </div>
            <DialogFooter>
              <Button type="submit">Create Thread</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

