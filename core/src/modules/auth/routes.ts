import express from "express"
import { requireAuth } from "../../middleware/requireAuth.js"
import authController from "./controller.js"

const authRoutes = express.Router()

authRoutes.get("/", authController.getUsers)
authRoutes.post("/register", authController.register)
authRoutes.post("/login", authController.login)
authRoutes.post("/logout", authController.logout)
authRoutes.get("/me", requireAuth, authController.me)

export default authRoutes