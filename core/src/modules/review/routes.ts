import express from "express"

import { requireAuth } from "../../middleware/requireAuth.js"
import reviewController from "./controller.js"

const reviewRoutes = express.Router()

reviewRoutes.post("/:id/reviews", requireAuth, reviewController.create)
reviewRoutes.get("/:id/reviews", reviewController.list)

export default reviewRoutes