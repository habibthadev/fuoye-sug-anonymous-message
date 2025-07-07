import type { Request, Response, NextFunction } from "express"
import logger from "../config/logger"

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"

  // Log the error
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400
    message = "Validation Error"
  }

  // Mongoose duplicate key error
  if (err.name === "MongoError" && (err as any).code === 11000) {
    statusCode = 400
    message = "Duplicate field value entered"
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired"
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong"
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn(`Route not found: ${req.method} ${req.url}`)
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`,
  })
}
