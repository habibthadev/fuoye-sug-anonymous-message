import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import app from "@/app"
import Message from "@/models/Message"
import Admin from "@/models/Admin"

describe("Message Controller", () => {
  let adminToken: string

  beforeEach(async () => {
    await Message.deleteMany({})
    await Admin.deleteMany({})

    // Create admin and get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    })

    adminToken = loginResponse.body.data.token
  })

  describe("POST /api/messages/submit", () => {
    it("should submit a valid message", async () => {
      const messageContent = "This is a test message with enough characters to pass validation."

      const response = await request(app).post("/api/messages/submit").send({ content: messageContent })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBeDefined()
    })

    it("should reject message that is too short", async () => {
      const response = await request(app).post("/api/messages/submit").send({ content: "Short" })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it("should sanitize malicious content", async () => {
      const maliciousContent = '<script>alert("xss")</script>This is a test message with enough characters.'

      const response = await request(app).post("/api/messages/submit").send({ content: maliciousContent })

      expect(response.status).toBe(201)

      // Check that the message was saved without the script tag
      const message = await Message.findById(response.body.data.id)
      expect(message?.sanitizedContent).not.toContain("<script>")
    })
  })

  describe("GET /api/messages", () => {
    it("should get all messages for admin", async () => {
      // Create test messages
      await Message.create([
        {
          content: "Test message 1 with enough characters for validation.",
          sanitizedContent: "Test message 1 with enough characters for validation.",
          messageLength: 50,
        },
        {
          content: "Test message 2 with enough characters for validation.",
          sanitizedContent: "Test message 2 with enough characters for validation.",
          messageLength: 50,
        },
      ])

      const response = await request(app).get("/api/messages").set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.messages).toHaveLength(2)
      expect(response.body.data.pagination).toBeDefined()
    })

    it("should require authentication", async () => {
      const response = await request(app).get("/api/messages")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/messages/stats", () => {
    it("should get message statistics", async () => {
      // Create test messages
      await Message.create([
        {
          content: "Test message 1 with enough characters for validation.",
          sanitizedContent: "Test message 1 with enough characters for validation.",
          messageLength: 50,
          isReviewed: true,
        },
        {
          content: "Test message 2 with enough characters for validation.",
          sanitizedContent: "Test message 2 with enough characters for validation.",
          messageLength: 60,
          isReviewed: false,
        },
      ])

      const response = await request(app).get("/api/messages/stats").set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.totalMessages).toBe(2)
      expect(response.body.data.reviewedMessages).toBe(1)
      expect(response.body.data.pendingMessages).toBe(1)
    })
  })

  describe("PATCH /api/messages/:id", () => {
    it("should update message review status", async () => {
      const message = await Message.create({
        content: "Test message with enough characters for validation.",
        sanitizedContent: "Test message with enough characters for validation.",
        messageLength: 50,
      })

      const response = await request(app)
        .patch(`/api/messages/${message.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isReviewed: true })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.isReviewed).toBe(true)
    })
  })
})
