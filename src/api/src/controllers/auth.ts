import { NextFunction, Request, response, Response } from "express";
import { prisma } from "../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  prisma.user
    .count({
      where: {
        OR: [
          { username: req.body.username ?? "" },
          { email: req.body.email ?? "" },
        ],
      },
    })
    .then((count) => {
      if (count > 0) {
        return res.status(409).send({ message: "User already exists." });
      }

      // TODO: input validation

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      prisma.user
        .create({
          data: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profile: {
              create: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                brithDate: new Date(req.body.birthDate),
              },
            },
          },
        })
        .then(() =>
          res.status(200).send({ message: "User successfully created." })
        );
    });
};

export const login = (req: Request, res: Response) => {
  prisma.user
    .findFirst({
      where: {
        OR: [{ username: req.body.username }, { email: req.body.email }],
      },
    })
    .then((user) => {
      if (!user) res.status(404).send({ message: "User was not found." });

      const checkPassword = bcrypt.compareSync(
        req.body.password,
        user?.password ?? ""
      );

      if (!checkPassword)
        return res.status(400).send({ message: "Password is incorrect." });

      const token = jwt.sign(
        { id: user?.id ?? "" },
        process.env.SECRET_KEY ?? ""
      );

      // @ts-ignore TEMPORARY FIX
      const { password, ...others } = user;

      return res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .send(others);
    });
};

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .send({ message: "User has been logged out." });
};
