import { db } from "../../lib/database.js"
import type { PublicUser } from "../../../types/user.js"

const getUsers = async (): Promise<PublicUser[]> => {
  return await db.user.findMany({
    omit: {
      passwordHash: true,
      googleId: true
    },
  })
}

export default { getUsers }