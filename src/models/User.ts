import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { genHash, genSalt } from "../utils/utils";

export interface IUser {
	_id: ObjectId;
	email: string;
	password: string;
	full_name: string;
}

export interface IUserModel extends IUser {}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true },
	full_name: { type: String, required: true },
	password: { type: String, required: false },
});

UserSchema.pre("save", async function () {
	if (!this.password) return;
	const salt = await genSalt();
	this.password = await genHash(this.password, salt);
});

export default mongoose.model<IUserModel>("User", UserSchema);
