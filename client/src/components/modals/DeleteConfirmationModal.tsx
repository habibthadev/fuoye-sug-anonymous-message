import type React from "react"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Message } from "@/types"

interface DeleteConfirmationModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  message,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!message) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Message
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-base text-muted-foreground">
            This action cannot be undone. The message will be permanently removed from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Message Preview */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Message to be deleted:</span>
            </div>
            <div className="text-sm text-red-600 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded border">
              ID: {message.id}
            </div>
            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
              <p className="line-clamp-3">
                {message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Warning</p>
              <p className="text-yellow-700 dark:text-yellow-300">
                Once deleted, this message cannot be recovered. Make sure you have downloaded or saved any important
                information before proceeding.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="spinner" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Yes, Delete Message
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
