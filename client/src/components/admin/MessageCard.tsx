import type React from "react"
import { useState } from "react"
import { Download, Eye, EyeOff, Trash2, Calendar, MessageSquare, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MarkdownPreview } from "@/components/ui/MarkdownPreview"
import { MessagePreviewModal } from "@/components/modals/MessagePreviewModal"
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal"
import { formatDate, formatRelativeTime, truncateText } from "@/lib/utils"
import { apiService } from "@/services/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Message } from "@/types"

interface MessageCardProps {
  message: Message
  onUpdate: (id: string, updates: Partial<Message>) => void
  onDelete: (id: string) => void
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleToggleReviewed = async () => {
    setIsUpdating(true)

    try {
      const response = await apiService.updateMessage(message.id, {
        isReviewed: !message.isReviewed,
      })

      if (response.success && response.data) {
        onUpdate(message.id, response.data)
        toast.success(message.isReviewed ? "Message marked as unreviewed" : "Message marked as reviewed")
      }
    } catch (error: any) {
      toast.error("Failed to update message", {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDownload = () => {
    setShowPreviewModal(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)

    try {
      const response = await apiService.deleteMessage(message.id)

      if (response.success) {
        onDelete(message.id)
        toast.success("Message deleted successfully")
        setShowDeleteModal(false)
      }
    } catch (error: any) {
      toast.error("Failed to delete message", {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const shouldTruncate = message.sanitizedContent.length > 300
  const displayContent =
    isExpanded || !shouldTruncate ? message.sanitizedContent : truncateText(message.sanitizedContent, 300)

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-lg",
          "border-l-4",
          message.isReviewed
            ? "border-l-green-500 bg-green-50/50 dark:bg-green-900/10"
            : "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  message.isReviewed
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
                )}
              >
                <MessageSquare className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">ID: {message.id.slice(-8)}</span>
                  <div
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      message.isReviewed
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    )}
                  >
                    {message.isReviewed ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Reviewed
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span title={formatDate(message.createdAt)}>{formatRelativeTime(message.createdAt)}</span>
                  </div>
                  <span>{message.messageLength} characters</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleReviewed}
                disabled={isUpdating}
                className={cn(
                  "transition-colors",
                  message.isReviewed
                    ? "hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300"
                    : "hover:bg-green-50 hover:text-green-600 hover:border-green-300",
                )}
              >
                {isUpdating ? (
                  <div className="spinner" />
                ) : message.isReviewed ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 bg-transparent"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <MarkdownPreview content={displayContent} />
            </div>

            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80"
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Show less
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show more
                  </>
                )}
              </Button>
            )}

            {message.reviewedAt && (
              <div className="text-xs text-muted-foreground border-t pt-3">
                Reviewed on {formatDate(message.reviewedAt)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <MessagePreviewModal message={message} isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} />

      <DeleteConfirmationModal
        message={message}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  )
}
