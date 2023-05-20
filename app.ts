import express from "express";
import mongoose from "mongoose";
import { MongoConfig } from "./src/config/mongoConfig";
import { ServerConfig } from "./src/config/appConfig";

import userRoute from "./src/routes/User";
import blogRoute from "./src/routes/Blog";
import { createInitialDocuments } from "./src/utils/utils";
import { errorHandler } from "./src/middleware/errorHandler";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use(errorHandler);

const mongooseConfig = new MongoConfig();
const mongooseOptions = mongooseConfig.createMongooseConfig();

const serverConfig = new ServerConfig();
const serverOptions = serverConfig.createServerConfig();
mongoose
	.connect(mongooseOptions.url)
	.then(() => {
		StartServer();
		createInitialDocuments();
		console.log("Database succesfully connected");
	})
	.catch(error => {
		console.log(error);
	});

const StartServer = () => {
	app.listen(serverOptions.port);
	console.log(`Server is running on port ${serverOptions.port}`);
};
