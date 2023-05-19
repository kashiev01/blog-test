import express from "express";
import mongoose from "mongoose";
import { MongoConfig } from "./src/config/mongoConfig";
import { ServerConfig } from "./src/config/appConfig";

import userRoute from "./src/routes/User";
import blogRoute from "./src/routes/Blog";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/blog", blogRoute);

const mongooseConfig = new MongoConfig();
const mongooseOptions = mongooseConfig.createMongooseConfig();

const serverConfig = new ServerConfig();
const serverOptions = serverConfig.createServerConfig();
mongoose
	.connect(mongooseOptions.url)
	.then(() => {
		StartServer();
		console.log("Database succesfully connected");
	})
	.catch(error => {
		console.log(error);
	});

const StartServer = () => {
	app.listen(serverOptions.port);
	console.log(`Server is runnin on port ${serverOptions.port}`);
};
