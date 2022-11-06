import { Request, Response } from "express";
import { prisma } from "../db";

export const register = async (req: Request, res: Response) => {
  //await prisma.user.count({ where: { username: req.body.username } });
};

export const login = (req: Request, res: Response) => {
  // TODO
};

export const logout = (req: Request, res: Response) => {
  // TODO
};
