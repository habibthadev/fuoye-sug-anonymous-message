import express, { Express } from "express"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import dotenv from "dotenv"

// Import configurations
import connectDB from "./config/database"
import logger from "./config/logger"

// Import middleware
import { generalLimiter } from "./middleware/rateLimiter"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"

// Import routes
import messageRoutes from "./routes/messages"
import authRoutes from "./routes/auth"
import analyticsRoutes from "./routes/analytics"

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
}

const app: Express = express()
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
  }),
)

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Sanitize data
app.use(mongoSanitize())

// Rate limiting
app.use(generalLimiter)

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })
  next()
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// API routes
app.use("/api/messages", messageRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/analytics", analyticsRoutes)

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

export default app
