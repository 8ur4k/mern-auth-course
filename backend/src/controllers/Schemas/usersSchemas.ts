import * as z from "zod";

export const GetUserParamsSchema = z.object({ username: z.string() });

export const SignUpRequestBodySchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const LoginRequestBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});
