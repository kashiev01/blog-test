import dotenv from "dotenv";

dotenv.config();

export class ServerConfig {
	private readonly port: string;

	constructor() {
		this.port = process.env.SERVER_PORT || "";
	}

	public createServerConfig() {
		return {
			port: this.port,
		};
	}
}
