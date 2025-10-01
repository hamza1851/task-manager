import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const userRoutes = (app) => {
  // User routes
  app.put("/update-profile/:id", authenticate, updateProfile);
  app.get("/get-profile", authenticate, getProfile);
};

export default userRoutes;
