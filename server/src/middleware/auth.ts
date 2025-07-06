import type { Response, NextFunction } from "express"
import { verifyToken } from "@/utils/jwt"
import type { AuthenticatedRequest } from "@/types"
import logger from "@/config/logger"

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
      return
    }

    const token = authHeader.substring(7)

    try {
      const decoded = verifyToken(token)
      req.admin = {
        id: decoded.adminId,
        email: decoded.email,
      }
      next()
    } catch (tokenError) {
      logger.warn("Invalid token attempt:", { token: token.substring(0, 10) + "..." })
      res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      })
      return
    }
  } catch (error) {
    logger.error("Authentication middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    })
  }
}
