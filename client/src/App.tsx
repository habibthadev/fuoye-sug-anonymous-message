import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { HomePage } from "@/pages/HomePage"
import { MessagePage } from "@/pages/MessagePage"
import { LoginPage } from "@/pages/admin/LoginPage"
import { DashboardPage } from "@/pages/admin/DashboardPage"
import { useThemeStore } from "@/stores/themeStore"
import { useAuthStore } from "@/stores/authStore"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const { theme } = useThemeStore()
  const { verifyAuth } = useAuthStore()

  useEffect(() => {
    // Apply theme on app load
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    // Verify auth on app load
    verifyAuth()
  }, [verifyAuth])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/message" element={<MessagePage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  )
}

export default App
