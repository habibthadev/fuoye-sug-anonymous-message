import type { Request, Response, NextFunction } from "express"
import Admin from "@/models/Admin"
import { generateToken } from "@/utils/jwt"
import analyticsService from "@/services/analyticsService"
import logger from "@/config/logger"

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000 // 2 hours

export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find admin by email
    let admin = await Admin.findOne({ email })

    // If admin doesn't exist, create one with hardcoded credentials
    if (!admin) {
      const adminEmail = process.env.ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD

      if (!adminEmail || !adminPassword) {
        logger.error("Admin credentials not configured in environment variables")
        res.status(500).json({
          success: false,
          message: "Server configuration error",
        })
        return
      }

      if (email === adminEmail) {
        admin = new Admin({
          email: adminEmail,
          password: adminPassword,
        })
        await admin.save()
        logger.info("Admin account created:", { email: adminEmail })
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
        return
      }
    }

    // Check if account is locked
    if (admin.isLocked) {
      res.status(423).json({
        success: false,
        message: "Account temporarily locked due to too many failed login attempts",
      })
      return
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password)

    if (!isPasswordValid) {
      // Increment login attempts
      admin.loginAttempts += 1

      // Lock account if max attempts reached
      if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME)
        logger.warn("Admin account locked due to failed login attempts:", { email })
      }

      await admin.save()

      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
      return
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0
    admin.lockUntil = undefined
    admin.lastLogin = new Date()
    await admin.save()

    // Generate JWT token
    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
    })

    // Track analytics
    await analyticsService.trackAdminLogin()

    logger.info("Admin login successful:", { adminId: admin.id, email: admin.email })

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          lastLogin: admin.lastLogin,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // If we reach here, the token is valid (middleware already verified it)
    res.json({
      success: true,
      message: "Token is valid",
      data: {
        admin: (req as any).admin,
      },
    })
  } catch (error) {
    next(error)
  }
}
