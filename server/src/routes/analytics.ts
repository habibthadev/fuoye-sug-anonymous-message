import { Router } from "express"
import type { Router as ExpressRouter } from "express"
import { getAnalytics, trackPageView, trackUniqueVisitor } from "../controllers/analyticsController"
import { authenticateAdmin } from "../middleware/auth"

const router: ExpressRouter = Router()

// Public tracking routes
router.post("/track/page-view", trackPageView)
router.post("/track/visitor", trackUniqueVisitor)

// Protected admin routes
router.get("/", authenticateAdmin, getAnalytics)

export default router
