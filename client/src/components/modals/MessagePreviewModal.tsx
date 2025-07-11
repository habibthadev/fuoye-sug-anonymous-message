import type React from "react"
import { useState, useRef } from "react"
import { X, Download, Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MarkdownPreview } from "@/components/ui/MarkdownPreview"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import type { Message } from "@/types"

interface MessagePreviewModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
}

export const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({ message, isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownloadAsImage = async () => {
    if (!message || !contentRef.current) return

    setIsDownloading(true)

    try {
      // Create a temporary container with better styling for the image
      const tempContainer = document.createElement("div")
      tempContainer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 800px;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Inter', sans-serif;
        z-index: -1;
      `

      const messageCard = document.createElement("div")
      messageCard.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      `

      // Add header
      const header = document.createElement("div")
      header.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f8f9fa;
      `

      const logo = document.createElement("div")
      logo.style.cssText = `
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #28a745, #20c997);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        font-size: 24px;
        font-weight: bold;
        color: white;
      `
      logo.textContent = "SU"

      const headerText = document.createElement("div")
      headerText.innerHTML = `
        <div style="font-size: 24px; font-weight: 700; color: #2d3748; margin-bottom: 5px;">Anonymous Message</div>
        <div style="font-size: 16px; color: #718096; font-weight: 500;">Student Union Government</div>
      `

      header.appendChild(logo)
      header.appendChild(headerText)

      // Add content
      const content = document.createElement("div")
      content.style.cssText = `
        font-size: 18px;
        line-height: 1.8;
        color: #2d3748;
        margin-bottom: 30px;
        white-space: pre-wrap;
        word-wrap: break-word;
      `
      content.textContent = message.content

      // Add footer
      const footer = document.createElement("div")
      footer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        border-top: 2px solid #f8f9fa;
        font-size: 14px;
        color: #718096;
      `

      const messageId = document.createElement("div")
      messageId.style.cssText = `
        font-family: 'Monaco', 'Consolas', monospace;
        background: #f7fafc;
        padding: 5px 10px;
        border-radius: 6px;
      `
      messageId.textContent = `ID: ${message.id}`

      const timestamp = document.createElement("div")
      timestamp.style.fontWeight = "500"
      timestamp.textContent = formatDate(message.createdAt)

      footer.appendChild(messageId)
      footer.appendChild(timestamp)

      // Assemble the card
      messageCard.appendChild(header)
      messageCard.appendChild(content)
      messageCard.appendChild(footer)
      tempContainer.appendChild(messageCard)

      // Add to DOM temporarily
      document.body.appendChild(tempContainer)

      // Generate image
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempContainer.scrollHeight,
      })

      // Remove temporary container
      document.body.removeChild(tempContainer)

      // Download image
      const link = document.createElement("a")
      link.download = `message-${message.id}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast.success("Message downloaded as image successfully!")
    } catch (error) {
      console.error("Failed to download image:", error)
      toast.error("Failed to download image. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  if (!message) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Message Preview
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div ref={contentRef} className="space-y-6">
            {/* Message Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">ID: {message.id}</span>
                  <span>•</span>
                  <span>{message.messageLength} characters</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    message.isReviewed
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {message.isReviewed ? "Reviewed" : "Pending"}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="p-6 border rounded-lg bg-background">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Message Content</h3>
              <div className="prose prose-sm max-w-none">
                <MarkdownPreview content={message.sanitizedContent} />
              </div>
            </div>

            {/* Raw Content (for reference) */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Raw Content</h4>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words font-mono">
                {message.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownloadAsImage} disabled={isDownloading} className="bg-primary hover:bg-primary/90">
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="spinner" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download as Image
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
