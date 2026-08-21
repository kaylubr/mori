import request from "supertest"
import { describe, expect, it } from "vitest"

import app from "../src/app.js"

describe("middleware", () => {
	it("returns a JSON 404 for unknown endpoints", async () => {
		const response = await request(app).get("/api/does-not-exist")

		expect(response.status).toBe(404)
		expect(response.body).toEqual({ error: "Endpoint not found" })
	})
})