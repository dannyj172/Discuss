import { model, Schema, Types } from "mongoose";
import { Comment, CommentSchema } from "./comment.model";
import { Voter, VoterSchema } from "./voter.model";

export interface Post {
  user: Types.ObjectId;
  id: string;
  owner: string;
  topic: string;
  title: string;
  description?: string;
  imageUrl?: string;
  votes: number;
  upvoters?: Voter[];
  downvoters?: Voter[];
  comments: Comment[];
}

export const PostSchema = new Schema<Post>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    owner: { type: String, required: true },
    topic: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    votes: { type: Number, required: true, default: 0 },
    upvoters: { type: [VoterSchema] },
    downvoters: { type: [VoterSchema] },
    comments: { type: [CommentSchema] },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const PostModel = model<Post>("post", PostSchema);
