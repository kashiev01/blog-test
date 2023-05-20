import mongoose, { ObjectId, Schema, Types } from "mongoose";

export interface IBlog {
	_id: ObjectId;
	author: string;
	content: any;
	created_at: Date;
}

export interface IBlogModel extends IBlog {}

const BlogSchema: Schema = new Schema({
	author: { type: Types.ObjectId, required: true },
	created_at: { type: Schema.Types.Mixed, default: new Date() },
	content: { type: String, required: true },
});

export default mongoose.model<IBlogModel>("Blog", BlogSchema);
