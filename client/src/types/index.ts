export interface Message {
  id: string
  content: string
  sanitizedContent: string
  messageLength: number
  isReviewed: boolean
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface MessageStats {
  totalMessages: number
  reviewedMessages: number
  pendingMessages: number
  messagesThisWeek: number
  messagesThisMonth: number
  averageMessageLength: number
}

export interface Admin {
  id: string
  email: string
  lastLogin?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    admin: Admin
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginatedResponse<T> {
  messages: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalMessages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface AnalyticsData {
  dailyAnalytics: DailyAnalytics[]
  totalStats: TotalStats
}

export interface DailyAnalytics {
  id: string
  date: string
  pageViews: number
  uniqueVisitors: number
  messageSubmissions: number
  adminLogins: number
  bounceRate: number
  averageSessionDuration: number
}

export interface TotalStats {
  totalPageViews: number
  totalUniqueVisitors: number
  totalMessageSubmissions: number
  totalAdminLogins: number
  averageBounceRate: number
  averageSessionDuration: number
}

export interface MessageSubmission {
  content: string
}

export interface AdminLogin {
  email: string
  password: string
}

export interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}
