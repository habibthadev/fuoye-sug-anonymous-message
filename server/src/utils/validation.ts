import { z } from "zod"

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(5000, "Message cannot exceed 5000 characters")
    .trim(),
})

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const adminUpdateMessageSchema = z.object({
  isReviewed: z.boolean().optional(),
})

export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(["day", "week", "month", "year"]).optional(),
})

export type MessageInput = z.infer<typeof messageSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type AdminUpdateMessageInput = z.infer<typeof adminUpdateMessageSchema>
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
