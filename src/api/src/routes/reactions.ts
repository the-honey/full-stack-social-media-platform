import express, { NextFunction, Request, Response } from "express";
import {
  getReactions,
  addReaction,
  deleteReaction,
} from "../controllers/reaction";
const router = express.Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/:postId", use(getReactions));
router.post("/:postId", use(addReaction));
router.delete("/:postId", use(deleteReaction));

export default router;
