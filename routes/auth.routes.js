import { login, logout, signup } from "../controllers/user.controller.js";

const authRoutes =  (app) => {
  // Auth routes
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/logout", logout);
}

export default authRoutes