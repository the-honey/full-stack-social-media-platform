import express, { NextFunction, Request, Response } from "express";
import { register, login, logout } from "../controllers/auth";
const router = express.Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/login", use(login));
router.post("/register", use(register));
router.post("/logout", use(logout));

export default router;
