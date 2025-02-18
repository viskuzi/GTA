import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// @ts-ignore
app.post("/api", async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const createdRow = await prisma.waitList.create({ data: { email, name } });

    res.json(createdRow);
  } catch (error) {
    res.status(400).json({ error: `An error ${error} occurred` });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT} attentively!`);
});
