import express, { Application, NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Application = express();

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: "Internal server error." });
});

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("The API has started.");
});
