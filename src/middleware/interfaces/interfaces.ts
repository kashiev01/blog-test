import { Request } from "express";

export interface CustomRequest extends Request {
	userId?: string;
	content?: any;
}

export interface JwtPayload {
	userId: string;
	email: string;
	iat: number;
	exp: number;
}
