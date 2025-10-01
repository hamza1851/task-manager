import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const taskRoutes = (app) => {
  // Task CRUD routes
  app.post("/tasks", authenticate, createTask);
  app.get("/tasks", authenticate, getTasks);
  app.get("/tasks/:id", authenticate, getTaskById);
  app.put("/tasks/:id", authenticate, updateTask);
  app.delete("/tasks/:id", authenticate, deleteTask);
};

export default taskRoutes;
