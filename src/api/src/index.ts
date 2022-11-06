import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();

import authRoutes from "./routes/auth";

app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: "Internal server error." });
});

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log("The API has started.");
});
