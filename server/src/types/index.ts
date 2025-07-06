import type { Request } from "express"
import type { JwtPayload } from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string
    email: string
  }
}

export interface JWTPayload extends JwtPayload {
  adminId: string
  email: string
}

export interface MessageStats {
  totalMessages: number
  messagesThisWeek: number
  messagesThisMonth: number
  averageMessageLength: number
}

export interface SiteAnalytics {
  totalVisits: number
  uniqueVisitors: number
  messageSubmissions: number
  adminLogins: number
  lastUpdated: Date
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
}
