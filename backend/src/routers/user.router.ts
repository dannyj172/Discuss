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
      username,
      password: encryptedPassword,
    };

    const dbUser = await UserModel.create(newUser);
    res.send(genereteTokenResponse(dbUser));
  })
);

router.get(
  "/profile/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;

    const user = await UserModel.findOne({ username: username }).select({
      username: 1,
      createdAt: 1,
      _id: 0,
    });
    if (user) {
      res.send(user);
    } else {
      res
        .status(HTTP_BAD_REQUEST)
        .send("A user with that username does not exist!");
    }
  })
);

const genereteTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    `${process.env.JWT_SECRET!}`,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    username: user.username,
    token: token,
  };
};

export default router;
