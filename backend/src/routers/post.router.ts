import { Router } from "express";
import { sample_posts } from "../data";
import asyncHandler from "express-async-handler";
import { PostModel } from "../models/post.model";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const postsCount = await PostModel.countDocuments();
    if (postsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await PostModel.create(sample_posts);
    res.send("Seed Is Done!");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const posts = await PostModel.find().sort({ createdAt: "descending" });
    res.send(posts);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    res.send(post);
  })
);

router.get(
  "/topic/:topicName",
  asyncHandler(async (req, res) => {
    const topicRegex = new RegExp(req.params.topicName, "i");
    const posts = await PostModel.find({ topic: { $regex: topicRegex } });
    res.send(posts);
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i"); //i = case insensitive
    const posts = await PostModel.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { topic: { $regex: searchRegex } },
      ],
    });

    res.send(posts);
  })
);

export default router;
