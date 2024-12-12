import { model, Schema } from "mongoose";

export interface User {
  id: string;
  username: string;
  password: string;
}

export const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

export const UserModel = model<User>("user", UserSchema);
