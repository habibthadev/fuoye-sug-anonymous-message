import type { Request, Response, NextFunction } from "express"
import analyticsService from "../services/analyticsService"
import type { AuthenticatedRequest } from "../types"

export const getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query

    const start = startDate ? new Date(startDate as string) : undefined
    const end = endDate ? new Date(endDate as string) : undefined

    const analytics = await analyticsService.getAnalytics(start, end)

    res.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}

export const trackPageView = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await analyticsService.trackPageView()

    res.json({
      success: true,
      message: "Page view tracked successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const trackUniqueVisitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await analyticsService.trackUniqueVisitor()

    res.json({
      success: true,
      message: "Unique visitor tracked successfully",
    })
  } catch (error) {
    next(error)
  }
}
