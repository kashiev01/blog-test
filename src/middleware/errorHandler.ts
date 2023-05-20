import { NextFunction, Request, Response } from "express";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(500).json({ error: "Something went wrong with your request" });
};
