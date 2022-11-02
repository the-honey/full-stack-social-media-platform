import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";

const app: Application = express();
const prisma: PrismaClient = new PrismaClient();

app.listen(8080, () => {
  console.log("The API has started.");
});
