import { Router } from "express";
import { sample_topics } from "../data";
import asyncHandler from "express-async-handler";
import { TopicModel } from "../models/topic.model";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const topicsCount = await TopicModel.countDocuments();
    if (topicsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await TopicModel.create(sample_topics);
    res.send("Seed Is Done!");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const topics = await TopicModel.find();
    res.send(topics);
  })
);

router.get(
  "/:topicName",
  asyncHandler(async (req, res) => {
    const topicName = req.params.topicName;

    const topic = await TopicModel.findOne({ topicName });
    res.send(topic);
  })
);

router.post(
  "/postAmountChange/:topicName",
  asyncHandler(async (req, res) => {
    const topicName = req.params.topicName;
    const action = req.body.action;
    let value;

    if (action === "increase") {
      value = 1;
    } else if (action === "decrease") {
      value = -1;
    }

    const topic: any = await TopicModel.findOneAndUpdate(
      { topicName: topicName },
      { $inc: { postsAmount: value } }
    );
    res.send(topic);
  })
);

export default router;
