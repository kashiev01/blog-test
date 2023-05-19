import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongoose";

export interface CustomRequest extends Request {
	userId?: string;
	content?: any;
}

interface JwtPayload {
	userId: string;
	email: string;
	iat: number;
	exp: number;
}
const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET as Secret
		) as JwtPayload;
		req.userId = decodedToken.userId;
		next();
	} catch (error) {
		return res.status(403).json({ message: "Invalid token" });
	}
};

export default verifyToken;
