console.log("Hello via Bun!");
import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Hello World!");
  return;
});

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  // console.log(userId);
  const data = await prismaClient.website.create({
    data: {
      userId,
      url,
    },
    include: {
      ticks: true,
    },
  });
  res.json({
    id: data.id,
  });
  return;
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;

  const data = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });
  res.json(data);
  return;
});

app.get("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const data = await prismaClient.website.findMany({
    where: {
      userId,
      disabled: false,
    },
    include: { ticks: true },
  });
  // console.log(data);
  res.json(data);
  return;
});

app.delete("/api/v1/website/", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;
  //find and update to disaple the website true
  const data = await prismaClient.website.update({
    where: {
      id: websiteId,
      userId,
    },
    data: {
      disabled: true,
    },
  });
  res.json({
    message: "Website deleted successfully",
  });
  return;
});

app.listen(8000);
