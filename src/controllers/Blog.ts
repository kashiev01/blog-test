import { Types } from "mongoose";
import Blog from "../models/Blog";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middleware/jwtVerify";

const createPost = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { content } = req.body;
	const { userId } = req;
	console.log(content);
	const post = new Blog({
		author: new Types.ObjectId(userId),
		content,
	});

	post.save().then(post => res.send(post));
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
	await Blog.find({}).then(posts => res.send(posts));
};

const deletePostById = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req;
	const post_id = req.params.post_id;
	console.log(userId);

	const post = await Blog.findById(post_id);
	console.log(post?.author);
	if (post?.author.toString() === userId) {
		await Blog.findByIdAndDelete(new Types.ObjectId(post_id)).then(result =>
			res.send("Запись была успешно удалена")
		);
	} else {
		res.send("Вы не можете удалить чужую запись");
	}
};

const updatePostById = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { post_id } = req.params;
	const { content } = req.body;
	const { userId } = req;

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
