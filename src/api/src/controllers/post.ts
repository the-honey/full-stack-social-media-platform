import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";

export const getPosts = async (
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

      const following =
        (await prisma.follows.findMany({
          select: { following: { select: { id: true } } },
          where: { followerId: userData.id },
        })) ?? [];

      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: following.map((user) => user.following.id) },
        },
        select: {
          content: true,
          createdAt: true,
          updatedAt: true,
          media: true,
          author: {
            select: {
              username: true,
              profile: { select: { profilePicUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(posts);
    }
  );
};

export const addPost = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not logged in." });

  jwt.verify(
    token,
    process.env.SECRET_KEY ?? "",
    async (err: any, userData: any) => {
      if (err) return res.status(403).json({ message: "Token is not valid." });

      await prisma.post.create({
        data: { authorId: userData.id, content: req.body.content ?? "" },
      });

      return res.status(200).json({ message: "Post created successfully." });
    }
  );
};
