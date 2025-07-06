import rateLimit from "express-rate-limit"
import logger from "@/config/logger"

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
    })
  },
})

// Strict rate limiter for message submissions
export const messageSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 messages per minute
  message: {
    success: false,
    message: "Too many message submissions. Please wait before submitting another message.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Message submission rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      success: false,
      message: "Too many message submissions. Please wait before submitting another message.",
    })
  },
})

// Strict rate limiter for admin login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Login rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    })
  },
})
