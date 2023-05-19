import dotenv from "dotenv";

dotenv.config();

export class MongoConfig {
	private readonly host: string;
	private readonly port: string;
	private readonly dbName: string;
	constructor() {
		this.dbName = process.env.MONGO_DB_NAME || "";
		this.port = process.env.MONGO_PORT || "";
		this.host = process.env.MONGO_HOST || "";
	}

	public createMongooseConfig() {
		return {
			url: `mongodb://${this.host}:${this.port}/${this.dbName}`,
			dbName: this.dbName,
			directConnection: true,
			keepAlive: true,
			port: this.port,
		};
	}
}
