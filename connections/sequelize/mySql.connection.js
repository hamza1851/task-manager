import { Sequelize } from "sequelize";
import { dbConfig } from "../../configs/config.js";
import logger from "../../utils/logger.js";

const sequelize = new Sequelize({
  database: dbConfig.DB,
  username: dbConfig.USER,
  host: dbConfig.HOST,
  password: dbConfig.PASSWORD,
  dialect: "mysql",
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established");

    await sequelize.sync({ force: false });
    logger.info("Database synced");
  } catch (error) {
    logger.error("Database connection error:", error);
    throw error;
  }
};

const db = { sequelize, connectDB };

export default db;
