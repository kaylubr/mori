import express from "express"

import { requireAuth } from "../../middleware/requireAuth.js"
import shelfController from "./controller.js"

const shelfRoutes = express.Router()

shelfRoutes.post("/", requireAuth, shelfController.add)
shelfRoutes.delete("/:manhwaId", requireAuth, shelfController.remove)
shelfRoutes.get("/", requireAuth, shelfController.list)

export default shelfRoutes