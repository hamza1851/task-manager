import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASS,
  DB: process.env.DB
};

export const JWT_SECRET = process.env.JWT_SECRET
export const ORIGIN = process.env.ORIGIN
export const PORT = process.env.PORT || 8080