import mongoose from "mongoose";
import {Logging} from "@sfroads/common";

mongoose.set("strictQuery", true);
const connectDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGO_URI!);
		Logging.info(`connected to ${connect.connection.host}`);
	} catch (error: any) {
		Logging.error(`Error connecting to database ${error}`);
	}
};

export const SERVER_PORT = (process.env.SERVER_PORT as string)
	? Number(process.env.SERVER_PORT as string)
	: 1337;

export default connectDB;
