import express from "express";
import cors from "cors";
import db from "./connections/sequelize/mySql.connection.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { ORIGIN, PORT } from "./configs/config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import logger from "./utils/logger.js";

const app = express();
const { connectDB } = db;

const corsOptions = {
  origin: ORIGIN
};

app.use(cors(corsOptions));
app.use(express.json());

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("Connection established");
//   })
//   .catch((err) => {
//     console.log("Error coccured connecting db: ", err);
//   });

// All routes

app.use(rateLimiter);
app.get("/", (req, res) => {
  console.log("Welcome Home");
  res.send("Welcome Home");
});
authRoutes(app);
userRoutes(app);
taskRoutes(app);

// Middlewares for wrong route and global error handling
app.use((req, res, next) => {
  logger.error(`Route not found - ${req.originalUrl}`);
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.name = "WrongRoute";
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to start server:", error);
  }
};
startServer();

// app.listen(PORT, (err) => {
//   if (err) {
//     console.log("Error occured: ", err);
//     return;
//   }
//   console.log("Sucessfully running the server");
// });
