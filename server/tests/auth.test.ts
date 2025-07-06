import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import app from "@/app"
import Admin from "@/models/Admin"

describe("Auth Controller", () => {
  beforeEach(async () => {
    await Admin.deleteMany({})
  })

  describe("POST /api/auth/login", () => {
    it("should create admin and login with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.admin.email).toBe(process.env.ADMIN_EMAIL)
    })

    it("should reject invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "wrong@email.com",
        password: "wrongpassword",
      })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should validate email format", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "password123",
      })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/auth/verify", () => {
    it("should verify valid token", async () => {
      // First login to get token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })

      const token = loginResponse.body.data.token

      const response = await request(app).get("/api/auth/verify").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.admin).toBeDefined()
    })

    it("should reject invalid token", async () => {
      const response = await request(app).get("/api/auth/verify").set("Authorization", "Bearer invalid-token")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should reject missing token", async () => {
      const response = await request(app).get("/api/auth/verify")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
