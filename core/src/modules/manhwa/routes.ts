import express from "express"
import manhwaController from "./controller.js"

const manhwaRoutes = express.Router()

manhwaRoutes.get("/", manhwaController.list)
manhwaRoutes.get("/:id", manhwaController.get)

export default manhwaRoutes
