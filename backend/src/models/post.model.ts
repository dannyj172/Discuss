import { model, Schema } from "mongoose";
import { Comment, CommentSchema } from "./comment.model";

export interface Post {
  id: string;
  owner: string;
  topic: string;
  title: string;
  description: string;
  imageUrl: string;
  votes: number;
  comments: Comment[];
}

export const PostSchema = new Schema<Post>(
  {
    owner: { type: String, required: true },
    topic: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    votes: { type: Number, required: true },
    comments: { type: [CommentSchema] }, //maybe true?
  },
  {
    toJSON: {
      virtuals: true,
    }, //virtuals changed mongoose default '_id' to 'id'
    toObject: {
      virtuals: true,
    },
    timestamps: true, //gives 'createdAt' and more
  }
);

export const PostModel = model<Post>("post", PostSchema); //Used to apply crud operations to database
