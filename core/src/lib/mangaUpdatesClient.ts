import config from "../config/index.js"
import type { MangaUpdatesSearchRequest } from "../modules/manhwa/types.js"

const request = async (url: string, init?: RequestInit): Promise<unknown> => {
  const response = await fetch(url, init)

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`MangaUpdates request failed with status ${response.status}: ${details}`)
  }

  return await response.json()
}

export const searchSeries = async (body: MangaUpdatesSearchRequest): Promise<unknown> => {
  return await request(`${config.MANGAUPDATES_BASE_URL}/series/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}
