import type { Request, Response, NextFunction } from "express"
import { type ZodSchema, ZodError } from "zod"
import logger from "../config/logger"

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))

        logger.warn("Validation error:", { errors: errorMessages, body: req.body })

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errorMessages,
        })
        return
      }

      logger.error("Unexpected validation error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      })
    }
  }
}
