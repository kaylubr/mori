export type MockUser = {
  id: number
  email: string
  username: string
  passwordHash: string | null
  googleId: string | null
  githubId: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export const makeUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: 1,
  email: "demo@example.com",
  username: "demo",
  passwordHash: "hashed-password",
  googleId: null,
  githubId: null,
  avatarUrl: null,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  ...overrides,
})
