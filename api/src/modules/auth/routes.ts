import express from "express"
import authController from './controller.js'

const authRoutes = express.Router()

authRoutes.get('/', authController.getUsers)

export default authRoutes