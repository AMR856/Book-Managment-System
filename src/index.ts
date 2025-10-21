import express from "express";
import bodyParser from "body-parser";
import { errorHandler } from "./utils/errorHandler";
import authorRouter from "./author/author.route";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/authors", authorRouter);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
