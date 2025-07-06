import type React from "react"
import { MessageForm } from "@/components/forms/MessageForm"
import { useAnalytics } from "@/hooks/useAnalytics"

export const MessagePage: React.FC = () => {
  useAnalytics()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">Anonymous Messaging</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your thoughts, feedback, or concerns with the Student Union Government. Your message will be
              completely anonymous and secure.
            </p>
          </div>

          <MessageForm />
        </div>
      </div>
    </div>
  )
}
