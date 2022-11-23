import { NextFunction, Request, response, Response } from "express";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";

export const getReactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const comments = await prisma.comment.findMany({
    where: { postId: req.params.postId },
    select: {
      content: true,
      createdAt: true,
      author: {
        select: {
          username: true,
          profile: { select: { profilePicUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json(comments);
};

export const addReaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not logged in." });

  jwt.verify(
    token,
    process.env.SECRET_KEY ?? "",
    async (err: any, userData: any) => {
      if (err) return res.status(403).json({ message: "Token is not valid." });

      await prisma.reaction.create({
        data: {
          authorId: userData.id,
          postId: req.params.postId,
          type: "LIKE",
        },
      });

      return res.status(200).json({ message: "Reaction added successfully." });
    }
  );
};

export const deleteReaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not logged in." });

  jwt.verify(
    token,
    process.env.SECRET_KEY ?? "",
    async (err: any, userData: any) => {
      if (err) return res.status(403).json({ message: "Token is not valid." });

      const count = await prisma.reaction.count({
        where: { AND: { authorId: userData.id, postId: req.params.postId } },
      });
      if (count == 0)
        return res
          .status(404)
          .json({ message: "Cannot remove reaction from this post." });

      await prisma.reaction.deleteMany({
        where: { AND: { authorId: userData.id, postId: req.params.postId } },
      });

      return res
        .status(200)
        .json({ message: "Reaction removed successfully." });
    }
  );
};
