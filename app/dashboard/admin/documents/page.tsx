import { DocumentManagement } from "@/components/admin/document-management"

export default function DocumentsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Document Management</h1>
      <DocumentManagement />
    </div>
  )
}

