import "dotenv/config"

const PORT = Number(process.env.PORT ?? 3000)
const NODE_ENV = process.env.NODE_ENV ?? "development"
const DATABASE_URL =
  {
    development: process.env.DEV_DATABASE_URL,
    testing: process.env.TEST_DATABASE_URL,
    production: process.env.PROD_DATABASE_URL,
  }[NODE_ENV] ?? ""
const MANGAUPDATES_BASE_URL =
  process.env.MANGAUPDATES_BASE_URL ?? "https://api.mangaupdates.com/v1"
const SESSION_SECRET = process.env.SESSION_SECRET ?? "changeme"
const SESSION_MAX_AGE_MS = Number(
  process.env.SESSION_MAX_AGE_MS ?? 7 * 24 * 60 * 60 * 1000,
)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ""
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ??
  "http://localhost:3000/api/auth/google/callback"
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? ""
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? ""
const GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL ??
  "http://localhost:3000/api/auth/github/callback"
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173"

export default {
  PORT,
  DATABASE_URL,
  MANGAUPDATES_BASE_URL,
  SESSION_SECRET,
  SESSION_MAX_AGE_MS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  FRONTEND_URL,
}
