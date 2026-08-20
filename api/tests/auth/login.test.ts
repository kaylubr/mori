import { describe, it } from "vitest"

// Tests:
// - Correct username + password logs the user in (session established).
// - Wrong password for a real username fails with a generic "invalid credentials" error.
// - A username with no matching account fails with an "account doesn't exist" error, per spec.
// - A real account that was created via Google/GitHub only (no passwordHash set) attempting a password login fails with a distinct message.

describe("POST /api/auth/login", () => {
  it.todo("logs in with correct username and password")
  it.todo("fails with generic invalid credentials for wrong password")
  it.todo("returns account doesn't exist for unknown username")
  it.todo("returns sign-in-with-provider message for accounts without passwordHash")
})
