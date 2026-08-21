import type { z } from "zod"

import type { reportBodySchema } from "./schema.js"

export type ReportBody = z.infer<typeof reportBodySchema>