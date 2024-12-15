import { Router } from "express";
import { sample_posts } from "../data";
import asyncHandler from "express-async-handler";
import { PostModel } from "../models/post.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { CommentModel } from "../models/comment.model";
import auth from "../middlewares/auth.mid";
import isPostOwner from "../middlewares/isPostOwner.mid";
import deleteCommentMid from "../middlewares/deleteComment.mid";
import { VoterModel } from "../models/voter.model";

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

router.post(
  "/:id/comment",
  auth,
  asyncHandler(async (req: any, res) => {
    const commentInfo = req.body;
    const id = req.params.id;
    if (!commentInfo) {
      res.status(HTTP_BAD_REQUEST).send("Empty input fields!");
      return;
    }
    const comment = new CommentModel({ ...commentInfo, user: req.user.id });
    const post: any = await PostModel.findOneAndUpdate(
      { _id: id },
      {
        $push: { comments: comment },
      }
    );
    res.send(post);
  })
);

router.post(
  "/:id/comment/delete/:commentId",
  auth,
  deleteCommentMid,
  asyncHandler(async (req: any, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    if (!commentId || !postId) {
      res.status(HTTP_BAD_REQUEST).send("Error deleting comment!");
      return;
    }
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { comments: { _id: commentId } },
      }
    );
    res.send(post);
  })
);

router.get(
  "/topic/:topicName",
  asyncHandler(async (req, res) => {
    const topicRegex = new RegExp(req.params.topicName, "i");
    const posts = await PostModel.find({ topic: { $regex: topicRegex } }).sort({
      createdAt: "descending",
    });
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
  "/create",
  auth,
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
  auth,
  isPostOwner,
  asyncHandler(async (req, res) => {
    const postContent = req.body;
    const { topic, title, description, imageUrl } = postContent;
    const postId = req.params.id;

    if (!postContent) {
      res.status(HTTP_BAD_REQUEST).send("Empty input fields!");
      return;
    }

    if (!postId) {
      res.status(HTTP_BAD_REQUEST).send("Invalid Post!");
      return;
    }
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        topic: topic,
        title: title,
        description: description,
        imageUrl: imageUrl,
      }
    );
    res.send(post);
  })
);

router.delete(
  "/:id/delete",
  auth,
  isPostOwner,
  asyncHandler(async (req, res) => {
    const post = await PostModel.findByIdAndDelete(req.params.id);
    res.send(post);
  })
);

router.get(
  "/all/:username",
  asyncHandler(async (req, res) => {
    const username: string = req.params.username;
    const post = await PostModel.find({ owner: username });
    res.send(post);
  })
);

router.post(
  "/:id/upvote",
  auth,
  asyncHandler(async (req: any, res) => {
    const postId = req.params.id;
    const userInfo = req.body;
    let increment = 0;
    const voter = new VoterModel({ voterId: userInfo.userId });

    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(HTTP_BAD_REQUEST).send("Invalid post!");
      return;
    }
    const hasUpvoted = post.upvoters?.some((voter) => {
      return voter.voterId === userInfo.userId;
    });
    const hasDownvoted = post.downvoters?.some((voter) => {
      return voter.voterId === userInfo.userId;
    });

    if (hasUpvoted) {
      increment = -1;
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { votes: increment },
          $pull: { upvoters: { voterId: voter.voterId } },
        }
      );
      res.send(updatedPost);
      return;
    } else if (hasDownvoted) {
      increment = +2;
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { votes: increment },
          $push: { upvoters: voter },
          $pull: { downvoters: { voterId: voter.voterId } },
        }
      );
      res.send(updatedPost);
      return;
    } else {
      increment = +1;
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { votes: increment },
        $push: { upvoters: voter },
      }
    );
    res.send(updatedPost);
  })
);

router.post(
  "/:id/downvote",
  auth,
  asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userInfo = req.body;
    let increment = 0;
    const voter = new VoterModel({ voterId: userInfo.userId });

    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(HTTP_BAD_REQUEST).send("Invalid post!");
      return;
    }
    const hasUpvoted = post.upvoters?.some((voter) => {
      return voter.voterId === userInfo.userId;
    });
    const hasDownvoted = post.downvoters?.some((voter) => {
      return voter.voterId === userInfo.userId;
    });

    if (hasDownvoted) {
      increment = +1;
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { votes: increment },
          $pull: { downvoters: { voterId: voter.voterId } },
        }
      );
      res.send(updatedPost);
      return;
    } else if (hasUpvoted) {
      increment = -2;
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { votes: increment },
          $push: { downvoters: voter },
          $pull: { upvoters: { voterId: voter.voterId } },
        }
      );
      res.send(updatedPost);
      return;
    } else {
      increment = -1;
    }
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { votes: increment },
        $push: { downvoters: voter },
      }
    );
    res.send(updatedPost);
  })
);

export default router;
