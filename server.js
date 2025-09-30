import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import routes from "./routes/routes.js";
import { ORIGIN, PORT } from "./index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
const corsOptions = {
  origin: ORIGIN
};

app.use(cors(corsOptions));
app.use(express.json());

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log("Error coccured connecting db: ", err);
  });

app.get("/", (req, res) => {
  console.log("Welcome Home");
  res.send("Welcome Home");
});

routes(app);

app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error occured: ", err);
    return;
  }
  console.log("Sucessfully running the server");
});
