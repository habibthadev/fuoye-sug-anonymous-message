import { Router } from "express"
import type { Router as ExpressRouter } from "express"
import { loginAdmin, verifyToken } from "@/controllers/authController"
import { authenticateAdmin } from "@/middleware/auth"
import { validateRequest } from "@/middleware/validation"
import { loginLimiter } from "@/middleware/rateLimiter"
import { adminLoginSchema } from "@/utils/validation"

const router: ExpressRouter = Router()

router.post("/login", loginLimiter, validateRequest(adminLoginSchema), loginAdmin)
router.get("/verify", authenticateAdmin, verifyToken)

export default router
