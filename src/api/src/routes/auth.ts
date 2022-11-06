import express from "express";
import { register, login, logout } from "../controllers/auth";

const router = express.Router();

router.get("/login", login);
router.get("/register", register);
router.get("/logout", logout);

export default router;
