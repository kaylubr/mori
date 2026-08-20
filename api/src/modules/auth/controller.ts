import type { Request, Response, NextFunction } from "express"
import passport from "passport"
import { ZodError, z } from "zod"

import { db } from "../../lib/database.js"
import { hashPassword } from "./password.js"

const registerSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const sanitizeUser = (user: any) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.parse(req.body)

    const existingUser = await db.user.findFirst({
      where: { OR: [{ username: parsed.username }, { email: parsed.email }] },
    })

    if (existingUser) {
      return res.status(409).json({ error: "Username or email already exists" })
    }

    const passwordHash = await hashPassword(parsed.password)
    const user = await db.user.create({
      data: {
        username: parsed.username,
        email: parsed.email,
        passwordHash,
        avatarUrl: '',
      },
    })

    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError)
      }

      return res.status(201).json({ user: sanitizeUser(user) })
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? "Invalid input" })
    }

    return next(error)
  }
}

const login = (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid username or password" })
  }

  return passport.authenticate("local", (authError: unknown, user: any, info?: any) => {
    if (authError) {
      return next(authError)
    }

    if (!user) {
      if (info?.code === "no-account") {
        return res.status(404).json({ error: "Account doesn't exist" })
      }

      if (info?.code === "passwordless") {
        return res.status(400).json({ error: "This account signs in with Google/GitHub" })
      }

      return res.status(401).json({ error: "Invalid username or password" })
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError)
      }

      return res.json({ user: sanitizeUser(user) })
    })
  })(req, res, next)
}

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }

    req.session.destroy((destroyError) => {
      if (destroyError) {
        return next(destroyError)
      }

      res.clearCookie("connect.sid")
      return res.status(200).json({ success: true })
    })

    return undefined
  })
}

const me = (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  return res.json({ user: sanitizeUser(req.user) })
}

const getUsers = async (_req: Request, res: Response) => {
  const users = await db.user.findMany({
    omit: {
      passwordHash: true,
      googleId: true,
      githubId: true,
    },
  })

  return res.json(users)
}

export default { register, login, logout, me, getUsers }