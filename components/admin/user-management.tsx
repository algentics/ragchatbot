"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash, UserPlus } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  subscription: "free" | "pro"
  createdAt: string
}

export function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      subscription: "pro",
      createdAt: "2023-01-15",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      subscription: "free",
      createdAt: "2023-03-20",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      subscription: "pro",
      createdAt: "2023-04-10",
    },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "user" | "admin",
      subscription: formData.get("subscription") as "free" | "pro",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    setIsAddDialogOpen(false)

    toast({
      title: "User added",
      description: `${newUser.name} has been added successfully.`,
    })
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const updatedUser: User = {
      ...selectedUser,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "user" | "admin",
      subscription: formData.get("subscription") as "free" | "pro",
    }

    setUsers(users.map((user) => (user.id === selectedUser.id ? updatedUser : user)))
    setIsEditDialogOpen(false)
    setSelectedUser(null)

    toast({
      title: "User updated",
      description: `${updatedUser.name}'s information has been updated.`,
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))

    toast({
      title: "User deleted",
      description: "The user has been removed from the system.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input placeholder="Search users..." className="max-w-sm" />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Add a new user to the system. All fields are required.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="user">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription">Subscription</Label>
                <Select name="subscription" defaultValue="free">
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      user.subscription === "pro"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.subscription}
                  </span>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information. All fields are required.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedUser.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={selectedUser.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select name="role" defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subscription">Subscription</Label>
                <Select name="subscription" defaultValue={selectedUser.subscription}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

