import express, { Application } from "express";

const app: Application = express();

import authRoutes from "./routes/auth";

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(8080, () => {
  console.log("The API has started.");
});
