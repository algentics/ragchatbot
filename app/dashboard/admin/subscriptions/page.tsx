import { SubscriptionManagement } from "@/components/admin/subscription-management"

export default function SubscriptionsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Subscription Management</h1>
      <SubscriptionManagement />
    </div>
  )
}

