import dotenv from "dotenv";
dotenv.config();
process.env.TZ = "Europe/London"; // update if salsa moves out

const MONGO_URL = process.env.MONGO_URL as string;
const TOP_SECRET_PATH = process.env.TOP_SECRET_PATH as string;
const PROD = (process.env.PROD as string) === "true";

export { MONGO_URL, TOP_SECRET_PATH, PROD };
