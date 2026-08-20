import type { User } from "../src/generated/prisma/client.js"

export type PublicUser = Omit<User, "passwordHash" | "googleId" | "githubId">