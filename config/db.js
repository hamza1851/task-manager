import { Sequelize } from "sequelize";
import { dbConfig } from "../index.js";

const sequelize = new Sequelize({
  database: dbConfig.DB,
  username: dbConfig.USER,
  host: dbConfig.HOST,
  password: dbConfig.PASSWORD,
  dialect: "mysql",
  logging: false
});

export default sequelize;
