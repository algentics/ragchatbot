"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Trash, FileText } from "lucide-react"

export function DocumentManagement() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [documents, setDocuments] = useState([
    { id: "1", name: "Company Policy.docx", size: "1.2 MB", date: "2023-05-15" },
    { id: "2", name: "Product Manual.pdf", size: "3.5 MB", date: "2023-06-20" },
    { id: "3", name: "FAQ.docx", size: "0.8 MB", date: "2023-07-10" },
  ])
  const [chunkSize, setChunkSize] = useState(1000)
  const [chunkOverlap, setChunkOverlap] = useState(200)
  const [splittingMethod, setSplittingMethod] = useState("paragraph")
  const [customSeparator, setCustomSeparator] = useState("")

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // In a real app, you would upload the file to your API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Documents uploaded",
        description: "Your documents have been uploaded and will be processed.",
      })
    } catch (error) {
      console.error("Error uploading documents:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))

    toast({
      title: "Document deleted",
      description: "The document has been removed from the system.",
    })
  }

  const handleSaveChunkingSettings = async () => {
    try {
      // In a real app, you would save these settings to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Chunking settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving chunking settings:", error)
      toast({
        title: "Save failed",
        description: "Failed to save chunking settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="upload">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload">Upload Documents</TabsTrigger>
        <TabsTrigger value="manage">Manage Documents</TabsTrigger>
        <TabsTrigger value="settings">Chunking Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-4">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documents">Upload Documents (PDF or DOCX)</Label>
            <Input id="documents" type="file" accept=".pdf,.docx" multiple />
            <p className="text-xs text-muted-foreground">
              Upload PDF or DOCX files to be processed and added to the knowledge base.
            </p>
          </div>

          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Documents"}
            {!isUploading && <Upload className="ms-2 h-4 w-4" />}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="manage" className="space-y-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-4 border-b bg-muted p-2 font-medium">
            <div>Name</div>
            <div>Size</div>
            <div>Date</div>
            <div className="text-right">Actions</div>
          </div>

          {documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-4 items-center p-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {doc.name}
              </div>
              <div>{doc.size}</div>
              <div>{doc.date}</div>
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chunk-size">Chunk Size (tokens)</Label>
            <Input
              id="chunk-size"
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              The size of each chunk in tokens. Smaller chunks may improve retrieval precision but reduce context.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chunk-overlap">Chunk Overlap (tokens)</Label>
            <Input
              id="chunk-overlap"
              type="number"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              The number of tokens to overlap between chunks to maintain context.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="splitting-method">Splitting Method</Label>
            <Select value={splittingMethod} onValueChange={setSplittingMethod}>
              <SelectTrigger id="splitting-method">
                <SelectValue placeholder="Select a splitting method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph</SelectItem>
                <SelectItem value="sentence">Sentence</SelectItem>
                <SelectItem value="token">Token</SelectItem>
                <SelectItem value="character">Character</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">The method used to split documents into chunks.</p>
          </div>

          {splittingMethod === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-separator">Custom Separator</Label>
              <Input
                id="custom-separator"
                placeholder="e.g., \n\n"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">A custom separator to use when splitting documents.</p>
            </div>
          )}

          <Button onClick={handleSaveChunkingSettings}>Save Chunking Settings</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

