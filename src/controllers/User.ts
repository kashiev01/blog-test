import express, { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { Document, Types } from "mongoose";
import dotenv from "dotenv";
import { compareHash } from "../utils/utils";

dotenv.config();


/**
 * Эндпоинт для регистрации юзеров. Сначала идет проверка есть ли в базе юзер с таким email, если есть возвращает ответ "Email уже используется",
 * если нет - в коллекции User создается пользователь. Пароль в базе не сохранется в оригинальном виде, а в захэшированном виде для безопасности.  
 *
 * @param req в запросе передаются поля 'full_name', 'email', 'password'
 * @param res 
 * @param next 
 */
const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
	const { full_name, password, email } = req.body;

	await User.findOne({ email })
		.then(user => {
			if (user) {
				res.send("Email уже используется");
			} else {
				const newUser = new User({
					email,
					full_name,
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
/**
 * Эндпоинт для авторизации пользователя. Идет проверка email на соответствие email в базе, 
 * затем введенный пароль хэшируется и сравнивается с паролем в базе. Если совпало, пользователю выдается JWT токен
 * @param req в запросе передаются поля 'email', 'password'
 * @param res 
 * @param next 
 */
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

export default { userSignUp, loginUser };
