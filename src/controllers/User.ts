import express, { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { Document, Types } from "mongoose";
import dotenv from "dotenv";
import { compareHash } from "../utils/utils";

dotenv.config();

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	const { first_name, last_name, password, email } = req.body;

	await User.findOne({ email })
		.then(user => {
			if (user) {
				res.send("This email is already taken");
			} else {
				const newUser = new User({
					email,
					first_name,
					last_name,
					password,
				});

				newUser
					.save()
					.then(user => res.status(201).json({ user }))
					.catch(error => {
						res.status(500).json(error);
					});
			}
		})
		.catch(error => {
			res.status(500).json(error);
		});
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	let user: IUser | null;
	let isMatch;

	user = await User.findOne({ email });
	if (user?.password) {
		isMatch = await compareHash(password, user.password);
	}
	if (isMatch) {
		const token = jwt.sign(
			{ userId: user?._id, email: user?.email },
			process.env.JWT_SECRET as Secret,
			{ expiresIn: process.env.JWT_EXP }
		);
		res.status(200).json({
			success: true,
			token,
		});
	} else {
		res.send("Re-check credentials");
	}
};

export default { createUser, loginUser };
