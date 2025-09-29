import dotenv from "dotenv"
dotenv.config()

const dbConfig = {
  HOST: process.env.HOST || "localhost",
  USER: process.env.USER || "root",
  PASSWORD: process.env.PASSWORD || "##Mylockk09##",
  DB: process.env.DB || "task_manager"
};

export default dbConfig;
