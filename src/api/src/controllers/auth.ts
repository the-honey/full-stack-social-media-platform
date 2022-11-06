import { NextFunction, Request, Response } from "express";
import { prisma } from "../db";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let count: number = await prisma.user.count({
    where: {
      OR: [{ username: req.body.username }, { email: req.body.email }],
    },
  });
};

export const login = (req: Request, res: Response) => {
  // TODO
};

export const logout = (req: Request, res: Response) => {
  // TODO
};
