import express, { NextFunction, Request, Response } from "express";
import { addPost, getPosts } from "../controllers/post";
const router = express.Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", use(getPosts));
//router.get("/:id", use(getPosts));
router.post("/", use(addPost));

export default router;
