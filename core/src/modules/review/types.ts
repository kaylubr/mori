import type { z } from "zod"

import type { reviewBodySchema } from "./schema.js"

export type ReviewBody = z.infer<typeof reviewBodySchema>