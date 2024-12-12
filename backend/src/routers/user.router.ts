import jwt from "jsonwebtoken";
import { Router } from "express";
import { sample_users } from "../data";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("Seed Is Done!");
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(genereteTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Invalid Username or Password!");
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (user) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("An account with that username already exists.");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: "",
      username, //maybe i want it as username:username.toLowerCase()
      password: encryptedPassword,
    };

    const dbUser = await UserModel.create(newUser);
    res.send(genereteTokenResponse(dbUser));
  })
);

const genereteTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      username: user.username,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  user.token = token;

  return user;
};

export default router;
