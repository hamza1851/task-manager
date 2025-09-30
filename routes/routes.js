import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/task.controller.js";
import {
  getProfile,
  login,
  logout,
  signup,
  updateProfile
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export default function (app) {
  // Auth routes
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/logout", logout);

  // User routes
  app.put("/update-profile/:id", authenticate, updateProfile);
  app.get("/get-profile", authenticate, getProfile);

  // Task CRUD routes
  app.post("/tasks", authenticate, createTask);
  app.get("/tasks", authenticate, getTasks);
  app.get("/tasks/:id", authenticate, getTaskById);
  app.put("/tasks/:id", authenticate, updateTask);
  app.delete("/tasks/:id", authenticate, deleteTask);
}
