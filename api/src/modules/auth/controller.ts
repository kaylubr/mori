import type { Request, Response, NextFunction } from "express"
import userService from './service.js'

const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(userService.getUsers())
  } catch (error: unknown) {
    next()
  }
}

export default { getUsers }