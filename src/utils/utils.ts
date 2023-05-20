import * as bcrypt from "bcrypt";
import User from "../models/User";
import { Types } from "mongoose";
import Blog from "../models/Blog";

export const genSalt = async () => await bcrypt.genSalt();

export const genHash = async (
	password: string | Buffer,
	salt: string | number
) => await bcrypt.hash(password, salt);

export const compareHash = async (password: string, hash: string) =>
	await bcrypt.compare(password, hash);

export const createInitialDocuments = async () => {
	const numDocuments = 20;

	const documents = [];

	for (let i = 0; i < numDocuments; i++) {
		documents.push({
			author: new Types.ObjectId(),
			content: `Post number ${i + 1}`,
		});
	}

	const result = await Blog.insertMany(documents);
	console.log(`${result.length} documents inserted.`);
};
