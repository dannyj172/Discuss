import { Router } from "express";
import { sample_posts } from "../data";
import asyncHandler from "express-async-handler";
import { PostModel } from "../models/post.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

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

router.post(
  "/create-post",
  asyncHandler(async (req, res) => {
    if (!req.body) {
      res.status(HTTP_BAD_REQUEST).send("Invalid create post request!");
    }
    const post = await PostModel.create(req.body);

    res.send(post);
  })
);

router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    if (!req.body) {
      res.status(HTTP_BAD_REQUEST).send("Invalid edit post request!");
    }

    const postId = req.params.id;
    const post = req.body;

    let newPost;

    if (!post.description) {
      console.log("happens1");
      newPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          topic: post.topic,
          title: post.title,
          imageUrl: post.imageUrl,
          $unset: { description: "" },
        }
      );
    } else if (!post.imageUrl) {
      console.log("happens2");
      newPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          topic: post.topic,
          title: post.title,
          description: post.description,
          $unset: { imageUrl: "" },
        }
      );
    } else {
      console.log("happens3");
      newPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          topic: post.topic,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl,
        }
      );
    }
    res.send(newPost);
  })
);

export default router;
