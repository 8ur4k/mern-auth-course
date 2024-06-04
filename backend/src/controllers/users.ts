import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import * as z from "zod";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const GetUserParamsSchema = z.object({ username: z.string() });

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { data, error } = GetUserParamsSchema.safeParse(req.params);

    if (error) {
      throw createHttpError(400, "Invalid parameters");
    }

    const { username } = data;
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const SignUpRequestBodySchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});
export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { data, error } = SignUpRequestBodySchema.safeParse(req.body);

    if (error) {
      throw createHttpError(400, "Invalid parameters");
    }

    const { username, email, password: passwordRaw } = data;

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please choose a diffrent one."
      );
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with this email address already exists. Please log in instead."
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const LoginRequestBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const login: RequestHandler = async (req, res, next) => {
  const { data, error } = LoginRequestBodySchema.safeParse(req.body);

  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }

  try {
    const { username, password } = data;

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
