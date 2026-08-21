import { db } from "../../lib/database.js"
import type { PublicUser } from "./types.js"

const findByUsernameOrEmail = async (username: string, email: string) => {
  return await db.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })
}

const createUser = async (username: string, email: string, passwordHash: string) => {
  return await db.user.create({
    data: {
      username,
      email,
      passwordHash,
      avatarUrl: "",
    },
  })
}

const getUsers = async (): Promise<PublicUser[]> => {
  return await db.user.findMany({
    omit: {
      passwordHash: true,
      googleId: true,
      githubId: true,
    },
  })
}

export default { findByUsernameOrEmail, createUser, getUsers }