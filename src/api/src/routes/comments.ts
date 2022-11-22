import express, { NextFunction, Request, Response } from "express";
import { getComments, addComment, deleteComment } from "../controllers/comment";
const router = express.Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/:postId", use(getComments));
router.post("/:postId", use(addComment));
router.delete("/:commentId", use(deleteComment));

export default router;
