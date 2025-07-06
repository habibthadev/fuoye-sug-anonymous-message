import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import type {
  ApiResponse,
  Message,
  MessageStats,
  PaginatedResponse,
  AnalyticsData,
  MessageSubmission,
  AdminLogin,
  AuthResponse,
} from "@/types"

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth-token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth-token")
          localStorage.removeItem("auth-admin")
          window.location.href = "/admin/login"
        }
        return Promise.reject(error)
      },
    )
  }

  // Auth endpoints
  async login(credentials: AdminLogin): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post("/auth/login", credentials)
    return response.data
  }

  async verifyToken(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get("/auth/verify")
    return response.data
  }

  // Message endpoints
  async submitMessage(message: MessageSubmission): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post("/messages/submit", message)
    return response.data
  }

  async getMessages(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Message>>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Message>>> = await this.api.get(
      `/messages?page=${page}&limit=${limit}`,
    )
    return response.data
  }

  async getMessage(id: string): Promise<ApiResponse<Message>> {
    const response: AxiosResponse<ApiResponse<Message>> = await this.api.get(`/messages/${id}`)
    return response.data
  }

  async updateMessage(id: string, updates: { isReviewed?: boolean }): Promise<ApiResponse<Message>> {
    const response: AxiosResponse<ApiResponse<Message>> = await this.api.patch(`/messages/${id}`, updates)
    return response.data
  }

  async deleteMessage(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/messages/${id}`)
    return response.data
  }

  async downloadMessage(id: string): Promise<Blob> {
    const response: AxiosResponse<Blob> = await this.api.get(`/messages/${id}/download`, {
      responseType: "blob",
    })
    return response.data
  }

  async getMessageStats(): Promise<ApiResponse<MessageStats>> {
    const response: AxiosResponse<ApiResponse<MessageStats>> = await this.api.get("/messages/stats")
    return response.data
  }

  // Analytics endpoints
  async trackPageView(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post("/analytics/track/page-view")
    return response.data
  }

  async trackUniqueVisitor(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post("/analytics/track/visitor")
    return response.data
  }

  async getAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse<AnalyticsData>> {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    const response: AxiosResponse<ApiResponse<AnalyticsData>> = await this.api.get(`/analytics?${params.toString()}`)
    return response.data
  }
}

export const apiService = new ApiService()
