import { Request, Response, NextFunction } from "express";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  const commentId: string = req.params.commentId;
  if (!commentId) {
    return res.status(HTTP_BAD_REQUEST).send("Invalid comment id!");
  }
  const userId = req.body.userId;
  const commentOwnerId = req.body.ownerId;

  if (commentOwnerId !== userId) {
    return res.status(HTTP_UNAUTHORIZED).send("This is not your comment!");
  } else {
    return next();
  }
};
