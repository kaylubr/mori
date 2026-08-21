import express from "express"

import { requireAuth } from "../../middleware/requireAuth.js"
import reportController from "./controller.js"

const reportRoutes = express.Router()

reportRoutes.post("/:reviewId/report", requireAuth, reportController.create)

export default reportRoutes