import { VectorDatabaseManagement } from "@/components/admin/vector-database-management"

export default function VectorDatabasePage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Vector Database Management</h1>
      <VectorDatabaseManagement />
    </div>
  )
}

