import { useEffect } from "react"
import { apiService } from "@/services/api"

let hasTrackedVisitor = false

export const useAnalytics = () => {
  useEffect(() => {
    // Track page view on every page load
    const trackPageView = async () => {
      try {
        await apiService.trackPageView()
      } catch (error) {
        console.error("Failed to track page view:", error)
      }
    }

    // Track unique visitor only once per session
    const trackUniqueVisitor = async () => {
      if (!hasTrackedVisitor) {
        try {
          await apiService.trackUniqueVisitor()
          hasTrackedVisitor = true
        } catch (error) {
          console.error("Failed to track unique visitor:", error)
        }
      }
    }

    trackPageView()
    trackUniqueVisitor()
  }, [])
}
