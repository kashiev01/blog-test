import { Types } from "mongoose";
import Blog from "../models/Blog";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { CustomRequest } from "../middleware/interfaces/interfaces";

/**
 * Создает новый документ в коллекции Blog. Поле 'author' заполняется ObjectId, полученным из JWT токена,
 * данные для поля 'content' могут быть получены из req.body.content или req.file, 'created_at' генерируется автоматически. 
 * Если пользователь в поле 'content' передал файл, то в базе сохраняется его base64 код, если текст - в базе сохранется сам текст
 * @param req запрос
 * @param res ответ
 * @param next функция обработчик
 */
const createPost = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req;
	const { content } = req.body;

	let base64Data;
	if (req.file) {
		const filePath = req.file.path;
		const fileData = fs.readFileSync(filePath);
		base64Data = fileData.toString("base64");
	}

	const post = new Blog({
		author: new Types.ObjectId(userId),
		content: base64Data || content,
	});

	post
		.save()
		.then(post => res.send(post))
		.catch(error => res.send(error.message));
};

/**
 * Возвращает все записи с коллеции Blog c пагинацией. На каждой странице отображается по 20 записей
 * @param req запрос
 * @param res ответ
 * @param next функция обработчик
 */
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string, 10) || 1;
	const limit = 20;

	try {
		const totalCount = await Blog.countDocuments({});
		const totalPages = Math.ceil(totalCount / limit);

		const posts = await Blog.find({})
			.skip((page - 1) * limit)
			.limit(limit);

		res.send({
			page,
			totalPages,
			posts,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Удаление записи в коллеции Blog по _id записи. Стоит проверка, что только автор поста может удалить указанную запись.
 * Сравнение идет по полю 'author' и userId из JWT токена
 * @param req в запросе передается параметр 'post_id'
 * @param res ответ
 * @param next функция обработчик
 */
const deletePostById = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req;
	const post_id = req.params.post_id;
	const post = await Blog.findById(post_id);

	if (post?.author.toString() === userId) {
		await Blog.findByIdAndDelete(new Types.ObjectId(post_id)).then(result =>
			res.send("Запись была успешно удалена")
		);
	} else {
		res.send("Вы не можете удалить чужую запись");
	}
};

/**
 * Редактирование записи в коллеции Blog по _id записи. Стоит проверка, что только автор поста может редактировать указанную запись.
 * Сравнение идет по полю 'author' и userId из JWT токена
 * @param req в запросе передается параметр 'post_id'
 * @param res ответ
 * @param next функция обработчик
 */
const updatePostById = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { post_id } = req.params;
	const { userId } = req;

	let content;
	if (req.file) {
		const filePath = req.file.path;
		const fileData = fs.readFileSync(filePath);
		content = fileData.toString("base64");
	}

	if (req.body.content) {
		content = req.body.content;
	}

	const post = await Blog.findById(post_id);

	if (post?.author.toString() === userId) {
		await Blog.findByIdAndUpdate(post_id, { content }, { new: true })
			.then(post => res.send(post))
			.catch(data => res.send(data));
	} else {
		res.send("Вы не можете редактировать чужую запись");
	}
};

export default { createPost, getPosts, deletePostById, updatePostById };
