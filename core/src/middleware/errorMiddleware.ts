import type { ErrorRequestHandler, Request, Response, NextFunction } from "express"

export const notFoundMiddleware = (_req: Request, res: Response) => {
	return res.status(404).json({ error: "Endpoint not found" })
}

export const errorMiddleware: ErrorRequestHandler = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const statusCode = typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number"
		? error.statusCode
		: 500
	const message = error instanceof Error ? error.message : "Internal server error"

	return res.status(statusCode).json({
		error: statusCode >= 500 ? "Internal server error" : message,
	})
}
