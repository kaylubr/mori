import express from "express"
import session from "express-session"
import passport from "passport"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"

import authRoutes from "./modules/auth/routes.js"
import manhwaRoutes from "./modules/manhwa/routes.js"
import config from "./config/index.js"
import { db } from "./lib/database.js"
import "./modules/auth/passport.js"

const app = express()

app.use(express.json())

const sessionStore = new PrismaSessionStore(db as any, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
})

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: config.SESSION_MAX_AGE_MS,
    },
  }),
)

app.use(passport.initialize())
app.use(passport.session())
app.use("/api/auth", authRoutes)
app.use("/api/manhwa", manhwaRoutes)

export default app
