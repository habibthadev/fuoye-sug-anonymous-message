import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Admin } from "@/types"
import { apiService } from "@/services/api"

interface AuthState {
  isAuthenticated: boolean
  admin: Admin | null
  token: string | null
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  verifyAuth: () => Promise<void>
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      admin: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await apiService.login({ email, password })

          if (response.success) {
            const { token, admin } = response.data

            // Store token in localStorage for API interceptor
            localStorage.setItem("auth-token", token)

            set({
              isAuthenticated: true,
              admin,
              token,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || "Login failed")
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Login failed"
          set({
            isAuthenticated: false,
            admin: null,
            token: null,
            isLoading: false,
            error: errorMessage,
          })
          throw error
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem("auth-token")
        localStorage.removeItem("auth-admin")

        set({
          isAuthenticated: false,
          admin: null,
          token: null,
          isLoading: false,
          error: null,
        })
      },

      verifyAuth: async () => {
        const token = localStorage.getItem("auth-token")

        if (!token) {
          set({ isAuthenticated: false, admin: null, token: null })
          return
        }

        set({ isLoading: true })

        try {
          const response = await apiService.verifyToken()

          if (response.success && response.data?.admin) {
            set({
              isAuthenticated: true,
              admin: response.data.admin,
              token,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error("Token verification failed")
          }
        } catch (error) {
          // Token is invalid, clear auth state
          localStorage.removeItem("auth-token")
          localStorage.removeItem("auth-admin")

          set({
            isAuthenticated: false,
            admin: null,
            token: null,
            isLoading: false,
            error: null,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        token: state.token,
      }),
    },
  ),
)
