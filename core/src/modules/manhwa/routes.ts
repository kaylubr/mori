import express from "express"
import manhwaController from "./controller.js"

const manhwaRoutes = express.Router()

manhwaRoutes.get("/", manhwaController.list)
manhwaRoutes.get("/:seriesId", manhwaController.get)

export default manhwaRoutes
