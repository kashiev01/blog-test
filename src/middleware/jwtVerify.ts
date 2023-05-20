import jwt, { Secret } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { CustomRequest, JwtPayload } from "./interfaces/interfaces";

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
