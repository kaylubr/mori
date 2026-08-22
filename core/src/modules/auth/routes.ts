import express from "express"
import passport from "passport"

import { requireAuth } from "../../middleware/requireAuth.js"
import config from "../../config/index.js"
import authController from "./controller.js"

const authRoutes = express.Router()

authRoutes.get("/", authController.getUsers)
authRoutes.post("/register", authController.register)
authRoutes.post("/login", authController.login)
authRoutes.post("/logout", authController.logout)
authRoutes.get("/me", requireAuth, authController.me)

authRoutes.get("/google", (req, res, next) => {
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
    return authController.oauthFailure(req, res)
  }

  return passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  )
})
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
  }),
  authController.oauthSuccess,
)
authRoutes.get("/google/failure", authController.oauthFailure)

authRoutes.get("/github", (req, res, next) => {
  if (!config.GITHUB_CLIENT_ID || !config.GITHUB_CLIENT_SECRET) {
    return authController.oauthFailure(req, res)
  }

  return passport.authenticate("github")(req, res, next)
})
authRoutes.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/github/failure",
  }),
  authController.oauthSuccess,
)
authRoutes.get("/github/failure", authController.oauthFailure)

export default authRoutes
