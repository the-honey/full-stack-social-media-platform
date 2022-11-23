import express, { Application, NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
dotenv.config();

const app: Application = express();

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import reactionRoutes from "./routes/reactions";

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10_000_000 } });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: "Internal server error." });
});

app.post(
  "/api/upload",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file)
      return res.status(400).json({ message: "Something went wrong." });
    res.status(200).json({ message: "File has been uploaded.", path: file });
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reactions", reactionRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("The API has started.");
});
