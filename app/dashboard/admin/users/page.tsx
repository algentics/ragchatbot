import { UserManagement } from "@/components/admin/user-management"

export default function UsersPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <UserManagement />
    </div>
  )
}

