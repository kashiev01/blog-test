import * as bcrypt from "bcrypt";

export const genSalt = async () => await bcrypt.genSalt();

export const genHash = async (
	password: string | Buffer,
	salt: string | number
) => await bcrypt.hash(password, salt);

export const compareHash = async (password: string, hash: string) =>
	await bcrypt.compare(password, hash);
