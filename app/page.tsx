import { LoginForm } from "@/components/login-form"

export default function Home() {
  // In a real app, you would check if the user is authenticated server-side
  // and redirect to the dashboard if they are
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">RAG Chatbot</h1>
          <p className="mt-2 text-muted-foreground">A chatbot with RAG capabilities and subscription plans</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

