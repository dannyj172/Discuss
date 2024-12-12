import { model, Schema } from "mongoose";

export interface Comment {
  author: string;
  text: string;
}

export const CommentSchema = new Schema<Comment>(
  {
    author: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true, //gives 'createdAt' and more
    toJSON: {
      virtuals: true,
    }, //virtuals changed mongoose default '_id' to 'id'
    toObject: {
      virtuals: true,
    },
  }
);

export const CommentModel = model<Comment>("comment", CommentSchema);
