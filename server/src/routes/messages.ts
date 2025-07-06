import { Router } from "express"
import type { Router as ExpressRouter } from "express"
import {
  submitMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  downloadMessageAsImage,
  getMessageStats,
} from "@/controllers/messageController"
import { authenticateAdmin } from "@/middleware/auth"
import { validateRequest } from "@/middleware/validation"
import { messageSubmissionLimiter } from "@/middleware/rateLimiter"
import { messageSchema, adminUpdateMessageSchema } from "@/utils/validation"

const router: ExpressRouter = Router()

// Public routes
router.post("/submit", messageSubmissionLimiter, validateRequest(messageSchema), submitMessage)

// Protected admin routes
router.use(authenticateAdmin)

router.get("/", getAllMessages)
router.get("/stats", getMessageStats)
router.get("/:id", getMessageById)
router.patch("/:id", validateRequest(adminUpdateMessageSchema), updateMessage)
router.delete("/:id", deleteMessage)
router.get("/:id/download", downloadMessageAsImage)

export default router
