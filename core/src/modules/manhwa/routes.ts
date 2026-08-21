import express from "express"
import manhwaController from "./controller.js"

const manhwaRoutes = express.Router()

manhwaRoutes.get("/", manhwaController.list)
manhwaRoutes.get("/:externalId", manhwaController.get)

export default manhwaRoutes
