import Analytics from "@/models/Analytics"
import logger from "@/config/logger"

class AnalyticsService {
  async trackPageView(date: Date = new Date()): Promise<void> {
    try {
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      await Analytics.findOneAndUpdate(
        { date: today },
        {
          $inc: { pageViews: 1 },
          $setOnInsert: { date: today },
        },
        { upsert: true, new: true },
      )
    } catch (error) {
      logger.error("Failed to track page view:", error)
    }
  }

  async trackUniqueVisitor(date: Date = new Date()): Promise<void> {
    try {
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      await Analytics.findOneAndUpdate(
        { date: today },
        {
          $inc: { uniqueVisitors: 1 },
          $setOnInsert: { date: today },
        },
        { upsert: true, new: true },
      )
    } catch (error) {
      logger.error("Failed to track unique visitor:", error)
    }
  }

  async trackMessageSubmission(date: Date = new Date()): Promise<void> {
    try {
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      await Analytics.findOneAndUpdate(
        { date: today },
        {
          $inc: { messageSubmissions: 1 },
          $setOnInsert: { date: today },
        },
        { upsert: true, new: true },
      )
    } catch (error) {
      logger.error("Failed to track message submission:", error)
    }
  }

  async trackAdminLogin(date: Date = new Date()): Promise<void> {
    try {
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      await Analytics.findOneAndUpdate(
        { date: today },
        {
          $inc: { adminLogins: 1 },
          $setOnInsert: { date: today },
        },
        { upsert: true, new: true },
      )
    } catch (error) {
      logger.error("Failed to track admin login:", error)
    }
  }

  async getAnalytics(startDate?: Date, endDate?: Date) {
    try {
      const query: any = {}

      if (startDate || endDate) {
        query.date = {}
        if (startDate) query.date.$gte = startDate
        if (endDate) query.date.$lte = endDate
      }

      const analytics = await Analytics.find(query).sort({ date: -1 }).limit(30)

      const totalStats = await Analytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalPageViews: { $sum: "$pageViews" },
            totalUniqueVisitors: { $sum: "$uniqueVisitors" },
            totalMessageSubmissions: { $sum: "$messageSubmissions" },
            totalAdminLogins: { $sum: "$adminLogins" },
            averageBounceRate: { $avg: "$bounceRate" },
            averageSessionDuration: { $avg: "$averageSessionDuration" },
          },
        },
      ])

      return {
        dailyAnalytics: analytics,
        totalStats: totalStats[0] || {
          totalPageViews: 0,
          totalUniqueVisitors: 0,
          totalMessageSubmissions: 0,
          totalAdminLogins: 0,
          averageBounceRate: 0,
          averageSessionDuration: 0,
        },
      }
    } catch (error) {
      logger.error("Failed to get analytics:", error)
      throw new Error("Failed to retrieve analytics data")
    }
  }
}

export default new AnalyticsService()
