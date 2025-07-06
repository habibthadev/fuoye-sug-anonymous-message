import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import app from "@/app"
import Analytics from "@/models/Analytics"
import Admin from "@/models/Admin"

describe("Analytics Controller", () => {
  let adminToken: string

  beforeEach(async () => {
    await Analytics.deleteMany({})
    await Admin.deleteMany({})

    // Create admin and get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    })

    adminToken = loginResponse.body.data.token
  })

  describe("POST /api/analytics/track/page-view", () => {
    it("should track page view", async () => {
      const response = await request(app).post("/api/analytics/track/page-view")

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe("POST /api/analytics/track/visitor", () => {
    it("should track unique visitor", async () => {
      const response = await request(app).post("/api/analytics/track/visitor")

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe("GET /api/analytics", () => {
    it("should get analytics data for admin", async () => {
      // Create test analytics data
      const today = new Date()
      await Analytics.create({
        date: today,
        pageViews: 100,
        uniqueVisitors: 50,
        messageSubmissions: 10,
        adminLogins: 2,
      })

      const response = await request(app).get("/api/analytics").set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.dailyAnalytics).toBeDefined()
      expect(response.body.data.totalStats).toBeDefined()
    })

    it("should require authentication", async () => {
      const response = await request(app).get("/api/analytics")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
