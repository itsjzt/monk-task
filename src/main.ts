import express, { Express } from "express";
import routes from "./routes";
import morgan from "morgan";

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", routes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/api`);
});
