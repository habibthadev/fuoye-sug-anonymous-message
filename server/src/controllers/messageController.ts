import type { Request, Response, NextFunction } from "express"
import Message from "@/models/Message"
import { sanitizeMarkdown } from "@/utils/sanitizer"
import emailService from "@/services/emailService"
import analyticsService from "@/services/analyticsService"
import imageService from "@/services/imageService"
import logger from "@/config/logger"
import type { AuthenticatedRequest } from "@/types"

export const submitMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content } = req.body

    // Sanitize the content
    const sanitizedContent = sanitizeMarkdown(content)

    if (!sanitizedContent || sanitizedContent.length < 10) {
      res.status(400).json({
        success: false,
        message: "Message content is too short after sanitization",
      })
      return
    }

    // Create new message
    const message = new Message({
      content: content.trim(),
      sanitizedContent,
      messageLength: content.trim().length,
    })

    await message.save()

    // Track analytics
    await analyticsService.trackMessageSubmission()

    // Send email notification (don't wait for it)
    emailService.sendNewMessageNotification(sanitizedContent).catch((error) => {
      logger.error("Failed to send email notification:", error)
    })

    logger.info("New message submitted:", { messageId: message.id, length: message.messageLength })

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: {
        id: message.id,
        submittedAt: message.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAllMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const messages = await Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-__v")

    const totalMessages = await Message.countDocuments()
    const totalPages = Math.ceil(totalMessages / limit)

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMessageById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const message = await Message.findById(id).select("-__v")

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      })
      return
    }

    res.json({
      success: true,
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

export const updateMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const { isReviewed } = req.body

    const message = await Message.findById(id)

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      })
      return
    }

    if (typeof isReviewed === "boolean") {
      message.isReviewed = isReviewed
      message.reviewedAt = isReviewed ? new Date() : undefined
    }

    await message.save()

    logger.info("Message updated:", { messageId: id, isReviewed, adminId: req.admin?.id })

    res.json({
      success: true,
      message: "Message updated successfully",
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const message = await Message.findById(id)

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      })
      return
    }

    await Message.findByIdAndDelete(id)

    logger.info("Message deleted:", { messageId: id, adminId: req.admin?.id })

    res.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const downloadMessageAsImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params

    const message = await Message.findById(id)

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      })
      return
    }

    const imageBuffer = await imageService.generateMessageImage(message.sanitizedContent, message.id)

    const filename = `message-${message.id}-${Date.now()}.png`

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": imageBuffer.length.toString(),
    })

    res.send(imageBuffer)

    logger.info("Message downloaded as image:", { messageId: id, adminId: req.admin?.id })
  } catch (error) {
    next(error)
  }
}

export const getMessageStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalMessages = await Message.countDocuments()
    const reviewedMessages = await Message.countDocuments({ isReviewed: true })
    const pendingMessages = totalMessages - reviewedMessages

    // Messages this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const messagesThisWeek = await Message.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    })

    // Messages this month
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const messagesThisMonth = await Message.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    // Average message length
    const avgLengthResult = await Message.aggregate([
      {
        $group: {
          _id: null,
          averageLength: { $avg: "$messageLength" },
        },
      },
    ])

    const averageMessageLength = avgLengthResult[0]?.averageLength || 0

    res.json({
      success: true,
      data: {
        totalMessages,
        reviewedMessages,
        pendingMessages,
        messagesThisWeek,
        messagesThisMonth,
        averageMessageLength: Math.round(averageMessageLength),
      },
    })
  } catch (error) {
    next(error)
  }
}
