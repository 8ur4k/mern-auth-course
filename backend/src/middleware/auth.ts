import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import * as z from "zod";
import { ObjectId } from "bson";

export const AuthUserSchema = z
  .object({
    _id: z.instanceof(ObjectId),
    username: z.string(),
    email: z.string(),
  })
  .optional();

export const requiresAuth: RequestHandler = async (req, res, next) => {
  if (req.session.userId) {
    const authUser = await UserModel.findById({ _id: req.session.userId })
      .select("+email")
      .exec();

    // @ts-ignore
    req.user = AuthUserSchema.parse(authUser);

    next();
  } else next(createHttpError(401, "User not authenticated"));
};
