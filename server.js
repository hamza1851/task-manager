import dotenv from "dotenv";
dotenv.config();

console.log("Secret: ", process.env.JWT_SECRET);
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import routes from "./routes/routes.js";

const app = express();
const corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 8080;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log("Error coccured connecting db: ", err);
  });

routes(app);

app.get("/", (req, res) => {
  console.log("Welcome Home");
  res.send("Welcome Home");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error occured: ", err);
    return;
  }
  console.log("Sucessfully running the server");
});
