import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";

export const getComments = async (
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

export const addComment = async (
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

      await prisma.comment.create({
        data: {
          authorId: userData.id,
          content: req.body.content,
          postId: req.params.postId,
        },
      });

      return res.status(200).json({ message: "Comment created successfully." });
    }
  );
};

export const deleteComment = async (
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

      const count =
        (await prisma.comment.deleteMany({
          where: { id: req.params.commentId, authorId: userData.id },
        })) ?? 0;

      if (count.count > 0) {
        return res
          .status(200)
          .json({ message: "Comment deleted successfully." });
      } else {
        return res.status(404).json({ message: "Comment was not found." });
      }
    }
  );
};
