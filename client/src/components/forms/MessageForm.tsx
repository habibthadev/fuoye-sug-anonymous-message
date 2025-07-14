import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, Eye, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MarkdownPreview } from "@/components/ui/MarkdownPreview"
import { apiService } from "@/services/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const messageSchema = z.object({
  content: z
    .string()
    .max(5000, "Message cannot exceed 5000 characters")
    .trim(),
})

type MessageFormData = z.infer<typeof messageSchema>

export const MessageForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("write")

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
  })

  const content = watch("content", "")
  const characterCount = content.length
  const progressPercentage = Math.min((characterCount / 5000) * 100, 100)

  const onSubmit = async (data: MessageFormData) => {
    setIsSubmitting(true)

    try {
      const response = await apiService.submitMessage(data)

      if (response.success) {
        toast.success("Message submitted successfully!", {
          description: "Your anonymous message has been sent to the Student Union.",
        })
        reset()
        setActiveTab("write")
      } else {
        throw new Error(response.message || "Failed to submit message")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit message"
      toast.error("Submission failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gradient">Share Your Voice Anonymously</CardTitle>
          <CardDescription className="text-base">
            Your message will be sent anonymously to the Student Union Government. We don't track IP addresses or store
            any identifying information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 md:space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="write" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-2 md:space-y-4">
                <div className="space-y-2">
                  <Textarea
                    {...register("content")}
                    placeholder="Share your thoughts, feedback, or concerns here... You can use markdown formatting for better presentation."
                    className={cn(
                      "min-h-[300px] resize-none border text-base leading-relaxed",
                      "focus:ring-2 focus:ring-primary focus:border-transparent",
                      "transition-all duration-200",
                      errors.content && "border-red-500 focus:ring-red-500",
                    )}
                    disabled={isSubmitting}
                  />

                  {errors.content && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.content.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Character count: {characterCount.toLocaleString()} / 5,000
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                         characterCount > 4500 ? "text-yellow-500": characterCount ? "text-red-500" : "text-green-500" )}
                    >
                      {characterCount > 4500 ? "Almost at limit": characterCount > 5000 ? "Exceeded the limit" : "Good length"}
                    </span>
                  </div>

                  <Progress
                    value={progressPercentage}
                    className={cn("h-2 transition-all duration-300", characterCount > 4500 && "animate-pulse")}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-2 md:space-y-4">
                <div className="min-h-[300px] p-6 border rounded-lg bg-muted/30">
                  {content.trim() ? (
                    <MarkdownPreview content={content} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center space-y-2">
                        <Eye className="h-12 w-12 mx-auto opacity-50" />
                        <p>Write your message to see the preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  "flex-1 h-12 text-base font-medium",
                  "bg-gradient-to-r from-primary to-primary/80",
                  "hover:from-primary/90 hover:to-primary/70",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200",
                  isSubmitting && "animate-pulse",
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Message
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset()
                  setActiveTab("write")
                }}
                disabled={isSubmitting || !content.trim()}
                className="h-12 px-8"
              >
                Clear
              </Button>
            </div>
          </form>

          {/* Help text */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="font-semibold text-primary mb-2">Markdown Support</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>You can use markdown formatting in your message:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <code>**bold text**</code> for <strong>bold text</strong>
                </li>
                <li>
                  <code>*italic text*</code> for <em>italic text</em>
                </li>
                <li>
                  <code>`code`</code> for <code>inline code</code>
                </li>
                <li>
                  <code># Heading</code> for headings
                </li>
                <li>
                  <code>- List item</code> for bullet points
                </li>
                <li>
                  <code>&gt; Quote</code> for blockquotes
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
