import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(__dirname, "../../uploads");
		fs.mkdirSync(uploadDir, { recursive: true });
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = path.extname(file.originalname);
		cb(null, uniqueSuffix + fileExtension);
	},
});

export const upload = multer({ storage });
