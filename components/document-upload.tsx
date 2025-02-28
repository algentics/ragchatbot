"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"

export function DocumentUpload({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      ]

      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        })
        return
      }

      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      // In a real app, you would upload the file to your API
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and will be used for this chat session.",
      })

      onClose()
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Upload Document</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">Select a PDF or DOCX file</Label>
        <Input id="document" type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      </div>

      {file && (
        <div className="rounded-md bg-muted p-2">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
          {!isUploading && <Upload className="ms-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

