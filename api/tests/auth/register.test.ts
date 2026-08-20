import { describe, it } from "vitest"

// Tests:
// - Successful registration stores a hashed password (never the raw value) and logs the user in immediately (req.login, session established).
// - 409 when the username is already taken.
// - 409 when the email is already taken.

describe("POST /api/auth/register", () => {
  it.todo("stores a hashed password and logs the user in immediately")
  it.todo("returns 409 when the username is already taken")
  it.todo("returns 409 when the email is already taken")
})
